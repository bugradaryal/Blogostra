using Bussiness.Features.Posts;
using Dto.Requests;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PostController : ControllerBase
{
    private readonly ISender _sender;

    public PostController(ISender sender)
    {
        _sender = sender;
    }

    [AllowAnonymous]
    [HttpGet("GetAllPostsByIndex")]
    public async Task<IActionResult> GetAllPostsByIndex(CancellationToken cancellationToken, int CurrentPage = 1, int index = 4)
    {
        return Ok(await _sender.Send(new GetPostsQuery(CurrentPage, index), cancellationToken));
    }

    [AllowAnonymous]
    [HttpGet("GetPostById")]
    public async Task<IActionResult> GetPostById(int postId, CancellationToken cancellationToken)
    {
        return Ok(await _sender.Send(new GetPostByIdQuery(postId), cancellationToken));
    }

    [AllowAnonymous]
    [HttpGet("GetPostCounts")]
    public async Task<IActionResult> PostCounts(CancellationToken cancellationToken)
    {
        return Ok(await _sender.Send(new GetPostCountQuery(), cancellationToken));
    }

    [Authorize]
    [HttpPost("LikeThePost")]
    public async Task<IActionResult> LikeThePost([FromBody] LikePostViewModel likePostViewModel, CancellationToken cancellationToken)
    {
        await _sender.Send(new LikePostCommand(likePostViewModel.PostId), cancellationToken);
        return Ok("Post Liked!!");
    }

    [Authorize]
    [HttpPost("DislikeThePost")]
    public async Task<IActionResult> DislikeThePost([FromBody] LikePostViewModel likePostViewModel, CancellationToken cancellationToken)
    {
        await _sender.Send(new DislikePostCommand(likePostViewModel.PostId), cancellationToken);
        return Ok("Post Disliked!!");
    }

    [AllowAnonymous]
    [HttpGet("GetPostBySearch")]
    public async Task<IActionResult> GetPostBySearch(string search, CancellationToken cancellationToken, int index = 1)
    {
        return Ok(await _sender.Send(new SearchPostsQuery(search, index), cancellationToken));
    }
}
