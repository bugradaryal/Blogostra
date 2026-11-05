using System.ComponentModel.DataAnnotations;

namespace Dto.Requests;

public class PasswordViewModel
{
    [Required]
    public string OldPassword { get; set; } = string.Empty;
    [Required]
    public string NewPassword { get; set; } = string.Empty;
}
