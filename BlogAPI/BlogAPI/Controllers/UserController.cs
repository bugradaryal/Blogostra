using Bussiness.Features.Users;
using Dto.Requests;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UserController : ControllerBase
{
    private readonly ISender _sender;

    public UserController(ISender sender)
    {
        _sender = sender;
    }

    [HttpDelete("DeleteAccount")]
    public async Task<IActionResult> DeleteAccount(CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteAccountCommand(), cancellationToken);
        return Ok(new { message = "Account successfully deleted!" });
    }

    [HttpPut("UpdateAccount")]
    public async Task<IActionResult> UpdateAccount(UserViewModel userViewModel, CancellationToken cancellationToken)
    {
        await _sender.Send(new UpdateAccountCommand(userViewModel), cancellationToken);
        return Ok(new { message = "Account successfully updated!" });
    }

    [HttpPut("ChangePassword")]
    public async Task<IActionResult> ChangePassword([FromBody] PasswordViewModel passwordViewModel, CancellationToken cancellationToken)
    {
        await _sender.Send(new ChangePasswordCommand(passwordViewModel), cancellationToken);
        return Ok(new { message = "Password successfully changed!" });
    }
}
