using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Dto.Responses;
using Entities;
using MediatR;

namespace Bussiness.Features.Auth;

public sealed record RefreshTokenCommand(string? RefreshToken) : IRequest<AuthResult>;

public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResult>
{
    private readonly ITokenService _tokenService;

    public RefreshTokenCommandHandler(ITokenService tokenService)
    {
        _tokenService = tokenService;
    }

    public async Task<AuthResult> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
            throw new BadRequestException("RefreshToken not found.");

        var user = await _tokenService.ResolveRefreshToken(request.RefreshToken, cancellationToken);
        if (user.AccountSuspended)
            throw new ForbiddenException("User's account suspended!");

        return await _tokenService.Issue(user);
    }
}
