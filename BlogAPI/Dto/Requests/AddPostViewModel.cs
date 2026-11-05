using System.ComponentModel.DataAnnotations;

namespace Dto.Requests
{
    public class AddPostViewModel
    {
        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string Title { get; set; }
        [Required]
        [MinLength(1)]
        [MaxLength(1800)]
        public string Content { get; set; }
        [Required]
        [RegularExpression("Personal|Travel|Lifestyle|News|Marketing|Sports|Movies")]
        [MinLength(3)]
        [MaxLength(30)]
        public string Category { get; set; }
        public byte[] Image { get; set; }
    }
}
