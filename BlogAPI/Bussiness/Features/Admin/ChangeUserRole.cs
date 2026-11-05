using Bussiness.Common;
using Bussiness.Exceptions;
using Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Bussiness.Features.Admin;

public sealed record ChangeUserRoleCommand(string UserId, string Role) : IRequest;

public sealed class ChangeUserRoleCommandHandler : IRequestHandler<ChangeUserRoleCommand>
{
    private readonly UserManager<User> _userManager;

    public ChangeUserRoleCommandHandler(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task Handle(ChangeUserRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId)
            ?? throw new NotFoundException("User not exist!");

        var currentRoles = await _userManager.GetRolesAsync(user);

        if (currentRoles.Contains(request.Role, StringComparer.OrdinalIgnoreCase))
            throw new ConflictException("User already has that role!");

        if (currentRoles.Count > 0)
            (await _userManager.RemoveFromRolesAsync(user, currentRoles)).ThrowIfFailed();

        (await _userManager.AddToRoleAsync(user, request.Role)).ThrowIfFailed();
    }
}
