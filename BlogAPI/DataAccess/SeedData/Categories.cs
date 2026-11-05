using Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.SeedData;

public class Categories : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasData(
            Category.Create(1, "Personal"),
            Category.Create(2, "Travel"),
            Category.Create(3, "Lifestyle"),
            Category.Create(4, "News"),
            Category.Create(5, "Marketing"),
            Category.Create(6, "Sports"),
            Category.Create(7, "Movies"));
    }
}
