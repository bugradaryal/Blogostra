using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    public partial class FixRoleNormalizationAndDateDefaults : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "096d52be-95c6-4ac9-b0a3-a0e8438d7a22",
                column: "NormalizedName",
                value: "ADMINISTRATOR");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Date",
                table: "Posts",
                type: "datetime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldDefaultValue: new DateTime(2025, 1, 6, 17, 33, 46, 650, DateTimeKind.Local).AddTicks(5030));

            migrationBuilder.AlterColumn<DateTime>(
                name: "Date",
                table: "Likes",
                type: "datetime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldDefaultValue: new DateTime(2025, 1, 6, 17, 33, 46, 650, DateTimeKind.Local).AddTicks(6426));

            migrationBuilder.AlterColumn<DateTime>(
                name: "Date",
                table: "Comments",
                type: "datetime",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime",
                oldDefaultValue: new DateTime(2025, 1, 6, 17, 33, 46, 650, DateTimeKind.Local).AddTicks(7530));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "096d52be-95c6-4ac9-b0a3-a0e8438d7a22",
                column: "NormalizedName",
                value: "ADMİNİSTRATOR");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Date",
                table: "Posts",
                type: "datetime",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 6, 17, 33, 46, 650, DateTimeKind.Local).AddTicks(5030),
                oldClrType: typeof(DateTime),
                oldType: "datetime");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Date",
                table: "Likes",
                type: "datetime",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 6, 17, 33, 46, 650, DateTimeKind.Local).AddTicks(6426),
                oldClrType: typeof(DateTime),
                oldType: "datetime");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Date",
                table: "Comments",
                type: "datetime",
                nullable: false,
                defaultValue: new DateTime(2025, 1, 6, 17, 33, 46, 650, DateTimeKind.Local).AddTicks(7530),
                oldClrType: typeof(DateTime),
                oldType: "datetime");
        }
    }
}
