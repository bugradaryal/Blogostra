using System.Net.Http.Headers;
using System.Net.Http.Json;
using Dto.Requests;
using Dto.Responses;
using Entities;

namespace IntegrationTests.Support;

public sealed record IssuedTokens(string AccessToken, string RefreshToken, UserProfileViewModel User);

public static class ApiClientExtensions
{
    public static async Task<RegisterViewModel> RegisterNewUser(this HttpClient client)
    {
        var registration = TestUsers.NewRegistration();
        var response = await client.PostAsJsonAsync("api/Auth/Register", registration);
        response.EnsureSuccessStatusCode();
        return registration;
    }

    public static async Task ConfirmEmail(this HttpClient client, CapturingMailTransport mail, string email)
    {
        var sendResponse = await client.PostAsJsonAsync("api/Auth/SendMail", email);
        sendResponse.EnsureSuccessStatusCode();

        var sent = mail.LastTo(email) ?? throw new InvalidOperationException("No confirmation mail was captured.");
        var verification = await client.PostAsJsonAsync("api/Auth/Emailverification", ConfirmationLink.Parse(sent.HtmlBody));
        verification.EnsureSuccessStatusCode();
    }

    public static Task<HttpResponseMessage> LoginAsync(this HttpClient client, string email, string password)
    {
        return client.PostAsJsonAsync("api/Auth/Login", new LoginViewModel { Email = email, Password = password });
    }

    public static async Task<IssuedTokens> ReadTokens(this HttpResponseMessage response)
    {
        var accessToken = response.Headers.GetValues("Authorization").Single();
        var refreshToken = response.Headers.GetValues("RefreshToken").Single();
        var user = await response.Content.ReadFromJsonAsync<UserProfileViewModel>()
            ?? throw new InvalidOperationException("Response body was empty.");

        return new IssuedTokens(accessToken.Replace("Bearer ", string.Empty), refreshToken, user);
    }

    public static Task<HttpResponseMessage> RefreshAsync(this HttpClient client, string? refreshToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/Auth/RefreshToken");
        if (refreshToken is not null)
            request.Headers.Add("RefreshToken", refreshToken);

        return client.SendAsync(request);
    }

    public static Task<HttpResponseMessage> ValidateTokenAsync(this HttpClient client, string? accessToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "api/Auth/ValidateToken");
        if (accessToken is not null)
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        return client.SendAsync(request);
    }
}
