using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MOWScheduler.Migrations
{
    /// <inheritdoc />
    public partial class AddUserOperationalRolesAndStaff : Migration
    {        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Check if OperationalRoles column doesn't exist before adding
            migrationBuilder.Sql(
                @"IF NOT EXISTS (
                    SELECT 1 FROM sys.columns 
                    WHERE Name = N'OperationalRoles'
                    AND Object_ID = Object_ID(N'Users')
                )
                BEGIN
                    ALTER TABLE Users ADD OperationalRoles nvarchar(max) NOT NULL DEFAULT ''
                END");
                
            // Check if IsStaff column doesn't exist before adding
            migrationBuilder.Sql(
                @"IF NOT EXISTS (
                    SELECT 1 FROM sys.columns 
                    WHERE Name = N'IsStaff'
                    AND Object_ID = Object_ID(N'Users')
                )
                BEGIN
                    ALTER TABLE Users ADD IsStaff bit NOT NULL DEFAULT 0
                END");
        }        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Check if OperationalRoles exists before removing
            migrationBuilder.Sql(
                @"IF EXISTS (
                    SELECT 1 FROM sys.columns 
                    WHERE Name = N'OperationalRoles'
                    AND Object_ID = Object_ID(N'Users')
                )
                BEGIN
                    ALTER TABLE Users DROP COLUMN OperationalRoles
                END");
            
            // Check if IsStaff exists before removing
            migrationBuilder.Sql(
                @"IF EXISTS (
                    SELECT 1 FROM sys.columns 
                    WHERE Name = N'IsStaff'
                    AND Object_ID = Object_ID(N'Users')
                )
                BEGIN
                    ALTER TABLE Users DROP COLUMN IsStaff
                END");
        }
    }
}
