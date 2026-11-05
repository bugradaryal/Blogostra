using Bussiness.Abstractions;
using Bussiness.Common;
using Bussiness.Exceptions;
using Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Bussiness.Features.Users;

public sealed record DeleteAccountCommand : IRequest;

public sealed class DeleteAccountCommandHandler : IRequestHandler<DeleteAccountCommand>
{
    private readonly UserManager<User> _userManager;
    private readonly ICurrentUser _currentUser;

    public DeleteAccountCommandHandler(UserManager<User> userManager, ICurrentUser currentUser)
    {
        _userManager = userManager;
        _currentUser = currentUser;
    }

    public async Task Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(_currentUser.GetUserId())
            ?? throw new UnauthorizedException("User is not exist!!");

        (await _userManager.DeleteAsync(user)).ThrowIfFailed();
    }
}
