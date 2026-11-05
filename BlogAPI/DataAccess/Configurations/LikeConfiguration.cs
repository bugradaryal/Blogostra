using Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations;

public class LikeConfiguration : IEntityTypeConfiguration<Like>
{
    public void Configure(EntityTypeBuilder<Like> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.PostId).HasColumnName("post_id").IsRequired();
        builder.Property(x => x.UserId).HasColumnName("user_id").HasColumnType("nvarchar(450)");
        builder.Property(x => x.Date).HasColumnType("datetime");

        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
    }
}
