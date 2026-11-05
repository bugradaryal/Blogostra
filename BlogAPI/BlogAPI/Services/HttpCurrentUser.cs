using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Utilities.Security;

namespace BlogAPI.Services;

public class HttpCurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public HttpCurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string GetUserId()
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimNames.UserId)?.Value;

        return string.IsNullOrEmpty(userId)
            ? throw new UnauthorizedException("User is not authenticated.")
            : userId;
    }
}
