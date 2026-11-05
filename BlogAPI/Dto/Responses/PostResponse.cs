using System.Text.Json.Serialization;

namespace Dto.Responses;

public sealed class PostResponse
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public DateTime Date { get; init; }
    public string Content { get; init; } = string.Empty;
    public byte[] Image { get; init; } = Array.Empty<byte>();

    [JsonPropertyName("category_id")]
    public int CategoryId { get; init; }

    [JsonPropertyName("categories")]
    public CategoryResponse? Category { get; init; }

    [JsonPropertyName("comments")]
    public IReadOnlyCollection<CommentResponse> Comments { get; init; } = Array.Empty<CommentResponse>();

    [JsonPropertyName("likes")]
    public IReadOnlyCollection<LikeResponse> Likes { get; init; } = Array.Empty<LikeResponse>();
}
