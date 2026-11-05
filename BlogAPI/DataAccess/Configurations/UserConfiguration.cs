using Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(x => x.Name).HasColumnType("nvarchar").IsRequired().HasMaxLength(32);
        builder.Property(x => x.Surname).HasColumnType("nvarchar").IsRequired().HasMaxLength(32);
        builder.Property(x => x.Address).HasColumnType("nvarchar").HasMaxLength(160).HasDefaultValue("Undefined");
        builder.Property(x => x.AccountSuspended).HasColumnType("bit ").HasDefaultValue(false);
        builder.HasIndex(x => x.Email).IsUnique();
    }
}
