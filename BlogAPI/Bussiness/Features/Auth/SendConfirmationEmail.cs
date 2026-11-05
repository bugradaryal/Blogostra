using Bussiness.Abstractions;
using Bussiness.Exceptions;
using Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Utilities.Mail;
using Utilities.Settings;

namespace Bussiness.Features.Auth;

public sealed record SendConfirmationEmailCommand(string Email) : IRequest;

public sealed class SendConfirmationEmailCommandHandler : IRequestHandler<SendConfirmationEmailCommand>
{
    private readonly UserManager<User> _userManager;
    private readonly IMailTransport _mailTransport;
    private readonly ClientOptions _clientOptions;

    public SendConfirmationEmailCommandHandler(UserManager<User> userManager, IMailTransport mailTransport, IOptions<ClientOptions> clientOptions)
    {
        _userManager = userManager;
        _mailTransport = mailTransport;
        _clientOptions = clientOptions.Value;
    }

    public async Task Handle(SendConfirmationEmailCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email)
            ?? throw new NotFoundException("Account does not exist!");

        if (user.EmailConfirmed)
            throw new BadRequestException("Email is already confirmed!");

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var link = ConfirmationEmail.BuildLink(_clientOptions.BaseUrl, user.Id, token);

        await _mailTransport.SendAsync(request.Email, "Email Verification", ConfirmationEmail.BuildBody(link), cancellationToken);
    }
}
