using Bussiness.Abstractions;
using Bussiness.Exceptions;
using MediatR;

namespace Bussiness.Features.Posts;

public sealed record DislikePostCommand(int PostId) : IRequest;

public sealed class DislikePostCommandHandler : IRequestHandler<DislikePostCommand>
{
    private readonly ILikeRepository _likeRepository;
    private readonly ICurrentUser _currentUser;

    public DislikePostCommandHandler(ILikeRepository likeRepository, ICurrentUser currentUser)
    {
        _likeRepository = likeRepository;
        _currentUser = currentUser;
    }

    public async Task Handle(DislikePostCommand request, CancellationToken cancellationToken)
    {
        var removed = await _likeRepository.DislikeThePost(request.PostId, _currentUser.GetUserId(), cancellationToken);
        if (!removed)
            throw new ConflictException("Post already dissliked!");
    }
}
