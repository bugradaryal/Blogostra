namespace Dto.Responses;

public record AuthResult(UserProfileViewModel User, string AccessToken, string RefreshToken);
