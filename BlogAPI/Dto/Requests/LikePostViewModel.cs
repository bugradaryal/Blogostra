using System.ComponentModel.DataAnnotations;

namespace Dto.Requests;

public class LikePostViewModel
{
    [Required]
    public int PostId { get; set; }
}
