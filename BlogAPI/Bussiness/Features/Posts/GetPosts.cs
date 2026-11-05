using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Bussiness.Mapping;
using Dto.Responses;
using MediatR;

namespace Bussiness.Features.Posts;

public sealed record GetPostsQuery(int Page, int PageSize) : IRequest<IReadOnlyCollection<PostResponse>>;

public sealed class GetPostsQueryHandler : IRequestHandler<GetPostsQuery, IReadOnlyCollection<PostResponse>>
{
    public const int MaxPageSize = 50;

    private readonly IPostRepository _postRepository;

    public GetPostsQueryHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<IReadOnlyCollection<PostResponse>> Handle(GetPostsQuery request, CancellationToken cancellationToken)
    {
        if (request.Page < 1 || request.PageSize < 1 || request.PageSize > MaxPageSize)
            throw new BadRequestException($"Page must be at least 1 and page size must be between 1 and {MaxPageSize}.");

        var posts = await _postRepository.GetAllPostsByIndex(request.Page, request.PageSize, cancellationToken);

        return posts.Select(post => post.ToResponse()).ToList();
    }
}
