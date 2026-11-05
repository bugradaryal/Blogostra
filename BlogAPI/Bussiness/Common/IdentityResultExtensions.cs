using Bussiness.Exceptions;
using Microsoft.AspNetCore.Identity;

namespace Bussiness.Common;

public static class IdentityResultExtensions
{
    private static readonly HashSet<string> DuplicateCodes = new()
    {
        nameof(IdentityErrorDescriber.DuplicateEmail),
        nameof(IdentityErrorDescriber.DuplicateUserName)
    };

    public static void ThrowIfFailed(this IdentityResult result)
    {
        if (result.Succeeded)
            return;

        var message = string.Join(" ", result.Errors.Select(error => error.Description));

        if (result.Errors.Any(error => DuplicateCodes.Contains(error.Code)))
            throw new ConflictException(message);

        var errors = result.Errors
            .GroupBy(error => error.Code)
            .ToDictionary(group => group.Key, group => group.Select(error => error.Description).ToArray());

        throw new ValidationFailedException(message, errors);
    }
}
