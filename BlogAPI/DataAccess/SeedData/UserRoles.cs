using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.SeedData;

public class UserRoles : IEntityTypeConfiguration<IdentityRole>
{
    public const string AdministratorId = "096d52be-95c6-4ac9-b0a3-a0e8438d7a22";
    public const string UserId = "0dd85ee5-2c4f-4af7-8f8e-6cb389244547";

    public void Configure(EntityTypeBuilder<IdentityRole> builder)
    {
        builder.HasData(
            new IdentityRole { Id = AdministratorId, Name = "Administrator", NormalizedName = "ADMINISTRATOR" },
            new IdentityRole { Id = UserId, Name = "User", NormalizedName = "USER" });
    }
}
