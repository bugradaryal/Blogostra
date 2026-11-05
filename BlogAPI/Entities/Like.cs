namespace Entities;

public class Like
{
    protected Like()
    {
    }

    public int Id { get; private set; }
    public int PostId { get; private set; }
    public string UserId { get; private set; } = string.Empty;
    public DateTime Date { get; private set; }
    public Post? Post { get; private set; }
    public User? User { get; private set; }

    public static Like Create(int postId, string userId, DateTime likedAt)
    {
        return new Like
        {
            PostId = postId,
            UserId = userId,
            Date = likedAt
        };
    }
}
