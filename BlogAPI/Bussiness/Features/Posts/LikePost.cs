using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Entities;
using MediatR;

namespace Bussiness.Features.Posts;

public sealed record LikePostCommand(int PostId) : IRequest;

public sealed class LikePostCommandHandler : IRequestHandler<LikePostCommand>
{
    private readonly IPostRepository _postRepository;
    private readonly ILikeRepository _likeRepository;
    private readonly ICurrentUser _currentUser;
    private readonly TimeProvider _timeProvider;

    public LikePostCommandHandler(IPostRepository postRepository, ILikeRepository likeRepository, ICurrentUser currentUser, TimeProvider timeProvider)
    {
        _postRepository = postRepository;
        _likeRepository = likeRepository;
        _currentUser = currentUser;
        _timeProvider = timeProvider;
    }

    public async Task Handle(LikePostCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.GetUserId();

        if (!await _postRepository.PostExists(request.PostId, cancellationToken))
            throw new NotFoundException("Post not exist!");

        if (await _likeRepository.IsPostLiked(request.PostId, userId, cancellationToken))
            throw new ConflictException("Post already liked!");

        var like = Like.Create(request.PostId, userId, _timeProvider.GetUtcNow().UtcDateTime);
        await _likeRepository.LikeThePost(like, cancellationToken);
    }
}
