# Staff and Volunteer Management System Data Model

## SQL Database Schema (Azure SQL)

```sql
-- Users table (staff and volunteers)
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Phone NVARCHAR(20),
    Address NVARCHAR(200),
    City NVARCHAR(50),
    State NVARCHAR(2),
    ZipCode NVARCHAR(10),
    UserType NVARCHAR(20) NOT NULL CHECK (UserType IN ('Staff', 'Volunteer')),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Active', 'Inactive', 'Rejected')),
    RegistrationDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    EmergencyContact NVARCHAR(MAX),
    ProfilePicture NVARCHAR(255),
    Notes NVARCHAR(MAX),
    JsonData NVARCHAR(MAX)
);

-- Recruitment table
CREATE TABLE Recruitment (
    RecruitmentID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    Source NVARCHAR(50) NOT NULL,
    ReferredBy INT FOREIGN KEY REFERENCES Users(UserID),
    ApplicationDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    InterviewDate DATETIME2,
    InterviewNotes NVARCHAR(MAX),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Applied' CHECK (Status IN ('Applied', 'Interviewed', 'Approved', 'Rejected')),
    JsonData NVARCHAR(MAX)
);

-- Background Check and Credentials table
CREATE TABLE Credentials (
    CredentialID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    CredentialType NVARCHAR(50) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Approved', 'Rejected', 'Expired')),
    IssuedDate DATE,
    ExpiryDate DATE,
    VerificationDate DATE,
    DocumentURL NVARCHAR(255),
    Notes NVARCHAR(MAX),
    JsonData NVARCHAR(MAX)
);

-- Roles table
CREATE TABLE Roles (
    RoleID INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    RequiredCredentials NVARCHAR(MAX),
    MinimumCommitment INT, -- in hours
    Department NVARCHAR(50),
    IsActive BIT NOT NULL DEFAULT 1,
    JsonData NVARCHAR(MAX)
);

-- User Roles (many-to-many relationship)
CREATE TABLE UserRoles (
    UserRoleID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    RoleID INT NOT NULL FOREIGN KEY REFERENCES Roles(RoleID),
    AssignmentDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Interested' CHECK (Status IN ('Interested', 'Training', 'Qualified', 'Active', 'Inactive')),
    Notes NVARCHAR(MAX),
    JsonData NVARCHAR(MAX),
    CONSTRAINT UQ_UserRole UNIQUE (UserID, RoleID)
);

-- Regular Weekly Availability
CREATE TABLE WeeklyAvailability (
    AvailabilityID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    DayOfWeek TINYINT NOT NULL CHECK (DayOfWeek BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    EffectiveDate DATE NOT NULL DEFAULT GETDATE(),
    ExpiryDate DATE,
    IsActive BIT NOT NULL DEFAULT 1,
    JsonData NVARCHAR(MAX),
    CONSTRAINT CHK_TimeRange CHECK (StartTime < EndTime)
);

-- Availability Exceptions (for specific dates)
CREATE TABLE AvailabilityExceptions (
    ExceptionID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    ExceptionDate DATE NOT NULL,
    IsAvailable BIT NOT NULL,
    StartTime TIME,
    EndTime TIME,
    Reason NVARCHAR(255),
    CreatedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    JsonData NVARCHAR(MAX),
    CONSTRAINT CHK_TimeRangeException CHECK (IsAvailable = 0 OR (StartTime < EndTime))
);

-- Time Entries for tracking work
CREATE TABLE TimeEntries (
    TimeEntryID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    RoleID INT FOREIGN KEY REFERENCES Roles(RoleID),
    ActivityDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    Duration AS DATEDIFF(MINUTE, StartTime, EndTime),
    Description NVARCHAR(MAX),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Submitted' CHECK (Status IN ('Draft', 'Submitted', 'Approved', 'Rejected')),
    SubmittedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    ApprovedBy INT FOREIGN KEY REFERENCES Users(UserID),
    ApprovedDate DATETIME2,
    JsonData NVARCHAR(MAX),
    CONSTRAINT CHK_TimeEntryRange CHECK (StartTime < EndTime)
);

-- Shifts table (scheduled work periods)
CREATE TABLE Shifts (
    ShiftID INT IDENTITY(1,1) PRIMARY KEY,
    RoleID INT NOT NULL FOREIGN KEY REFERENCES Roles(RoleID),
    ShiftDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    RequiredHeadcount INT NOT NULL DEFAULT 1,
    Notes NVARCHAR(MAX),
    JsonData NVARCHAR(MAX),
    CONSTRAINT CHK_ShiftTimeRange CHECK (StartTime < EndTime)
);

-- User Shift Assignments
CREATE TABLE ShiftAssignments (
    AssignmentID INT IDENTITY(1,1) PRIMARY KEY,
    ShiftID INT NOT NULL FOREIGN KEY REFERENCES Shifts(ShiftID),
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    AssignmentStatus NVARCHAR(20) NOT NULL DEFAULT 'Scheduled' CHECK (AssignmentStatus IN ('Invited', 'Scheduled', 'Confirmed', 'Declined', 'Completed', 'No-Show')),
    AssignedDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    ConfirmedDate DATETIME2,
    Notes NVARCHAR(MAX),
    JsonData NVARCHAR(MAX),
    CONSTRAINT UQ_ShiftUser UNIQUE (ShiftID, UserID)
);

-- Index creation for performance
CREATE INDEX IX_Users_Status ON Users(Status);
CREATE INDEX IX_Users_UserType ON Users(UserType);
CREATE INDEX IX_Recruitment_Status ON Recruitment(Status);
CREATE INDEX IX_Credentials_UserID ON Credentials(UserID);
CREATE INDEX IX_Credentials_ExpiryDate ON Credentials(ExpiryDate);
CREATE INDEX IX_WeeklyAvailability_UserID_DayOfWeek ON WeeklyAvailability(UserID, DayOfWeek);
CREATE INDEX IX_AvailabilityExceptions_UserID_ExceptionDate ON AvailabilityExceptions(UserID, ExceptionDate);
CREATE INDEX IX_TimeEntries_UserID_ActivityDate ON TimeEntries(UserID, ActivityDate);
CREATE INDEX IX_Shifts_ShiftDate ON Shifts(ShiftDate);
CREATE INDEX IX_ShiftAssignments_ShiftID ON ShiftAssignments(ShiftID);
CREATE INDEX IX_ShiftAssignments_UserID ON ShiftAssignments(UserID);
```

## JSON Schema Definitions

```json
{
  "Users": {
    "type": "object",
    "properties": {
      "demographicInfo": {
        "type": "object",
        "properties": {
          "birthDate": { "type": "string", "format": "date" },
          "gender": { "type": "string" },
          "ethnicity": { "type": "string" },
          "preferredLanguages": { "type": "array", "items": { "type": "string" } }
        }
      },
      "onboardingStatus": {
        "type": "object",
        "properties": {
          "stepsCompleted": { "type": "array", "items": { "type": "string" } },
          "pendingSteps": { "type": "array", "items": { "type": "string" } },
          "lastUpdated": { "type": "string", "format": "date-time" }
        }
      },
      "skills": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "skillName": { "type": "string" },
            "proficiencyLevel": { "type": "string", "enum": ["Beginner", "Intermediate", "Advanced", "Expert"] },
            "yearsExperience": { "type": "number" },
            "certification": { "type": "boolean" }
          }
        }
      },
      "preferences": {
        "type": "object",
        "properties": {
          "maxHoursPerWeek": { "type": "number" },
          "preferredDepartments": { "type": "array", "items": { "type": "string" } },
          "remoteOnly": { "type": "boolean" },
          "notifications": {
            "type": "object",
            "properties": {
              "email": { "type": "boolean" },
              "sms": { "type": "boolean" },
              "app": { "type": "boolean" }
            }
          }
        }
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      }
    }
  },

  "Recruitment": {
    "type": "object",
    "properties": {
      "resume": { "type": "string", "format": "uri" },
      "coverLetter": { "type": "string" },
      "interviewers": { 
        "type": "array", 
        "items": { 
          "type": "object",
          "properties": {
            "userId": { "type": "integer" },
            "feedback": { "type": "string" },
            "rating": { "type": "integer", "minimum": 1, "maximum": 5 }
          }
        }
      },
      "screeningQuestions": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "question": { "type": "string" },
            "answer": { "type": "string" },
            "score": { "type": "integer" }
          }
        }
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      }
    }
  },

  "Credentials": {
    "type": "object",
    "properties": {
      "issuer": { "type": "string" },
      "verificationDetails": {
        "type": "object",
        "properties": {
          "method": { "type": "string" },
          "verifiedBy": { "type": "integer" },
          "referenceNumber": { "type": "string" }
        }
      },
      "attachments": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "fileName": { "type": "string" },
            "fileType": { "type": "string" },
            "uploadDate": { "type": "string", "format": "date-time" },
            "fileUrl": { "type": "string", "format": "uri" }
          }
        }
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      }
    }
  },

  "Roles": {
    "type": "object",
    "properties": {
      "skillRequirements": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "skillName": { "type": "string" },
            "minimumLevel": { "type": "string" },
            "isRequired": { "type": "boolean" }
          }
        }
      },
      "trainingModules": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "moduleId": { "type": "string" },
            "moduleName": { "type": "string" },
            "isRequired": { "type": "boolean" },
            "estimatedHours": { "type": "number" }
          }
        }
      },
      "schedule": {
        "type": "object",
        "properties": {
          "recurringDays": { "type": "array", "items": { "type": "integer", "minimum": 0, "maximum": 6 } },
          "typicalHours": {
            "type": "object",
            "properties": {
              "start": { "type": "string", "format": "time" },
              "end": { "type": "string", "format": "time" }
            }
          },
          "flexibility": { "type": "string", "enum": ["Fixed", "Flexible", "Very Flexible"] }
        }
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      }
    }
  },

  "UserRoles": {
    "type": "object",
    "properties": {
      "trainingProgress": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "moduleId": { "type": "string" },
            "status": { "type": "string", "enum": ["Not Started", "In Progress", "Completed"] },
            "completionDate": { "type": "string", "format": "date" },
            "score": { "type": "number" }
          }
        }
      },
      "assessments": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "assessmentDate": { "type": "string", "format": "date" },
            "assessedBy": { "type": "integer" },
            "rating": { "type": "integer", "minimum": 1, "maximum": 5 },
            "feedback": { "type": "string" }
          }
        }
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      }
    }
  },

  "WeeklyAvailability": {
    "type": "object",
    "properties": {
      "recurrence": {
        "type": "object",
        "properties": {
          "frequency": { "type": "string", "enum": ["Weekly", "Biweekly", "Monthly"] },
          "interval": { "type": "integer", "minimum": 1 },
          "untilDate": { "type": "string", "format": "date" }
        }
      },
      "location": { "type": "string", "enum": ["Onsite", "Remote", "Either"] },
      "notes": { "type": "string" },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      }
    }
  },

  "AvailabilityExceptions": {
    "type": "object",
    "properties": {
      "recurrenceId": { "type": "integer" },
      "notificationSent": { "type": "boolean" },
      "notificationSentDate": { "type": "string", "format": "date-time" },
      "approvedBy": { "type": "integer" },
      "approvedDate": { "type": "string", "format": "date-time" },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      }
    }
  },

  "TimeEntries": {
    "type": "object",
    "properties": {
      "breakTime": { "type": "integer" },
      "location": { "type": "string", "enum": ["Onsite", "Remote"] },
      "projects": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "projectId": { "type": "string" },
            "projectName": { "type": "string" },
            "allocatedMinutes": { "type": "integer" }
          }
        }
      },
      "attachments": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "fileName": { "type": "string" },
            "fileType": { "type": "string" },
            "uploadDate": { "type": "string", "format": "date-time" },
            "fileUrl": { "type": "string", "format": "uri" }
          }
        }
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      }
    }
  },

  "Shifts": {
    "type": "object",
    "properties": {
      "location": { 
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "address": { "type": "string" },
          "room": { "type": "string" },
          "virtualLink": { "type": "string", "format": "uri" }
        }
      },
      "skillRequirements": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "skillName": { "type": "string" },
            "minimumLevel": { "type": "string" }
          }
        }
      },
      "recurrence": {
        "type": "object",
        "properties": {
          "pattern": { "type": "string", "enum": ["Once", "Daily", "Weekly", "Monthly"] },
          "interval": { "type": "integer" },
          "endDate": { "type": "string", "format": "date" },
          "occurrences": { "type": "integer" }
        }
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      }
    }
  },

  "ShiftAssignments": {
    "type": "object",
    "properties": {
      "checkinTime": { "type": "string", "format": "time" },
      "checkoutTime": { "type": "string", "format": "time" },
      "feedback": {
        "type": "object",
        "properties": {
          "rating": { "type": "integer", "minimum": 1, "maximum": 5 },
          "comments": { "type": "string" }
        }
      },
      "notificationHistory": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "notificationType": { "type": "string" },
            "sentDate": { "type": "string", "format": "date-time" },
            "status": { "type": "string" }
          }
        }
      },
      "customFields": {
        "type": "object",
        "additionalProperties": true
      }
    }
  }
}
```

## Key Features of This Data Model

1. **User Management**
   - Comprehensive user profiles for both staff and volunteers
   - Detailed demographic and contact information
   - Extensible JSON fields for custom attributes

2. **Recruitment Process**
   - Tracks applications from initial contact through hiring
   - Interview management and feedback
   - Source tracking and referral information

3. **Credentials & Background Checks**
   - Manages multiple credential types (background checks, certifications, etc.)
   - Expiration tracking and renewal notifications
   - Document attachments and verification details

4. **Role Management**
   - Defines various positions with detailed descriptions
   - Tracks required skills and credentials
   - Supports training and qualification tracking

5. **Availability Management**
   - Regular weekly availability patterns
   - Exception handling for date-specific changes
   - Recurrence patterns for schedule rotation

6. **Time Tracking**
   - Detailed time entry system with role association
   - Approval workflow
   - Support for projects and location tracking

7. **Shift Scheduling**
   - Creates shifts based on roles and requirements
   - Assigns users to shifts with confirmation tracking
   - Handles recurring shift patterns

8. **Extensibility**
   - JSON fields in each table allow for future expansion
   - Custom fields support organization-specific needs
   - Flexible schema evolution without database structure changes