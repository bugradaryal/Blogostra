using Dto.Responses;
using Entities;

namespace Bussiness.Mapping;

public static class PostMappings
{
    public static PostResponse ToResponse(this Post post)
    {
        return new PostResponse
        {
            Id = post.Id,
            Title = post.Title,
            Date = post.Date,
            Content = post.Content,
            Image = post.Image,
            CategoryId = post.CategoryId,
            Category = post.Category?.ToResponse(),
            Comments = post.Comments.Select(comment => comment.ToResponse()).ToList(),
            Likes = post.Likes.Select(like => like.ToResponse()).ToList()
        };
    }

    public static CategoryResponse ToResponse(this Category category)
    {
        return new CategoryResponse { Id = category.Id, Name = category.Name };
    }

    public static CommentResponse ToResponse(this Comment comment)
    {
        return new CommentResponse
        {
            Id = comment.Id,
            UserId = comment.UserId,
            UserName = comment.UserName,
            PostId = comment.PostId,
            Date = comment.Date,
            Content = comment.Content
        };
    }

    public static LikeResponse ToResponse(this Like like)
    {
        return new LikeResponse
        {
            Id = like.Id,
            PostId = like.PostId,
            UserId = like.UserId,
            Date = like.Date
        };
    }
}
