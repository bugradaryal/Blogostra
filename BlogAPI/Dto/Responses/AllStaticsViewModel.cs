namespace Dto.Responses
{
    public class AllStaticsViewModel
    {
        public ICollection<PostStaticsViewModel> PostStatics { get; set; }
        public ICollection<CommentStaticsViewModel> CommentStatics { get; set; }
        public ICollection<LikeStaticsViewModel> LikeStatics { get; set; }
        public int UserCount { get; set; }
    }
}
