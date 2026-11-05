using Bussiness.Features.Admin;
using Dto.Requests;
using Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = AppRoles.Administrator)]
public class AdminController : ControllerBase
{
    private readonly ISender _sender;

    public AdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("GetAllUsers")]
    public async Task<IActionResult> GetAllUsers(CancellationToken cancellationToken)
    {
        return Ok(await _sender.Send(new GetAllUsersQuery(), cancellationToken));
    }

    [HttpPost("GiveRoleToUser")]
    public async Task<IActionResult> GiveRoleToUser(RoleViewModel roleViewModel, CancellationToken cancellationToken)
    {
        await _sender.Send(new ChangeUserRoleCommand(roleViewModel.userId, roleViewModel.Role), cancellationToken);
        return Ok(new { message = "User has new role!" });
    }

    [HttpPost("SuspendUser")]
    public async Task<IActionResult> SuspendUser(string userId, bool suspend, CancellationToken cancellationToken)
    {
        await _sender.Send(new SuspendUserCommand(userId, suspend), cancellationToken);
        return Ok(new { message = "Done!!" });
    }

    [HttpPost("AddPost")]
    public async Task<IActionResult> AddPost([FromBody] AddPostViewModel postViewModel, CancellationToken cancellationToken)
    {
        await _sender.Send(new CreatePostCommand(postViewModel), cancellationToken);
        return Ok(new { message = "Post added!" });
    }

    [HttpDelete("RemovePost")]
    public async Task<IActionResult> RemovePost([FromBody] RemovePostViewModel removePostViewModel, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeletePostCommand(removePostViewModel.postId), cancellationToken);
        return Ok(new { message = "Post Deleted!" });
    }

    [HttpPut("UpdatePost")]
    public async Task<IActionResult> UpdatePost(UpdatePostViewModel postViewModel, CancellationToken cancellationToken)
    {
        await _sender.Send(new UpdatePostCommand(postViewModel), cancellationToken);
        return Ok("Post updated!!");
    }

    [HttpDelete("DeleteCommentFromPost")]
    public async Task<IActionResult> DeleteCommentFromPost(int commentId, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteCommentCommand(commentId), cancellationToken);
        return Ok("Post deleted!!");
    }

    [HttpPost("GetAllStatistics")]
    public async Task<IActionResult> GetAllStatistics([FromBody] DateViewModel dateViewModel, CancellationToken cancellationToken)
    {
        return Ok(await _sender.Send(new GetStatisticsQuery(dateViewModel.startdate, dateViewModel.enddate), cancellationToken));
    }
}
