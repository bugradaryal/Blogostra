using System.ComponentModel.DataAnnotations;

namespace Dto.Requests;

public class CommentViewModel
{
    [Required]
    public int post_id { get; set; }
    [Required]
    [MinLength(1)]
    [MaxLength(720)]
    public string Content { get; set; } = string.Empty;
}
