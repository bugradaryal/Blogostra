using Bussiness.Features.Auth;
using Bussiness.Features.Users;
using Dto.Requests;
using Dto.Responses;
using Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BlogAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ISender _sender;

    public AuthController(ISender sender)
    {
        _sender = sender;
    }

    [AllowAnonymous]
    [HttpPost("Register")]
    public async Task<IActionResult> Register(RegisterViewModel registerViewModel, CancellationToken cancellationToken)
    {
        await _sender.Send(new RegisterUserCommand(registerViewModel), cancellationToken);
        return Ok(new { message = "Register is succesfull!!" });
    }

    [AllowAnonymous]
    [HttpPost("Login")]
    public async Task<IActionResult> Login(LoginViewModel loginViewModel, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new LoginCommand(loginViewModel.Email, loginViewModel.Password), cancellationToken);
        AppendTokenHeaders(result);
        return Ok(result.User);
    }

    [Authorize]
    [HttpPost("ValidateToken")]
    public async Task<IActionResult> ValidateToken(CancellationToken cancellationToken)
    {
        return Ok(await _sender.Send(new GetSessionQuery(), cancellationToken));
    }

    [AllowAnonymous]
    [HttpPost("RefreshToken")]
    public async Task<IActionResult> RefreshToken(CancellationToken cancellationToken)
    {
        var refreshToken = Request.Headers["RefreshToken"].FirstOrDefault();
        var result = await _sender.Send(new RefreshTokenCommand(refreshToken), cancellationToken);
        AppendTokenHeaders(result);
        return Ok(new { message = "Login Succesfull With RefreshToken" });
    }

    [AllowAnonymous]
    [HttpPost("SendMail")]
    public async Task<IActionResult> SendingEmail([FromBody] string email, CancellationToken cancellationToken)
    {
        await _sender.Send(new SendConfirmationEmailCommand(email), cancellationToken);
        return Ok(new { message = "Email verification code sended!!!" });
    }

    [AllowAnonymous]
    [HttpPost("Emailverification")]
    public async Task<IActionResult> Emailverification([FromBody] EmailVeificationViewModel emailVeificationViewModel, CancellationToken cancellationToken)
    {
        await _sender.Send(new ConfirmEmailCommand(emailVeificationViewModel.userId, emailVeificationViewModel.emailConfUrl), cancellationToken);
        return Ok(new { message = "Your email has been successfully confirmed!" });
    }

    private void AppendTokenHeaders(AuthResult result)
    {
        Response.Headers.Append("Authorization", "Bearer " + result.AccessToken);
        Response.Headers.Append("RefreshToken", result.RefreshToken);
    }
}
