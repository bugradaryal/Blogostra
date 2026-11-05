using Entities;

namespace Bussiness.Abstractions;

public interface ICategoryRepository
{
    Task<Category?> GetCategoryByName(string name, CancellationToken cancellationToken = default);
}
