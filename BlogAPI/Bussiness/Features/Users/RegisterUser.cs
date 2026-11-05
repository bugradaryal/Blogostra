using Bussiness.Common;
using Dto.Requests;
using Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Bussiness.Features.Users;

public sealed record RegisterUserCommand(RegisterViewModel Model) : IRequest;

public sealed class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand>
{
    private readonly UserManager<User> _userManager;

    public RegisterUserCommandHandler(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var model = request.Model;
        var user = User.Register(model.UserName, model.Email, model.Name, model.Surname, model.Address, model.PhoneNumber);

        (await _userManager.CreateAsync(user, model.Password)).ThrowIfFailed();

        var roleResult = await _userManager.AddToRoleAsync(user, AppRoles.User);
        if (!roleResult.Succeeded)
        {
            await _userManager.DeleteAsync(user);
            roleResult.ThrowIfFailed();
        }
    }
}
