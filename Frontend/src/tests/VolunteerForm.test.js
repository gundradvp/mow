import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VolunteerForm from "../pages/VolunteerForm";
import axios from "axios";

// Mock react-router-dom's useNavigate function
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("axios");

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("VolunteerForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form for creating a new volunteer", () => {
    renderWithRouter(<VolunteerForm />);

    expect(screen.getByText("Add Volunteer")).toBeInTheDocument();
    expect(screen.getByLabelText(/User ID:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Availability:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Skills:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
  });

  it("submits the form to create a new volunteer", async () => {
    axios.post.mockResolvedValueOnce({});

    renderWithRouter(<VolunteerForm />);

    fireEvent.change(screen.getByLabelText(/User ID:/i), {
      target: { value: "User1" },
    });
    fireEvent.change(screen.getByLabelText(/Availability:/i), {
      target: { value: "Weekdays" },
    });
    fireEvent.change(screen.getByLabelText(/Skills:/i), {
      target: { value: "Driving" },
    });

    fireEvent.submit(screen.getByRole("form"));

    expect(axios.post).toHaveBeenCalledWith("/api/Volunteers", {
      userId: "User1",
      availability: "Weekdays",
      skills: "Driving",
    });
  });

  it("renders the form for editing an existing volunteer", () => {
    const volunteer = {
      id: 1,
      userId: "User1",
      availability: "Weekdays",
      skills: "Driving",
    };

    renderWithRouter(<VolunteerForm volunteer={volunteer} />);

    expect(screen.getByText("Edit Volunteer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("User1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Weekdays")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Driving")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
  });

  it("submits the form to update an existing volunteer", async () => {
    const volunteer = {
      id: 1,
      userId: "User1",
      availability: "Weekdays",
      skills: "Driving",
    };
    axios.put.mockResolvedValueOnce({});

    renderWithRouter(<VolunteerForm volunteer={volunteer} />);

    fireEvent.change(screen.getByLabelText(/Availability:/i), {
      target: { value: "Weekends" },
    });
    fireEvent.submit(screen.getByRole("form"));

    expect(axios.put).toHaveBeenCalledWith("/api/Volunteers/1", {
      userId: "User1",
      availability: "Weekends",
      skills: "Driving",
    });
  });

  it("handles API errors gracefully when creating", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    axios.post.mockRejectedValueOnce(new Error("API Error"));

    renderWithRouter(<VolunteerForm />);

    fireEvent.change(screen.getByLabelText(/User ID:/i), {
      target: { value: "User1" },
    });
    fireEvent.change(screen.getByLabelText(/Availability:/i), {
      target: { value: "Weekdays" },
    });
    fireEvent.change(screen.getByLabelText(/Skills:/i), {
      target: { value: "Driving" },
    });

    fireEvent.submit(screen.getByRole("form"));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
