using Dto.Requests;

namespace IntegrationTests.Support;

public sealed record SignedInUser(HttpClient Client, RegisterViewModel Registration, IssuedTokens Tokens)
{
    public string Id => Tokens.User.Id;
}
