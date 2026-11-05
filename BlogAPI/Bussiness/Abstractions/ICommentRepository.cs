using Dto.Responses;
using Entities;

namespace Bussiness.Abstractions;

public interface ICommentRepository
{
    Task AddCommentToPost(Comment comment, CancellationToken cancellationToken = default);
    Task<bool> DeleteCommentFromPost(int commentId, CancellationToken cancellationToken = default);
    Task<ICollection<CommentStaticsViewModel>> GetAllCommentStatistics(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
}
