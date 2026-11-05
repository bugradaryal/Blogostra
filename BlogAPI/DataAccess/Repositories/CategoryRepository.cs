using Bussiness.Abstractions;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly DataDbContext _context;

    public CategoryRepository(DataDbContext context)
    {
        _context = context;
    }

    public Task<Category?> GetCategoryByName(string name, CancellationToken cancellationToken = default)
    {
        return _context.Categories.FirstOrDefaultAsync(x => x.Name == name, cancellationToken);
    }
}
