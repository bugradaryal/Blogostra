using System.Text;
using BlogAPI.Configuration;
using BlogAPI.Middleware;
using BlogAPI.Services;
using Bussiness;
using DataAccess;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using Serilog;
using Utilities.Settings;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    if (builder.Environment.IsDevelopment())
        builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext());

    builder.Services.AddOptions<JWT>()
        .Bind(builder.Configuration.GetSection("JWT"))
        .Validate(jwt => !string.IsNullOrWhiteSpace(jwt.Key) && Encoding.UTF8.GetByteCount(jwt.Key) >= 32,
            "JWT:Key must be at least 32 bytes long.")
        .Validate(jwt => jwt.RefreshTokenDays is > 0 and <= 90,
            "JWT:RefreshTokenDays must be between 1 and 90.")
        .ValidateOnStart();
    builder.Services.Configure<EmailSender>(builder.Configuration.GetSection("EmailSender"));
    builder.Services.Configure<ClientOptions>(builder.Configuration.GetSection("Client"));

    builder.Services.AddBusiness();
    builder.Services.AddDataAccess();
    builder.Services.AddApiServices();

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
    builder.Services.ConfigureOptions<ConfigureJwtBearerOptions>();

    var clientBaseUrl = builder.Configuration["Client:BaseUrl"] ?? "http://localhost:3000";
    builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
        .WithOrigins(clientBaseUrl)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .WithExposedHeaders("Authorization", "RefreshToken")));

    builder.Services.AddControllers();

    builder.Services.Configure<ApiBehaviorOptions>(options =>
        options.InvalidModelStateResponseFactory = context =>
        {
            var response = ErrorResponseFactory.FromModelState(context.HttpContext, context.ModelState);
            return new ContentResult
            {
                StatusCode = response.Status,
                ContentType = ErrorResponseFactory.ContentType,
                Content = ErrorResponseFactory.Serialize(response)
            };
        });

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(option =>
    {
        option.SwaggerDoc("v1", new OpenApiInfo { Title = "Blog API", Version = "v1" });
        option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter a valid token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "Bearer"
        });
        option.AddSecurityDefinition("RefreshToken", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Name = "RefreshToken",
            Type = SecuritySchemeType.ApiKey,
            Description = "Login response header'ýndaki RefreshToken deðeri"
        });
        option.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                },
                Array.Empty<string>()
            },
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "RefreshToken" }
                },
                Array.Empty<string>()
            }
        });
    });

    var app = builder.Build();

    app.UseSerilogRequestLogging();
    app.UseMiddleware<ExceptionHandlingMiddleware>();

    app.UseHttpsRedirection();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API"));
    }

    app.UseRouting();
    app.UseCors();
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    app.Run();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

public partial class Program
{
}
