using Dto.Responses;
using Entities;

namespace Bussiness.Abstractions;

public interface IPostRepository
{
    Task AddPost(Post post, CancellationToken cancellationToken = default);
    Task<bool> DeletePost(int postId, CancellationToken cancellationToken = default);
    Task UpdatePost(Post post, CancellationToken cancellationToken = default);
    Task<ICollection<Post>> GetAllPostsByIndex(int currentPage, int index, CancellationToken cancellationToken = default);
    Task<Post?> GetPostById(int postId, CancellationToken cancellationToken = default);
    Task<bool> PostExists(int postId, CancellationToken cancellationToken = default);
    Task<int> PostCounts(CancellationToken cancellationToken = default);
    Task<ICollection<PostStaticsViewModel>> GetAllPostStatistics(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task<ICollection<Post>> GetPostBySearch(string title, int index, CancellationToken cancellationToken = default);
}
