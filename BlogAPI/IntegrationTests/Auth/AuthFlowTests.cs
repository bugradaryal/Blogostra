using System.Net;
using System.Net.Http.Json;
using Dto.Responses;
using IntegrationTests.Support;

namespace IntegrationTests.Auth;

[Collection(ApiCollection.Name)]
public class AuthFlowTests
{
    private readonly BlogApiFactory _factory;
    private readonly HttpClient _client;

    public AuthFlowTests(BlogApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateApiClient();
    }

    [Fact]
    public async Task Register_Login_Refresh_CompletesFullFlow()
    {
        var registration = await _client.RegisterNewUser();

        var loginBeforeConfirmation = await _client.LoginAsync(registration.Email, registration.Password);
        Assert.Equal(HttpStatusCode.Forbidden, loginBeforeConfirmation.StatusCode);

        await _client.ConfirmEmail(_factory.Mail, registration.Email);

        var loginResponse = await _client.LoginAsync(registration.Email, registration.Password);
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);

        var firstTokens = await loginResponse.ReadTokens();
        Assert.False(string.IsNullOrWhiteSpace(firstTokens.AccessToken));
        Assert.False(string.IsNullOrWhiteSpace(firstTokens.RefreshToken));
        Assert.Equal(registration.Email, firstTokens.User.Email);
        Assert.True(firstTokens.User.EmailConfirmed);

        var sessionResponse = await _client.ValidateTokenAsync(firstTokens.AccessToken);
        Assert.Equal(HttpStatusCode.OK, sessionResponse.StatusCode);
        var session = await sessionResponse.Content.ReadFromJsonAsync<TokenValidationViewModel>();
        Assert.NotNull(session);
        Assert.Equal("User", session.role);
        Assert.Equal(firstTokens.User.Id, session.user.Id);

        var refreshResponse = await _client.RefreshAsync(firstTokens.RefreshToken);
        Assert.Equal(HttpStatusCode.OK, refreshResponse.StatusCode);

        var refreshedAccessToken = refreshResponse.Headers.GetValues("Authorization").Single().Replace("Bearer ", string.Empty);
        var refreshedRefreshToken = refreshResponse.Headers.GetValues("RefreshToken").Single();
        Assert.NotEqual(firstTokens.RefreshToken, refreshedRefreshToken);

        var sessionAfterRefresh = await _client.ValidateTokenAsync(refreshedAccessToken);
        Assert.Equal(HttpStatusCode.OK, sessionAfterRefresh.StatusCode);

        var replayedRefresh = await _client.RefreshAsync(firstTokens.RefreshToken);
        Assert.Equal(HttpStatusCode.Unauthorized, replayedRefresh.StatusCode);
    }

    [Fact]
    public async Task Login_ResponseDoesNotExposeSensitiveUserFields()
    {
        var registration = await _client.RegisterNewUser();
        await _client.ConfirmEmail(_factory.Mail, registration.Email);

        var response = await _client.LoginAsync(registration.Email, registration.Password);
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.DoesNotContain("passwordHash", body, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("securityStamp", body, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Login_WithWrongPassword_ReturnsUnauthorized()
    {
        var registration = await _client.RegisterNewUser();
        await _client.ConfirmEmail(_factory.Mail, registration.Email);

        var response = await _client.LoginAsync(registration.Email, "WrongPassw0rd");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithUnknownEmail_ReturnsUnauthorized()
    {
        var response = await _client.LoginAsync($"missing{Guid.NewGuid():N}@example.com", TestUsers.Password);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Register_WithDuplicateEmail_ReturnsConflict()
    {
        var first = await _client.RegisterNewUser();

        var duplicate = TestUsers.NewRegistration();
        duplicate.Email = first.Email;

        var response = await _client.PostAsJsonAsync("api/Auth/Register", duplicate);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task Refresh_WithUnknownToken_ReturnsUnauthorized()
    {
        var response = await _client.RefreshAsync(Convert.ToBase64String(Guid.NewGuid().ToByteArray()));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Refresh_WithoutToken_ReturnsBadRequest()
    {
        var response = await _client.RefreshAsync(null);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ValidateToken_WithoutBearerToken_ReturnsUnauthorized()
    {
        var response = await _client.ValidateTokenAsync(null);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task SendMail_ForUnknownAccount_ReturnsNotFound()
    {
        var response = await _client.PostAsJsonAsync("api/Auth/SendMail", $"missing{Guid.NewGuid():N}@example.com");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
