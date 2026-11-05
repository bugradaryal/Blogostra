namespace Dto.Responses;

public class TokenValidationViewModel
{
    public UserProfileViewModel user { get; set; } = null!;
    public string role { get; set; } = string.Empty;
}
