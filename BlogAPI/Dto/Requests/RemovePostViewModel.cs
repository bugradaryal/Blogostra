using System.ComponentModel.DataAnnotations;

namespace Dto.Requests
{
    public class RemovePostViewModel
    {
        [Required]
        public int postId { get; set; }
    }
}
