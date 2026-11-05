using Dto.Responses;
using Entities;

namespace Bussiness.Abstractions;

public interface ILikeRepository
{
    Task LikeThePost(Like like, CancellationToken cancellationToken = default);
    Task<bool> DislikeThePost(int postId, string userId, CancellationToken cancellationToken = default);
    Task<bool> IsPostLiked(int postId, string userId, CancellationToken cancellationToken = default);
    Task<ICollection<LikeStaticsViewModel>> GetAllLikeStatistics(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
}
