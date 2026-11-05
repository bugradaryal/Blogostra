using System.Net;

namespace Utilities.Mail;

public static class ConfirmationEmail
{
    public static string BuildLink(string baseUrl, string userId, string token)
    {
        return $"{baseUrl.TrimEnd('/')}/EmailVerification?userId={Uri.EscapeDataString(userId)}&emailConfUrl={Uri.EscapeDataString(token)}";
    }

    public static string BuildBody(string link)
    {
        var encodedLink = WebUtility.HtmlEncode(link);

        return $"<p><b>Email verification url: </b><a href=\"{encodedLink}\">Verify your email</a></p>" +
               $"<p>If the link doesn't work: {encodedLink}</p>";
    }
}
