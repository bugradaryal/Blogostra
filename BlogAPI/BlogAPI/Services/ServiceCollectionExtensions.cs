using Bussiness.Abstractions;

namespace BlogAPI.Services;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiServices(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUser, HttpCurrentUser>();
        services.AddScoped<ITokenService, JwtTokenService>();
        services.AddScoped<IMailTransport, SmtpMailTransport>();

        return services;
    }
}
