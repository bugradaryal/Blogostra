using Bussiness.Abstractions;
using Dto.Responses;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class LikeRepository : ILikeRepository
{
    private readonly DataDbContext _context;

    public LikeRepository(DataDbContext context)
    {
        _context = context;
    }

    public async Task LikeThePost(Like like, CancellationToken cancellationToken = default)
    {
        await _context.Likes.AddAsync(like, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DislikeThePost(int postId, string userId, CancellationToken cancellationToken = default)
    {
        var affected = await _context.Likes
            .Where(x => x.PostId == postId && x.UserId == userId)
            .ExecuteDeleteAsync(cancellationToken);
        return affected > 0;
    }

    public Task<bool> IsPostLiked(int postId, string userId, CancellationToken cancellationToken = default)
    {
        return _context.Likes.AnyAsync(x => x.PostId == postId && x.UserId == userId, cancellationToken);
    }

    public async Task<ICollection<LikeStaticsViewModel>> GetAllLikeStatistics(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Likes
            .AsNoTracking()
            .Where(like => like.Date >= startDate && like.Date < endDate)
            .GroupBy(like => new { like.Date.Year, like.Date.Month })
            .Select(group => new LikeStaticsViewModel
            {
                Year = group.Key.Year,
                Month = group.Key.Month,
                LikeCount = group.Count()
            })
            .OrderBy(result => result.Year)
            .ThenBy(result => result.Month)
            .ToListAsync(cancellationToken);
    }
}
