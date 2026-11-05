namespace Dto.Responses;

public class ErrorResponse
{
    public int Status { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public string TraceId { get; init; } = string.Empty;
    public string? Detail { get; init; }
    public IReadOnlyDictionary<string, string[]>? Errors { get; init; }
}
