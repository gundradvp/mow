# Inventory Management API Documentation

This document outlines the usage of the Inventory Management API endpoints for Meals on Wheels.

## Categories

Categories allow for organizing inventory items in a hierarchical structure (with parent-child relationships).

### Endpoints

- **GET /api/Categories** - List all categories
- **GET /api/Categories/{id}** - Get a specific category by ID
- **POST /api/Categories** - Create a new category
- **PUT /api/Categories/{id}** - Update an existing category
- **DELETE /api/Categories/{id}** - Delete a category

### Example Category Object

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Dairy Products",
  "description": "Milk, cheese, and other dairy items",
  "parentCategoryId": null,
  "isActive": true
}
```

## Inventory Items

Inventory items represent the products and ingredients used in meal preparation.

### Endpoints

- **GET /api/InventoryItems** - List all inventory items
- **GET /api/InventoryItems/{id}** - Get a specific inventory item by ID
- **POST /api/InventoryItems** - Create a new inventory item
- **PUT /api/InventoryItems/{id}** - Update an existing inventory item
- **DELETE /api/InventoryItems/{id}** - Delete an inventory item
- **GET /api/InventoryItems/reorder-needed** - Get all items that need to be reordered
- **PUT /api/InventoryItems/{id}/adjust-quantity** - Adjust the quantity of an item (positive for addition, negative for subtraction)

### Example Inventory Item Object

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Whole Milk",
  "description": "Gallon of whole milk",
  "sku": "MLK-001",
  "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "unitOfMeasure": "Gallon",
  "currentQuantity": 25.0,
  "reorderThreshold": 10.0,
  "reorderQuantity": 20.0,
  "unitCost": 3.99,
  "expirationDate": "2025-06-15T00:00:00Z",
  "location": "Refrigerator A",
  "isActive": true,
  "createdAt": "2025-05-14T00:00:00Z",
  "updatedAt": "2025-05-14T00:00:00Z"
}
```

## Role-Based Access Control

Inventory management features are restricted based on operational roles:

### Role-Based Permissions

| Endpoint                                     | InventoryManager | KitchenManager | KitchenVolunteer | Staff |
| -------------------------------------------- | ---------------- | -------------- | ---------------- | ----- |
| GET /api/Categories                          | ✓                | ✓              | ✓                | ✓     |
| POST /api/Categories                         | ✓                | ✓              | ❌               | ✓     |
| PUT/DELETE /api/Categories                   | ✓                | ❌             | ❌               | ✓     |
| GET /api/InventoryItems                      | ✓                | ✓              | ✓                | ✓     |
| POST /api/InventoryItems                     | ✓                | ❌             | ❌               | ✓     |
| PUT /api/InventoryItems                      | ✓                | ✓              | ❌               | ✓     |
| DELETE /api/InventoryItems                   | ✓                | ❌             | ❌               | ✓     |
| GET /api/InventoryItems/reorder-needed       | ✓                | ✓              | ✓                | ✓     |
| PUT /api/InventoryItems/{id}/adjust-quantity | ✓                | ✓              | ✓                | ✓     |
| GET /api/InventoryTransactions               | ✓                | ✓              | ✓                | ✓     |
| GET /api/InventoryTransactions/statistics    | ✓                | ✓              | ❌               | ✓     |
| POST /api/InventoryTransactions              | ✓                | ✓              | ✓                | ✓     |

Note: Users with `IsStaff = true` automatically have all permissions regardless of their operational roles.

## Using Operational Roles

### Implementation

Operational roles are assigned to users through the `OperationalRoles` property (comma-separated values) in the User model. These roles are separate from the primary system role and provide more granular permissions for specific operational areas.

Example: A user may have the primary role of "Volunteer" but operational roles of "Driver,KitchenVolunteer".

### How Roles Are Applied

1. **JWT Tokens**: User roles are included in the JWT token when logging in:

   ```csharp
   new Claim("operationalRoles", user.OperationalRoles ?? string.Empty)
   ```

2. **Controller Authorization**: Controllers and methods use the custom `RequireOperationalRole` attribute:

   ```csharp
   [RequireOperationalRole("InventoryManager,KitchenManager")]
   ```

3. **Code-Based Checks**: Additional checks in code using the `RoleHelper` class:
   ```csharp
   if (RoleHelper.HasOperationalRole(User, RoleHelper.OperationalRoles.InventoryManager))
   {
       // Perform privileged operation
   }
   ```

### Available Operational Roles

- `InventoryManager` - Full access to inventory management
- `KitchenManager` - Manages kitchen operations and meal planning
- `KitchenVolunteer` - Kitchen preparation and cooking
- `Driver` - Delivers meals to clients
- `RoutePlanner` - Plans and assigns delivery routes
- `Packer` - Packages meals for delivery
- `ClientCoordinator` - Manages client information and services
