using System.ComponentModel.DataAnnotations;

namespace Dto.Requests
{
    public class LoginViewModel
    {
        [EmailAddress]
        [Required]
        public string Email { get; set; }
        [Required]
        [MaxLength(32)]
        [MinLength(6)]
        public string Password { get; set; }
    }
}
