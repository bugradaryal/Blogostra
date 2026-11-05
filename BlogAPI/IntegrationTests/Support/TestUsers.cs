using Dto.Requests;

namespace IntegrationTests.Support;

public static class TestUsers
{
    public const string Password = "Passw0rd!";

    public static RegisterViewModel NewRegistration()
    {
        var suffix = Guid.NewGuid().ToString("N")[..10];

        return new RegisterViewModel
        {
            Name = "Test",
            Surname = "Person",
            UserName = $"user{suffix}",
            Email = $"user{suffix}@example.com",
            Password = Password,
            Address = "Test Street 1",
            PhoneNumber = "5551234567"
        };
    }
}
