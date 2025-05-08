import { render, screen } from "@testing-library/react";
import VolunteerList from "../pages/VolunteerList";
import axios from "axios";

jest.mock("axios");

describe("VolunteerList", () => {
  it("renders a list of volunteers", async () => {
    // Mock API response
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, userId: "User1", availability: "Weekdays", skills: "Driving" },
        { id: 2, userId: "User2", availability: "Weekends", skills: "Cooking" },
      ],
    });

    render(<VolunteerList />);

    // Check if the heading is rendered
    expect(screen.getByText("Volunteer List")).toBeInTheDocument();

    // Wait for volunteers to load
    const volunteerItems = await screen.findAllByRole("listitem");
    expect(volunteerItems).toHaveLength(2);
    expect(volunteerItems[0]).toHaveTextContent("User1 - Weekdays - Driving");
    expect(volunteerItems[1]).toHaveTextContent("User2 - Weekends - Cooking");
  });

  it("displays no volunteers when list is empty", async () => {
    // Mock API response with empty array
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<VolunteerList />);

    // Check if the heading is rendered
    expect(screen.getByText("Volunteer List")).toBeInTheDocument();

    // There should be no list items
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("handles API errors gracefully", async () => {
    // Mock console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Mock API error
    axios.get.mockRejectedValueOnce(new Error("API Error"));

    render(<VolunteerList />);

    // Check if the heading is rendered despite API error
    expect(screen.getByText("Volunteer List")).toBeInTheDocument();

    // Wait for axios call to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify error was logged
    expect(console.error).toHaveBeenCalled();

    // Restore console.error
    console.error = originalConsoleError;
  });
});
