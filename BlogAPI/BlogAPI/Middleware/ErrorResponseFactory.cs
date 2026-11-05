using System.Text.Json;
using System.Text.Json.Serialization;
using Bussiness.Exceptions;
using Dto.Responses;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BlogAPI.Middleware;

public static class ErrorResponseFactory
{
    public const string ContentType = "application/problem+json";

    public static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    public static string Serialize(ErrorResponse response)
    {
        return JsonSerializer.Serialize(response, SerializerOptions);
    }

    public static ErrorResponse FromException(HttpContext context, Exception exception, bool includeDetail)
    {
        switch (exception)
        {
            case AppException appException:
                return new ErrorResponse
                {
                    Status = appException.StatusCode,
                    Title = appException.Title,
                    Message = appException.Message,
                    TraceId = context.TraceIdentifier,
                    Errors = appException.Errors
                };

            case BadHttpRequestException badRequest:
                return new ErrorResponse
                {
                    Status = badRequest.StatusCode,
                    Title = "Bad Request",
                    Message = "The request could not be processed.",
                    TraceId = context.TraceIdentifier,
                    Detail = includeDetail ? badRequest.Message : null
                };

            default:
                return new ErrorResponse
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "Internal Server Error",
                    Message = "An unexpected error occurred. Please try again later.",
                    TraceId = context.TraceIdentifier,
                    Detail = includeDetail ? exception.ToString() : null
                };
        }
    }

    public static ErrorResponse FromModelState(HttpContext context, ModelStateDictionary modelState)
    {
        var errors = modelState
            .Where(entry => entry.Value is { Errors.Count: > 0 })
            .ToDictionary(
                entry => entry.Key,
                entry => entry.Value!.Errors
                    .Select(error => string.IsNullOrEmpty(error.ErrorMessage) ? "The input was not valid." : error.ErrorMessage)
                    .ToArray());

        return new ErrorResponse
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation Failed",
            Message = errors.Count == 0
                ? "One or more validation errors occurred."
                : string.Join(" ", errors.Values.SelectMany(messages => messages)),
            TraceId = context.TraceIdentifier,
            Errors = errors
        };
    }
}
