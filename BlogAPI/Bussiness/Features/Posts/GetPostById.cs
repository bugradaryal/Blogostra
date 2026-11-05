using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Bussiness.Mapping;
using Dto.Responses;
using MediatR;

namespace Bussiness.Features.Posts;

public sealed record GetPostByIdQuery(int PostId) : IRequest<PostResponse>;

public sealed class GetPostByIdQueryHandler : IRequestHandler<GetPostByIdQuery, PostResponse>
{
    private readonly IPostRepository _postRepository;

    public GetPostByIdQueryHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<PostResponse> Handle(GetPostByIdQuery request, CancellationToken cancellationToken)
    {
        var post = await _postRepository.GetPostById(request.PostId, cancellationToken)
            ?? throw new NotFoundException("Post not exist!");

        return post.ToResponse();
    }
}
