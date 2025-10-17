import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Settings,
  Person,
  VpnKey,
} from "@mui/icons-material";

function Header({ handleDrawerToggle }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleProfileMenuClose();
    console.log("Logout clicked");
  };

  const handleChangePassword = () => {
    handleProfileMenuClose();
    console.log("Change Password clicked");
  };

  const handleEditProfile = () => {
    handleProfileMenuClose();
    console.log("Edit Profile clicked");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease-in-out",
        width: { sm: "100%" }, // ✅ Always take full width
        ml: { sm: 0 }, // ✅ No margin (title stays visible)
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* ===== Left Section (Menu + Title) ===== */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Sidebar Menu Icon (Visible only on Mobile) */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { sm: "none" },
              mr: 1,
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* App Title - Always Visible */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: "bold",
              letterSpacing: 0.5,
              color: "white",
              fontSize: isMobile ? "1.05rem" : "1.3rem",
              textTransform: "uppercase",
              userSelect: "none",
            }}
          >
            Fredbox
          </Typography>
        </Box>

        {/* ===== Right Section (Profile Avatar) ===== */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "white",
                color: "#1976d2",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              JS
            </Avatar>
          </IconButton>

          {/* ===== Profile Dropdown ===== */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleProfileMenuClose}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: 2,
                overflow: "visible",
                filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.1))",
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* User Info */}
            <MenuItem onClick={handleEditProfile}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <Box>
                <ListItemText primary="John Smith" />
                <Typography variant="caption" color="text.secondary">
                  admin@example.com
                </Typography>
              </Box>
            </MenuItem>

            <Divider />

            {/* Profile Options */}
            <MenuItem onClick={handleEditProfile}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </MenuItem>

            <MenuItem onClick={handleChangePassword}>
              <ListItemIcon>
                <VpnKey fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Change Password" />
            </MenuItem>

            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>

            <Divider />

            {/* Logout */}
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
