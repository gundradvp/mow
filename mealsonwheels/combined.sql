-- Enable ANSI NULL defaults for the database
/*SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ***************************************************
-- PART 1: CORE TABLES
-- ***************************************************

-- Category table
CREATE TABLE Category (
    category_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(50) NOT NULL,
    description NVARCHAR(MAX),
    parent_category_id UNIQUEIDENTIFIER NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Category_ParentCategory FOREIGN KEY (parent_category_id) 
        REFERENCES Category(category_id)
);
GO

-- Facility table
CREATE TABLE Facility (
    facility_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL,
    address NVARCHAR(MAX) NOT NULL,
    city NVARCHAR(50) NOT NULL,
    state NVARCHAR(2) NOT NULL DEFAULT 'CA',
    zip_code NVARCHAR(10) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    capacity INT,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Storage Location table
CREATE TABLE StorageLocation (
    storage_location_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(50) NOT NULL,
    type NVARCHAR(20) NOT NULL,
    description NVARCHAR(MAX),
    capacity DECIMAL(10, 2),
    temperature_range NVARCHAR(50),
    facility_id UNIQUEIDENTIFIER NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_StorageLocation_Facility FOREIGN KEY (facility_id) 
        REFERENCES Facility(facility_id)
);
GO

-- Inventory Item table
CREATE TABLE InventoryItem (
    inventory_item_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    item_name NVARCHAR(100) NOT NULL,
    category_id UNIQUEIDENTIFIER NOT NULL,
    description NVARCHAR(MAX),
    unit_of_measure NVARCHAR(20) NOT NULL,
    current_quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
    minimum_quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
    maximum_quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
    avg_consumption_rate DECIMAL(10, 2),
    barcode NVARCHAR(50),
    storage_location_id UNIQUEIDENTIFIER NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_InventoryItem_Category FOREIGN KEY (category_id) 
        REFERENCES Category(category_id),
    CONSTRAINT FK_InventoryItem_StorageLocation FOREIGN KEY (storage_location_id) 
        REFERENCES StorageLocation(storage_location_id),
    CONSTRAINT CK_InventoryItem_Quantities CHECK (current_quantity >= 0 AND minimum_quantity >= 0 AND maximum_quantity >= minimum_quantity)
);
GO

-- ***************************************************
-- PART 2: UNIFIED USER MANAGEMENT
-- ***************************************************

-- User table (enhanced with staff/volunteer fields)
CREATE TABLE [User] (
    user_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    user_type NVARCHAR(20) NOT NULL CHECK (user_type IN ('Staff', 'Volunteer')),
    status NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Inactive', 'Rejected')),
    role NVARCHAR(20) NOT NULL,  -- Primary role: admin, inventory_manager, kitchen_staff, driver, packer, route_planner
    facility_id UNIQUEIDENTIFIER NOT NULL,
    is_driver BIT NOT NULL DEFAULT 0,
    driver_license NVARCHAR(50),
    driver_license_expiry DATE,
    registration_date DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    emergency_contact NVARCHAR(MAX),
    profile_picture NVARCHAR(255),
    available_start_time TIME,
    available_end_time TIME,
    available_days NVARCHAR(50),  -- comma-separated days of week
    max_route_distance DECIMAL(8, 2),
    max_route_duration_minutes INT,
    notes NVARCHAR(MAX),
    json_data NVARCHAR(MAX), -- For demographic info, skills, preferences
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_User_Facility FOREIGN KEY (facility_id) 
        REFERENCES Facility(facility_id),
    CONSTRAINT UQ_User_Email UNIQUE (email)
);
GO

-- Recruitment table
CREATE TABLE Recruitment (
    recruitment_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    source NVARCHAR(50) NOT NULL,
    referred_by UNIQUEIDENTIFIER NULL,
    application_date DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    interview_date DATETIME2,
    interview_notes NVARCHAR(MAX),
    status NVARCHAR(20) NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Interviewed', 'Approved', 'Rejected')),
    json_data NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Recruitment_User FOREIGN KEY (user_id) REFERENCES [User](user_id),
    CONSTRAINT FK_Recruitment_ReferredBy FOREIGN KEY (referred_by) REFERENCES [User](user_id)
);
GO

-- Credentials table
CREATE TABLE Credentials (
    credential_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    credential_type NVARCHAR(50) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Expired')),
    issued_date DATE,
    expiry_date DATE,
    verification_date DATE,
    document_url NVARCHAR(255),
    notes NVARCHAR(MAX),
    json_data NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Credentials_User FOREIGN KEY (user_id) REFERENCES [User](user_id)
);
GO

-- Roles table (extends beyond simple user.role)
CREATE TABLE Roles (
    role_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    role_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    required_credentials NVARCHAR(MAX),
    minimum_commitment INT, -- in hours
    department NVARCHAR(50),
    is_active BIT NOT NULL DEFAULT 1,
    json_data NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- User Roles (many-to-many relationship)
CREATE TABLE UserRoles (
    user_role_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    role_id UNIQUEIDENTIFIER NOT NULL,
    assignment_date DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    status NVARCHAR(20) NOT NULL DEFAULT 'Interested' CHECK (status IN ('Interested', 'Training', 'Qualified', 'Active', 'Inactive')),
    notes NVARCHAR(MAX),
    json_data NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_UserRole_User FOREIGN KEY (user_id) REFERENCES [User](user_id),
    CONSTRAINT FK_UserRole_Role FOREIGN KEY (role_id) REFERENCES Roles(role_id),
    CONSTRAINT UQ_UserRole UNIQUE (user_id, role_id)
);
GO

-- ***************************************************
-- PART 3: ENHANCED SCHEDULING SYSTEM
-- ***************************************************

-- Regular Weekly Availability
CREATE TABLE WeeklyAvailability (
    availability_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    day_of_week TINYINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL, 
    end_time TIME NOT NULL,
    effective_date DATE NOT NULL DEFAULT GETDATE(),
    expiry_date DATE,
    is_active BIT NOT NULL DEFAULT 1,
    json_data NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_WeeklyAvailability_User FOREIGN KEY (user_id) REFERENCES [User](user_id),
    CONSTRAINT CHK_TimeRange CHECK (start_time < end_time)
);
GO

-- Availability Exceptions (for specific dates)
CREATE TABLE AvailabilityExceptions (
    exception_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    exception_date DATE NOT NULL,
    is_available BIT NOT NULL,
    start_time TIME,
    end_time TIME,
    reason NVARCHAR(255),
    json_data NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_AvailabilityExceptions_User FOREIGN KEY (user_id) REFERENCES [User](user_id),
    CONSTRAINT CHK_TimeRangeException CHECK (is_available = 0 OR (start_time < end_time))
);
GO

-- Shifts table (scheduled work periods)
CREATE TABLE Shifts (
    shift_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    role_id UNIQUEIDENTIFIER NOT NULL,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    required_headcount INT NOT NULL DEFAULT 1,
    shift_type NVARCHAR(50) NOT NULL, -- 'Kitchen', 'Packing', 'Delivery'
    notes NVARCHAR(MAX),
    json_data NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Shifts_Role FOREIGN KEY (role_id) REFERENCES Roles(role_id),
    CONSTRAINT CHK_ShiftTimeRange CHECK (start_time < end_time)
);
GO

-- User Shift Assignments
CREATE TABLE ShiftAssignments (
    assignment_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    shift_id UNIQUEIDENTIFIER NOT NULL,
    user_id UNIQUEIDENTIFIER NOT NULL,
    assignment_status NVARCHAR(20) NOT NULL DEFAULT 'Scheduled' 
        CHECK (assignment_status IN ('Invited', 'Scheduled', 'Confirmed', 'Declined', 'Completed', 'No-Show')),
    assigned_date DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    confirmed_date DATETIME2,
    check_in_time DATETIME2,
    check_out_time DATETIME2,
    notes NVARCHAR(MAX),
    json_data NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_ShiftAssignments_Shift FOREIGN KEY (shift_id) REFERENCES Shifts(shift_id),
    CONSTRAINT FK_ShiftAssignments_User FOREIGN KEY (user_id) REFERENCES [User](user_id),
    CONSTRAINT UQ_ShiftUser UNIQUE (shift_id, user_id)
);
GO

-- Time entries for all activities
CREATE TABLE TimeEntries (
    time_entry_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    role_id UNIQUEIDENTIFIER NULL,
    shift_assignment_id UNIQUEIDENTIFIER NULL,
    activity_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration AS DATEDIFF(MINUTE, start_time, end_time),
    description NVARCHAR(MAX),
    status NVARCHAR(20) NOT NULL DEFAULT 'Submitted' 
        CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Rejected')),
    submitted_date DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    approved_by UNIQUEIDENTIFIER NULL,
    approved_date DATETIME2,
    json_data NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_TimeEntries_User FOREIGN KEY (user_id) REFERENCES [User](user_id),
    CONSTRAINT FK_TimeEntries_Role FOREIGN KEY (role_id) REFERENCES Roles(role_id),
    CONSTRAINT FK_TimeEntries_ShiftAssignment FOREIGN KEY (shift_assignment_id) REFERENCES ShiftAssignments(assignment_id),
    CONSTRAINT FK_TimeEntries_ApprovedBy FOREIGN KEY (approved_by) REFERENCES [User](user_id),
    CONSTRAINT CHK_TimeEntryRange CHECK (start_time < end_time)
);
GO

-- ***************************************************
-- PART 4: CARE RECIPIENT & SERVICE ROUTE TABLES
-- ***************************************************

-- Service Route table
CREATE TABLE ServiceRoute (
    route_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(50) NOT NULL,
    description NVARCHAR(MAX),
    facility_id UNIQUEIDENTIFIER NOT NULL,
    estimated_duration_minutes INT,
    estimated_distance_miles DECIMAL(8, 2),
    route_sequence_data NVARCHAR(MAX),  -- JSON data for route sequence
    zip_codes_covered NVARCHAR(255),    -- Comma-separated zip codes
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_ServiceRoute_Facility FOREIGN KEY (facility_id) 
        REFERENCES Facility(facility_id)
);
GO

-- CareRecipient table (formerly Client)
CREATE TABLE CareRecipient (
    cr_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    address NVARCHAR(MAX) NOT NULL,
    city NVARCHAR(50) NOT NULL,
    state NVARCHAR(2) NOT NULL DEFAULT 'CA',
    zip_code NVARCHAR(10) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    email NVARCHAR(100),
    birth_date DATE NOT NULL,
    emergency_contact NVARCHAR(100) NOT NULL,
    emergency_phone NVARCHAR(20) NOT NULL,
    dietary_restrictions NVARCHAR(MAX),
    allergies NVARCHAR(MAX),
    service_route_id UNIQUEIDENTIFIER NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'active',
    notes NVARCHAR(MAX),
    special_instructions NVARCHAR(MAX),
    accessibility_notes NVARCHAR(MAX),
    preferred_delivery_time NVARCHAR(50),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_CareRecipient_ServiceRoute FOREIGN KEY (service_route_id) 
        REFERENCES ServiceRoute(route_id)
);
GO

-- ***************************************************
-- PART 5: INVENTORY & SUPPLIER TABLES
-- ***************************************************

-- Supplier table
CREATE TABLE Supplier (
    supplier_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL,
    contact_person NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    address NVARCHAR(MAX) NOT NULL,
    city NVARCHAR(50) NOT NULL,
    state NVARCHAR(2) NOT NULL DEFAULT 'CA',
    zip_code NVARCHAR(10) NOT NULL,
    account_number NVARCHAR(50),
    notes NVARCHAR(MAX),
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- PurchaseOrder table
CREATE TABLE PurchaseOrder (
    po_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    supplier_id UNIQUEIDENTIFIER NOT NULL,
    order_date DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    expected_delivery_date DATE NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'draft',
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    payment_terms NVARCHAR(50),
    payment_status NVARCHAR(20) NOT NULL DEFAULT 'unpaid',
    shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_by UNIQUEIDENTIFIER NOT NULL,
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_PurchaseOrder_Supplier FOREIGN KEY (supplier_id) 
        REFERENCES Supplier(supplier_id),
    CONSTRAINT FK_PurchaseOrder_User FOREIGN KEY (created_by) 
        REFERENCES [User](user_id),
    CONSTRAINT CK_PurchaseOrder_Amounts CHECK (total_amount >= 0 AND shipping_cost >= 0)
);
GO

-- PurchaseOrderItem table
CREATE TABLE PurchaseOrderItem (
    po_item_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    po_id UNIQUEIDENTIFIER NOT NULL,
    inventory_item_id UNIQUEIDENTIFIER NOT NULL,
    quantity_ordered DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity_received DECIMAL(10, 2) NOT NULL DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL,
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_PurchaseOrderItem_PurchaseOrder FOREIGN KEY (po_id) 
        REFERENCES PurchaseOrder(po_id),
    CONSTRAINT FK_PurchaseOrderItem_InventoryItem FOREIGN KEY (inventory_item_id) 
        REFERENCES InventoryItem(inventory_item_id),
    CONSTRAINT CK_PurchaseOrderItem_Quantities CHECK (quantity_ordered > 0 AND unit_price >= 0 AND quantity_received >= 0)
);
GO

-- ***************************************************
-- PART 6: MEAL & KITCHEN TABLES
-- ***************************************************

-- Meal table
CREATE TABLE Meal (
    meal_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    meal_type NVARCHAR(20) NOT NULL,
    calories INT,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- MealIngredient table
CREATE TABLE MealIngredient (
    meal_ingredient_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    meal_id UNIQUEIDENTIFIER NOT NULL,
    inventory_item_id UNIQUEIDENTIFIER NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_MealIngredient_Meal FOREIGN KEY (meal_id) 
        REFERENCES Meal(meal_id),
    CONSTRAINT FK_MealIngredient_InventoryItem FOREIGN KEY (inventory_item_id) 
        REFERENCES InventoryItem(inventory_item_id),
    CONSTRAINT CK_MealIngredient_Quantity CHECK (quantity > 0)
);
GO

-- ***************************************************
-- PART 7: VEHICLE & LOGISTICS TABLES
-- ***************************************************

-- Vehicle table
CREATE TABLE Vehicle (
    vehicle_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    vehicle_name NVARCHAR(50) NOT NULL,
    license_plate NVARCHAR(20) NOT NULL,
    vehicle_type NVARCHAR(30) NOT NULL,
    capacity_cubic_feet DECIMAL(8, 2) NOT NULL,
    max_weight_lbs DECIMAL(8, 2) NOT NULL,
    facility_id UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'available',
    maintenance_due_date DATE,
    notes NVARCHAR(MAX),
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Vehicle_Facility FOREIGN KEY (facility_id)
        REFERENCES Facility(facility_id)
);
GO

-- BoxType table
CREATE TABLE BoxType (
    box_type_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(50) NOT NULL,
    description NVARCHAR(MAX),
    length_inches DECIMAL(5, 2) NOT NULL,
    width_inches DECIMAL(5, 2) NOT NULL,
    height_inches DECIMAL(5, 2) NOT NULL,
    max_weight_lbs DECIMAL(5, 2) NOT NULL,
    insulated BIT NOT NULL DEFAULT 0,
    color NVARCHAR(30),
    is_reusable BIT NOT NULL DEFAULT 0,
    capacity_meal_count INT NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Box inventory table
CREATE TABLE Box (
    box_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    box_type_id UNIQUEIDENTIFIER NOT NULL,
    barcode NVARCHAR(50),
    status NVARCHAR(20) NOT NULL DEFAULT 'available',
    current_location_id UNIQUEIDENTIFIER,
    last_sanitized_date DATE,
    usage_count INT NOT NULL DEFAULT 0,
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Box_BoxType FOREIGN KEY (box_type_id)
        REFERENCES BoxType(box_type_id),
    CONSTRAINT FK_Box_Facility FOREIGN KEY (current_location_id)
        REFERENCES Facility(facility_id)
);
GO

-- MealPreparation table - linked to shifts
CREATE TABLE MealPreparation (
    meal_prep_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    meal_id UNIQUEIDENTIFIER NOT NULL,
    prep_date DATE NOT NULL,
    quantity INT NOT NULL,
    facility_id UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'planned',
    notes NVARCHAR(MAX),
    created_by UNIQUEIDENTIFIER NOT NULL,
    shift_id UNIQUEIDENTIFIER NULL, -- Link to kitchen shift
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_MealPreparation_Meal FOREIGN KEY (meal_id) 
        REFERENCES Meal(meal_id),
    CONSTRAINT FK_MealPreparation_Facility FOREIGN KEY (facility_id) 
        REFERENCES Facility(facility_id),
    CONSTRAINT FK_MealPreparation_User FOREIGN KEY (created_by) 
        REFERENCES [User](user_id),
    CONSTRAINT FK_MealPreparation_Shift FOREIGN KEY (shift_id)
        REFERENCES Shifts(shift_id),
    CONSTRAINT CK_MealPreparation_Quantity CHECK (quantity > 0)
);
GO

-- MealPrepConsumption table
CREATE TABLE MealPrepConsumption (
    consumption_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    meal_prep_id UNIQUEIDENTIFIER NOT NULL,
    inventory_item_id UNIQUEIDENTIFIER NOT NULL,
    quantity_used DECIMAL(10, 2) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_MealPrepConsumption_MealPreparation FOREIGN KEY (meal_prep_id) 
        REFERENCES MealPreparation(meal_prep_id),
    CONSTRAINT FK_MealPrepConsumption_InventoryItem FOREIGN KEY (inventory_item_id) 
        REFERENCES InventoryItem(inventory_item_id),
    CONSTRAINT CK_MealPrepConsumption_QuantityUsed CHECK (quantity_used > 0)
);
GO

-- Packing Sheet table - linked to shifts
CREATE TABLE PackingSheet (
    packing_sheet_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    packing_date DATE NOT NULL,
    facility_id UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'draft',
    total_meals INT NOT NULL DEFAULT 0,
    total_boxes INT NOT NULL DEFAULT 0,
    completed_by UNIQUEIDENTIFIER NULL,
    verified_by UNIQUEIDENTIFIER NULL,
    shift_id UNIQUEIDENTIFIER NULL, -- Link to packing shift
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_PackingSheet_Facility FOREIGN KEY (facility_id)
        REFERENCES Facility(facility_id),
    CONSTRAINT FK_PackingSheet_CompletedBy FOREIGN KEY (completed_by)
        REFERENCES [User](user_id),
    CONSTRAINT FK_PackingSheet_VerifiedBy FOREIGN KEY (verified_by)
        REFERENCES [User](user_id),
    CONSTRAINT FK_PackingSheet_Shift FOREIGN KEY (shift_id)
        REFERENCES Shifts(shift_id)
);
GO

-- Delivery table - linked to shifts
CREATE TABLE Delivery (
    delivery_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    route_id UNIQUEIDENTIFIER NOT NULL,
    delivery_date DATE NOT NULL,
    driver_user_id UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'planned',
    start_time DATETIME2,
    end_time DATETIME2,
    vehicle_id UNIQUEIDENTIFIER NULL,
    actual_mileage DECIMAL(8, 2),
    departure_checklist_completed BIT NOT NULL DEFAULT 0,
    return_checklist_completed BIT NOT NULL DEFAULT 0,
    shift_id UNIQUEIDENTIFIER NULL, -- Link to delivery shift
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Delivery_ServiceRoute FOREIGN KEY (route_id) 
        REFERENCES ServiceRoute(route_id),
    CONSTRAINT FK_Delivery_User FOREIGN KEY (driver_user_id) 
        REFERENCES [User](user_id),
    CONSTRAINT FK_Delivery_Vehicle FOREIGN KEY (vehicle_id) 
        REFERENCES Vehicle(vehicle_id),
    CONSTRAINT FK_Delivery_Shift FOREIGN KEY (shift_id)
        REFERENCES Shifts(shift_id),
    CONSTRAINT CK_Delivery_Times CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time)
);
GO

-- Packed Box table
CREATE TABLE PackedBox (
    packed_box_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    packing_sheet_id UNIQUEIDENTIFIER NOT NULL,
    box_id UNIQUEIDENTIFIER NULL, -- NULL if using disposable boxes
    box_type_id UNIQUEIDENTIFIER NOT NULL,
    delivery_id UNIQUEIDENTIFIER NULL,
    label_printed BIT NOT NULL DEFAULT 0,
    label_print_date DATETIME2,
    packed_by UNIQUEIDENTIFIER NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'packed',
    temperature_at_packing DECIMAL(5, 2),
    packing_timestamp DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_PackedBox_PackingSheet FOREIGN KEY (packing_sheet_id)
        REFERENCES PackingSheet(packing_sheet_id),
    CONSTRAINT FK_PackedBox_Box FOREIGN KEY (box_id)
        REFERENCES Box(box_id),
    CONSTRAINT FK_PackedBox_BoxType FOREIGN KEY (box_type_id)
        REFERENCES BoxType(box_type_id),
    CONSTRAINT FK_PackedBox_Delivery FOREIGN KEY (delivery_id)
        REFERENCES Delivery(delivery_id),
    CONSTRAINT FK_PackedBox_User FOREIGN KEY (packed_by)
        REFERENCES [User](user_id)
);
GO

-- DeliveryItem table
CREATE TABLE DeliveryItem (
    delivery_item_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    delivery_id UNIQUEIDENTIFIER NOT NULL,
    cr_id UNIQUEIDENTIFIER NOT NULL,
    meal_prep_id UNIQUEIDENTIFIER NOT NULL,
    quantity INT NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'scheduled',
    delivery_time DATETIME2,
    delivery_attempt_count INT NOT NULL DEFAULT 0,
    delivery_notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_DeliveryItem_Delivery FOREIGN KEY (delivery_id) 
        REFERENCES Delivery(delivery_id),
    CONSTRAINT FK_DeliveryItem_CareRecipient FOREIGN KEY (cr_id) 
        REFERENCES CareRecipient(cr_id),
    CONSTRAINT FK_DeliveryItem_MealPreparation FOREIGN KEY (meal_prep_id) 
        REFERENCES MealPreparation(meal_prep_id),
    CONSTRAINT CK_DeliveryItem_Quantity CHECK (quantity > 0)
);
GO

-- PackedBoxItem table
CREATE TABLE PackedBoxItem (
    packed_box_item_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    packed_box_id UNIQUEIDENTIFIER NOT NULL,
    meal_prep_id UNIQUEIDENTIFIER NOT NULL,
    cr_id UNIQUEIDENTIFIER NOT NULL,
    delivery_item_id UNIQUEIDENTIFIER NULL,
    quantity INT NOT NULL DEFAULT 1,
    special_instructions NVARCHAR(MAX),
    position_in_box NVARCHAR(20),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_PackedBoxItem_PackedBox FOREIGN KEY (packed_box_id)
        REFERENCES PackedBox(packed_box_id),
    CONSTRAINT FK_PackedBoxItem_MealPreparation FOREIGN KEY (meal_prep_id)
        REFERENCES MealPreparation(meal_prep_id),
    CONSTRAINT FK_PackedBoxItem_CareRecipient FOREIGN KEY (cr_id)
        REFERENCES CareRecipient(cr_id),
    CONSTRAINT FK_PackedBoxItem_DeliveryItem FOREIGN KEY (delivery_item_id)
        REFERENCES DeliveryItem(delivery_item_id)
);
GO

-- Loading Sheet table
CREATE TABLE LoadingSheet (
    loading_sheet_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    delivery_id UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'pending',
    loading_start_time DATETIME2,
    loading_end_time DATETIME2,
    loaded_by UNIQUEIDENTIFIER NULL,
    verified_by UNIQUEIDENTIFIER NULL,
    total_boxes INT NOT NULL DEFAULT 0,
    loading_dock NVARCHAR(20),
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_LoadingSheet_Delivery FOREIGN KEY (delivery_id)
        REFERENCES Delivery(delivery_id),
    CONSTRAINT FK_LoadingSheet_LoadedBy FOREIGN KEY (loaded_by)
        REFERENCES [User](user_id),
    CONSTRAINT FK_LoadingSheet_VerifiedBy FOREIGN KEY (verified_by)
        REFERENCES [User](user_id)
);
GO

-- LoadingSheetItem table
CREATE TABLE LoadingSheetItem (
    loading_sheet_item_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    loading_sheet_id UNIQUEIDENTIFIER NOT NULL,
    packed_box_id UNIQUEIDENTIFIER NOT NULL,
    loading_sequence INT NOT NULL,
    loading_zone NVARCHAR(20),
    is_loaded BIT NOT NULL DEFAULT 0,
    loading_timestamp DATETIME2,
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_LoadingSheetItem_LoadingSheet FOREIGN KEY (loading_sheet_id)
        REFERENCES LoadingSheet(loading_sheet_id),
    CONSTRAINT FK_LoadingSheetItem_PackedBox FOREIGN KEY (packed_box_id)
        REFERENCES PackedBox(packed_box_id)
);
GO

-- ***************************************************
-- PART 8: INVENTORY TRANSACTION & DONATION TABLES
-- ***************************************************

-- InventoryTransaction table
CREATE TABLE InventoryTransaction (
    transaction_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    inventory_item_id UNIQUEIDENTIFIER NOT NULL,
    transaction_type NVARCHAR(20) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    transaction_date DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    po_id UNIQUEIDENTIFIER NULL,
    meal_prep_id UNIQUEIDENTIFIER NULL,
    user_id UNIQUEIDENTIFIER NOT NULL,
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_InventoryTransaction_InventoryItem FOREIGN KEY (inventory_item_id) 
        REFERENCES InventoryItem(inventory_item_id),
    CONSTRAINT FK_InventoryTransaction_PurchaseOrder FOREIGN KEY (po_id) 
        REFERENCES PurchaseOrder(po_id),
    CONSTRAINT FK_InventoryTransaction_MealPreparation FOREIGN KEY (meal_prep_id) 
        REFERENCES MealPreparation(meal_prep_id),
    CONSTRAINT FK_InventoryTransaction_User FOREIGN KEY (user_id) 
        REFERENCES [User](user_id)
);
GO

-- Donation table
CREATE TABLE Donation (
    donation_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    donor_name NVARCHAR(100) NOT NULL,
    donation_date DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    inventory_item_id UNIQUEIDENTIFIER NULL,
    category_id UNIQUEIDENTIFIER NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    estimated_value DECIMAL(10, 2) NOT NULL,
    received_by UNIQUEIDENTIFIER NOT NULL,
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Donation_InventoryItem FOREIGN KEY (inventory_item_id) 
        REFERENCES InventoryItem(inventory_item_id),
    CONSTRAINT FK_Donation_Category FOREIGN KEY (category_id) 
        REFERENCES Category(category_id),
    CONSTRAINT FK_Donation_User FOREIGN KEY (received_by) 
        REFERENCES [User](user_id),
    CONSTRAINT CK_Donation_Quantity CHECK (quantity > 0),
    CONSTRAINT CK_Donation_EstimatedValue CHECK (estimated_value >= 0)
);
GO

-- ***************************************************
-- PART 9: NOTIFICATION SYSTEM TABLES
-- ***************************************************

-- Notification Templates table
CREATE TABLE NotificationTemplate (
    template_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    template_name NVARCHAR(100) NOT NULL,
    subject_template NVARCHAR(200) NOT NULL,
    body_template NVARCHAR(MAX) NOT NULL,
    notification_type NVARCHAR(50) NOT NULL, -- 'email', 'sms', 'in_app'
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Notification table
CREATE TABLE Notification (
    notification_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    template_id UNIQUEIDENTIFIER NOT NULL,
    subject NVARCHAR(200) NOT NULL,
    body NVARCHAR(MAX) NOT NULL,
    notification_type NVARCHAR(50) NOT NULL, -- 'email', 'sms', 'in_app'
    status NVARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'delivered', 'read'
    scheduled_time DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    sent_time DATETIME2,
    read_time DATETIME2,
    related_entity_type NVARCHAR(50), -- 'shift', 'delivery', etc.
    related_entity_id UNIQUEIDENTIFIER,
    json_data NVARCHAR(MAX), -- For additional data needed for notifications
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Notification_User FOREIGN KEY (user_id) REFERENCES [User](user_id),
    CONSTRAINT FK_Notification_Template FOREIGN KEY (template_id) REFERENCES NotificationTemplate(template_id)
);
GO

-- ***************************************************
-- PART 10: MEAL PLANNING & FORECASTING TABLE
-- ***************************************************

-- MealPlan table
CREATE TABLE MealPlan (
    meal_plan_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    plan_name NVARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    facility_id UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'approved', 'in-progress', 'completed'
    total_meals INT NOT NULL DEFAULT 0,
    forecast_generated BIT NOT NULL DEFAULT 0,
    created_by UNIQUEIDENTIFIER NOT NULL,
    approved_by UNIQUEIDENTIFIER NULL,
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_MealPlan_Facility FOREIGN KEY (facility_id) REFERENCES Facility(facility_id),
    CONSTRAINT FK_MealPlan_CreatedBy FOREIGN KEY (created_by) REFERENCES [User](user_id),
    CONSTRAINT FK_MealPlan_ApprovedBy FOREIGN KEY (approved_by) REFERENCES [User](user_id),
    CONSTRAINT CK_MealPlan_Dates CHECK (end_date >= start_date)
);
GO

-- MealPlanItem table
CREATE TABLE MealPlanItem (
    meal_plan_item_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    meal_plan_id UNIQUEIDENTIFIER NOT NULL,
    meal_id UNIQUEIDENTIFIER NOT NULL,
    prep_date DATE NOT NULL,
    quantity INT NOT NULL,
    meal_prep_id UNIQUEIDENTIFIER NULL, -- Links to the created meal preparation once executed
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_MealPlanItem_MealPlan FOREIGN KEY (meal_plan_id) REFERENCES MealPlan(meal_plan_id),
    CONSTRAINT FK_MealPlanItem_Meal FOREIGN KEY (meal_id) REFERENCES Meal(meal_id),
    CONSTRAINT FK_MealPlanItem_MealPrep FOREIGN KEY (meal_prep_id) REFERENCES MealPreparation(meal_prep_id),
    CONSTRAINT CK_MealPlanItem_Quantity CHECK (quantity > 0)
);
GO

-- InventoryForecast table
CREATE TABLE InventoryForecast (
    forecast_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    meal_plan_id UNIQUEIDENTIFIER NOT NULL,
    inventory_item_id UNIQUEIDENTIFIER NOT NULL,
    required_quantity DECIMAL(10, 2) NOT NULL,
    current_quantity DECIMAL(10, 2) NOT NULL,
    projected_shortage DECIMAL(10, 2) NOT NULL,
    po_item_id UNIQUEIDENTIFIER NULL, -- Link to purchase order item if created
    status NVARCHAR(20) NOT NULL DEFAULT 'identified', -- 'identified', 'ordered', 'received'
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_InventoryForecast_MealPlan FOREIGN KEY (meal_plan_id) REFERENCES MealPlan(meal_plan_id),
    CONSTRAINT FK_InventoryForecast_InventoryItem FOREIGN KEY (inventory_item_id) REFERENCES InventoryItem(inventory_item_id),
    CONSTRAINT FK_InventoryForecast_POItem FOREIGN KEY (po_item_id) REFERENCES PurchaseOrderItem(po_item_id)
);
GO

-- ***************************************************
-- PART 11: INDEXES FOR PERFORMANCE
-- ***************************************************

-- User indexes
CREATE INDEX IX_User_UserType ON [User](user_type);
CREATE INDEX IX_User_Status ON [User](status);
CREATE INDEX IX_User_Role ON [User](role);
CREATE INDEX IX_User_FacilityId ON [User](facility_id);
CREATE INDEX IX_User_FullName ON [User](last_name, first_name);
CREATE INDEX IX_User_IsDriver ON [User](is_driver) WHERE is_driver = 1;

-- Recruitment indexes
CREATE INDEX IX_Recruitment_UserId ON Recruitment(user_id);
CREATE INDEX IX_Recruitment_Status ON Recruitment(status);
CREATE INDEX IX_Recruitment_ApplicationDate ON Recruitment(application_date);

-- Credentials indexes
CREATE INDEX IX_Credentials_UserId ON Credentials(user_id);
CREATE INDEX IX_Credentials_Type ON Credentials(credential_type);
CREATE INDEX IX_Credentials_Status ON Credentials(status);
CREATE INDEX IX_Credentials_ExpiryDate ON Credentials(expiry_date);

-- Roles and UserRoles indexes
CREATE INDEX IX_Roles_IsActive ON Roles(is_active);
CREATE INDEX IX_UserRoles_UserId ON UserRoles(user_id);
CREATE INDEX IX_UserRoles_RoleId ON UserRoles(role_id);
CREATE INDEX IX_UserRoles_Status ON UserRoles(status);

-- Availability indexes
CREATE INDEX IX_WeeklyAvailability_UserId_DayOfWeek ON WeeklyAvailability(user_id, day_of_week);
CREATE INDEX IX_WeeklyAvailability_EffectiveDate ON WeeklyAvailability(effective_date);
CREATE INDEX IX_AvailabilityExceptions_UserId_Date ON AvailabilityExceptions(user_id, exception_date);

-- Shift indexes
CREATE INDEX IX_Shifts_RoleId ON Shifts(role_id);
CREATE INDEX IX_Shifts_Date ON Shifts(shift_date);
CREATE INDEX IX_Shifts_Type ON Shifts(shift_type);
CREATE INDEX IX_ShiftAssignments_ShiftId ON ShiftAssignments(shift_id);
CREATE INDEX IX_ShiftAssignments_UserId ON ShiftAssignments(user_id);
CREATE INDEX IX_ShiftAssignments_Status ON ShiftAssignments(assignment_status);

-- TimeEntries indexes
CREATE INDEX IX_TimeEntries_UserId ON TimeEntries(user_id);
CREATE INDEX IX_TimeEntries_ActivityDate ON TimeEntries(activity_date);
CREATE INDEX IX_TimeEntries_Status ON TimeEntries(status);
CREATE INDEX IX_TimeEntries_ShiftAssignmentId ON TimeEntries(shift_assignment_id);

-- CareRecipient indexes
CREATE INDEX IX_CareRecipient_ServiceRouteId ON CareRecipient(service_route_id);
CREATE INDEX IX_CareRecipient_Status ON CareRecipient(status);
CREATE INDEX IX_CareRecipient_FullName ON CareRecipient(last_name, first_name);
CREATE INDEX IX_CareRecipient_ZipCode ON CareRecipient(zip_code);

-- MealPreparation indexes
CREATE INDEX IX_MealPreparation_MealId ON MealPreparation(meal_id);
CREATE INDEX IX_MealPreparation_PrepDate ON MealPreparation(prep_date);
CREATE INDEX IX_MealPreparation_FacilityId ON MealPreparation(facility_id);
CREATE INDEX IX_MealPreparation_Status ON MealPreparation(status);
CREATE INDEX IX_MealPreparation_ShiftId ON MealPreparation(shift_id);

-- Delivery indexes
CREATE INDEX IX_Delivery_RouteId ON Delivery(route_id);
CREATE INDEX IX_Delivery_DeliveryDate ON Delivery(delivery_date);
CREATE INDEX IX_Delivery_DriverUserId ON Delivery(driver_user_id);
CREATE INDEX IX_Delivery_Status ON Delivery(status);
CREATE INDEX IX_Delivery_ShiftId ON Delivery(shift_id);
CREATE INDEX IX_DeliveryItem_DeliveryId ON DeliveryItem(delivery_id);
CREATE INDEX IX_DeliveryItem_CRId ON DeliveryItem(cr_id);
CREATE INDEX IX_DeliveryItem_Status ON DeliveryItem(status);

-- PackingSheet indexes
CREATE INDEX IX_PackingSheet_FacilityId ON PackingSheet(facility_id);
CREATE INDEX IX_PackingSheet_PackingDate ON PackingSheet(packing_date);
CREATE INDEX IX_PackingSheet_Status ON PackingSheet(status);
CREATE INDEX IX_PackingSheet_ShiftId ON PackingSheet(shift_id);
CREATE INDEX IX_PackedBox_PackingSheetId ON PackedBox(packing_sheet_id);
CREATE INDEX IX_PackedBox_DeliveryId ON PackedBox(delivery_id);

-- Inventory indexes
CREATE INDEX IX_InventoryItem_CategoryId ON InventoryItem(category_id);
CREATE INDEX IX_InventoryItem_StorageLocationId ON InventoryItem(storage_location_id);
CREATE INDEX IX_InventoryItem_CurrentQuantity ON InventoryItem(current_quantity);
CREATE INDEX IX_InventoryTransaction_ItemId ON InventoryTransaction(inventory_item_id);
CREATE INDEX IX_InventoryTransaction_Type ON InventoryTransaction(transaction_type);
CREATE INDEX IX_InventoryTransaction_Date ON InventoryTransaction(transaction_date);

-- Notification indexes
CREATE INDEX IX_Notification_UserId ON Notification(user_id);
CREATE INDEX IX_Notification_Status ON Notification(status);
CREATE INDEX IX_Notification_RelatedEntity ON Notification(related_entity_type, related_entity_id);
CREATE INDEX IX_Notification_ScheduledTime ON Notification(scheduled_time);

-- MealPlan indexes
CREATE INDEX IX_MealPlan_FacilityId ON MealPlan(facility_id);
CREATE INDEX IX_MealPlan_DateRange ON MealPlan(start_date, end_date);
CREATE INDEX IX_MealPlan_Status ON MealPlan(status);
CREATE INDEX IX_MealPlanItem_MealPlanId ON MealPlanItem(meal_plan_id);
CREATE INDEX IX_MealPlanItem_MealId ON MealPlanItem(meal_id);
CREATE INDEX IX_MealPlanItem_PrepDate ON MealPlanItem(prep_date);
CREATE INDEX IX_InventoryForecast_MealPlanId ON InventoryForecast(meal_plan_id);
*/
-- ***************************************************
-- PART 12: REPORTING VIEWS
-- ***************************************************

-- View for low stock items
CREATE OR ALTER VIEW vw_LowStockItems AS
SELECT 
    i.inventory_item_id,
    i.item_name,
    i.current_quantity,
    i.minimum_quantity,
    i.unit_of_measure,
    c.name AS category_name,
    sl.name AS storage_location,
    f.name AS facility_name
FROM 
    InventoryItem i
    JOIN Category c ON i.category_id = c.category_id
    JOIN StorageLocation sl ON i.storage_location_id = sl.storage_location_id
    JOIN Facility f ON sl.facility_id = f.facility_id
WHERE 
    i.current_quantity <= i.minimum_quantity AND i.is_active = 1;
GO

-- View for upcoming deliveries
CREATE OR ALTER VIEW vw_UpcomingDeliveries AS
SELECT 
    d.delivery_id,
    d.delivery_date,
    d.status,
    sr.name AS route_name,
    f.name AS facility_name,
    u.first_name + ' ' + u.last_name AS driver_name,
    s.shift_id,
    s.start_time,
    s.end_time,
    COUNT(di.delivery_item_id) AS total_items,
    COUNT(DISTINCT di.cr_id) AS total_care_recipients
FROM 
    Delivery d
    JOIN ServiceRoute sr ON d.route_id = sr.route_id
    JOIN Facility f ON sr.facility_id = f.facility_id
    JOIN [User] u ON d.driver_user_id = u.user_id
    LEFT JOIN Shifts s ON d.shift_id = s.shift_id
    LEFT JOIN DeliveryItem di ON d.delivery_id = di.delivery_id
WHERE 
    d.delivery_date >= CAST(GETDATE() AS DATE)
    AND d.delivery_date <= DATEADD(DAY, 7, CAST(GETDATE() AS DATE))
GROUP BY 
    d.delivery_id, d.delivery_date, d.status, sr.name, f.name, 
    u.first_name, u.last_name, s.shift_id, s.start_time, s.end_time;
GO

-- View for care recipient meal history
CREATE OR ALTER VIEW vw_CareRecipientMealHistory AS
SELECT 
    cr.cr_id,
    cr.first_name + ' ' + cr.last_name AS care_recipient_name,
    d.delivery_date,
    m.name AS meal_name,
    m.meal_type,
    di.quantity,
    di.status AS delivery_status,
    u.first_name + ' ' + u.last_name AS driver_name,
    u.user_type AS driver_type
FROM 
    CareRecipient cr
    JOIN DeliveryItem di ON cr.cr_id = di.cr_id
    JOIN Delivery d ON di.delivery_id = d.delivery_id
    JOIN MealPreparation mp ON di.meal_prep_id = mp.meal_prep_id
    JOIN Meal m ON mp.meal_id = m.meal_id
    JOIN [User] u ON d.driver_user_id = u.user_id;
GO

-- View for volunteer activity summary
CREATE OR ALTER VIEW vw_UserActivitySummary AS
SELECT 
    u.user_id,
    u.first_name + ' ' + u.last_name AS user_name,
    u.user_type,
    r.role_name,
    DATEPART(YEAR, te.activity_date) AS Year,
    DATEPART(MONTH, te.activity_date) AS Month,
    COUNT(DISTINCT te.time_entry_id) AS activity_count,
    SUM(te.duration) AS total_minutes,
    COUNT(DISTINCT mp.meal_prep_id) AS meal_preps_participated,
    COUNT(DISTINCT ps.packing_sheet_id) AS packing_sessions_participated,
    COUNT(DISTINCT d.delivery_id) AS deliveries_completed,
    SUM(CASE WHEN mp.meal_prep_id IS NOT NULL THEN mp.quantity ELSE 0 END) AS meals_prepared
FROM 
    [User] u
    LEFT JOIN UserRoles ur ON u.user_id = ur.user_id
    LEFT JOIN Roles r ON ur.role_id = r.role_id
    LEFT JOIN TimeEntries te ON u.user_id = te.user_id
    LEFT JOIN ShiftAssignments sa ON te.shift_assignment_id = sa.assignment_id
    LEFT JOIN Shifts s ON sa.shift_id = s.shift_id
    LEFT JOIN MealPreparation mp ON s.shift_id = mp.shift_id
    LEFT JOIN PackingSheet ps ON s.shift_id = ps.shift_id
    LEFT JOIN Delivery d ON s.shift_id = d.shift_id
WHERE
    te.activity_date IS NOT NULL
GROUP BY
    u.user_id, u.first_name, u.last_name, u.user_type, r.role_name,
    DATEPART(YEAR, te.activity_date), DATEPART(MONTH, te.activity_date);
GO

-- View for operational efficiency metrics
CREATE OR ALTER VIEW vw_OperationalEfficiency AS
SELECT
    mp.meal_prep_id,
    m.name AS meal_name,
    mp.prep_date,
    mp.quantity AS meals_prepared,
    s.shift_id,
    COUNT(DISTINCT sa.user_id) AS staff_count,
    SUM(te.duration) AS total_prep_minutes,
    CASE WHEN COUNT(DISTINCT sa.user_id) > 0 THEN 
        mp.quantity / (SUM(te.duration) / 60.0 / COUNT(DISTINCT sa.user_id)) 
    ELSE 0 END AS meals_per_staff_hour
FROM
    MealPreparation mp
    JOIN Meal m ON mp.meal_id = m.meal_id
    LEFT JOIN Shifts s ON mp.shift_id = s.shift_id
    LEFT JOIN ShiftAssignments sa ON s.shift_id = sa.shift_id
    LEFT JOIN TimeEntries te ON sa.assignment_id = te.shift_assignment_id
WHERE
    mp.status = 'completed'
GROUP BY
    mp.meal_prep_id, m.name, mp.prep_date, mp.quantity, s.shift_id;
GO

-- View for credential expiration tracking
CREATE OR ALTER VIEW vw_CredentialExpiration AS
SELECT
    c.credential_id,
    c.credential_type,
    c.status,
    c.expiry_date,
    DATEDIFF(DAY, GETDATE(), c.expiry_date) AS days_until_expiry,
    u.user_id,
    u.first_name + ' ' + u.last_name AS user_name,
    u.user_type,
    u.email,
    u.phone,
    u.role,
    CASE
        WHEN c.expiry_date IS NULL THEN 'No Expiration'
        WHEN c.expiry_date < GETDATE() THEN 'Expired'
        WHEN DATEDIFF(DAY, GETDATE(), c.expiry_date) <= 30 THEN 'Expiring Soon'
        ELSE 'Valid'
    END AS expiration_status
FROM
    Credentials c
    JOIN [User] u ON c.user_id = u.user_id
WHERE
    u.is_active = 1
    AND (c.status = 'Approved' OR c.status = 'Pending');
GO

-- View for meal planning forecasting
CREATE OR ALTER VIEW vw_MealPlanForecastSummary AS
SELECT
    mp.meal_plan_id,
    mp.plan_name,
    mp.start_date,
    mp.end_date,
    mp.facility_id,
    f.name AS facility_name,
    mp.status AS plan_status,
    COUNT(mpi.meal_plan_item_id) AS planned_meal_types,
    SUM(mpi.quantity) AS total_planned_meals,
    COUNT(DISTINCT mpi.prep_date) AS planned_prep_days,
    COUNT(forecast.forecast_id) AS items_forecasted,
    SUM(CASE WHEN forecast.projected_shortage > 0 THEN 1 ELSE 0 END) AS items_with_shortage,
    SUM(forecast.projected_shortage) AS total_shortage_units,
    COUNT(forecast.po_item_id) AS items_ordered,
    mp.created_by,
    u.first_name + ' ' + u.last_name AS created_by_name,
    mp.created_at
FROM
    MealPlan mp
    JOIN Facility f ON mp.facility_id = f.facility_id
    JOIN [User] u ON mp.created_by = u.user_id
    LEFT JOIN MealPlanItem mpi ON mp.meal_plan_id = mpi.meal_plan_id
    LEFT JOIN InventoryForecast forecast ON mp.meal_plan_id = forecast.meal_plan_id
GROUP BY
    mp.meal_plan_id, mp.plan_name, mp.start_date, mp.end_date,
    mp.facility_id, f.name, mp.status, mp.created_by,
    u.first_name, u.last_name, mp.created_at;
GO

-- View for volunteer/staff hours by facility
CREATE OR ALTER VIEW vw_StaffingHoursByFacility AS
SELECT
    f.facility_id,
    f.name AS facility_name,
    u.user_type,
    u.role,
    CAST(te.activity_date AS VARCHAR(7)) AS month_year,
    COUNT(DISTINCT u.user_id) AS unique_users,
    SUM(te.duration) / 60.0 AS total_hours,
    AVG(te.duration) / 60.0 AS avg_hours_per_entry,
    COUNT(DISTINCT te.activity_date) AS days_with_activity,
    COUNT(DISTINCT s.shift_id) AS shift_count
FROM
    Facility f
    JOIN [User] u ON f.facility_id = u.facility_id
    JOIN TimeEntries te ON u.user_id = te.user_id
    LEFT JOIN ShiftAssignments sa ON te.shift_assignment_id = sa.assignment_id
    LEFT JOIN Shifts s ON sa.shift_id = s.shift_id
WHERE
    te.status = 'Approved'
GROUP BY
    f.facility_id, f.name, u.user_type, u.role, 
    CAST(te.activity_date AS VARCHAR(7));
GO

-- View for shift coverage gaps
CREATE OR ALTER VIEW vw_ShiftCoverageGaps AS
SELECT
    s.shift_id,
    s.shift_date,
    s.start_time,
    s.end_time,
    s.shift_type,
    r.role_name,
    s.required_headcount,
    COUNT(sa.assignment_id) AS assigned_count,
    s.required_headcount - COUNT(sa.assignment_id) AS headcount_gap,
    f.name AS facility_name,
    CASE 
        WHEN s.shift_date < GETDATE() THEN 'Past'
        WHEN s.shift_date = GETDATE() THEN 'Today'
        WHEN s.shift_date BETWEEN DATEADD(DAY, 1, GETDATE()) AND DATEADD(DAY, 7, GETDATE()) THEN 'Next 7 Days'
        WHEN s.shift_date BETWEEN DATEADD(DAY, 8, GETDATE()) AND DATEADD(DAY, 30, GETDATE()) THEN 'Next 30 Days'
        ELSE 'Future'
    END AS time_period
FROM
    Shifts s
    JOIN Roles r ON s.role_id = r.role_id
    LEFT JOIN ShiftAssignments sa ON s.shift_id = sa.shift_id AND sa.assignment_status IN ('Scheduled', 'Confirmed')
    LEFT JOIN MealPreparation mp ON s.shift_id = mp.shift_id
    LEFT JOIN PackingSheet ps ON s.shift_id = ps.shift_id
    LEFT JOIN Delivery d ON s.shift_id = d.shift_id
    LEFT JOIN Facility f ON 
        COALESCE(
            (SELECT facility_id FROM MealPreparation WHERE shift_id = s.shift_id),
            (SELECT facility_id FROM PackingSheet WHERE shift_id = s.shift_id),
            (SELECT sr.facility_id FROM Delivery d JOIN ServiceRoute sr ON d.route_id = sr.route_id WHERE d.shift_id = s.shift_id)
        ) = f.facility_id
WHERE
    s.shift_date >= DATEADD(DAY, -7, GETDATE()) -- Include recent past for analysis
GROUP BY
    s.shift_id, s.shift_date, s.start_time, s.end_time, s.shift_type, 
    r.role_name, s.required_headcount, f.name;
GO
