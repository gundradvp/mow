import React, { useEffect, useState } from "react";
import axios from "axios";

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  useEffect(() => {
    // Fetch shifts and volunteers from the backend
    axios
      .get("/api/Shifts")
      .then((response) => setShifts(response.data))
      .catch((error) => console.error("Error fetching shifts:", error));

    axios
      .get("/api/Volunteers")
      .then((response) => setVolunteers(response.data))
      .catch((error) => console.error("Error fetching volunteers:", error));
  }, []);

  const assignVolunteerToShift = () => {
    if (selectedShift && selectedVolunteer) {
      axios
        .post(
          `/api/Volunteers/${selectedVolunteer}/assign-shift`,
          selectedShift
        )
        .then(() => alert("Volunteer assigned to shift successfully!"))
        .catch((error) =>
          console.error("Error assigning volunteer to shift:", error)
        );
    }
  };

  return (
    <div>
      <h1>Shift Management</h1>

      <div>
        <h2>Shifts</h2>
        <ul>
          {shifts.map((shift) => (
            <li key={shift.id} onClick={() => setSelectedShift(shift.id)}>
              {shift.name} ({shift.startTime} - {shift.endTime})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Volunteers</h2>
        <ul>
          {volunteers.map((volunteer) => (
            <li
              key={volunteer.id}
              onClick={() => setSelectedVolunteer(volunteer.id)}
            >
              {volunteer.userId} - {volunteer.skills}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={assignVolunteerToShift}
        disabled={!selectedShift || !selectedVolunteer}
      >
        Assign Volunteer to Shift
      </button>
    </div>
  );
};

export default ShiftManagement;
