using Bussiness.Abstractions;
using Bussiness.Exceptions;
using MediatR;

namespace Bussiness.Features.Admin;

public sealed record DeleteCommentCommand(int CommentId) : IRequest;

public sealed class DeleteCommentCommandHandler : IRequestHandler<DeleteCommentCommand>
{
    private readonly ICommentRepository _commentRepository;

    public DeleteCommentCommandHandler(ICommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
    {
        if (!await _commentRepository.DeleteCommentFromPost(request.CommentId, cancellationToken))
            throw new NotFoundException("Comment not exist!");
    }
}
