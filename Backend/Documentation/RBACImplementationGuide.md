# Role-Based Access Control Implementation Guide

## Overview

This guide documents how Role-Based Access Control (RBAC) is implemented in the Meals on Wheels system. The system uses a two-tier role system with primary roles (Admin, Coordinator, Volunteer) and operational roles (InventoryManager, Driver, etc.) that provide fine-grained access control.

## Key Components

### 1. User Model Properties

The `User` class has these role-related properties:

```csharp
// Primary system role (Admin, Coordinator, Volunteer)
public string Role { get; set; } = string.Empty;

// Operational roles (comma-separated values)
public string OperationalRoles { get; set; } = string.Empty;

// Whether the user is staff (true) or volunteer (false)
public bool IsStaff { get; set; } = false;
```

### 2. JWT Token Claims

When generating a JWT token, the roles are included as claims:

```csharp
new Claim(ClaimTypes.Role, user.Role),
new Claim("isStaff", user.IsStaff.ToString().ToLower()),
new Claim("operationalRoles", user.OperationalRoles ?? string.Empty)
```

### 3. Custom Authorization Attribute

We use a custom `RequireOperationalRoleAttribute` to restrict access based on operational roles:

```csharp
[RequireOperationalRole("InventoryManager,KitchenManager")]
```

### 4. Role Helper Class

The `RoleHelper` class provides utility methods for working with roles:

```csharp
// Constants for all valid operational roles
public static class OperationalRoles
{
    public const string InventoryManager = "InventoryManager";
    public const string KitchenManager = "KitchenManager";
    // ...
}

// Check if user has an operational role
public static bool HasOperationalRole(ClaimsPrincipal user, string role)
{
    // Staff members have all operational roles
    if (IsStaff(user)) return true;

    var roles = GetUserOperationalRoles(user);
    return roles.Contains(role, StringComparer.OrdinalIgnoreCase);
}
```

## Implementation Steps

### 1. Controller-Level Authorization

To restrict an entire controller to specific roles:

```csharp
[Authorize]
[RequireOperationalRole("InventoryManager,KitchenManager")]
public class InventoryItemsController : ControllerBase
{
    // All actions require InventoryManager or KitchenManager role
}
```

### 2. Action-Level Authorization

For more granular control at the action method level:

```csharp
[HttpDelete("{id}")]
[RequireOperationalRole("InventoryManager")] // Only InventoryManager can delete
public async Task<IActionResult> DeleteInventoryItem(Guid id)
{
    // Implementation...
}
```

### 3. Code-Based Checks

For runtime checks based on user roles:

```csharp
if (RoleHelper.HasOperationalRole(User, RoleHelper.OperationalRoles.InventoryManager) ||
    User.IsInRole("Admin"))
{
    // Show advanced options
}
```

## Staff Override

Users with `IsStaff = true` automatically have access to all operational role-based functions, regardless of their specific operational roles. This allows staff members to perform any action in the system.

## Common Role Combinations

| User Type            | Primary Role | Operational Roles               | IsStaff |
| -------------------- | ------------ | ------------------------------- | ------- |
| Administrator        | Admin        | All operational roles           | true    |
| Kitchen Supervisor   | Coordinator  | KitchenManager,InventoryManager | true    |
| Inventory Manager    | Coordinator  | InventoryManager                | true    |
| Driver Volunteer     | Volunteer    | Driver                          | false   |
| Kitchen Volunteer    | Volunteer    | KitchenVolunteer                | false   |
| Multi-role Volunteer | Volunteer    | Driver,KitchenVolunteer         | false   |

## Adding a New Protected Resource

To add RBAC to a new controller or API endpoint:

1. Identify the required operational roles for the resource
2. Apply the [RequireOperationalRole] attribute to the controller or action
3. Add role-specific logic inside the method if needed
4. Document the role requirements in your API documentation

## Frontend Integration

The frontend application should:

1. Store the JWT token with user role information
2. Extract operational roles from the token
3. Show/hide UI elements based on the user's roles
4. Handle 403 Forbidden responses when a user attempts to access unauthorized resources
