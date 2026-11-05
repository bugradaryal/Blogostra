using Bussiness.Common;
using Bussiness.Exceptions;
using Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Bussiness.Features.Admin;

public sealed record SuspendUserCommand(string UserId, bool Suspend) : IRequest;

public sealed class SuspendUserCommandHandler : IRequestHandler<SuspendUserCommand>
{
    private readonly UserManager<User> _userManager;

    public SuspendUserCommandHandler(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task Handle(SuspendUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId)
            ?? throw new NotFoundException("User not exist!");

        if (user.AccountSuspended == request.Suspend)
            return;

        if (request.Suspend)
            user.Suspend();
        else
            user.Reinstate();

        (await _userManager.UpdateAsync(user)).ThrowIfFailed();
    }
}
