using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using System.Security.Claims;

namespace MOWScheduler.Helpers
{
    /// <summary>
    /// Custom authorization attribute to verify that the user has one of the specified operational roles.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public class RequireOperationalRoleAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        private readonly string[] _allowedRoles;

        /// <summary>
        /// Initializes a new instance of the <see cref="RequireOperationalRoleAttribute"/> class.
        /// </summary>
        /// <param name="roles">Comma-separated list of allowed operational roles.</param>
        public RequireOperationalRoleAttribute(string roles)
        {
            _allowedRoles = roles.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(r => r.Trim()).ToArray();
        }

        /// <summary>
        /// Performs authorization based on the user's operational roles.
        /// </summary>
        /// <param name="context">The authorization filter context.</param>
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            // Skip authorization if action is decorated with [AllowAnonymous]
            var allowAnonymous = context.ActionDescriptor.EndpointMetadata
                .Any(em => em.GetType() == typeof(AllowAnonymousAttribute));
                
            if (allowAnonymous)
                return;

            // Check if user is authenticated at all
            if (!context.HttpContext.User.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            // Get user's operational roles from claims
            var operationalRolesClaim = context.HttpContext.User.FindFirst("operationalRoles");
            
            // If no roles claim is found
            if (operationalRolesClaim == null)
            {
                context.Result = new ForbidResult();
                return;
            }

            // Staff can do anything
            var isStaffClaim = context.HttpContext.User.FindFirst("isStaff");
            if (isStaffClaim != null && bool.TryParse(isStaffClaim.Value, out bool isStaff) && isStaff)
            {
                return;
            }

            // Check if user has any of the allowed operational roles
            var userRoles = operationalRolesClaim.Value
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(r => r.Trim());

            if (!userRoles.Any(role => _allowedRoles.Contains(role, StringComparer.OrdinalIgnoreCase)))
            {
                context.Result = new ForbidResult();
                return;
            }
        }
    }
}
