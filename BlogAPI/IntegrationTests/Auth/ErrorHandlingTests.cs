using System.Net;
using System.Net.Http.Json;
using BlogAPI.Middleware;
using Dto.Responses;
using IntegrationTests.Support;

namespace IntegrationTests.Auth;

[Collection(ApiCollection.Name)]
public class ErrorHandlingTests
{
    private readonly HttpClient _client;

    public ErrorHandlingTests(BlogApiFactory factory)
    {
        _client = factory.CreateApiClient();
    }

    [Fact]
    public async Task InvalidRegistration_ReturnsStructuredValidationError()
    {
        var registration = TestUsers.NewRegistration();
        registration.Name = "a";

        var response = await _client.PostAsJsonAsync("api/Auth/Register", registration);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal(ErrorResponseFactory.ContentType, response.Content.Headers.ContentType?.MediaType);

        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(ErrorResponseFactory.SerializerOptions);
        Assert.NotNull(error);
        Assert.Equal(400, error.Status);
        Assert.False(string.IsNullOrWhiteSpace(error.Message));
        Assert.False(string.IsNullOrWhiteSpace(error.TraceId));
        Assert.NotNull(error.Errors);
        Assert.NotEmpty(error.Errors);
    }

    [Fact]
    public async Task DomainFailure_ReturnsErrorResponseWithMessage()
    {
        var response = await _client.LoginAsync($"missing{Guid.NewGuid():N}@example.com", TestUsers.Password);

        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(ErrorResponseFactory.SerializerOptions);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.NotNull(error);
        Assert.Equal(401, error.Status);
        Assert.Equal("Email or password is wrong!", error.Message);
        Assert.False(string.IsNullOrWhiteSpace(error.TraceId));
    }
}
