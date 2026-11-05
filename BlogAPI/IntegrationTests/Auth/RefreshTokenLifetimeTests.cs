using System.Net;
using IntegrationTests.Support;

namespace IntegrationTests.Auth;

[Collection(ApiCollection.Name)]
public class RefreshTokenLifetimeTests
{
    private readonly BlogApiFactory _factory;
    private readonly HttpClient _client;

    public RefreshTokenLifetimeTests(BlogApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateApiClient();
    }

    [Fact]
    public async Task RefreshToken_IsStoredAsHashWithSevenDayLifetime()
    {
        var user = await _factory.SignInNewUser();

        var stored = Assert.Single(await _factory.StoredRefreshTokens(user.Id));

        Assert.NotEqual(user.Tokens.RefreshToken, stored.TokenHash);
        Assert.Equal(64, stored.TokenHash.Length);
        Assert.Equal(TimeSpan.FromDays(7), stored.ExpiresAt - stored.CreatedAt);
    }

    [Fact]
    public async Task Refresh_ReplacesTheStoredToken()
    {
        var user = await _factory.SignInNewUser();
        var before = Assert.Single(await _factory.StoredRefreshTokens(user.Id));

        var response = await _client.RefreshAsync(user.Tokens.RefreshToken);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var after = Assert.Single(await _factory.StoredRefreshTokens(user.Id));
        Assert.NotEqual(before.TokenHash, after.TokenHash);
    }

    [Fact]
    public async Task Refresh_WithinLifetime_Succeeds()
    {
        var user = await _factory.SignInNewUser();

        _factory.Clock.Advance(TimeSpan.FromDays(6));
        try
        {
            var response = await _client.RefreshAsync(user.Tokens.RefreshToken);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
        finally
        {
            _factory.Clock.Advance(TimeSpan.FromDays(-6));
        }
    }

    [Fact]
    public async Task Refresh_AfterLifetime_ReturnsUnauthorized()
    {
        var user = await _factory.SignInNewUser();

        _factory.Clock.Advance(TimeSpan.FromDays(8));
        try
        {
            var response = await _client.RefreshAsync(user.Tokens.RefreshToken);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

            var replay = await _client.RefreshAsync(user.Tokens.RefreshToken);
            Assert.Equal(HttpStatusCode.Unauthorized, replay.StatusCode);
        }
        finally
        {
            _factory.Clock.Advance(TimeSpan.FromDays(-8));
        }
    }

    [Fact]
    public async Task SecondLogin_KeepsFirstSessionRefreshable()
    {
        var user = await _factory.SignInNewUser();

        var secondLogin = await _client.LoginAsync(user.Registration.Email, user.Registration.Password);
        Assert.Equal(HttpStatusCode.OK, secondLogin.StatusCode);

        var firstSessionRefresh = await _client.RefreshAsync(user.Tokens.RefreshToken);
        Assert.Equal(HttpStatusCode.OK, firstSessionRefresh.StatusCode);
    }
}
