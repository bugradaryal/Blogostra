using System.Security.Cryptography;
using System.Text;

namespace Utilities.Security;

public static class TokenHasher
{
    public static string Hash(string token)
    {
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    }
}
