using Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations;

public class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.UserId).HasColumnName("user_id").HasColumnType("nvarchar(450)");
        builder.Property(x => x.PostId).HasColumnName("post_id").IsRequired();
        builder.Property(x => x.Date).HasColumnType("datetime");
        builder.Property(x => x.Content).HasColumnType("nvarchar").HasMaxLength(720);
        builder.Property(x => x.UserName).HasColumnType("nvarchar").HasMaxLength(240).IsRequired();

        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
    }
}
