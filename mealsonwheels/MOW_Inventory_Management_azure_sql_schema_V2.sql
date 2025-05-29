-- Azure SQL Database Schema for Meals on Wheels Inventory Management
-- SQL Server-specific syntax optimization for Azure SQL Database

-- Enable ANSI NULL defaults for the database
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Create Category table
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

-- Create Facility table
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

-- Create Storage Location table
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

-- Create Inventory Item table
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

-- Create User table
CREATE TABLE [User] (
    user_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    role NVARCHAR(20) NOT NULL,  -- admin, inventory_manager, kitchen_staff, driver, packer, route_planner
    facility_id UNIQUEIDENTIFIER NOT NULL,
    is_driver BIT NOT NULL DEFAULT 0,
    driver_license NVARCHAR(50),
    driver_license_expiry DATE,
    available_start_time TIME,
    available_end_time TIME,
    available_days NVARCHAR(50),  -- comma-separated days of week
    max_route_distance DECIMAL(8, 2),
    max_route_duration_minutes INT,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_User_Facility FOREIGN KEY (facility_id) 
        REFERENCES Facility(facility_id),
    CONSTRAINT UQ_User_Email UNIQUE (email)
);
GO

-- Create Service Route table
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

-- Create Care Recipient (CR) table
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

-- Create Supplier table
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

-- Create Purchase Order table
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

-- Create Purchase Order Item table
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

-- Create Meal table
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

-- Create Meal Ingredient table
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

-- Create Meal Preparation table
CREATE TABLE MealPreparation (
    meal_prep_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    meal_id UNIQUEIDENTIFIER NOT NULL,
    prep_date DATE NOT NULL,
    quantity INT NOT NULL,
    facility_id UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'planned',
    notes NVARCHAR(MAX),
    created_by UNIQUEIDENTIFIER NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_MealPreparation_Meal FOREIGN KEY (meal_id) 
        REFERENCES Meal(meal_id),
    CONSTRAINT FK_MealPreparation_Facility FOREIGN KEY (facility_id) 
        REFERENCES Facility(facility_id),
    CONSTRAINT FK_MealPreparation_User FOREIGN KEY (created_by) 
        REFERENCES [User](user_id),
    CONSTRAINT CK_MealPreparation_Quantity CHECK (quantity > 0)
);
GO

-- Create Meal Prep Consumption table
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

-- Create Delivery table
CREATE TABLE Delivery (
    delivery_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    route_id UNIQUEIDENTIFIER NOT NULL,
    delivery_date DATE NOT NULL,
    driver_user_id UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'planned', -- planned, in-progress, completed, cancelled, rescheduled
    start_time DATETIME2,
    end_time DATETIME2,
    vehicle_id UNIQUEIDENTIFIER NULL,
    actual_mileage DECIMAL(8, 2),
    departure_checklist_completed BIT NOT NULL DEFAULT 0,
    return_checklist_completed BIT NOT NULL DEFAULT 0,
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Delivery_ServiceRoute FOREIGN KEY (route_id) 
        REFERENCES ServiceRoute(route_id),
    CONSTRAINT FK_Delivery_User FOREIGN KEY (driver_user_id) 
        REFERENCES [User](user_id),
    CONSTRAINT FK_Delivery_Vehicle FOREIGN KEY (vehicle_id) 
        REFERENCES Vehicle(vehicle_id),
    CONSTRAINT CK_Delivery_Times CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time)
);
GO

-- Create Delivery Item table
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

-- Create Inventory Transaction table
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

-- Create Donation table
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

-- Create new tables for box packing and logistics

-- Create Vehicle table
CREATE TABLE Vehicle (
    vehicle_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    vehicle_name NVARCHAR(50) NOT NULL,
    license_plate NVARCHAR(20) NOT NULL,
    vehicle_type NVARCHAR(30) NOT NULL,
    capacity_cubic_feet DECIMAL(8, 2) NOT NULL,
    max_weight_lbs DECIMAL(8, 2) NOT NULL,
    facility_id UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'available',  -- available, in-use, maintenance, retired
    maintenance_due_date DATE,
    notes NVARCHAR(MAX),
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Vehicle_Facility FOREIGN KEY (facility_id)
        REFERENCES Facility(facility_id)
);
GO

-- Create BoxType table
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

-- Create Box table for actual inventory of boxes
CREATE TABLE Box (
    box_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    box_type_id UNIQUEIDENTIFIER NOT NULL,
    barcode NVARCHAR(50),
    status NVARCHAR(20) NOT NULL DEFAULT 'available',  -- available, in-use, cleaning, damaged, retired
    current_location_id UNIQUEIDENTIFIER,  -- FK to facility
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

-- Create PackingSheet table
CREATE TABLE PackingSheet (
    packing_sheet_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    packing_date DATE NOT NULL,
    facility_id UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'draft',  -- draft, in-progress, completed, verified
    total_meals INT NOT NULL DEFAULT 0,
    total_boxes INT NOT NULL DEFAULT 0,
    completed_by UNIQUEIDENTIFIER,  -- FK to User
    verified_by UNIQUEIDENTIFIER,   -- FK to User
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_PackingSheet_Facility FOREIGN KEY (facility_id)
        REFERENCES Facility(facility_id),
    CONSTRAINT FK_PackingSheet_CompletedBy FOREIGN KEY (completed_by)
        REFERENCES [User](user_id),
    CONSTRAINT FK_PackingSheet_VerifiedBy FOREIGN KEY (verified_by)
        REFERENCES [User](user_id)
);
GO

-- Create PackedBox table
CREATE TABLE PackedBox (
    packed_box_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    packing_sheet_id UNIQUEIDENTIFIER NOT NULL,
    box_id UNIQUEIDENTIFIER,  -- NULL if using disposable boxes
    box_type_id UNIQUEIDENTIFIER NOT NULL,
    delivery_id UNIQUEIDENTIFIER NULL,
    label_printed BIT NOT NULL DEFAULT 0,
    label_print_date DATETIME2,
    packed_by UNIQUEIDENTIFIER,  -- FK to User
    status NVARCHAR(20) NOT NULL DEFAULT 'packed',  -- packed, loaded, delivered, returned
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

-- Create PackedBoxItem table
CREATE TABLE PackedBoxItem (
    packed_box_item_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    packed_box_id UNIQUEIDENTIFIER NOT NULL,
    meal_prep_id UNIQUEIDENTIFIER NOT NULL,
    cr_id UNIQUEIDENTIFIER NOT NULL,
    delivery_item_id UNIQUEIDENTIFIER,
    quantity INT NOT NULL DEFAULT 1,
    special_instructions NVARCHAR(MAX),
    position_in_box NVARCHAR(20),  -- top, middle, bottom, etc.
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

-- Create LoadingSheet table
CREATE TABLE LoadingSheet (
    loading_sheet_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    delivery_id UNIQUEIDENTIFIER NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, in-progress, completed
    loading_start_time DATETIME2,
    loading_end_time DATETIME2,
    loaded_by UNIQUEIDENTIFIER,  -- FK to User
    verified_by UNIQUEIDENTIFIER,  -- FK to User
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

-- Create LoadingSheetItem table
CREATE TABLE LoadingSheetItem (
    loading_sheet_item_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    loading_sheet_id UNIQUEIDENTIFIER NOT NULL,
    packed_box_id UNIQUEIDENTIFIER NOT NULL,
    loading_sequence INT NOT NULL,  -- Order in which boxes should be loaded
    loading_zone NVARCHAR(20),  -- Front, middle, rear of vehicle
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

-- Create MealLabel table
CREATE TABLE MealLabel (
    meal_label_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    packed_box_item_id UNIQUEIDENTIFIER NOT NULL,
    label_template NVARCHAR(50) NOT NULL,
    print_status NVARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, printed, reprinted, error
    print_timestamp DATETIME2,
    print_count INT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_MealLabel_PackedBoxItem FOREIGN KEY (packed_box_item_id)
        REFERENCES PackedBoxItem(packed_box_item_id)
);
GO

-- Create BoxLabel table
CREATE TABLE BoxLabel (
    box_label_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    packed_box_id UNIQUEIDENTIFIER NOT NULL,
    label_template NVARCHAR(50) NOT NULL,
    print_status NVARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, printed, reprinted, error
    print_timestamp DATETIME2,
    print_count INT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_BoxLabel_PackedBox FOREIGN KEY (packed_box_id)
        REFERENCES PackedBox(packed_box_id)
);
GO

-- Create RouteLabel table
CREATE TABLE RouteLabel (

-- Create indexes for InventoryItem table
CREATE INDEX IX_InventoryItem_CategoryId ON InventoryItem(category_id);
CREATE INDEX IX_InventoryItem_StorageLocationId ON InventoryItem(storage_location_id);
CREATE INDEX IX_InventoryItem_CurrentQuantity ON InventoryItem(current_quantity);
CREATE INDEX IX_InventoryItem_IsActive ON InventoryItem(is_active);

-- Create indexes for StorageLocation table
CREATE INDEX IX_StorageLocation_FacilityId ON StorageLocation(facility_id);
CREATE INDEX IX_StorageLocation_Type ON StorageLocation(type);

-- Create indexes for Category table
CREATE INDEX IX_Category_ParentCategoryId ON Category(parent_category_id);
CREATE INDEX IX_Category_Name ON Category(name);

-- Create indexes for User table
CREATE INDEX IX_User_FacilityId ON [User](facility_id);
CREATE INDEX IX_User_Role ON [User](role);
CREATE INDEX IX_User_FullName ON [User](last_name, first_name);

-- Create indexes for Care Recipient (CR) table
CREATE INDEX IX_CareRecipient_ServiceRouteId ON CareRecipient(service_route_id);
CREATE INDEX IX_CareRecipient_Status ON CareRecipient(status);
CREATE INDEX IX_CareRecipient_FullName ON CareRecipient(last_name, first_name);
CREATE INDEX IX_CareRecipient_ZipCode ON CareRecipient(zip_code);

-- Create indexes for ServiceRoute table
CREATE INDEX IX_ServiceRoute_FacilityId ON ServiceRoute(facility_id);

-- Create indexes for Supplier table
CREATE INDEX IX_Supplier_IsActive ON Supplier(is_active);
CREATE INDEX IX_Supplier_Name ON Supplier(name);

-- Create indexes for PurchaseOrder table
CREATE INDEX IX_PurchaseOrder_SupplierId ON PurchaseOrder(supplier_id);
CREATE INDEX IX_PurchaseOrder_Status ON PurchaseOrder(status);
CREATE INDEX IX_PurchaseOrder_OrderDate ON PurchaseOrder(order_date);
CREATE INDEX IX_PurchaseOrder_ExpectedDeliveryDate ON PurchaseOrder(expected_delivery_date);
CREATE INDEX IX_PurchaseOrder_CreatedBy ON PurchaseOrder(created_by);

-- Create indexes for PurchaseOrderItem table
CREATE INDEX IX_PurchaseOrderItem_PoId ON PurchaseOrderItem(po_id);
CREATE INDEX IX_PurchaseOrderItem_InventoryItemId ON PurchaseOrderItem(inventory_item_id);

-- Create indexes for Meal table
CREATE INDEX IX_Meal_Type ON Meal(meal_type);
CREATE INDEX IX_Meal_IsActive ON Meal(is_active);

-- Create indexes for MealIngredient table
CREATE INDEX IX_MealIngredient_MealId ON MealIngredient(meal_id);
CREATE INDEX IX_MealIngredient_InventoryItemId ON MealIngredient(inventory_item_id);

-- Create indexes for MealPreparation table
CREATE INDEX IX_MealPreparation_MealId ON MealPreparation(meal_id);
CREATE INDEX IX_MealPreparation_PrepDate ON MealPreparation(prep_date);
CREATE INDEX IX_MealPreparation_FacilityId ON MealPreparation(facility_id);
CREATE INDEX IX_MealPreparation_Status ON MealPreparation(status);
CREATE INDEX IX_MealPreparation_CreatedBy ON MealPreparation(created_by);

-- Create indexes for MealPrepConsumption table
CREATE INDEX IX_MealPrepConsumption_MealPrepId ON MealPrepConsumption(meal_prep_id);
CREATE INDEX IX_MealPrepConsumption_InventoryItemId ON MealPrepConsumption(inventory_item_id);

-- Create indexes for Delivery table
CREATE INDEX IX_Delivery_RouteId ON Delivery(route_id);
CREATE INDEX IX_Delivery_DeliveryDate ON Delivery(delivery_date);
CREATE INDEX IX_Delivery_DriverUserId ON Delivery(driver_user_id);
CREATE INDEX IX_Delivery_Status ON Delivery(status);

-- Create indexes for DeliveryItem table
CREATE INDEX IX_DeliveryItem_DeliveryId ON DeliveryItem(delivery_id);
CREATE INDEX IX_DeliveryItem_CRId ON DeliveryItem(cr_id);
CREATE INDEX IX_DeliveryItem_MealPrepId ON DeliveryItem(meal_prep_id);
CREATE INDEX IX_DeliveryItem_Status ON DeliveryItem(status);
CREATE INDEX IX_DeliveryItem_DeliveryTime ON DeliveryItem(delivery_time);

-- Create indexes for InventoryTransaction table
CREATE INDEX IX_InventoryTransaction_InventoryItemId ON InventoryTransaction(inventory_item_id);
CREATE INDEX IX_InventoryTransaction_TransactionType ON InventoryTransaction(transaction_type);
CREATE INDEX IX_InventoryTransaction_TransactionDate ON InventoryTransaction(transaction_date);
CREATE INDEX IX_InventoryTransaction_PoId ON InventoryTransaction(po_id);
CREATE INDEX IX_InventoryTransaction_MealPrepId ON InventoryTransaction(meal_prep_id);
CREATE INDEX IX_InventoryTransaction_UserId ON InventoryTransaction(user_id);

-- Create indexes for Donation table
CREATE INDEX IX_Donation_InventoryItemId ON Donation(inventory_item_id);
CREATE INDEX IX_Donation_CategoryId ON Donation(category_id);
CREATE INDEX IX_Donation_DonationDate ON Donation(donation_date);
CREATE INDEX IX_Donation_ReceivedBy ON Donation(received_by);

-- Create commonly used composite indexes for performance
CREATE INDEX IX_CareRecipient_RouteStatus ON CareRecipient(service_route_id, status);
CREATE INDEX IX_DeliveryItem_DeliveryCR ON DeliveryItem(delivery_id, cr_id);
CREATE INDEX IX_MealPrep_FacilityDate ON MealPreparation(facility_id, prep_date);
CREATE INDEX IX_StorageLocation_FacilityType ON StorageLocation(facility_id, type);
CREATE INDEX IX_InventoryTransaction_ItemDate ON InventoryTransaction(inventory_item_id, transaction_date);
CREATE INDEX IX_PurchaseOrder_SupplierStatus ON PurchaseOrder(supplier_id, status);
CREATE INDEX IX_Delivery_DateStatus ON Delivery(delivery_date, status);

-- Create useful views for reporting

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
    COUNT(di.delivery_item_id) AS total_items,
    COUNT(DISTINCT di.cr_id) AS total_care_recipients
FROM 
    Delivery d
    JOIN ServiceRoute sr ON d.route_id = sr.route_id
    JOIN Facility f ON sr.facility_id = f.facility_id
    JOIN [User] u ON d.driver_user_id = u.user_id
    LEFT JOIN DeliveryItem di ON d.delivery_id = di.delivery_id
WHERE 
    d.delivery_date >= CAST(GETDATE() AS DATE)
    AND d.delivery_date <= DATEADD(DAY, 7, CAST(GETDATE() AS DATE))
GROUP BY 
    d.delivery_id, d.delivery_date, d.status, sr.name, f.name, u.first_name, u.last_name;
GO

-- View for inventory valuation
CREATE OR ALTER VIEW vw_InventoryValuation AS
WITH LastPurchasePrice AS (
    SELECT 
        poi.inventory_item_id,
        MAX(po.order_date) AS last_order_date,
        poi.unit_price
    FROM 
        PurchaseOrderItem poi
        JOIN PurchaseOrder po ON poi.po_id = po.po_id
    WHERE 
        po.status = 'completed'
    GROUP BY 
        poi.inventory_item_id, poi.unit_price
)
SELECT 
    i.inventory_item_id,
    i.item_name,
    c.name AS category_name,
    sl.name AS storage_location,
    f.name AS facility_name,
    i.current_quantity,
    i.unit_of_measure,
    ISNULL(lpp.unit_price, 0) AS unit_price,
    i.current_quantity * ISNULL(lpp.unit_price, 0) AS total_value
FROM 
    InventoryItem i
    JOIN Category c ON i.category_id = c.category_id
    JOIN StorageLocation sl ON i.storage_location_id = sl.storage_location_id
    JOIN Facility f ON sl.facility_id = f.facility_id
    LEFT JOIN LastPurchasePrice lpp ON i.inventory_item_id = lpp.inventory_item_id
WHERE 
    i.is_active = 1
    AND i.current_quantity > 0;
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
    di.status AS delivery_status
FROM 
    CareRecipient cr
    JOIN DeliveryItem di ON cr.cr_id = di.cr_id
    JOIN Delivery d ON di.delivery_id = d.delivery_id
    JOIN MealPreparation mp ON di.meal_prep_id = mp.meal_prep_id
    JOIN Meal m ON mp.meal_id = m.meal_id
ORDER BY 
    cr.cr_id, d.delivery_date DESC;
GO

-- View for consumption trends
CREATE OR ALTER VIEW vw_ConsumptionTrends AS
SELECT 
    i.inventory_item_id,
    i.item_name,
    c.name AS category_name,
    DATEPART(YEAR, it.transaction_date) AS year,
    DATEPART(MONTH, it.transaction_date) AS month,
    SUM(CASE WHEN it.transaction_type = 'consumption' THEN it.quantity ELSE 0 END) AS total_consumption,
    COUNT(DISTINCT CASE WHEN it.transaction_type = 'consumption' THEN it.transaction_id END) AS consumption_count,
    AVG(CASE WHEN it.transaction_type = 'consumption' THEN it.quantity ELSE NULL END) AS avg_consumption_per_transaction
FROM 
    InventoryItem i
    JOIN Category c ON i.category_id = c.category_id
    JOIN InventoryTransaction it ON i.inventory_item_id = it.inventory_item_id
WHERE 
    it.transaction_date >= DATEADD(YEAR, -1, GETDATE())
GROUP BY 
    i.inventory_item_id, i.item_name, c.name, DATEPART(YEAR, it.transaction_date), DATEPART(MONTH, it.transaction_date);
GO