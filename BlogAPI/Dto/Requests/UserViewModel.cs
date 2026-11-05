using System.ComponentModel.DataAnnotations;

namespace Dto.Requests;

public class UserViewModel
{
    [MinLength(4)]
    [MaxLength(32)]
    [Required]
    public string UserName { get; set; } = string.Empty;
    [EmailAddress]
    [Required]
    public string Email { get; set; } = string.Empty;
    [MinLength(3)]
    [MaxLength(32)]
    [Required]
    public string Name { get; set; } = string.Empty;
    [MinLength(3)]
    [MaxLength(32)]
    [Required]
    public string Surname { get; set; } = string.Empty;
    [StringLength(10, ErrorMessage = "Invalid phone number!")]
    [RegularExpression(@"^[0-9]+$", ErrorMessage = "Wrong character type!")]
    public string? PhoneNumber { get; set; }
    [MaxLength(160)]
    public string? Address { get; set; }
}
