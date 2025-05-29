# Operational Roles and Permissions

## Overview

This document outlines the operational roles implemented in the Meals on Wheels system and the permissions associated with each role. The system uses a two-tier role system:

1. Primary Role: Main system-level role (Admin, Coordinator, or Volunteer)
2. Operational Role: Specific functional roles that determine day-to-day permissions

## Primary Roles

| Role        | Description                                       |
| ----------- | ------------------------------------------------- |
| Admin       | System administrators with access to all features |
| Coordinator | Staff members who manage specific areas           |
| Volunteer   | Community members who volunteer their time        |

## Operational Roles

### Administrative Operational Roles

| Role                 | Description                   | Permissions                                                                                             |
| -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| InventoryManager     | Manages the inventory system  | Can create, update, and delete categories and inventory items. Can view and generate inventory reports. |
| RoutePlanner         | Plans delivery routes         | Can create and modify delivery routes, assign clients to routes, and optimize delivery schedules.       |
| ClientCoordinator    | Manages client information    | Can add, update, and view client records. Can assign clients to meal plans and delivery schedules.      |
| VolunteerCoordinator | Manages volunteer information | Can view and update volunteer information, schedule volunteers, and track volunteer hours.              |

### Kitchen Operational Roles

| Role             | Description                | Permissions                                                                                      |
| ---------------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| KitchenManager   | Manages kitchen operations | Can view all inventory, create and update meals, assign recipes, and manage kitchen staff.       |
| KitchenVolunteer | Assists in the kitchen     | Can view required inventory for meal preparation, mark items as used, and record prepared meals. |

### Logistics Operational Roles

| Role               | Description                         | Permissions                                                                                      |
| ------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| Packer             | Packs meals for delivery            | Can view client-specific meal requirements, record packed meals, and update inventory.           |
| Driver             | Delivers meals to clients           | Can view assigned routes, client information for their routes, and record successful deliveries. |
| LoadingCoordinator | Coordinates loading and dispatching | Can view all routes, assign packed meals to routes, and track driver departures/returns.         |

## Role-Based Access Control Implementation

The system implements role-based access control through:

1. **JWT Authentication**: User roles are encoded in the JWT token
2. **Custom Authorization Attributes**: `[RequireOperationalRole("Role1,Role2")]` attribute for controllers/actions
3. **Helper Methods**: `RoleHelper` class provides utility methods for role verification

### Example Authorization Flows

#### Inventory Management

- Creating a new inventory category requires the `InventoryManager` or `KitchenManager` role
- Updating inventory quantities can be done by `InventoryManager`, `KitchenManager`, or `KitchenVolunteer`
- Viewing inventory reports is restricted to `InventoryManager` and `KitchenManager`

#### Client Management

- Adding new clients requires the `ClientCoordinator` role
- Updating client meal preferences requires `ClientCoordinator` or `KitchenManager`
- Viewing client delivery information requires `Driver` or `RoutePlanner`

## User Assignment

- Staff members (`IsStaff = true`) automatically have permission for all operations
- Users can have multiple operational roles (comma-separated in the database)
- Operational roles can be assigned at registration or by administrators later
