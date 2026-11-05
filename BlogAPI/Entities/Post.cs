namespace Entities;

public class Post
{
    private readonly List<Comment> _comments = new();
    private readonly List<Like> _likes = new();

    protected Post()
    {
    }

    public int Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public DateTime Date { get; private set; }
    public string Content { get; private set; } = string.Empty;
    public byte[] Image { get; private set; } = Array.Empty<byte>();
    public int CategoryId { get; private set; }
    public Category? Category { get; private set; }
    public IReadOnlyCollection<Comment> Comments => _comments;
    public IReadOnlyCollection<Like> Likes => _likes;

    public static Post Create(string title, string content, byte[] image, Category category, DateTime createdAt)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(content);

        return new Post
        {
            Title = title,
            Content = content,
            Image = image,
            CategoryId = category.Id,
            Category = category,
            Date = createdAt
        };
    }

    public void Revise(string title, string content, byte[] image, Category category, DateTime revisedAt)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(content);

        Title = title;
        Content = content;
        Image = image;
        CategoryId = category.Id;
        Category = category;
        Date = revisedAt;
    }
}
