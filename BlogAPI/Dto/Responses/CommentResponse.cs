using System.Text.Json.Serialization;

namespace Dto.Responses;

public sealed class CommentResponse
{
    public int Id { get; init; }

    [JsonPropertyName("user_id")]
    public string UserId { get; init; } = string.Empty;

    public string UserName { get; init; } = string.Empty;

    [JsonPropertyName("post_id")]
    public int PostId { get; init; }

    public DateTime Date { get; init; }
    public string Content { get; init; } = string.Empty;
}
