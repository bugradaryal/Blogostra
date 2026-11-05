using Microsoft.AspNetCore.Identity;

namespace Entities;

public class User : IdentityUser
{
    protected User()
    {
    }

    public string Name { get; private set; } = string.Empty;
    public string Surname { get; private set; } = string.Empty;
    public string Address { get; private set; } = string.Empty;
    public bool AccountSuspended { get; private set; }

    public static User Register(string userName, string email, string name, string surname, string address, string? phoneNumber)
    {
        return new User
        {
            UserName = userName,
            Email = email,
            Name = name,
            Surname = surname,
            Address = address,
            PhoneNumber = phoneNumber
        };
    }

    public void UpdateProfile(string userName, string name, string surname, string? phoneNumber, string address)
    {
        UserName = userName;
        Name = name;
        Surname = surname;
        PhoneNumber = phoneNumber;
        Address = address;
    }

    public void Suspend()
    {
        AccountSuspended = true;
    }

    public void Reinstate()
    {
        AccountSuspended = false;
    }
}
