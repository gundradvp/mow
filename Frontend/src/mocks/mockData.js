// This file provides mock data for the application to use
// when running without a backend

export const mockRoutes = [
  {
    id: "R-452",
    name: "North Springfield",
    deliveries: ["ST7890QR12", "ST7890QR13", "ST7890QR14", "ST7890QR15"],
    status: "Active",
  },
  {
    id: "R-453",
    name: "East Springfield",
    deliveries: ["ST7891QR16", "ST7891QR17"],
    status: "Active",
  },
  {
    id: "R-454",
    name: "South Springfield",
    deliveries: ["ST7892QR18", "ST7892QR19", "ST7892QR20"],
    status: "Inactive",
  },
];

export const mockDeliveries = [
  {
    id: "ST7890QR12",
    sequenceNumber: 1,
    date: "2025-05-10",
    time: "9:00 AM - 11:00 AM",
    route: "North Springfield",
    routeNumber: "R-452",
    recipientName: "Aman Sharma",
    phoneNumber: "+1 (555) 123-4567",
    address: "201/D, Ananta Apts, Near Jal Bhawan, Andheri 400069",
    distance: "5 km",
    status: "Yet to Start",
    items: [
      { name: "Caramel Macchiato", quantity: 1, dietary: "Regular" },
      { name: "Egg Mayo Breakfast Sandwich", quantity: 2, dietary: "Regular" },
    ],
    specialInstructions:
      "Please knock loudly, recipient has hearing difficulties. Ensure food is warm when delivered.",
  },
  {
    id: "ST7890QR13",
    sequenceNumber: 2,
    date: "2025-05-10",
    time: "11:30 AM - 1:30 PM",
    route: "East Springfield",
    routeNumber: "R-452",
    recipientName: "Sarah Johnson",
    phoneNumber: "+1 (555) 234-5678",
    address: "42 Oak Street, Apartment 7B, Springfield, IL 62704",
    distance: "3.2 km",
    status: "Yet to Start",
    items: [
      { name: "Vegetable Soup", quantity: 1, dietary: "Vegetarian" },
      {
        name: "Grilled Chicken Sandwich",
        quantity: 1,
        dietary: "High-Protein",
      },
      { name: "Fresh Fruit Cup", quantity: 1, dietary: "Low-Sugar" },
    ],
    specialInstructions:
      "Leave package outside door if no answer. Text on arrival.",
  },
  {
    id: "ST7890QR14",
    sequenceNumber: 3,
    date: "2025-05-11",
    time: "10:00 AM - 12:00 PM",
    route: "West Springfield",
    routeNumber: "R-452",
    recipientName: "Robert Miller",
    phoneNumber: "+1 (555) 345-6789",
    address: "157 Pine Avenue, Springfield, IL 62701",
    distance: "4.5 km",
    status: "Pending Confirmation",
    items: [
      { name: "Turkey & Swiss Sandwich", quantity: 1, dietary: "Regular" },
      { name: "Garden Salad", quantity: 1, dietary: "Gluten-Free" },
      { name: "Apple Juice", quantity: 1, dietary: "Regular" },
    ],
    specialInstructions:
      "Recipient uses wheelchair. Please wait patiently for door to be answered.",
  },
];

export const mockVolunteers = [
  {
    id: "V001",
    name: "John Driver",
    phone: "+1 (555) 987-6543",
    email: "john.driver@example.com",
    status: "Active",
    role: "Driver",
    availability: "Weekdays",
  },
  {
    id: "V002",
    name: "Jane Volunteer",
    phone: "+1 (555) 876-5432",
    email: "jane.volunteer@example.com",
    status: "Active",
    role: "Kitchen Helper",
    availability: "Weekends",
  },
];

export const mockClients = [
  {
    id: "C001",
    name: "Aman Sharma",
    phone: "+1 (555) 123-4567",
    address: "201/D, Ananta Apts, Near Jal Bhawan, Andheri 400069",
    status: "Active",
    deliveryDays: "Monday, Wednesday, Friday",
    dietaryRestrictions: "None",
  },
  {
    id: "C002",
    name: "Sarah Johnson",
    phone: "+1 (555) 234-5678",
    address: "42 Oak Street, Apartment 7B, Springfield, IL 62704",
    status: "Active",
    deliveryDays: "Tuesday, Thursday",
    dietaryRestrictions: "Vegetarian",
  },
  {
    id: "C003",
    name: "Robert Miller",
    phone: "+1 (555) 345-6789",
    address: "157 Pine Avenue, Springfield, IL 62701",
    status: "Active",
    deliveryDays: "Monday, Wednesday, Friday",
    dietaryRestrictions: "Gluten-Free",
  },
];

export const mockNotifications = [
  {
    id: 1,
    type: "schedule_confirmation",
    message: "Please confirm your delivery for May 11, 2025",
    status: "unread",
    date: "2025-05-07",
  },
  {
    id: 2,
    type: "delivery_updated",
    message: "Route schedule updated for North Springfield route",
    status: "read",
    date: "2025-05-05",
  },
];

// Export a helper function to get mock data
export const getMockData = (collection, id) => {
  const collections = {
    routes: mockRoutes,
    deliveries: mockDeliveries,
    volunteers: mockVolunteers,
    clients: mockClients,
    notifications: mockNotifications,
  };

  if (id) {
    return collections[collection].find((item) => item.id === id) || null;
  }

  return collections[collection] || [];
};
