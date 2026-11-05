using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Bussiness.Mapping;
using Dto.Responses;
using MediatR;

namespace Bussiness.Features.Posts;

public sealed record SearchPostsQuery(string Search, int Page) : IRequest<IReadOnlyCollection<PostResponse>>;

public sealed class SearchPostsQueryHandler : IRequestHandler<SearchPostsQuery, IReadOnlyCollection<PostResponse>>
{
    private readonly IPostRepository _postRepository;

    public SearchPostsQueryHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<IReadOnlyCollection<PostResponse>> Handle(SearchPostsQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Search))
            throw new BadRequestException("Search text is required!");
        if (request.Page < 1)
            throw new BadRequestException("Page must be at least 1.");

        var posts = await _postRepository.GetPostBySearch(request.Search, request.Page, cancellationToken);

        return posts.Select(post => post.ToResponse()).ToList();
    }
}
