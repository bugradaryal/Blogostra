using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Bussiness.Mapping;
using Dto.Responses;
using Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Bussiness.Features.Auth;

public sealed record GetSessionQuery : IRequest<TokenValidationViewModel>;

public sealed class GetSessionQueryHandler : IRequestHandler<GetSessionQuery, TokenValidationViewModel>
{
    private readonly UserManager<User> _userManager;
    private readonly ICurrentUser _currentUser;

    public GetSessionQueryHandler(UserManager<User> userManager, ICurrentUser currentUser)
    {
        _userManager = userManager;
        _currentUser = currentUser;
    }

    public async Task<TokenValidationViewModel> Handle(GetSessionQuery request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(_currentUser.GetUserId())
            ?? throw new UnauthorizedException("User is not exist!!");

        if (user.AccountSuspended)
            throw new ForbiddenException("User is suspended!!");

        var roles = await _userManager.GetRolesAsync(user);

        return new TokenValidationViewModel
        {
            user = user.ToProfile(),
            role = roles.FirstOrDefault() ?? string.Empty
        };
    }
}
