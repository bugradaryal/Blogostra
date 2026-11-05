using Bussiness.Abstractions;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using Utilities.Settings;

namespace BlogAPI.Services;

public sealed class SmtpMailTransport : IMailTransport
{
    private readonly EmailSender _settings;

    public SmtpMailTransport(IOptions<EmailSender> settings)
    {
        _settings = settings.Value;
    }

    public async Task SendAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Blog", _settings.Email));
        message.To.Add(new MailboxAddress(string.Empty, to));
        message.Subject = subject;
        message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.SslOnConnect, cancellationToken);
        await client.AuthenticateAsync(_settings.Email, _settings.Password, cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}
