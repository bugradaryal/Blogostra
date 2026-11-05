using Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations;

public class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.Title).HasColumnType("nvarchar").IsRequired().HasMaxLength(250);
        builder.Property(x => x.Date).HasColumnType("datetime");
        builder.Property(x => x.Content).HasColumnType("nvarchar").HasMaxLength(1800).IsRequired();
        builder.Property(x => x.Image).HasColumnType("varbinary(max)");
        builder.Property(x => x.CategoryId).HasColumnName("category_id").IsRequired();

        builder.HasOne(x => x.Category).WithMany().HasForeignKey(x => x.CategoryId);
        builder.HasMany(x => x.Comments).WithOne(x => x.Post).HasForeignKey(x => x.PostId);
        builder.HasMany(x => x.Likes).WithOne(x => x.Post).HasForeignKey(x => x.PostId);

        builder.Navigation(x => x.Comments).UsePropertyAccessMode(PropertyAccessMode.Field);
        builder.Navigation(x => x.Likes).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
