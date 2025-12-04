import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  People,
  MeetingRoom,
  BugReport,
  Rule,
  Refresh,
  Notifications,
  Logout,
  EventAvailable,
  EventBusy,
  Restaurant,
} from "@mui/icons-material";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, ChartTooltip, Legend);

/* ========================= COUNT ANIMATION ========================= */
const useCountUp = (target, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return count;
};

/* ========================= RESPONSIVE PIE CHART ========================= */
const ResponsivePieChart = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        height: isMobile ? 260 : 350,
        width: "100%",
        p: { xs: 1, sm: 2 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Pie
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: isMobile ? "bottom" : "right",
              labels: { padding: 15, usePointStyle: true },
            },
          },
        }}
      />
    </Box>
  );
};

/* ========================= MAIN DASHBOARD ========================= */
const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Replace with backend API data later
  const data = {
    totalStudents: 210,
    occupiedRooms: 178,
    complaints: 12,
    pendingRequests: 9,
    messcutRequests: 34,
    messcutApproved: 20,
    messcutRejected: 14,
    apologyRequests: 7,
    todayCheckin: 22,
    todayCheckout: 18,
  };

  const statsTop = [
    { title: "Total Students", value: data.totalStudents, icon: <People />, color: "#1E88E5" },
    { title: "Occupied Rooms", value: data.occupiedRooms, icon: <MeetingRoom />, color: "#43A047" },
    { title: "Active Complaints", value: data.complaints, icon: <BugReport />, color: "#E53935" },
    { title: "Pending Approvals", value: data.pendingRequests, icon: <Rule />, color: "#FB8C00" },
  ];

  const statsBottom = [
    { title: "Messcut Requests", value: data.messcutRequests, icon: <Restaurant />, color: "#5E35B1" },
    { title: "Today Check-in", value: data.todayCheckin, icon: <EventAvailable />, color: "#00897B" },
    { title: "Today Check-out", value: data.todayCheckout, icon: <EventBusy />, color: "#C2185B" },
  ];

  /* ========================= PIE CHART DATA ========================= */
  const pieData = {
    labels: [
      "Messcut Approved",
      "Messcut Rejected",
      "Pending Approvals",
      "Complaints",
      "Apology Requests",
    ],
    datasets: [
      {
        data: [
          data.messcutApproved,
          data.messcutRejected,
          data.pendingRequests,
          data.complaints,
          data.apologyRequests,
        ],
        backgroundColor: ["#43A047", "#E53935", "#FB8C00", "#1E88E5", "#8E24AA"],
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "linear-gradient(to bottom, #f7f9fc, #eef1f7)",
        minHeight: "100vh",
      }}
    >
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" },
              background: "linear-gradient(90deg, #1565C0, #42A5F5)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Hostel Dashboard
          </Typography>

          <Typography color="text.secondary">
            Real-time overview of hostel operations
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Notifications">
            <IconButton sx={{ bgcolor: "white", boxShadow: 1 }}>
              <Notifications sx={{ color: "#1565C0" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Refresh">
            <IconButton sx={{ bgcolor: "white", boxShadow: 1 }}>
              <Refresh sx={{ color: "#1565C0" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton sx={{ bgcolor: "white", boxShadow: 1 }}>
              <Logout sx={{ color: "#D32F2F" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ================= TOP GRID ================= */}
      <Grid container spacing={3}>
        {statsTop.map((item, i) => {
          const count = useCountUp(item.value);

          return (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: `linear-gradient(145deg, ${item.color}18, #ffffff)`,
                  borderLeft: `5px solid ${item.color}`,
                  transition: "0.25s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography
                      fontSize={{ xs: "1.3rem", sm: "1.6rem" }}
                      fontWeight="bold"
                      color={item.color}
                    >
                      {count}
                    </Typography>
                    <Typography color="text.secondary" fontWeight={600}>
                      {item.title}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      bgcolor: `${item.color}22`,
                      color: item.color,
                      width: 52,
                      height: 52,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ================= BOTTOM GRID ================= */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {statsBottom.map((item, i) => {
          const count = useCountUp(item.value);

          return (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: `linear-gradient(145deg, ${item.color}18, #ffffff)`,
                  borderLeft: `5px solid ${item.color}`,
                  transition: "0.25s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography
                      fontSize={{ xs: "1.3rem", sm: "1.6rem" }}
                      fontWeight="bold"
                      color={item.color}
                    >
                      {count}
                    </Typography>
                    <Typography color="text.secondary" fontWeight={600}>
                      {item.title}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      bgcolor: `${item.color}22`,
                      color: item.color,
                      width: 52,
                      height: 52,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ================= PIE CHART ================= */}
      <Card
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 4,
          boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ textAlign: "center", mb: 3 }}
        >
          Hostel Analytics Overview
        </Typography>

        <ResponsivePieChart data={pieData} />
      </Card>
    </Box>
  );
};

export default AdminDashboard;
