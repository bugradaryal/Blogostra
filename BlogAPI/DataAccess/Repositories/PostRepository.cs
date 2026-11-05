using Bussiness.Abstractions;
using Dto.Responses;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class PostRepository : IPostRepository
{
    private readonly DataDbContext _context;

    public PostRepository(DataDbContext context)
    {
        _context = context;
    }

    public async Task AddPost(Post post, CancellationToken cancellationToken = default)
    {
        await _context.Posts.AddAsync(post, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeletePost(int postId, CancellationToken cancellationToken = default)
    {
        var affected = await _context.Posts
            .Where(x => x.Id == postId)
            .ExecuteDeleteAsync(cancellationToken);
        return affected > 0;
    }

    public async Task UpdatePost(Post post, CancellationToken cancellationToken = default)
    {
        if (_context.Entry(post).State == EntityState.Detached)
            _context.Posts.Update(post);

        await _context.SaveChangesAsync(cancellationToken);
    }

    public Task<int> PostCounts(CancellationToken cancellationToken = default)
    {
        return _context.Posts.CountAsync(cancellationToken);
    }

    public Task<bool> PostExists(int postId, CancellationToken cancellationToken = default)
    {
        return _context.Posts.AnyAsync(x => x.Id == postId, cancellationToken);
    }

    public async Task<ICollection<Post>> GetAllPostsByIndex(int currentPage, int index, CancellationToken cancellationToken = default)
    {
        return await _context.Posts
            .AsNoTracking()
            .OrderBy(x => x.Id)
            .Skip((currentPage - 1) * index)
            .Take(index)
            .Include(x => x.Comments)
            .Include(x => x.Likes)
            .Include(x => x.Category)
            .AsSplitQuery()
            .ToListAsync(cancellationToken);
    }

    public Task<Post?> GetPostById(int postId, CancellationToken cancellationToken = default)
    {
        return _context.Posts
            .Include(x => x.Comments)
            .Include(x => x.Likes)
            .Include(x => x.Category)
            .AsSplitQuery()
            .FirstOrDefaultAsync(x => x.Id == postId, cancellationToken);
    }

    public async Task<ICollection<PostStaticsViewModel>> GetAllPostStatistics(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Posts
            .AsNoTracking()
            .Where(post => post.Date >= startDate && post.Date < endDate)
            .GroupBy(post => new { post.Date.Year, post.Date.Month })
            .Select(group => new PostStaticsViewModel
            {
                Year = group.Key.Year,
                Month = group.Key.Month,
                PostCount = group.Count()
            })
            .OrderBy(result => result.Year)
            .ThenBy(result => result.Month)
            .ToListAsync(cancellationToken);
    }

    public async Task<ICollection<Post>> GetPostBySearch(string title, int index, CancellationToken cancellationToken = default)
    {
        const int pageSize = 4;
        var term = title.ToLower();

        return await _context.Posts
            .AsNoTracking()
            .Where(x => x.Title.ToLower().Contains(term))
            .OrderBy(x => x.Id)
            .Skip((index - 1) * pageSize)
            .Take(pageSize)
            .Include(x => x.Comments)
            .Include(x => x.Likes)
            .Include(x => x.Category)
            .AsSplitQuery()
            .ToListAsync(cancellationToken);
    }
}
