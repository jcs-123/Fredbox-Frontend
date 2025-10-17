import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import {
  Dashboard,
  Assessment,
  CalendarMonth,
  People,
  Assignment,
  Report,
  Event,
  ListAlt,
  Logout,
  Flag,
  DoneAll,
  NoteAlt,
  ErrorOutline,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Mess Cut Report", icon: <Report />, path: "/mess-cut-report" },
    { text: "Name Wise Report", icon: <People />, path: "/name-wise-report" },
    { text: "Date Wise Report", icon: <CalendarMonth />, path: "/Date-wise-report" },
    { text: "Attendance Report", icon: <Assessment />, path: "/admin/attendance-report" },
    { text: "Monthly Attendance Report", icon: <ListAlt />, path: "/Monthly-Attendance-report" },
    { text: "Request View", icon: <Event />, path: "/Request-View" },
    { text: "Request Bulk Approval", icon: <DoneAll />, path: "/admin/request-bulk-approval" },
    { text: "Holiday Select", icon: <Flag />, path: "/holiday-select" },
    { text: "Date Select", icon: <CalendarMonth />, path: "/admin/date-select" },
    { text: "Apology Request", icon: <NoteAlt />, path: "/admin/apology-request" },
    { text: "Apology Request View", icon: <NoteAlt />, path: "/admin/apology-request-view" },
    { text: "Complaint View", icon: <ErrorOutline />, path: "/admin/complaint-view" },
  ];

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(180deg, #f8f9fb 0%, #edf2f7 100%)",
      }}
    >
      {/* ==== Brand / Logo ==== */}
      <Box
        sx={{
          textAlign: "center",
          py: 2.5,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            letterSpacing: 0.5,
          }}
        >
          FREDBOX
        </Typography>
      </Box>

      {/* ==== Menu Section ==== */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 1 }}>
        <List disablePadding>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Tooltip
                key={item.text}
                title={isMobile ? "" : item.text}
                placement="right"
                arrow
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={isMobile ? handleDrawerToggle : undefined}
                  sx={{
                    mx: 1,
                    my: 0.3,
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    backgroundColor: active
                      ? "rgba(25,118,210,0.12)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(25,118,210,0.1)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? "#1976d2" : "rgba(0,0,0,0.6)",
                      minWidth: 40,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 400,
                      fontSize: "0.93rem",
                      color: active ? "#1976d2" : "rgba(0,0,0,0.85)",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      <Divider />

      {/* ==== Logout ==== */}
      <Box sx={{ p: 1 }}>
        <ListItemButton
          onClick={() => alert("Logout Clicked")}
          sx={{
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "rgba(244,67,54,0.08)",
              transform: "translateX(4px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <ListItemIcon sx={{ color: "#f44336" }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 600,
              color: "#f44336",
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* ==== Mobile Drawer ==== */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
            borderRight: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
            transition: "transform 0.3s ease-in-out",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ==== Desktop Drawer ==== */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "fixed",
            height: "100vh",
            overflow: "hidden",
            borderRight: "1px solid #e0e0e0",
            boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease-in-out",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default Sidebar;
