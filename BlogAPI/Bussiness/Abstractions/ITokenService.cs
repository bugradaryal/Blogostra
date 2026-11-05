using Dto.Responses;
using Entities;

namespace Bussiness.Abstractions;

public interface ITokenService
{
    Task<AuthResult> Issue(User user);
    Task<User> ResolveRefreshToken(string refreshToken, CancellationToken cancellationToken = default);
}
