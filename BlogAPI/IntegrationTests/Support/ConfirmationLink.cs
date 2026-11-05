using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using Dto.Requests;

namespace IntegrationTests.Support;

public static partial class ConfirmationLink
{
    public static EmailVeificationViewModel Parse(string htmlBody)
    {
        var match = HrefPattern().Match(htmlBody);
        if (!match.Success)
            throw new InvalidOperationException("Confirmation mail does not contain a link.");

        var url = new Uri(WebUtility.HtmlDecode(match.Groups[1].Value));
        var query = HttpUtility.ParseQueryString(url.Query);

        return new EmailVeificationViewModel
        {
            userId = query["userId"] ?? string.Empty,
            emailConfUrl = query["emailConfUrl"] ?? string.Empty
        };
    }

    [GeneratedRegex("href=\"([^\"]+)\"")]
    private static partial Regex HrefPattern();
}
