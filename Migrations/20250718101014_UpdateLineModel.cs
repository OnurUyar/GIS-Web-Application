using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLineModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndLatitude",
                table: "Lines");

            migrationBuilder.DropColumn(
                name: "EndLongitude",
                table: "Lines");

            migrationBuilder.DropColumn(
                name: "StartLatitude",
                table: "Lines");

            migrationBuilder.DropColumn(
                name: "StartLongitude",
                table: "Lines");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Lines",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<LineString>(
                name: "Geometry",
                table: "Lines",
                type: "geometry",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Geometry",
                table: "Lines");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Lines",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<double>(
                name: "EndLatitude",
                table: "Lines",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "EndLongitude",
                table: "Lines",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "StartLatitude",
                table: "Lines",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "StartLongitude",
                table: "Lines",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
