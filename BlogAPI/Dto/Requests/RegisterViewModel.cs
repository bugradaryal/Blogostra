using System.ComponentModel.DataAnnotations;

namespace Dto.Requests
{
    public class RegisterViewModel
    {
        [MinLength(3)]
        [MaxLength(32)]
        [Required]
        public string Name { get; set; }
        [MinLength(3)]
        [MaxLength(32)]
        [Required]
        public string Surname { get; set; }
        [MinLength(4)]
        [MaxLength(32)]
        [Required]
        public string UserName { get; set; }

        [EmailAddress]
        [Required]
        public string Email { get; set; }
        [MinLength(6)]
        [MaxLength(16)]
        [Required]
        public string Password { get; set; }
        [MaxLength(160)]
        public string Address { get; set; }
        [StringLength(10, ErrorMessage ="Invalid phone number!")]
        [RegularExpression(@"^[0-9]+$", ErrorMessage = "Wrong character type!")]
        public string PhoneNumber { get; set; }
    }
}
