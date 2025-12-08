import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  People,
  MeetingRoom,
  BugReport,
  Rule,
  Refresh,
  EventAvailable,
  EventBusy,
  Restaurant,
} from "@mui/icons-material";

import axios from "axios";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, ChartTooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || "https://fredbox-backend.onrender.com";

/* ===================================================== */
/* COUNT UP HOOK */
/* ===================================================== */
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

/* ===================================================== */
/* RESPONSIVE PIE CHART */
/* ===================================================== */
const ResponsivePieChart = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        height: isMobile ? 260 : 350,
        width: "100%",
        display: "flex",
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

/* ===================================================== */
/* MAIN DASHBOARD */
/* ===================================================== */
const AdminDashboard = () => {
  const theme = useTheme();

  /* ===================== COUNTS ===================== */
  const [totalStudents, setTotalStudents] = useState(0);
  const [occupiedRooms, setOccupiedRooms] = useState(0);

  const [complaintTotal, setComplaintTotal] = useState(0);
  const [complaintPending, setComplaintPending] = useState(0);

  const [apologyPending, setApologyPending] = useState(0);

  const [messcutPending, setMesscutPending] = useState(0);
  const [leavingToday, setLeavingToday] = useState(0);
  const [returningToday, setReturningToday] = useState(0);

  /* ===================== LOAD COUNTS ===================== */
  useEffect(() => {
    loadStudentRoomCounts();
    loadComplaintCounts();
    loadApologyCounts();
    loadMesscutCounts();
  }, []);

  const loadStudentRoomCounts = async () => {
    try {
      const res = await axios.get(`${API_URL}/count`);
      setTotalStudents(res.data.totalStudents || 0);
      setOccupiedRooms(res.data.occupiedRooms || 0);
    } catch (err) {
      console.log("Student/Room Count Error:", err);
    }
  };

  const loadComplaintCounts = async () => {
    try {
      const res = await axios.get(`${API_URL}/allcomplaint/count`);
      setComplaintTotal(res.data.total || 0);
      setComplaintPending(res.data.pending || 0);
    } catch (err) {
      console.log("Complaint Count Error:", err);
    }
  };

  const loadApologyCounts = async () => {
    try {
      const res = await axios.get(`${API_URL}/count/pending`);
      setApologyPending(res.data.pending || 0);
    } catch (err) {
      console.log("Apology Count Error:", err);
    }
  };

  const loadMesscutCounts = async () => {
    try {
      const res = await axios.get(`${API_URL}/messcut/clear/count`);
      setMesscutPending(res.data.pending || 0);
      setLeavingToday(res.data.leavingToday || 0);
      setReturningToday(res.data.returningToday || 0);
    } catch (err) {
      console.log("Messcut Count Error:", err);
    }
  };

  /* ===================================================== */
  /* STAT CARD DEFINITIONS */
  /* ===================================================== */
  const statsTop = [
    { title: "Total Students", value: totalStudents, icon: <People />, color: "#1E88E5" },
    { title: "Occupied Rooms", value: occupiedRooms, icon: <MeetingRoom />, color: "#43A047" },
    { title: "Pending Complaints", value: complaintPending, icon: <BugReport />, color: "#E53935" },
    { title: "Pending Apology Requests", value: apologyPending, icon: <Rule />, color: "#FB8C00" },
  ];

  const statsBottom = [
    { title: "Pending Messcut", value: messcutPending, icon: <Restaurant />, color: "#5E35B1" },
    { title: "Today Leaving", value: leavingToday, icon: <EventBusy />, color: "#C2185B" },
    { title: "Today Returning", value: returningToday, icon: <EventAvailable />, color: "#00897B" },
  ];

  /* ===================================================== */
  /* PIE CHART DATA */
  /* ===================================================== */

  // Existing small chart
  const pieData = {
    labels: ["Messcut Pending", "Total Complaints", "Apology Pending"],
    datasets: [
      {
        data: [messcutPending, complaintTotal, apologyPending],
        backgroundColor: ["#5E35B1", "#1E88E5", "#8E24AA"],
      },
    ],
  };

  // FULL Summary Chart
  const fullChartData = {
    labels: [
      "Total Students",
      "Occupied Rooms",
      "Pending Complaints",
      "Pending Apology",
      "Messcut Pending",
      "Today Leaving",
      "Today Returning",
    ],
    datasets: [
      {
        data: [
          totalStudents,
          occupiedRooms,
          complaintPending,
          apologyPending,
          messcutPending,
          leavingToday,
          returningToday,
        ],
        backgroundColor: [
          "#1E88E5",
          "#43A047",
          "#E53935",
          "#FB8C00",
          "#5E35B1",
          "#C2185B",
          "#00897B",
        ],
        borderWidth: 2,
      },
    ],
  };

  /* ===================================================== */
  /* UI OUTPUT */
  /* ===================================================== */

  return (
    <Box sx={{ p: 4, minHeight: "100vh", background: "#eef1f7" }}>

      {/* REFRESH BTN */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <IconButton
          onClick={() => {
            loadStudentRoomCounts();
            loadComplaintCounts();
            loadApologyCounts();
            loadMesscutCounts();
          }}
        >
          <Refresh />
        </IconButton>
      </Box>

      {/* TOP CARDS */}
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
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography fontSize="1.6rem" fontWeight="bold" color={item.color}>
                      {count}
                    </Typography>
                    <Typography color="text.secondary">{item.title}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${item.color}22`, color: item.color }}>
                    {item.icon}
                  </Avatar>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* BOTTOM CARDS */}
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
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography fontSize="1.6rem" fontWeight="bold" color={item.color}>
                      {count}
                    </Typography>
                    <Typography color="text.secondary">{item.title}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${item.color}22`, color: item.color }}>{item.icon}</Avatar>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* FULL SUMMARY PIE CHART */}
      <Box sx={{ mt: 5 }}>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Overall Summary Analysis
          </Typography>
          <ResponsivePieChart data={fullChartData} />
        </Card>
      </Box>

      {/* COMPLAINT/MESSCUT/APOLOGY CHART */}
      <Box sx={{ mt: 3 }}>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Complaints / Messcut / Apology
          </Typography>
          <ResponsivePieChart data={pieData} />
        </Card>
      </Box>

    </Box>
  );
};

export default AdminDashboard;
