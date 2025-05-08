import React, { useState, useContext, useEffect } from "react";
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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // Update drawer state when screen size changes
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  // Menu handling
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Drawer handling
  const toggleDrawer = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  // Navigation handling
  const navigateTo = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
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
        path: currentUser?.role === "Volunteer" ? "/volunteer-dashboard" : "/dashboard",
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

    // Add volunteer-specific items
    if (currentUser && currentUser.role === "Volunteer") {
      items.push(
        {
          text: "Routes",
          icon: <RouteIcon />,
          path: "/volunteer-routes",
          roles: ["Volunteer"],
        }
      );
    }

    // Filter items based on user role
    return currentUser
      ? items.filter((item) => item.roles.includes(currentUser.role))
      : [];
  };

  // Determine if we should hide the drawer for volunteer dashboard on mobile
  const isVolunteerDashboardOnMobile = () => {
    return (
      currentUser?.role === "Volunteer" && 
      location.pathname === "/volunteer-dashboard" && 
      isMobile
    );
  };

  // Drawer content
  const drawerContent = (
    <>
      <Toolbar 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          px: [1],
          minHeight: (theme) => theme.spacing(7)
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
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
                  display: { xs: mobileOpen ? 'block' : 'none', sm: open ? 'block' : 'none' },
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
    </>
  );

  // Don't render layout elements if we're on volunteer dashboard on mobile
  if (isVolunteerDashboardOnMobile()) {
    return <Outlet />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
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

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth 
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: open ? drawerWidth : theme.spacing(7),
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: open ? drawerWidth : theme.spacing(7),
              boxSizing: "border-box",
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open={open}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          mt: { xs: 7, sm: 8 },
          width: '100%'
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;
