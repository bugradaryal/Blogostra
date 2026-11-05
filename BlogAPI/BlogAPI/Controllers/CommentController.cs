using Bussiness.Features.Comments;
using Dto.Requests;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CommentController : ControllerBase
{
    private readonly ISender _sender;

    public CommentController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("AddCommentToPost")]
    [Authorize]
    public async Task<IActionResult> AddCommentToPost(CommentViewModel commentViewModel, CancellationToken cancellationToken)
    {
        await _sender.Send(new AddCommentCommand(commentViewModel), cancellationToken);
        return Ok("Comment added to the post!!");
    }
}
