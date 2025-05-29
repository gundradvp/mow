# User Roles in Meals on Wheels Volunteer Integration System

Based on the provided documents, I've identified the user roles present in both the Meals on Wheels inventory system and the staff/volunteer management system. The integration creates a unified role structure that accommodates various responsibilities across the organization.

## Core User Types

There are two primary user types in the system:

1. **Staff** - Paid employees with regular responsibilities and schedules
2. **Volunteers** - Unpaid contributors who help with various operations

## Operational Roles

The system contains the following operational roles, which can be assigned to either staff or volunteer user types:

### 1. Administrative Roles

- **Admin** - System administrators with full access to all features
- **Inventory Manager** - Manages inventory levels, purchase orders, and donations
- **Route Planner** - Plans and optimizes delivery routes and schedules

### 2. Kitchen Roles

- **Kitchen Staff** - Staff members who work in meal preparation
- **Kitchen Volunteer** - Volunteers who assist with meal preparation

### 3. Logistics Roles

- **Packer** - Responsible for packing meals into boxes for delivery
- **Driver** - Delivers meals to care recipients (can be staff or volunteer)
- **Loading Coordinator** - Manages the loading of vehicles for delivery

### 4. Volunteer Management

- **Volunteer Coordinator** - Manages volunteer recruitment, scheduling, and credentials

## Role Assignment System

The system uses a flexible role-assignment approach:

1. Each user has a **primary role** (stored in the `role` field of the `User` table)
2. Users can have multiple secondary roles through the `UserRoles` many-to-many relationship
3. Roles can require specific credentials or training
4. Role assignments have statuses such as 'Interested', 'Training', 'Qualified', 'Active', or 'Inactive'

## Role-Based Access Control

The role-based permissions system enables:

1. Access control to specific system modules (inventory, kitchen, delivery, etc.)
2. Permission to perform specific actions within modules
3. Visibility of data based on facility assignment and role

## Scheduling and Availability

The scheduling system accommodates the different needs of staff and volunteers:

1. **Staff** typically have regular schedules with defined shifts
2. **Volunteers** indicate availability through:
   - Weekly availability patterns (days and times they are typically available)
   - Exceptions for specific dates (unavailable dates or special availability)
   - Shift assignments (specific assignments to operational tasks)

## Role Qualifications

The system tracks qualifications for roles:

1. **Credentials** - Background checks, certifications, driver's licenses, etc.
2. **Training Modules** - Required training for specific roles
3. **Assessment Progress** - Tracking of skill development and qualification status

## Driver-Specific Attributes

Drivers have special attributes in the system:

1. **Is Driver** flag on the user profile
2. **Driver's License** information and expiration date
3. **Vehicle Assignment** capabilities
4. **Route Limitations** including maximum distance and duration
5. **Availability** for scheduling on delivery routes

This comprehensive role system allows the organization to effectively manage both staff and volunteers across all operational areas while maintaining appropriate access controls and ensuring qualified individuals are assigned to each responsibility.
