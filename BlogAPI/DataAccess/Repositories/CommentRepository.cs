using Bussiness.Abstractions;
using Dto.Responses;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly DataDbContext _context;

    public CommentRepository(DataDbContext context)
    {
        _context = context;
    }

    public async Task AddCommentToPost(Comment comment, CancellationToken cancellationToken = default)
    {
        await _context.Comments.AddAsync(comment, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteCommentFromPost(int commentId, CancellationToken cancellationToken = default)
    {
        var affected = await _context.Comments
            .Where(x => x.Id == commentId)
            .ExecuteDeleteAsync(cancellationToken);
        return affected > 0;
    }

    public async Task<ICollection<CommentStaticsViewModel>> GetAllCommentStatistics(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Comments
            .AsNoTracking()
            .Where(comment => comment.Date >= startDate && comment.Date < endDate)
            .GroupBy(comment => new { comment.Date.Year, comment.Date.Month })
            .Select(group => new CommentStaticsViewModel
            {
                Year = group.Key.Year,
                Month = group.Key.Month,
                CommentCount = group.Count()
            })
            .OrderBy(result => result.Year)
            .ThenBy(result => result.Month)
            .ToListAsync(cancellationToken);
    }
}
