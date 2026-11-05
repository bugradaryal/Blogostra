namespace Bussiness.Abstractions;

public interface IMailTransport
{
    Task SendAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default);
}
