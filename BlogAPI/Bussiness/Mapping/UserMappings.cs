using Dto.Responses;
using Entities;

namespace Bussiness.Mapping;

public static class UserMappings
{
    public static UserProfileViewModel ToProfile(this User user)
    {
        return new UserProfileViewModel
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            EmailConfirmed = user.EmailConfirmed,
            Name = user.Name,
            Surname = user.Surname,
            PhoneNumber = user.PhoneNumber,
            Address = user.Address,
            AccountSuspended = user.AccountSuspended
        };
    }
}
