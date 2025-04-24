import React, { useState, useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

// MUI components
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import RouteIcon from "@mui/icons-material/Route";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Drawer width
const drawerWidth = 240;

function Layout() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // Menu handling
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Drawer handling
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Navigation handling
  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const items = [
      {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/dashboard",
        roles: ["Admin", "Coordinator", "Volunteer"],
      },
      {
        text: "Calendar",
        icon: <CalendarMonthIcon />,
        path: "/calendar",
        roles: ["Admin", "Coordinator", "Volunteer"],
      },
    ];

    // Add admin-only items
    if (
      currentUser &&
      (currentUser.role === "Admin" || currentUser.role === "Coordinator")
    ) {
      items.push(
        {
          text: "Volunteers",
          icon: <PeopleIcon />,
          path: "/volunteers",
          roles: ["Admin", "Coordinator"],
        },
        {
          text: "Clients",
          icon: <HomeIcon />,
          path: "/clients",
          roles: ["Admin", "Coordinator"],
        },
        {
          text: "Routes",
          icon: <RouteIcon />,
          path: "/routes",
          roles: ["Admin", "Coordinator"],
        }
      );
    }

    // Filter items based on user role
    return currentUser
      ? items.filter((item) => item.roles.includes(currentUser.role))
      : [];
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            MOW Scheduler
          </Typography>

          {/* Notifications */}
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={currentUser?.name || "User"}
                  src="/static/images/avatar/2.jpg"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                onClick={() => {
                  handleCloseUserMenu();
                  navigateTo("/profile");
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            ...(!open && {
              width: (theme) => theme.spacing(7),
              overflowX: "hidden",
            }),
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
        open={open}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {getNavigationItems().map((item) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{
                  display: "block",
                  backgroundColor:
                    location.pathname === item.path
                      ? "rgba(0, 0, 0, 0.08)"
                      : "transparent",
                }}
              >
                <ListItemButton
                  onClick={() => navigateTo(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color:
                        location.pathname === item.path
                          ? "primary.main"
                          : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      color:
                        location.pathname === item.path
                          ? "primary.main"
                          : "inherit",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;
