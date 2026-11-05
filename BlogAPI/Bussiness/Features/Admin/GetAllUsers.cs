using Bussiness.Abstractions;
using Bussiness.Mapping;
using Dto.Responses;
using MediatR;

namespace Bussiness.Features.Admin;

public sealed record GetAllUsersQuery : IRequest<IReadOnlyCollection<UserProfileViewModel>>;

public sealed class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, IReadOnlyCollection<UserProfileViewModel>>
{
    private readonly IUserRepository _userRepository;

    public GetAllUsersQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IReadOnlyCollection<UserProfileViewModel>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetAllUsers(cancellationToken);

        return users.Select(user => user.ToProfile()).ToList();
    }
}
