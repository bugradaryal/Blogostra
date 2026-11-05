namespace BlogAPI.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
        {
            _logger.LogInformation("Request {Method} {Path} was cancelled by the client", context.Request.Method, context.Request.Path);
            context.Response.StatusCode = 499;
        }
        catch (Exception exception)
        {
            if (context.Response.HasStarted)
            {
                _logger.LogError(exception, "Exception after the response had started on {Method} {Path}", context.Request.Method, context.Request.Path);
                throw;
            }

            await WriteErrorResponse(context, exception);
        }
    }

    private async Task WriteErrorResponse(HttpContext context, Exception exception)
    {
        var response = ErrorResponseFactory.FromException(context, exception, _environment.IsDevelopment());

        if (response.Status >= StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);
        }
        else
        {
            _logger.LogWarning("Request {Method} {Path} failed with {StatusCode}: {ErrorMessage}",
                context.Request.Method, context.Request.Path, response.Status, response.Message);
        }

        context.Response.StatusCode = response.Status;
        await context.Response.WriteAsJsonAsync(response, ErrorResponseFactory.SerializerOptions, ErrorResponseFactory.ContentType);
    }
}
