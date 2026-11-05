using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Bussiness.Mapping;
using Dto.Responses;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Utilities.Security;
using Utilities.Settings;

namespace BlogAPI.Services;

public sealed class JwtTokenService : ITokenService
{
    private readonly JWT _jwt;
    private readonly SymmetricSecurityKey _key;
    private readonly UserManager<User> _userManager;
    private readonly ITokenRepository _tokenRepository;
    private readonly TimeProvider _timeProvider;

    public JwtTokenService(IOptions<JWT> jwt, UserManager<User> userManager, ITokenRepository tokenRepository, TimeProvider timeProvider)
    {
        _jwt = jwt.Value;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
        _userManager = userManager;
        _tokenRepository = tokenRepository;
        _timeProvider = timeProvider;
    }

    public async Task<AuthResult> Issue(User user)
    {
        var now = _timeProvider.GetUtcNow().UtcDateTime;

        var accessToken = await CreateAccessToken(user, now);
        var refreshToken = SecureToken.Generate();

        await _tokenRepository.DeleteExpired(user.Id, now);
        await _tokenRepository.Add(RefreshToken.Issue(user.Id, TokenHasher.Hash(refreshToken), now, TimeSpan.FromDays(_jwt.RefreshTokenDays)));

        return new AuthResult(user.ToProfile(), accessToken, refreshToken);
    }

    public async Task<User> ResolveRefreshToken(string refreshToken, CancellationToken cancellationToken = default)
    {
        var tokenHash = TokenHasher.Hash(refreshToken);

        var stored = await _tokenRepository.GetByHash(tokenHash, cancellationToken)
            ?? throw new UnauthorizedException("Refresh token is invalid!!");

        var consumed = await _tokenRepository.DeleteByHash(tokenHash, cancellationToken);
        if (!consumed)
            throw new UnauthorizedException("Refresh token is invalid!!");

        if (stored.IsExpired(_timeProvider.GetUtcNow().UtcDateTime))
            throw new UnauthorizedException("Refresh token is expired!!");

        return await _userManager.FindByIdAsync(stored.UserId)
            ?? throw new UnauthorizedException("Refresh token is invalid!!");
    }

    private async Task<string> CreateAccessToken(User user, DateTime now)
    {
        var roles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim> { new(ClaimNames.UserId, user.Id) };
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = now.AddMinutes(_jwt.DurationInMinutes),
            SigningCredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature),
            Issuer = _jwt.Issuer,
            Audience = _jwt.Audience
        };

        var handler = new JwtSecurityTokenHandler();
        return handler.WriteToken(handler.CreateToken(descriptor));
    }
}
