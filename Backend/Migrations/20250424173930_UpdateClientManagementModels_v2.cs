using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MOWScheduler.Migrations
{
    /// <inheritdoc />
    public partial class UpdateClientManagementModels_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DietaryRestrictions",
                table: "Clients");

            migrationBuilder.RenameColumn(
                name: "ServiceAuthorizations",
                table: "Clients",
                newName: "Gender");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "Clients",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeliveryRouteId",
                table: "Clients",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CaseNotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NoteContent = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CaseNotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CaseNotes_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CaseNotes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClientDeliverySchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<int>(type: "int", nullable: false),
                    RecurrencePattern = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientDeliverySchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClientDeliverySchedules_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DietaryRestrictions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RestrictionName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DietaryRestrictions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EligibilityCriteria",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CriteriaName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EligibilityCriteria", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MealTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MealTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceAuthorizations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<int>(type: "int", nullable: false),
                    AuthorizationProvider = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AuthorizationNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AuthorizedServices = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceAuthorizations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceAuthorizations_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClientDietaryRestrictions",
                columns: table => new
                {
                    ClientId = table.Column<int>(type: "int", nullable: false),
                    DietaryRestrictionId = table.Column<int>(type: "int", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientDietaryRestrictions", x => new { x.ClientId, x.DietaryRestrictionId });
                    table.ForeignKey(
                        name: "FK_ClientDietaryRestrictions_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClientDietaryRestrictions_DietaryRestrictions_DietaryRestrictionId",
                        column: x => x.DietaryRestrictionId,
                        principalTable: "DietaryRestrictions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClientEligibilityCriteria",
                columns: table => new
                {
                    ClientId = table.Column<int>(type: "int", nullable: false),
                    EligibilityCriterionId = table.Column<int>(type: "int", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientEligibilityCriteria", x => new { x.ClientId, x.EligibilityCriterionId });
                    table.ForeignKey(
                        name: "FK_ClientEligibilityCriteria_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClientEligibilityCriteria_EligibilityCriteria_EligibilityCriterionId",
                        column: x => x.EligibilityCriterionId,
                        principalTable: "EligibilityCriteria",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClientDeliveryScheduleDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientDeliveryScheduleId = table.Column<int>(type: "int", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    MealTypeId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientDeliveryScheduleDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClientDeliveryScheduleDetails_ClientDeliverySchedules_ClientDeliveryScheduleId",
                        column: x => x.ClientDeliveryScheduleId,
                        principalTable: "ClientDeliverySchedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClientDeliveryScheduleDetails_MealTypes_MealTypeId",
                        column: x => x.MealTypeId,
                        principalTable: "MealTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_DeliveryRouteId",
                table: "Clients",
                column: "DeliveryRouteId");

            migrationBuilder.CreateIndex(
                name: "IX_CaseNotes_ClientId",
                table: "CaseNotes",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_CaseNotes_UserId",
                table: "CaseNotes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientDeliveryScheduleDetails_ClientDeliveryScheduleId",
                table: "ClientDeliveryScheduleDetails",
                column: "ClientDeliveryScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientDeliveryScheduleDetails_MealTypeId",
                table: "ClientDeliveryScheduleDetails",
                column: "MealTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientDeliverySchedules_ClientId",
                table: "ClientDeliverySchedules",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientDietaryRestrictions_DietaryRestrictionId",
                table: "ClientDietaryRestrictions",
                column: "DietaryRestrictionId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientEligibilityCriteria_EligibilityCriterionId",
                table: "ClientEligibilityCriteria",
                column: "EligibilityCriterionId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceAuthorizations_ClientId",
                table: "ServiceAuthorizations",
                column: "ClientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_DeliveryRoutes_DeliveryRouteId",
                table: "Clients",
                column: "DeliveryRouteId",
                principalTable: "DeliveryRoutes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_DeliveryRoutes_DeliveryRouteId",
                table: "Clients");

            migrationBuilder.DropTable(
                name: "CaseNotes");

            migrationBuilder.DropTable(
                name: "ClientDeliveryScheduleDetails");

            migrationBuilder.DropTable(
                name: "ClientDietaryRestrictions");

            migrationBuilder.DropTable(
                name: "ClientEligibilityCriteria");

            migrationBuilder.DropTable(
                name: "ServiceAuthorizations");

            migrationBuilder.DropTable(
                name: "ClientDeliverySchedules");

            migrationBuilder.DropTable(
                name: "MealTypes");

            migrationBuilder.DropTable(
                name: "DietaryRestrictions");

            migrationBuilder.DropTable(
                name: "EligibilityCriteria");

            migrationBuilder.DropIndex(
                name: "IX_Clients_DeliveryRouteId",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "DeliveryRouteId",
                table: "Clients");

            migrationBuilder.RenameColumn(
                name: "Gender",
                table: "Clients",
                newName: "ServiceAuthorizations");

            migrationBuilder.AddColumn<string>(
                name: "DietaryRestrictions",
                table: "Clients",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
