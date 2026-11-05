using Bussiness.Abstractions;
using Bussiness.Common;
using Bussiness.Exceptions;
using Dto.Requests;
using Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Bussiness.Features.Users;

public sealed record UpdateAccountCommand(UserViewModel Model) : IRequest;

public sealed class UpdateAccountCommandHandler : IRequestHandler<UpdateAccountCommand>
{
    private readonly UserManager<User> _userManager;
    private readonly ICurrentUser _currentUser;

    public UpdateAccountCommandHandler(UserManager<User> userManager, ICurrentUser currentUser)
    {
        _userManager = userManager;
        _currentUser = currentUser;
    }

    public async Task Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(_currentUser.GetUserId())
            ?? throw new UnauthorizedException("User is not exist!!");

        var model = request.Model;
        user.UpdateProfile(model.UserName, model.Name, model.Surname, model.PhoneNumber, model.Address ?? user.Address);

        (await _userManager.UpdateAsync(user)).ThrowIfFailed();
    }
}
