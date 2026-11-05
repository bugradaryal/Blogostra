namespace Entities;

public class Comment
{
    protected Comment()
    {
    }

    public int Id { get; private set; }
    public string UserId { get; private set; } = string.Empty;
    public string UserName { get; private set; } = string.Empty;
    public int PostId { get; private set; }
    public DateTime Date { get; private set; }
    public string Content { get; private set; } = string.Empty;
    public User? User { get; private set; }
    public Post? Post { get; private set; }

    public static Comment Create(User author, int postId, string content, DateTime createdAt)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(content);

        return new Comment
        {
            UserId = author.Id,
            UserName = author.UserName ?? string.Empty,
            PostId = postId,
            Content = content,
            Date = createdAt
        };
    }
}
