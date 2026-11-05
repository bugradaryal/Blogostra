namespace Entities;

public class Category
{
    protected Category()
    {
    }

    public int Id { get; private set; }
    public string Name { get; private set; } = string.Empty;

    public static Category Create(int id, string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new Category { Id = id, Name = name };
    }
}
