import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  People,
  Bed,
  Restaurant,
  Payment,
  Warning,
  Refresh,
  ElectricBolt,
  Description,
  EventNote,
  CalendarMonth,
  Assignment,
  Assessment,
  DoneAll,
  HolidayVillage,
  BugReport,
  Rule,
  ThumbUpAlt,
} from "@mui/icons-material";

/* ===================== 🔹 Count Animation Hook ===================== */
const useCountUp = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

/* ===================== 🔹 Facility Circular Gauge ===================== */
const FacilityGauge = ({ value, color, label, status, size = 100 }) => {
  const circumference = 2 * Math.PI * 35;
  const offset = circumference - (value / 100) * circumference;
  return (
    <Box sx={{ textAlign: "center", position: "relative", width: size, height: size, mx: "auto" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="35" stroke="#f0f0f0" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="35"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
        <Typography variant="h6" fontWeight="bold" color={color}>
          {value}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <Chip
        label={status}
        size="small"
        sx={{
          position: "absolute",
          bottom: -8,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: `${color}15`,
          color,
          fontWeight: 600,
          fontSize: "0.65rem",
        }}
      />
    </Box>
  );
};

/* ===================== 🔹 Main Component ===================== */
const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* ---------- Stats Data ---------- */
  const stats = [
    { title: "Total Students", value: 156, icon: <People />, color: "#1976d2", change: "+12", desc: "Currently residing" },
    { title: "Occupancy Rate", value: 85, icon: <Bed />, color: "#2e7d32", change: "+5%", desc: "Room utilization" },
    { title: "Monthly Revenue", value: 124800, icon: <Payment />, color: "#ed6c02", change: "+8%", desc: "Total collections" },
    { title: "Pending Issues", value: 7, icon: <Warning />, color: "#d32f2f", change: "-3", desc: "Maintenance requests" },
  ];

  /* ---------- Facilities ---------- */
  const facilities = [
    { name: "Water Supply", value: 95, color: "#1976d2", status: "Optimal" },
    { name: "Electricity", value: 98, color: "#2e7d32", status: "Stable" },
    { name: "WiFi Network", value: 92, color: "#ed6c02", status: "Good" },
    { name: "Security", value: 100, color: "#9c27b0", status: "Active" },
  ];

  /* ---------- Quick Access ---------- */
  const quickReports = [
    { title: "Mess Cut Report", icon: <Restaurant />, color: "#1976d2" },
    { title: "Name Wise Report", icon: <Description />, color: "#0288d1" },
    { title: "Date Wise Report", icon: <CalendarMonth />, color: "#009688" },
    { title: "Attendance Report", icon: <Assessment />, color: "#2e7d32" },
    { title: "Semester Wise Messcut", icon: <Assignment />, color: "#673ab7" },
    { title: "Monthly Attendance", icon: <EventNote />, color: "#f57c00" },
    { title: "Request View", icon: <Rule />, color: "#0288d1" },
    { title: "Bulk Approval", icon: <DoneAll />, color: "#43a047" },
    { title: "Holiday Select", icon: <HolidayVillage />, color: "#8e24aa" },
    { title: "Date Select", icon: <CalendarMonth />, color: "#7b1fa2" },
    { title: "Apology Request", icon: <ThumbUpAlt />, color: "#ef6c00" },
    { title: "Complaint View", icon: <BugReport />, color: "#d32f2f" },
  ];

  /* ===================== UI ===================== */
  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, background: "#f8fafc", minHeight: "100vh" }}>
      {/* ---------- Header ---------- */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              mb: 0.5,
              background: "linear-gradient(135deg,#1976d2,#42a5f5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.4rem" },
            }}
          >
            Hostel Operation Analysis
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Smart monitoring of hostel facilities and reports
          </Typography>
        </Box>
        <Tooltip title="Refresh Dashboard">
          <IconButton sx={{ bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", "&:hover": { bgcolor: "#f5f5f5" } }}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ---------- Stats Cards ---------- */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((s, i) => {
          const count = useCountUp(s.value);
          return (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: `linear-gradient(135deg,${s.color}10,${s.color}05)`,
                  border: `1px solid ${s.color}30`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 150,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 6px 20px rgba(0,0,0,0.08)" },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Box>
                    <Typography variant="h5" color={s.color} fontWeight="bold">
                      {s.title === "Monthly Revenue"
                        ? `₹${count.toLocaleString()}`
                        : s.title === "Occupancy Rate"
                        ? `${count}%`
                        : count}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="600">
                      {s.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {s.desc}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${s.color}20`, color: s.color, width: 48, height: 48 }}>
                    {s.icon}
                  </Avatar>
                </Box>
                <Chip
                  label={s.change}
                  size="small"
                  sx={{
                    bgcolor: s.change.includes("+") ? "#4caf5020" : "#ff980020",
                    color: s.change.includes("+") ? "#4caf50" : "#ff9800",
                    fontWeight: 600,
                    width: "fit-content",
                  }}
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ---------- Quick Access Section ---------- */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, mb: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          📊 Quick Access Reports & Requests
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(6, 1fr)",
            },
            gap: 16,
          }}
        >
          {quickReports.map((item, index) => (
            <Card
              key={index}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                height: 120,
                background: `linear-gradient(135deg,${item.color}10,${item.color}05)`,
                border: `1px solid ${item.color}30`,
                transition: "0.3s",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Avatar sx={{ bgcolor: `${item.color}20`, color: item.color, mb: 1 }}>
                {item.icon}
              </Avatar>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  textAlign: "center",
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                }}
              >
                {item.title}
              </Typography>
            </Card>
          ))}
        </Grid>
      </Paper>

    
    </Box>
  );
};

export default AdminDashboard;
