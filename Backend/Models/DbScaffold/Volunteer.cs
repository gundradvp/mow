using System;
using System.Collections.Generic;

namespace MOWScheduler.Models.DbScaffold;

public partial class Volunteer
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string AvailableDays { get; set; } = null!;

    public bool IsActive { get; set; }

    public DateTime StartDate { get; set; }

    public string Notes { get; set; } = null!;

    public string Availability { get; set; } = null!;

    public string Skills { get; set; } = null!;

    public string? Address { get; set; }

    public string? City { get; set; }

    public string Email { get; set; } = null!;

    public string? EmergencyContactName { get; set; }

    public string? EmergencyContactPhone { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? PhoneNumber { get; set; }

    public string? State { get; set; }

    public string? ZipCode { get; set; }

    public bool BackgroundCheckConsent { get; set; }

    public DateTime? BackgroundCheckDate { get; set; }

    public bool CanLift20Pounds { get; set; }

    public string? EmergencyContactRelationship { get; set; }

    public bool HasCompletedBackgroundCheck { get; set; }

    public bool HasDriverLicense { get; set; }

    public bool IsWillingToDrive { get; set; }

    public string Preferences { get; set; } = null!;
}
