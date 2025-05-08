import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  useMediaQuery,
  Paper,
  Badge,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterActive, setFilterActive] = useState("all");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // Fetch volunteers from the backend
    setLoading(true);
    axios
      .get("/api/Volunteers")
      .then((response) => {
        const volunteersWithDetails = response.data.map((volunteer) => ({
          ...volunteer,
          // Add some default values for fields that might be missing in the API response
          firstName: volunteer.firstName || "First",
          lastName: volunteer.lastName || "Last",
          email: volunteer.email || "email@example.com",
          phone: volunteer.phoneNumber || "555-123-4567",
          location: volunteer.address || "Local Area",
          status: volunteer.isActive ? "Active" : "Inactive",
          profileImage: `https://i.pravatar.cc/150?u=${volunteer.id}`, // Random avatar based on id
        }));
        setVolunteers(volunteersWithDetails);
        setFilteredVolunteers(volunteersWithDetails);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching volunteers:", error);
        setLoading(false);
        // For demonstration purposes, add some mock data when API fails
        const mockData = Array(9)
          .fill()
          .map((_, index) => ({
            id: index + 1,
            firstName: `Volunteer${index + 1}`,
            lastName: `Last${index + 1}`,
            email: `volunteer${index + 1}@example.com`,
            phoneNumber: `555-123-${1000 + index}`,
            address: `${index + 100} Main St`,
            city: "Springfield",
            state: "IL",
            skills:
              index % 2 === 0
                ? "Driving, Cooking, Administration"
                : "Cooking, Phone Calls, Delivery",
            availability:
              index % 3 === 0
                ? "Weekdays, Mornings"
                : index % 3 === 1
                ? "Weekends, Afternoons"
                : "Monday, Wednesday, Friday",
            isActive: index % 5 !== 0,
            profileImage: `https://i.pravatar.cc/150?u=${index + 1}`,
            phone: `555-123-${1000 + index}`,
            location: `${index + 100} Main St, Springfield`,
            status: index % 5 !== 0 ? "Active" : "Inactive",
          }));
        setVolunteers(mockData);
        setFilteredVolunteers(mockData);
      });
  }, []);

  useEffect(() => {
    // Filter and sort volunteers
    let result = [...volunteers];

    // Apply status filter
    if (filterActive !== "all") {
      result = result.filter((vol) =>
        filterActive === "active"
          ? vol.status === "Active"
          : vol.status !== "Active"
      );
    }

    // Apply search term
    if (searchTerm) {
      result = result.filter(
        (volunteer) =>
          volunteer.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          volunteer.lastName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          volunteer.skills?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
        case "location":
          return (a.location || "").localeCompare(b.location || "");
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });

    setFilteredVolunteers(result);
  }, [searchTerm, volunteers, sortBy, filterActive]);

  const handleAddVolunteer = () => {
    navigate("/volunteer/new");
  };

  const handleVolunteerClick = (volunteerId) => {
    navigate(`/volunteer/${volunteerId}`);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleFilterChange = (newFilter) => {
    setFilterActive(newFilter);
  };

  const getStatusBadgeColor = (status) => {
    return status === "Active" ? "success" : "default";
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 4,
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "medium" }}
        >
          Volunteers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddVolunteer}
          sx={{
            borderRadius: "8px",
            px: 3,
            py: 1,
            fontWeight: "bold",
          }}
        >
          Add Volunteer
        </Button>
      </Box>

      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: "12px",
          background: theme.palette.background.paper,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search volunteers by name, email or skills"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: "8px" },
              }}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FilterIcon sx={{ mr: 1, color: "text.secondary" }} />
              <Box sx={{ minWidth: 120 }}>
                <Button
                  color={filterActive === "all" ? "primary" : "inherit"}
                  onClick={() => handleFilterChange("all")}
                  size="small"
                >
                  All
                </Button>
                <Button
                  color={filterActive === "active" ? "primary" : "inherit"}
                  onClick={() => handleFilterChange("active")}
                  size="small"
                >
                  Active
                </Button>
                <Button
                  color={filterActive === "inactive" ? "primary" : "inherit"}
                  onClick={() => handleFilterChange("inactive")}
                  size="small"
                >
                  Inactive
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <SortIcon sx={{ mr: 1, color: "text.secondary" }} />
              <Box>
                <Button
                  color={sortBy === "name" ? "primary" : "inherit"}
                  onClick={() => handleSortChange("name")}
                  size="small"
                >
                  Name
                </Button>
                <Button
                  color={sortBy === "location" ? "primary" : "inherit"}
                  onClick={() => handleSortChange("location")}
                  size="small"
                >
                  Location
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredVolunteers.length === 0 ? (
        <Paper sx={{ textAlign: "center", my: 4, p: 4, borderRadius: "12px" }}>
          <Typography variant="h6">No volunteers found</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Try adjusting your search or filter settings
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddVolunteer}
          >
            Add a new volunteer
          </Button>
        </Paper>
      ) : (
        <>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Showing {filteredVolunteers.length} volunteer
            {filteredVolunteers.length !== 1 ? "s" : ""}
          </Typography>
          <Grid container spacing={3}>
            {filteredVolunteers.map((volunteer) => (
              <Grid item xs={12} sm={6} md={4} key={volunteer.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                      cursor: "pointer",
                    },
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                  onClick={() => handleVolunteerClick(volunteer.id)}
                >
                  <Box
                    sx={{
                      bgcolor: theme.palette.primary.light,
                      height: "8px",
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          <Chip
                            label={volunteer.status}
                            size="small"
                            color={getStatusBadgeColor(volunteer.status)}
                            sx={{ height: 20, fontSize: "0.7rem" }}
                          />
                        }
                      >
                        <Avatar
                          src={volunteer.profileImage}
                          alt={`${volunteer.firstName} ${volunteer.lastName}`}
                          sx={{
                            width: 70,
                            height: 70,
                            mr: 2,
                            border: "2px solid white",
                            boxShadow: 1,
                          }}
                        />
                      </Badge>
                      <Box>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ fontWeight: 500 }}
                        >
                          {volunteer.firstName} {volunteer.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Volunteer since {volunteer.since || "2023"}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mt: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <EmailIcon
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {volunteer.email}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <PhoneIcon
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {volunteer.phone}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <LocationIcon
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {volunteer.location}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <CalendarIcon
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1, mt: 0.5 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {volunteer.availability || "Flexible availability"}
                        </Typography>
                      </Box>
                    </Box>

                    {volunteer.skills && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Skills:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {volunteer.skills.split(",").map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill.trim()}
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: "4px" }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: "8px", mr: 1 }}
                    >
                      View Profile
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      sx={{ borderRadius: "8px" }}
                    >
                      Schedule
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default VolunteerList;
