using System.Security.Cryptography;

namespace Utilities.Security;

public static class SecureToken
{
    public static string Generate(int byteCount = 32)
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(byteCount));
    }
}
