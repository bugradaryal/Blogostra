using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.SeedData;

public class AdminUser : IEntityTypeConfiguration<User>, IEntityTypeConfiguration<IdentityUserRole<string>>
{
    public const string UserId = "058fc4dd-2ece-4290-8ac7-d2c4cc96c9c7";

    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasData(new
        {
            Id = UserId,
            UserName = "Oyuasx",
            NormalizedUserName = "OYUASX",
            Email = "oyuasx@gmail.com",
            NormalizedEmail = "OYUASX@GMAIL.COM",
            EmailConfirmed = true,
            PasswordHash = "AQAAAAIAAYagAAAAEM9HAAtAOpsqTutJygMXTyg6AN8ChcISPTfVTHxRixUVPVP0rco+1cVx/te7OTf2Zg==", //asd123ASD.
            SecurityStamp = "dfeb9f52-8a29-48f2-8c9f-ab9aab870bb4",
            ConcurrencyStamp = "55ea2f83-a552-461e-befe-b67e26d1ae73",
            PhoneNumber = "5551234567",
            PhoneNumberConfirmed = false,
            TwoFactorEnabled = false,
            LockoutEnabled = true,
            AccessFailedCount = 0,
            Name = "Oyuasx",
            Surname = "Admin",
            Address = "Istanbul",
            AccountSuspended = false
        });
    }

    public void Configure(EntityTypeBuilder<IdentityUserRole<string>> builder)
    {
        builder.HasData(new IdentityUserRole<string>
        {
            UserId = UserId,
            RoleId = UserRoles.AdministratorId
        });
    }
}