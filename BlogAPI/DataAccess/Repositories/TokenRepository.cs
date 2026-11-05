using Bussiness.Abstractions;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class TokenRepository : ITokenRepository
{
    private readonly DataDbContext _context;

    public TokenRepository(DataDbContext context)
    {
        _context = context;
    }

    public Task<RefreshToken?> GetByHash(string tokenHash, CancellationToken cancellationToken = default)
    {
        return _context.RefreshTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash, cancellationToken);
    }

    public async Task Add(RefreshToken token, CancellationToken cancellationToken = default)
    {
        await _context.RefreshTokens.AddAsync(token, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteByHash(string tokenHash, CancellationToken cancellationToken = default)
    {
        var affected = await _context.RefreshTokens
            .Where(x => x.TokenHash == tokenHash)
            .ExecuteDeleteAsync(cancellationToken);

        return affected > 0;
    }

    public async Task DeleteExpired(string userId, DateTime now, CancellationToken cancellationToken = default)
    {
        await _context.RefreshTokens
            .Where(x => x.UserId == userId && x.ExpiresAt <= now)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
