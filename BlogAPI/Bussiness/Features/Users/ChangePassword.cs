using Bussiness.Abstractions;
using Bussiness.Common;
using Bussiness.Exceptions;
using Dto.Requests;
using Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Bussiness.Features.Users;

public sealed record ChangePasswordCommand(PasswordViewModel Model) : IRequest;

public sealed class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand>
{
    private readonly UserManager<User> _userManager;
    private readonly ICurrentUser _currentUser;

    public ChangePasswordCommandHandler(UserManager<User> userManager, ICurrentUser currentUser)
    {
        _userManager = userManager;
        _currentUser = currentUser;
    }

    public async Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(_currentUser.GetUserId())
            ?? throw new UnauthorizedException("User is not exist!!");

        var result = await _userManager.ChangePasswordAsync(user, request.Model.OldPassword, request.Model.NewPassword);
        result.ThrowIfFailed();
    }
}
