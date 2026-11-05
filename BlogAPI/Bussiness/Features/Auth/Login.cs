using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Dto.Responses;
using Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Bussiness.Features.Auth;

public sealed record LoginCommand(string Email, string Password) : IRequest<AuthResult>;

public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResult>
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ITokenService _tokenService;

    public LoginCommandHandler(UserManager<User> userManager, SignInManager<User> signInManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    public async Task<AuthResult> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email)
            ?? throw new UnauthorizedException("Email or password is wrong!");

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

        if (result.IsLockedOut)
            throw new ForbiddenException("Too many attempt. Account is locked for 5 min!");
        if (result.IsNotAllowed)
            throw new ForbiddenException("Your email is not verified! Please check your mailbox!!");
        if (!result.Succeeded)
            throw new UnauthorizedException("Email or password is wrong!");
        if (user.AccountSuspended)
            throw new ForbiddenException("User's account suspended!");

        return await _tokenService.Issue(user);
    }
}
