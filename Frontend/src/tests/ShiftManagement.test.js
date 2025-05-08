import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShiftManagement from "../pages/ShiftManagement";
import axios from "axios";

jest.mock("axios");

describe("ShiftManagement", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window.alert
    window.alert = jest.fn();
  });

  it("renders shifts and volunteers", async () => {
    // Mock API responses
    axios.get.mockImplementation((url) => {
      if (url === "/api/Shifts") {
        return Promise.resolve({
          data: [
            { id: 1, name: "Morning", startTime: "08:00", endTime: "12:00" },
            { id: 2, name: "Afternoon", startTime: "12:00", endTime: "16:00" },
          ],
        });
      } else if (url === "/api/Volunteers") {
        return Promise.resolve({
          data: [
            { id: 1, userId: "User1", skills: "Driving" },
            { id: 2, userId: "User2", skills: "Cooking" },
          ],
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    render(<ShiftManagement />);

    // Check if the heading is rendered
    expect(screen.getByText("Shift Management")).toBeInTheDocument();

    // Wait for shifts and volunteers to load
    await waitFor(() => {
      expect(screen.getByText(/Morning \(08:00 - 12:00\)/)).toBeInTheDocument();
      expect(
        screen.getByText(/Afternoon \(12:00 - 16:00\)/)
      ).toBeInTheDocument();
      expect(screen.getByText(/User1 - Driving/)).toBeInTheDocument();
      expect(screen.getByText(/User2 - Cooking/)).toBeInTheDocument();
    });

    // Check section headings
    expect(screen.getByText("Shifts")).toBeInTheDocument();
    expect(screen.getByText("Volunteers")).toBeInTheDocument();

    // Button should be disabled initially
    const assignButton = screen.getByText("Assign Volunteer to Shift");
    expect(assignButton).toBeDisabled();
  });

  it("enables the assign button when both shift and volunteer are selected", async () => {
    // Mock API responses
    axios.get.mockImplementation((url) => {
      if (url === "/api/Shifts") {
        return Promise.resolve({
          data: [
            { id: 1, name: "Morning", startTime: "08:00", endTime: "12:00" },
          ],
        });
      } else if (url === "/api/Volunteers") {
        return Promise.resolve({
          data: [{ id: 1, userId: "User1", skills: "Driving" }],
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    render(<ShiftManagement />);

    // Wait for shifts and volunteers to load
    const shiftItem = await screen.findByText(/Morning/);
    const volunteerItem = await screen.findByText(/User1/);

    // Button should be disabled initially
    const assignButton = screen.getByText("Assign Volunteer to Shift");
    expect(assignButton).toBeDisabled();

    // Select shift
    fireEvent.click(shiftItem);
    expect(assignButton).toBeDisabled();

    // Select volunteer
    fireEvent.click(volunteerItem);

    // Button should now be enabled
    expect(assignButton).not.toBeDisabled();
  });

  it("assigns a volunteer to a shift", async () => {
    // Mock API responses
    axios.get.mockImplementation((url) => {
      if (url === "/api/Shifts") {
        return Promise.resolve({
          data: [
            { id: 1, name: "Morning", startTime: "08:00", endTime: "12:00" },
          ],
        });
      } else if (url === "/api/Volunteers") {
        return Promise.resolve({
          data: [{ id: 1, userId: "User1", skills: "Driving" }],
        });
      }
      return Promise.reject(new Error("Not found"));
    });

    axios.post.mockResolvedValueOnce({});

    render(<ShiftManagement />);

    // Wait for shifts and volunteers to load
    const shiftItem = await screen.findByText(/Morning/);
    const volunteerItem = await screen.findByText(/User1/);

    // Select shift and volunteer
    fireEvent.click(shiftItem);
    fireEvent.click(volunteerItem);

    // Assign volunteer to shift
    const assignButton = screen.getByText("Assign Volunteer to Shift");
    fireEvent.click(assignButton);

    // Verify API call
    expect(axios.post).toHaveBeenCalledWith(
      "/api/Volunteers/1/assign-shift",
      1
    );

    // Verify alert was shown
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Volunteer assigned to shift successfully!"
      );
    });
  });

  it("handles API errors gracefully", async () => {
    // Mock console.error
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Mock API responses - shifts successful, volunteers fails
    axios.get.mockImplementation((url) => {
      if (url === "/api/Shifts") {
        return Promise.resolve({
          data: [
            { id: 1, name: "Morning", startTime: "08:00", endTime: "12:00" },
          ],
        });
      } else if (url === "/api/Volunteers") {
        return Promise.reject(new Error("API Error"));
      }
      return Promise.reject(new Error("Not found"));
    });

    render(<ShiftManagement />);

    // Wait for shifts to load but volunteers to fail
    await waitFor(() => {
      expect(screen.getByText(/Morning/)).toBeInTheDocument();
    });

    // Check that the error was logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching volunteers:",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
