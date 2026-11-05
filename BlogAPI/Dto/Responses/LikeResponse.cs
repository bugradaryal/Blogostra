using System.Text.Json.Serialization;

namespace Dto.Responses;

public sealed class LikeResponse
{
    public int Id { get; init; }

    [JsonPropertyName("post_id")]
    public int PostId { get; init; }

    [JsonPropertyName("user_id")]
    public string UserId { get; init; } = string.Empty;

    public DateTime Date { get; init; }
}
