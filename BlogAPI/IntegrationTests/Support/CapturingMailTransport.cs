using System.Collections.Concurrent;
using Bussiness.Abstractions;

namespace IntegrationTests.Support;

public sealed record SentMail(string To, string Subject, string HtmlBody);

public sealed class CapturingMailTransport : IMailTransport
{
    private readonly ConcurrentQueue<SentMail> _messages = new();

    public Task SendAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        _messages.Enqueue(new SentMail(to, subject, htmlBody));
        return Task.CompletedTask;
    }

    public SentMail? LastTo(string address)
    {
        return _messages.LastOrDefault(message => string.Equals(message.To, address, StringComparison.OrdinalIgnoreCase));
    }
}
