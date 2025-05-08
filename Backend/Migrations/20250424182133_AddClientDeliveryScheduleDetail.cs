using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MOWScheduler.Migrations
{
    /// <inheritdoc />
    public partial class AddClientDeliveryScheduleDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Volunteers",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Volunteers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Volunteers",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmergencyContactName",
                table: "Volunteers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmergencyContactPhone",
                table: "Volunteers",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Volunteers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Volunteers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Volunteers",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Volunteers",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ZipCode",
                table: "Volunteers",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Volunteers");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Volunteers");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Volunteers");

            migrationBuilder.DropColumn(
                name: "EmergencyContactName",
                table: "Volunteers");

            migrationBuilder.DropColumn(
                name: "EmergencyContactPhone",
                table: "Volunteers");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Volunteers");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Volunteers");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Volunteers");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Volunteers");

            migrationBuilder.DropColumn(
                name: "ZipCode",
                table: "Volunteers");
        }
    }
}
