using Bussiness.Abstractions;
using MediatR;

namespace Bussiness.Features.Posts;

public sealed record GetPostCountQuery : IRequest<int>;

public sealed class GetPostCountQueryHandler : IRequestHandler<GetPostCountQuery, int>
{
    private readonly IPostRepository _postRepository;

    public GetPostCountQueryHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public Task<int> Handle(GetPostCountQuery request, CancellationToken cancellationToken)
    {
        return _postRepository.PostCounts(cancellationToken);
    }
}
