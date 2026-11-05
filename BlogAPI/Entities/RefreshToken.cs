namespace Entities;

public class RefreshToken
{
    protected RefreshToken()
    {
    }

    public int Id { get; private set; }
    public string UserId { get; private set; } = string.Empty;
    public string TokenHash { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public User? User { get; private set; }

    public static RefreshToken Issue(string userId, string tokenHash, DateTime issuedAt, TimeSpan lifetime)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);
        ArgumentException.ThrowIfNullOrWhiteSpace(tokenHash);

        return new RefreshToken
        {
            UserId = userId,
            TokenHash = tokenHash,
            CreatedAt = issuedAt,
            ExpiresAt = issuedAt.Add(lifetime)
        };
    }

    public bool IsExpired(DateTime now)
    {
        return ExpiresAt <= now;
    }
}
