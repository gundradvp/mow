# Meals on Wheels Yolo County (MOWScheduler)

## Project Overview

Meals on Wheels Yolo County (MOWScheduler) is a cloud-based platform designed to streamline service delivery, volunteer coordination, and reporting for Meals on Wheels programs. The system is built to be mobile-friendly and scalable, ensuring efficient operations and compliance with HIPAA and AAA4 standards.

---

## Features

### 1. Client Management System

- **Intake & Eligibility Forms**: Capture demographic data, eligibility criteria, dietary restrictions, and service authorizations.
- **Case Notes & Documentation**: Secure, HIPAA-compliant notes and service logs.
- **Scheduling Capabilities**: Support for customized delivery schedules and packing sheet generation.

### 2. Volunteer Management System

- **Volunteer Applications & Forms**: Digital intake forms for background checks, waivers, etc.
- **Self-Serve Volunteer Portal**: Account management, shift sign-up, and automated notifications.
- **Custom Scheduling Logic**: Support unique volunteer schedules.

### 3. Operational Efficiency

- **Route Optimization**: Automated or semi-automated route building.
- **Driver App Access**: Real-time route access, delivery confirmations, and incident reporting.
- **Service Units**: Real-time updates for Home Delivered Meals and accurate tracking for Congregate Dining.

### 4. Data, Reporting & Compliance

- **Custom Reports**: Generate reports for service units, demographics, and volunteer hours.
- **Export Capability**: Ensure compatibility with GetCare.
- **Compliance Readiness**: Meet HIPAA and AAA4 standards.

### 5. Messaging & Broadcast Communication

- **Mass Notifications**: Send emails or SMS to clients and volunteers.
- **Scheduling Broadcasts**: Pre-schedule urgent alerts or updates.

---

## Technology Stack

- **Backend**: ASP.NET Core, Entity Framework Core
- **Frontend**: React.js
- **Database**: SQL Server
- **Mobile**: Mobile-friendly web design, with plans for a dedicated driver app
- **APIs**: RESTful APIs for integration and data exchange

---

## Development Plan

The project will be implemented feature by feature, starting with the **Client Management System**. Each feature will be designed to be mobile-friendly and scalable.

### Current Focus

- **Feature**: Client Management System
- **Tasks**:
  1. Add models for `IntakeForm`, `EligibilityCriteria`, and `DietaryRestrictions`.
  2. Extend `Client` model to include service authorizations.
  3. Create APIs for CRUD operations on client data.
  4. Implement scheduling logic in the `Schedule` model and controller.
  5. Design responsive forms and schedules for mobile usability.

---

## How to Run the Project

1. Clone the repository.
2. Navigate to the `Backend` folder and run the following commands:
   ```bash
   dotnet restore
   dotnet build
   dotnet run
   ```
3. Navigate to the `Frontend` folder and run the following commands:
   ```bash
   npm install
   npm start
   ```

---

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear and concise messages.
4. Submit a pull request for review.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
