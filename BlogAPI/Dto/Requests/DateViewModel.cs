using System.ComponentModel.DataAnnotations;

namespace Dto.Requests
{
    public class DateViewModel
    {
        [Required]
        public DateTime startdate { get; set; }
        [Required]
        public DateTime enddate { get; set; }
    }
}
