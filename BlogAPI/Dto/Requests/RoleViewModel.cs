using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Dto.Requests
{
    public class RoleViewModel
    {
        [Required]
        public string userId { get; set; }
        [Required]
        [AllowedValues("User", "Administrator")]
        public string Role { get; set ; }
    }
}
