using Bussiness.Abstractions;
using Bussiness.Exceptions;
using MediatR;

namespace Bussiness.Features.Admin;

public sealed record DeletePostCommand(int PostId) : IRequest;

public sealed class DeletePostCommandHandler : IRequestHandler<DeletePostCommand>
{
    private readonly IPostRepository _postRepository;

    public DeletePostCommandHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task Handle(DeletePostCommand request, CancellationToken cancellationToken)
    {
        if (!await _postRepository.DeletePost(request.PostId, cancellationToken))
            throw new NotFoundException("Post not exist!");
    }
}
