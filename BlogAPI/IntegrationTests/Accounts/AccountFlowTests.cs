using System.Net;
using System.Net.Http.Json;
using Dto.Requests;
using Dto.Responses;
using IntegrationTests.Support;

namespace IntegrationTests.Accounts;

[Collection(ApiCollection.Name)]
public class AccountFlowTests
{
    private readonly BlogApiFactory _factory;
    private readonly HttpClient _anonymous;

    public AccountFlowTests(BlogApiFactory factory)
    {
        _factory = factory;
        _anonymous = factory.CreateApiClient();
    }

    [Fact]
    public async Task UpdateAccount_ChangesProfileOfSignedInUser()
    {
        var user = await _factory.SignInNewUser();

        var update = new UserViewModel
        {
            UserName = $"renamed{Guid.NewGuid():N}"[..20],
            Email = user.Registration.Email,
            Name = "Changed",
            Surname = "Surname",
            PhoneNumber = "5559876543",
            Address = "New Street 5"
        };

        var response = await user.Client.PutAsJsonAsync("api/User/UpdateAccount", update);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var session = await user.Client.PostAsync("api/Auth/ValidateToken", null);
        var body = await session.Content.ReadFromJsonAsync<TokenValidationViewModel>();
        Assert.NotNull(body);
        Assert.Equal("Changed", body.user.Name);
        Assert.Equal(update.UserName, body.user.UserName);
    }

    [Fact]
    public async Task ChangePassword_AllowsLoginOnlyWithNewPassword()
    {
        var user = await _factory.SignInNewUser();
        const string newPassword = "NewPassw0rd!";

        var response = await user.Client.PutAsJsonAsync("api/User/ChangePassword", new PasswordViewModel
        {
            OldPassword = user.Registration.Password,
            NewPassword = newPassword
        });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var oldLogin = await _anonymous.LoginAsync(user.Registration.Email, user.Registration.Password);
        Assert.Equal(HttpStatusCode.Unauthorized, oldLogin.StatusCode);

        var newLogin = await _anonymous.LoginAsync(user.Registration.Email, newPassword);
        Assert.Equal(HttpStatusCode.OK, newLogin.StatusCode);
    }

    [Fact]
    public async Task DeleteAccount_RemovesTheSignedInUser()
    {
        var user = await _factory.SignInNewUser();

        var response = await user.Client.DeleteAsync("api/User/DeleteAccount");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var login = await _anonymous.LoginAsync(user.Registration.Email, user.Registration.Password);
        Assert.Equal(HttpStatusCode.Unauthorized, login.StatusCode);
    }

    [Fact]
    public async Task Admin_ListsUsers_WithoutSensitiveFields()
    {
        var admin = await _factory.SignInNewUser(administrator: true);

        var response = await admin.Client.PostAsync("api/Admin/GetAllUsers", null);
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains(admin.Registration.Email, body);
        Assert.DoesNotContain("passwordHash", body, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("securityStamp", body, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task RegularUser_CannotListUsers()
    {
        var user = await _factory.SignInNewUser();

        var response = await user.Client.PostAsync("api/Admin/GetAllUsers", null);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Admin_SuspendsUser_AndSuspendedUserCannotLogin()
    {
        var admin = await _factory.SignInNewUser(administrator: true);
        var member = await _factory.SignInNewUser();

        var suspended = await admin.Client.PostAsync($"api/Admin/SuspendUser?userId={member.Id}&suspend=true", null);
        Assert.Equal(HttpStatusCode.OK, suspended.StatusCode);

        var login = await _anonymous.LoginAsync(member.Registration.Email, member.Registration.Password);
        Assert.Equal(HttpStatusCode.Forbidden, login.StatusCode);

        var reinstated = await admin.Client.PostAsync($"api/Admin/SuspendUser?userId={member.Id}&suspend=false", null);
        Assert.Equal(HttpStatusCode.OK, reinstated.StatusCode);

        var loginAgain = await _anonymous.LoginAsync(member.Registration.Email, member.Registration.Password);
        Assert.Equal(HttpStatusCode.OK, loginAgain.StatusCode);
    }

    [Fact]
    public async Task Admin_ChangesRole_AndRejectsRepeatedAssignment()
    {
        var admin = await _factory.SignInNewUser(administrator: true);
        var member = await _factory.SignInNewUser();
        var change = new RoleViewModel { userId = member.Id, Role = "Administrator" };

        var first = await admin.Client.PostAsJsonAsync("api/Admin/GiveRoleToUser", change);
        Assert.Equal(HttpStatusCode.OK, first.StatusCode);

        var second = await admin.Client.PostAsJsonAsync("api/Admin/GiveRoleToUser", change);
        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
    }

    [Fact]
    public async Task Admin_ReadsStatistics()
    {
        var admin = await _factory.SignInNewUser(administrator: true);
        var range = new DateViewModel { startdate = DateTime.UtcNow.AddDays(-1), enddate = DateTime.UtcNow.AddDays(1) };

        var response = await admin.Client.PostAsJsonAsync("api/Admin/GetAllStatistics", range);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var statistics = await response.Content.ReadFromJsonAsync<AllStaticsViewModel>();
        Assert.NotNull(statistics);
        Assert.True(statistics.UserCount >= 1);
    }

    [Fact]
    public async Task Admin_Statistics_WithReversedRange_ReturnsBadRequest()
    {
        var admin = await _factory.SignInNewUser(administrator: true);
        var range = new DateViewModel { startdate = DateTime.UtcNow.AddDays(1), enddate = DateTime.UtcNow.AddDays(-1) };

        var response = await admin.Client.PostAsJsonAsync("api/Admin/GetAllStatistics", range);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
