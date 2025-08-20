import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Dashboard,
  People,
  Settings,
  ExitToApp,
  Menu,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const AdminSidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
    { text: "Users", icon: <People />, path: "/admin/users" },
    { text: "Settings", icon: <Settings />, path: "/admin/settings" },
    { text: "Logout", icon: <ExitToApp />, path: "/signin" },
  ];

  return (
    <>
      {/* Nút toggle */}
      <IconButton
        color="inherit"
        onClick={() => setOpen(!open)}
        sx={{ position: "fixed", top: 10, left: 10, zIndex: 1300 }}
      >
        <Menu />
      </IconButton>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1e293b",
            color: "white",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
        </Toolbar>

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                "&:hover": { backgroundColor: "#334155" },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default AdminSidebar;
