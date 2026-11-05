using Bussiness.Abstractions;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class UserRepository : IUserRepository
{
    private readonly DataDbContext _context;

    public UserRepository(DataDbContext context)
    {
        _context = context;
    }

    public async Task<ICollection<User>> GetAllUsers(CancellationToken cancellationToken = default)
    {
        return await _context.Users.AsNoTracking().ToListAsync(cancellationToken);
    }

    public Task<int> UserCount(CancellationToken cancellationToken = default)
    {
        return _context.Users.CountAsync(cancellationToken);
    }
}
