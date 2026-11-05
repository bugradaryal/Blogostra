using System.Net.Http.Headers;
using Bussiness.Abstractions;
using DataAccess;
using Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Testcontainers.MsSql;

namespace IntegrationTests.Support;

public sealed class BlogApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private const string DatabaseName = "BlogApiIntegrationTests";

    private readonly MsSqlContainer _sqlServer = new MsSqlBuilder()
        .WithImage("mcr.microsoft.com/mssql/server:2022-latest")
        .Build();

    public CapturingMailTransport Mail { get; } = new();
    public AdjustableTimeProvider Clock { get; } = new();

    public async Task InitializeAsync()
    {
        await _sqlServer.StartAsync();

        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<DataDbContext>();
        await context.Database.MigrateAsync();
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await base.DisposeAsync();
        await _sqlServer.DisposeAsync();
    }

    public HttpClient CreateApiClient()
    {
        return CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
    }

    public async Task<SignedInUser> SignInNewUser(bool administrator = false)
    {
        var client = CreateApiClient();
        var registration = await client.RegisterNewUser();
        await client.ConfirmEmail(Mail, registration.Email);

        if (administrator)
            await GrantAdministrator(registration.Email);

        var response = await client.LoginAsync(registration.Email, registration.Password);
        response.EnsureSuccessStatusCode();

        var tokens = await response.ReadTokens();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokens.AccessToken);

        return new SignedInUser(client, registration, tokens);
    }

    public async Task<IReadOnlyList<RefreshToken>> StoredRefreshTokens(string userId)
    {
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<DataDbContext>();

        return await context.RefreshTokens
            .AsNoTracking()
            .Where(token => token.UserId == userId)
            .ToListAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((_, configuration) =>
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = BuildConnectionString(),
                ["JWT:Key"] = "integration-tests-signing-key-0123456789-abcdefghijklmnop",
                ["JWT:Issuer"] = "https://tests.blogapi.local",
                ["JWT:Audience"] = "https://tests.blogapi.local/api",
                ["JWT:DurationInMinutes"] = "30",
                ["Serilog:MinimumLevel:Default"] = "Warning"
            }));

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<IMailTransport>();
            services.AddSingleton<IMailTransport>(Mail);
            services.RemoveAll<TimeProvider>();
            services.AddSingleton<TimeProvider>(Clock);
        });
    }

    private async Task GrantAdministrator(string email)
    {
        using var scope = Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        var user = await userManager.FindByEmailAsync(email)
            ?? throw new InvalidOperationException("Registered user was not found.");

        var result = await userManager.AddToRoleAsync(user, AppRoles.Administrator);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join(" ", result.Errors.Select(error => error.Description)));
    }

    private string BuildConnectionString()
    {
        return new SqlConnectionStringBuilder(_sqlServer.GetConnectionString())
        {
            InitialCatalog = DatabaseName
        }.ConnectionString;
    }
}
