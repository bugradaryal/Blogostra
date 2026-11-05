using System.ComponentModel.DataAnnotations;

namespace Dto.Requests
{
    public class EmailVeificationViewModel
    {
        [Required]
        public string userId { get; set; }
        [Required]
        public string emailConfUrl { get; set; }
    }
}
