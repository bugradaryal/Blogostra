using Entities;

namespace Bussiness.Abstractions;

public interface IUserRepository
{
    Task<ICollection<User>> GetAllUsers(CancellationToken cancellationToken = default);
    Task<int> UserCount(CancellationToken cancellationToken = default);
}
