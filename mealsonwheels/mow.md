# Meals on Wheels Volunteer Integration System Implementation Guide

## Overview

This implementation guide provides a comprehensive roadmap for developing the integrated Meals on Wheels Volunteer Management System using C# for the backend API and React for the frontend. The system merges volunteer/staff management with inventory management, meal preparation, and delivery logistics.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Implementation](#database-implementation)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Integration Points](#integration-points)
6. [Deployment Strategy](#deployment-strategy)
7. [Testing Strategy](#testing-strategy)
8. [Security Considerations](#security-considerations)
9. [Implementation Roadmap](#implementation-roadmap)

---

## System Architecture

### High-Level Architecture

![System Architecture](https://mermaid.ink/img/pako:eNqNk81u2zAMx19F0KnFUMfpx2kIkqYDMmDogW2PHdRYiYXIkiHJaYKi716pmz10w4peDJP8kX_-RTrC-1QgxFGujpQZfoorfORZ40WKnaiaTkmht2q6UISEV2amUlMC4YVnJ2a1ct9YHk9oRbY7HCuZ1ko2SozxCRNrX4R3pFBncOy0k7nwOxLOpDDr2pb8g8Uu_MkztB_DGbDfIs1AkUt6xZ4bsHtK_LEV2OmZVGXGXXGyyozeloi7xLfLZeUyrEG8KcXzvUmsbkHftqk-F1tsmNwpKZrL1CiGYOopMq3ZZXpM0VzXg__vV_2ycdKj8MRMzsZb_IzWnX4hosSfh2fjAQ8PZ7C4oLAcRFANNKmsOZNLa3lSQola-VB3XxU545C9cYkjsg26F9rz8KhmcpaxE1R7inNs8PkO2BI7OwUTlZqJrk1Hcz8gHYqx1-5OftGD998r__Triyc9W8dGZGqvmmeYVzZMuIMbAER_h5wO2NkbKsz5HxzzP9w3ygN8bPwi9Tt1GqlkMkw54F2rXku7G0ex0mTLGOMo4pPK8KRczrbAE-MoNnVhuSE2babz9lBjHJVKO1zoqnKZ_9wNH_PMQr3CfgK1etY?)

```
graph TB
    subgraph "Frontend (React)"
        A[React App] --> B[Redux State Management]
        B --> C1[User Module]
        B --> C2[Inventory Module]
        B --> C3[Meal Planning Module]
        B --> C4[Delivery Module]
        B --> C5[Reports & Dashboard]

        C1 --> D1[Staff Management]
        C1 --> D2[Volunteer Management]
        C1 --> D3[Availability & Scheduling]

        C2 --> E1[Inventory Items]
        C2 --> E2[Purchase Orders]
        C2 --> E3[Donations]

        C3 --> F1[Meal Definitions]
        C3 --> F2[Meal Preparation]
        C3 --> F3[Packing]

        C4 --> G1[Routes]
        C4 --> G2[Care Recipients]
        C4 --> G3[Delivery Management]
    end

    subgraph "Backend (C# ASP.NET)"
        H[ASP.NET Core API] --> I[Service Layer]
        I --> J1[User Services]
        I --> J2[Inventory Services]
        I --> J3[Meal Services]
        I --> J4[Logistics Services]
        I --> J5[Reporting Services]

        J1 --> K1[EF Core Repositories]
        J2 --> K1
        J3 --> K1
        J4 --> K1
        J5 --> K1

        K1 --> L[Azure SQL Database]
    end

    A <--> H
```

### Components

1. **Database Layer**: Azure SQL Database
2. **Backend API**: C# ASP.NET Core Web API with Entity Framework Core
3. **Frontend**: React SPA with Redux state management
4. **Integration**: REST API communication between frontend and backend

---

## Database Implementation

### Setup Instructions

1. Create an Azure SQL Database instance in your Azure Portal
2. Connect to your database using SQL Server Management Studio or Azure Data Studio
3. Execute the provided SQL scripts to create database schema in this order:
   - Tables and relationships
   - Indexes
   - Views
   - Stored procedures (if any)

### Key Database Elements

- **User Tables**: Unified staff and volunteer management
- **Inventory Tables**: Categories, Items, Locations, Transactions
- **Scheduling Tables**: Availability, Shifts, Assignments
- **Meal Planning Tables**: Meals, Ingredients, Preparation
- **Logistics Tables**: Routes, Deliveries, Vehicles, Boxes

---

## Backend Implementation

### C# ASP.NET Core Web API Project Setup

```bash
# Create solution
dotnet new sln -n MealsOnWheels

# Create API project
dotnet new webapi -n MealsOnWheels.API
dotnet sln add MealsOnWheels.API

# Create class library projects
dotnet new classlib -n MealsOnWheels.Domain
dotnet new classlib -n MealsOnWheels.Infrastructure
dotnet new classlib -n MealsOnWheels.Application

# Add projects to solution
dotnet sln add MealsOnWheels.Domain
dotnet sln add MealsOnWheels.Infrastructure
dotnet sln add MealsOnWheels.Application

# Reference projects
dotnet add MealsOnWheels.Application reference MealsOnWheels.Domain
dotnet add MealsOnWheels.Infrastructure reference MealsOnWheels.Domain
dotnet add MealsOnWheels.API reference MealsOnWheels.Application
dotnet add MealsOnWheels.API reference MealsOnWheels.Infrastructure
```

### Required NuGet Packages

```bash
# Core dependencies
dotnet add MealsOnWheels.API package Microsoft.EntityFrameworkCore.SqlServer
dotnet add MealsOnWheels.API package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add MealsOnWheels.API package Swashbuckle.AspNetCore
dotnet add MealsOnWheels.API package AutoMapper.Extensions.Microsoft.DependencyInjection

# Infrastructure dependencies
dotnet add MealsOnWheels.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer
dotnet add MealsOnWheels.Infrastructure package Microsoft.EntityFrameworkCore.Tools
dotnet add MealsOnWheels.Infrastructure package Microsoft.Extensions.Configuration
```

### Project Structure

```
MealsOnWheels/
├── MealsOnWheels.API/             # Web API project
│   ├── Controllers/               # API endpoints
│   ├── Program.cs                 # App configuration
│   └── appsettings.json           # Configuration files
├── MealsOnWheels.Application/     # Application services
│   ├── DTOs/                      # Data Transfer Objects
│   ├── Interfaces/                # Service interfaces
│   ├── Mappings/                  # AutoMapper profiles
│   └── Services/                  # Implementation of services
├── MealsOnWheels.Domain/          # Domain models and logic
│   ├── Entities/                  # Domain entities
│   ├── Interfaces/                # Repository interfaces
│   └── Enums/                     # Shared enumerations
└── MealsOnWheels.Infrastructure/  # Infrastructure concerns
    ├── Data/                      # EF Core DbContext
    ├── Repositories/              # Repository implementations
    └── Migrations/                # EF Core migrations
```

### Entity Framework Core Setup

1. **Define DbContext**

```csharp
// MealsOnWheels.Infrastructure/Data/ApplicationDbContext.cs
using MealsOnWheels.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MealsOnWheels.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<Facility> Facilities { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }
        // ... other DbSets

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure entities
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.UserId).HasColumnName("user_id");
                // ... continue with all entity configurations
            });

            // ... other entity configurations
        }
    }
}
```

2. **Configure DbContext in Program.cs**

```csharp
// MealsOnWheels.API/Program.cs
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("MealsOnWheels.Infrastructure")));
```

3. **Create Initial Migration**

```bash
cd MealsOnWheels.Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../MealsOnWheels.API
```

### Controller Implementation Example

```csharp
// MealsOnWheels.API/Controllers/UsersController.cs
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto userDto)
    {
        var newUser = await _userService.CreateUserAsync(userDto);
        return CreatedAtAction(nameof(GetUser), new { id = newUser.UserId }, newUser);
    }

    // ... PUT, PATCH, DELETE endpoints
}
```

---

## Frontend Implementation

### React Project Setup

```bash
# Create React project with TypeScript
npx create-react-app mow-client --template typescript

# Navigate to project directory
cd mow-client

# Install core dependencies
npm install react-router-dom @reduxjs/toolkit axios formik yup
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install react-query date-fns
```

### Project Structure

```
mow-client/
├── public/                     # Static files
├── src/
│   ├── api/                    # API clients and endpoints
│   ├── app/                    # Redux store setup
│   │   └── store.ts            # Redux store configuration
│   ├── assets/                 # Images, icons, etc.
│   ├── components/             # Shared components
│   │   ├── common/             # Common UI components
│   │   ├── forms/              # Reusable form components
│   │   └── layout/             # Layout components
│   ├── features/               # Feature modules
│   │   ├── auth/               # Authentication
│   │   ├── users/              # User management
│   │   ├── inventory/          # Inventory management
│   │   ├── meals/              # Meal planning
│   │   ├── delivery/           # Delivery management
│   │   └── reports/            # Reports and dashboard
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Page components
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main app component
│   ├── index.tsx               # Entry point
│   └── routes.tsx              # Route definitions
├── package.json
└── tsconfig.json
```

### Redux Store Setup

```typescript
// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/usersSlice";
import inventoryReducer from "../features/inventory/inventorySlice";
import mealsReducer from "../features/meals/mealsSlice";
import deliveryReducer from "../features/delivery/deliverySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    inventory: inventoryReducer,
    meals: mealsReducer,
    delivery: deliveryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### API Client Setup

```typescript
// src/api/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors (401, 403, 500, etc.)
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Example Feature Implementation

```typescript
// src/features/users/usersSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserDto, CreateUserDto, UpdateUserDto } from "../../types";
import apiClient from "../../api/apiClient";

interface UsersState {
  users: UserDto[];
  selectedUser: UserDto | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await apiClient.get<UserDto[]>("/users");
  return response.data;
});

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId: string) => {
    const response = await apiClient.get<UserDto>(`/users/${userId}`);
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (user: CreateUserDto) => {
    const response = await apiClient.post<UserDto>("/users", user);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }: { userId: string; userData: UpdateUserDto }) => {
    const response = await apiClient.put<UserDto>(`/users/${userId}`, userData);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      });
    // ... other cases for fetchUserById, createUser, updateUser
  },
});

export const { clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
```

### Example Component Implementation

```tsx
// src/pages/Users/UserList.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { AppDispatch, RootState } from "../../app/store";
import { fetchUsers } from "../../features/users/usersSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorAlert from "../../components/common/ErrorAlert";

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, status, error } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "failed") {
    return <ErrorAlert message={error || "Failed to load users"} />;
  }

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Users</Typography>
        <Button
          component={Link}
          to="/users/new"
          variant="contained"
          color="primary"
        >
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.userType}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/users/${user.userId}`}
                    size="small"
                    color="primary"
                  >
                    View
                  </Button>
                  <Button
                    component={Link}
                    to={`/users/${user.userId}/edit`}
                    size="small"
                    color="secondary"
                    sx={{ ml: 1 }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserList;
```

---

## Integration Points

### Key Integration Areas

1. **User Management & Scheduling**

   - Connect user profiles with roles and credentials
   - Link availability to shift scheduling
   - Integrate time entries with operational activities

2. **Inventory & Meal Planning**

   - Connect inventory management with meal planning
   - Track ingredient consumption per meal preparation
   - Forecast inventory needs based on meal plans

3. **Meal Preparation & Delivery**

   - Link prepared meals to packing process
   - Connect packed boxes to deliveries
   - Track box inventory through the delivery cycle

4. **Reporting & Analytics**
   - Cross-functional reporting of volunteer hours and activities
   - Operational efficiency metrics across departments
   - Comprehensive dashboards with unified data

### Integration Architecture

![Integration Architecture](https://mermaid.ink/img/pako:eNqNktFq2zAUhl_l4KsFo9hJmtwFJ04KhUG3wnrp1YYslY4tFks60pGTEPLuO3LcQAfrjrTQ_-n_znnRGXFkGRE44UwwduQpCr5hBTrHiehLFgKhKFE2pfAUOuSV5ozDgGxYSVPBmyZsyIgzWlYKKLxgLRnD96tNQvJ2S55WPJNQ9ylXbQolC8uVSaJ49LEDvKJYtqA1ScH1vD1JeQrctXaD-eAYoZ59zGTH8_PalEgwGYSClcoJ97eolLYH7kdoMP7bf8dYQybEQq09739SEIztJXhBbmmKITw4JWdkQj460VxhqSEFJYxnhwERRIQXdbfNLzk7wX8dsyNwLevu76xya8fZ-9nF9Oy_-FUQrgXHJb7Ctmz4DwpQ-I5v89XnL8vN7Xo5v12tZns_37vrl-fH-f3DQ3J3_3g3m7-Rd0EiKnkqMcFDZVVWOt3ljUJszQrfuu4aVwgnjEfjmBPBota8d8gmoHFMRN1EA4m6-V3_FFpOBDK-c8xUpi6wn9UfwXmYlA?type=png)

```
classDiagram
    User "1" -- "many" UserRole : has
    User "1" -- "many" WeeklyAvailability : has
    User "1" -- "many" AvailabilityException : has
    User "1" -- "many" ShiftAssignment : works
    User "1" -- "many" TimeEntry : logs

    Role "1" -- "many" UserRole : defines
    Role "1" -- "many" Shift : requires

    Shift "1" -- "many" ShiftAssignment : assigned
    Shift "1" -- "1" MealPreparation : schedules
    Shift "1" -- "1" PackingSheet : schedules
    Shift "1" -- "1" Delivery : schedules

    ShiftAssignment "1" -- "many" TimeEntry : generates

    MealPreparation "1" -- "many" DeliveryItem : prepares
    MealPreparation "1" -- "many" PackedBoxItem : contains
    MealPreparation "many" -- "1" Meal : follows recipe

    Meal "1" -- "many" MealIngredient : requires
    MealIngredient "many" -- "1" InventoryItem : uses
    MealPrepConsumption "many" -- "1" InventoryItem : consumes
    MealPrepConsumption "many" -- "1" MealPreparation : records

    PackingSheet "1" -- "many" PackedBox : contains
    PackedBox "1" -- "many" PackedBoxItem : holds
    PackedBox "many" -- "1" Delivery : loaded for

    Delivery "1" -- "many" DeliveryItem : contains
    DeliveryItem "many" -- "1" CareRecipient : delivered to
    PackedBoxItem "many" -- "1" DeliveryItem : fulfills

    class User {
        +Guid user_id
        +String first_name
        +String last_name
        +String email
        +String role
        +String user_type
    }

    class Shift {
        +Guid shift_id
        +Guid role_id
        +Date shift_date
        +Time start_time
        +Time end_time
        +String shift_type
    }

    class TimeEntry {
        +Guid time_entry_id
        +Guid user_id
        +Guid role_id
        +Guid shift_assignment_id
        +Date activity_date
        +Time start_time
        +Time end_time
        +Int duration
    }

    class MealPreparation {
        +Guid meal_prep_id
        +Guid meal_id
        +Date prep_date
        +Int quantity
        +Guid shift_id
        +String status
    }
```

---

## Deployment Strategy

### Azure DevOps CI/CD Pipeline

1. **Source Control**:

   - Store code in Azure DevOps or GitHub repository
   - Use feature branch workflow with pull request reviews

2. **CI Pipeline**:

   - Trigger builds on pull requests and main branch commits
   - Run unit and integration tests
   - Generate code quality reports
   - Create build artifacts

3. **CD Pipeline**:
   - Deploy to Dev/Test environments automatically
   - Require approval for Staging/Production deployments
   - Use Blue-Green deployment for zero downtime

### Docker Containerization

```yaml
# Backend Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["MealsOnWheels.API/MealsOnWheels.API.csproj", "MealsOnWheels.API/"]
COPY ["MealsOnWheels.Application/MealsOnWheels.Application.csproj", "MealsOnWheels.Application/"]
COPY ["MealsOnWheels.Domain/MealsOnWheels.Domain.csproj", "MealsOnWheels.Domain/"]
COPY ["MealsOnWheels.Infrastructure/MealsOnWheels.Infrastructure.csproj", "MealsOnWheels.Infrastructure/"]
RUN dotnet restore "MealsOnWheels.API/MealsOnWheels.API.csproj"
COPY . .
WORKDIR "/src/MealsOnWheels.API"
RUN dotnet build "MealsOnWheels.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MealsOnWheels.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MealsOnWheels.API.dll"]

# Frontend Dockerfile
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS final
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Azure Hosting Options

1. **Backend**:

   - Azure App Service for Web API
   - Azure SQL Database for data storage
   - Azure Key Vault for secrets management

2. **Frontend**:

   - Azure Static Web Apps or Azure App Service
   - Azure CDN for content delivery

3. **Monitoring**:
   - Application Insights for telemetry
   - Azure Monitor for logs and metrics

---

## Testing Strategy

### Backend Testing

1. **Unit Tests**:
   - Test service logic independently
   - Use xUnit or NUnit framework
   - Mock repositories and dependencies

```csharp
// Example service unit test
public class UserServiceTests
{
    private readonly Mock<IUserRepository> _mockUserRepo;
    private readonly IMapper _mapper;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _mockUserRepo = new Mock<IUserRepository>();

        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<UserMappingProfile>();
        });
        _mapper = mapperConfig.CreateMapper();

        _userService = new UserService(_mockUserRepo.Object, _mapper);
    }

    [Fact]
    public async Task GetUserById_WithValidId_ReturnsUser()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User { UserId = userId, FirstName = "John", LastName = "Doe" };
        _mockUserRepo.Setup(repo => repo.GetByIdAsync(userId)).ReturnsAsync(user);

        // Act
        var result = await _userService.GetUserByIdAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.UserId);
        Assert.Equal("John", result.FirstName);
        Assert.Equal("Doe", result.LastName);
    }
}
```

2. **Integration Tests**:
   - Test API controllers with test database
   - Use TestServer for in-memory hosting
   - Use SQL Server LocalDB or in-memory database provider

```csharp
public class UsersControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public UsersControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Replace SQL Server with in-memory database
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase("TestingDb");
                });

                // Ensure database is created and seeded
                var sp = services.BuildServiceProvider();
                using var scope = sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                db.Database.EnsureCreated();
                SeedTestData(db);
            });
        });
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetUsers_ReturnsSuccessAndCorrectContentType()
    {
        // Act
        var response = await _client.GetAsync("/api/users");

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json; charset=utf-8",
            response.Content.Headers.ContentType?.ToString());
    }

    private void SeedTestData(ApplicationDbContext context)
    {
        // Add test data here
    }
}
```

### Frontend Testing

1. **Unit Tests**:
   - Test React components in isolation
   - Test Redux reducers, actions, and selectors
   - Use Jest and React Testing Library

```typescript
// Example Redux reducer test
import usersReducer, {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
} from "../features/users/usersSlice";

describe("users reducer", () => {
  const initialState = {
    users: [],
    selectedUser: null,
    status: "idle",
    error: null,
  };

  it("should handle initial state", () => {
    expect(usersReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle fetchUsers.pending", () => {
    const action = { type: fetchUsers.pending.type };
    const state = usersReducer(initialState, action);
    expect(state.status).toEqual("loading");
  });

  it("should handle fetchUsers.fulfilled", () => {
    const mockUsers = [{ userId: "1", firstName: "John", lastName: "Doe" }];
    const action = {
      type: fetchUsers.fulfilled.type,
      payload: mockUsers,
    };
    const state = usersReducer(initialState, action);

    expect(state.status).toEqual("succeeded");
    expect(state.users).toEqual(mockUsers);
  });
});

// Example component test
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import UserList from "../pages/Users/UserList";

const mockStore = configureStore([thunk]);

describe("UserList Component", () => {
  test("renders loading spinner when status is loading", () => {
    const store = mockStore({
      users: {
        users: [],
        status: "loading",
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserList />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("renders users table when status is succeeded", () => {
    const mockUsers = [
      {
        userId: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "admin",
        userType: "Staff",
        status: "Active",
      },
      {
        userId: "2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        role: "driver",
        userType: "Volunteer",
        status: "Active",
      },
    ];

    const store = mockStore({
      users: {
        users: mockUsers,
        status: "succeeded",
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserList />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });
});
```

2. **Integration Tests**:
   - Test components interactions and workflows
   - Use Cypress for end-to-end testing

```typescript
// Example Cypress test
describe("User Management", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/users", { fixture: "users.json" }).as("getUsers");
    cy.visit("/users");
    cy.wait("@getUsers");
  });

  it("displays user list", () => {
    cy.contains("h4", "Users");
    cy.get("table").should("exist");
    cy.get("table tbody tr").should("have.length", 2);
  });

  it("navigates to user details when View button clicked", () => {
    cy.intercept("GET", "/api/users/1", { fixture: "user-details.json" }).as(
      "getUser"
    );
    cy.contains("button", "View").first().click();
    cy.wait("@getUser");
    cy.url().should("include", "/users/1");
    cy.contains("h4", "User Details");
    cy.contains("John Doe");
  });

  it("opens create user form and submits it", () => {
    cy.intercept("POST", "/api/users", {
      statusCode: 201,
      body: {
        userId: "3",
        firstName: "New",
        lastName: "User",
        email: "newuser@example.com",
        role: "kitchen_staff",
        userType: "Staff",
        status: "Active",
      },
    }).as("createUser");

    cy.contains("button", "Add User").click();
    cy.url().should("include", "/users/new");

    cy.get('input[name="firstName"]').type("New");
    cy.get('input[name="lastName"]').type("User");
    cy.get('input[name="email"]').type("newuser@example.com");
    cy.get('select[name="role"]').select("kitchen_staff");
    cy.get('select[name="userType"]').select("Staff");

    cy.contains("button", "Save").click();
    cy.wait("@createUser");
    cy.url().should("include", "/users");
  });
});
```

---

## Security Considerations

### Authentication & Authorization

1. **Authentication Implementation**:

   - Use JWT for API authentication
   - Implement token-based authentication flow
   - Store tokens securely in browser (httpOnly cookie or secure localStorage strategy)

2. **Authorization Strategy**:
   - Role-based access control (RBAC)
   - Policy-based authorization for complex rules
   - Secure all API endpoints with proper claims checks

### Data Protection

1. **Sensitive Data**:

   - Use HTTPS for all connections
   - Encrypt sensitive data at rest
   - Implement data masking for PII in logs

2. **Input Validation**:
   - Validate all inputs on both client and server side
   - Implement model validation in ASP.NET Core
   - Use parameterized queries and EF Core to prevent SQL injection

### Audit & Compliance

1. **Audit Logging**:

   - Implement detailed audit trails for data changes
   - Log all authentication events and sensitive operations
   - Store logs securely and ensure immutability

2. **Compliance Features**:
   - Support data subject access requests (DSAR)
   - Implement data retention policies
   - Allow data exports in compliance with regulations

---

## Implementation Roadmap

### Phase 1: Core Foundation (6-8 weeks)

1. **Week 1-2: Project Setup**

   - Set up database schema and initial migrations
   - Create API project structure and configure middleware
   - Set up React project with routing and state management

2. **Week 3-5: User Management**

   - Implement unified user table and authentication
   - Create user management screens (staff and volunteers)
   - Implement role-based authorization

3. **Week 6-8: Inventory Management**
   - Implement inventory items, categories, and locations
   - Create supplier and purchase order functionality
   - Develop inventory tracking screens

### Phase 2: Operational Features (8-10 weeks)

4. **Week 9-11: Scheduling System**

   - Implement availability tracking and exceptions
   - Create shift management functionality
   - Develop scheduling and assignment features

5. **Week 12-14: Meal Planning**

   - Implement meal definitions and ingredients
   - Create meal preparation workflow
   - Develop kitchen operations screens

6. **Week 15-18: Delivery Management**
   - Implement care recipient management
   - Create route planning and box packing
   - Develop delivery tracking screens

### Phase 3: Integration & Reporting (4-6 weeks)

7. **Week 19-21: Integration Features**

   - Implement cross-module workflows
   - Create notification system
   - Develop process automation features

8. **Week 22-24: Reporting & Analytics**
   - Implement operational dashboards
   - Create statistical reports
   - Develop volunteer performance metrics

### Phase 4: Refinement & Deployment (4-6 weeks)

9. **Week 25-27: Quality Assurance**

   - Conduct thorough testing and bug fixing
   - Implement performance optimizations
   - Enhance user experience based on feedback

10. **Week 28-30: Deployment & Training**
    - Set up production infrastructure
    - Develop training materials and documentation
    - Implement phased deployment strategy

---

This implementation guide provides a comprehensive roadmap for developing the integrated Meals on Wheels Volunteer Management System. The modular approach allows for incremental development while ensuring all integration points are properly addressed.
