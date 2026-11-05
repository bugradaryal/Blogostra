using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Dto.Requests;
using Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Bussiness.Features.Comments;

public sealed record AddCommentCommand(CommentViewModel Model) : IRequest;

public sealed class AddCommentCommandHandler : IRequestHandler<AddCommentCommand>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IPostRepository _postRepository;
    private readonly UserManager<User> _userManager;
    private readonly ICurrentUser _currentUser;
    private readonly TimeProvider _timeProvider;

    public AddCommentCommandHandler(
        ICommentRepository commentRepository,
        IPostRepository postRepository,
        UserManager<User> userManager,
        ICurrentUser currentUser,
        TimeProvider timeProvider)
    {
        _commentRepository = commentRepository;
        _postRepository = postRepository;
        _userManager = userManager;
        _currentUser = currentUser;
        _timeProvider = timeProvider;
    }

    public async Task Handle(AddCommentCommand request, CancellationToken cancellationToken)
    {
        var author = await _userManager.FindByIdAsync(_currentUser.GetUserId())
            ?? throw new UnauthorizedException("User is not exist!!");

        if (!await _postRepository.PostExists(request.Model.post_id, cancellationToken))
            throw new NotFoundException("Post not exist!");

        var comment = Comment.Create(author, request.Model.post_id, request.Model.Content, _timeProvider.GetUtcNow().UtcDateTime);
        await _commentRepository.AddCommentToPost(comment, cancellationToken);
    }
}
