using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace MOWScheduler.Helpers
{
    /// <summary>
    /// Helper class for role-related operations.
    /// </summary>
    public static class RoleHelper
    {
        /// <summary>
        /// Primary roles in the system.
        /// </summary>
        public static class PrimaryRoles
        {
            public const string Admin = "Admin";
            public const string Coordinator = "Coordinator";
            public const string Volunteer = "Volunteer";
        }
        
        /// <summary>
        /// Operational roles in the system.
        /// </summary>
        public static class OperationalRoles
        {
            // Administrative Roles
            public const string InventoryManager = "InventoryManager";
            public const string RoutePlanner = "RoutePlanner";
            
            // Kitchen Roles
            public const string KitchenStaff = "KitchenStaff";
            public const string KitchenVolunteer = "KitchenVolunteer";
            
            // Logistics Roles
            public const string Packer = "Packer";
            public const string Driver = "Driver";
            public const string LoadingCoordinator = "LoadingCoordinator";
        }
        
        /// <summary>
        /// Adds an operational role to a comma-separated list of roles.
        /// </summary>
        public static string AddOperationalRole(string currentRoles, string roleToAdd)
        {
            if (string.IsNullOrEmpty(currentRoles))
            {
                return roleToAdd;
            }
            
            var roles = currentRoles.Split(',').ToList();
            if (!roles.Contains(roleToAdd))
            {
                roles.Add(roleToAdd);
            }
            
            return string.Join(',', roles);
        }
        
        /// <summary>
        /// Removes an operational role from a comma-separated list of roles.
        /// </summary>
        public static string RemoveOperationalRole(string currentRoles, string roleToRemove)
        {
            if (string.IsNullOrEmpty(currentRoles))
            {
                return string.Empty;
            }
            
            var roles = currentRoles.Split(',').ToList();
            roles.Remove(roleToRemove);
            
            return string.Join(',', roles);
        }
        
        /// <summary>
        /// Checks if a comma-separated list of roles contains a specific role.
        /// </summary>
        public static bool HasOperationalRole(string currentRoles, string roleToCheck)
        {
            if (string.IsNullOrEmpty(currentRoles))
            {
                return false;
            }
            
            var roles = currentRoles.Split(',');
            return roles.Contains(roleToCheck);
        }
          /// <summary>
        /// Gets all operational roles from a comma-separated list.
        /// </summary>
        public static List<string> GetOperationalRoles(string currentRoles)
        {
            if (string.IsNullOrEmpty(currentRoles))
            {
                return new List<string>();
            }
            
            return currentRoles.Split(',').ToList();
        }
        
        /// <summary>
        /// Gets the operational roles of a user from their claims.
        /// </summary>
        /// <param name="user">The ClaimsPrincipal representing the user.</param>
        /// <returns>A list of operational roles the user has.</returns>
        public static List<string> GetUserOperationalRoles(ClaimsPrincipal user)
        {
            var operationalRolesClaim = user.FindFirst("operationalRoles");
            if (operationalRolesClaim == null)
            {
                return new List<string>();
            }
            
            return operationalRolesClaim.Value
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(role => role.Trim())
                .ToList();
        }
        
        /// <summary>
        /// Checks if the user has a specific operational role.
        /// </summary>
        /// <param name="user">The ClaimsPrincipal representing the user.</param>
        /// <param name="role">The operational role to check for.</param>
        /// <returns>True if the user has the role, false otherwise.</returns>
        public static bool HasOperationalRole(ClaimsPrincipal user, string role)
        {
            // Staff members have all operational roles
            var isStaffClaim = user.FindFirst("isStaff");
            if (isStaffClaim != null && bool.TryParse(isStaffClaim.Value, out bool isStaff) && isStaff)
            {
                return true;
            }
            
            var roles = GetUserOperationalRoles(user);
            return roles.Contains(role, StringComparer.OrdinalIgnoreCase);
        }
        
        /// <summary>
        /// Checks if the user has any of the specified operational roles.
        /// </summary>
        /// <param name="user">The ClaimsPrincipal representing the user.</param>
        /// <param name="roles">The operational roles to check for.</param>
        /// <returns>True if the user has any of the roles, false otherwise.</returns>
        public static bool HasAnyOperationalRole(ClaimsPrincipal user, params string[] roles)
        {
            // Staff members have all operational roles
            var isStaffClaim = user.FindFirst("isStaff");
            if (isStaffClaim != null && bool.TryParse(isStaffClaim.Value, out bool isStaff) && isStaff)
            {
                return true;
            }
            
            var userRoles = GetUserOperationalRoles(user);
            return roles.Any(role => userRoles.Contains(role, StringComparer.OrdinalIgnoreCase));
        }
    }
}
