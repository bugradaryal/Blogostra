using Entities;

namespace Bussiness.Abstractions;

public interface ITokenRepository
{
    Task<RefreshToken?> GetByHash(string tokenHash, CancellationToken cancellationToken = default);
    Task Add(RefreshToken token, CancellationToken cancellationToken = default);
    Task<bool> DeleteByHash(string tokenHash, CancellationToken cancellationToken = default);
    Task DeleteExpired(string userId, DateTime now, CancellationToken cancellationToken = default);
}
