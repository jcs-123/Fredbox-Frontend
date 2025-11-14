import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* 🔹 Toast Config */
const toastConfig = {
  position: "top-center",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/* 🔹 Generate Indian Time Options */
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 6; hour < 12; hour++)
    for (let minute = 0; minute < 60; minute += 15)
      times.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} AM`);
  for (let minute = 0; minute < 60; minute += 15)
    times.push(`12:${minute.toString().padStart(2, "0")} PM`);
  for (let hour = 1; hour < 12; hour++)
    for (let minute = 0; minute < 60; minute += 15)
      times.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} PM`);
  return times;
};
const timeOptions = generateTimeOptions();

/* 🔹 Convert 12-hour → 24-hour */
const convertTo24Hour = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
};

/* 🔹 Compare Dates + Times */
const isWithinRange = (req, fromDate, fromTime, toDate, toTime) => {
  if (!fromDate || !fromTime || !toDate || !toTime) return false;
  const reqDate = new Date(req.leavingDate);
  const start = new Date(fromDate);
  const end = new Date(toDate);

  const reqT = convertTo24Hour(req.leavingTime);
  const fromT = convertTo24Hour(fromTime);
  const toT = convertTo24Hour(toTime);

  const reqMin = reqT.hours * 60 + reqT.minutes;
  const fromMin = fromT.hours * 60 + fromT.minutes;
  const toMin = toT.hours * 60 + toT.minutes;

  if (reqDate < start || reqDate > end) return false;
  if (reqDate.getTime() === start.getTime() && reqMin < fromMin) return false;
  if (reqDate.getTime() === end.getTime() && reqMin > toMin) return false;
  return true;
};

function RequestBulkApproval() {
  const [fromDate, setFromDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toDate, setToDate] = useState("");
  const [toTime, setToTime] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  /* 🟢 Fetch Pending Requests */
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/all`);
      toast.dismiss(); // 👈 clear previous toast

      if (res.data.success) {
        const pending = (res.data.data || []).filter((r) => r.status === "Pending");
        setData(pending);

        if (pending.length > 0) {
          toast.info(`📦 ${pending.length} pending requests loaded`, {
            ...toastConfig,
            style: {
              background: "linear-gradient(135deg, #1565C0, #42A5F5)",
              color: "#fff",
              fontWeight: 600,
            },
          });
        } else {
          toast.warning("✅ No pending requests found", {
            ...toastConfig,
            style: {
              background: "linear-gradient(135deg, #546E7A, #90A4AE)",
              color: "#fff",
            },
          });
        }
      } else {
        toast.error("❌ Failed to load requests", toastConfig);
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      toast.dismiss(); // clear before showing new one
      toast.error("🚨 Server connection failed", toastConfig);
    }
  };

  fetchData();
}, []);

  /* 🔸 Filter Data */
const handleLoadData = () => {
  toast.dismiss(); // 👈 clear any previous message

  if (!fromDate || !fromTime || !toDate || !toTime)
    return toast.warn("⚠️ Please select all fields", toastConfig);

  if (new Date(fromDate) > new Date(toDate))
    return toast.error("🚫 From Date cannot be after To Date!", toastConfig);

  const result = data.filter((req) =>
    isWithinRange(req, fromDate, fromTime, toDate, toTime)
  );
  setFiltered(result);
  setSelectedIds([]);

  result.length
    ? toast.success(`✅ ${result.length} record(s) matched your filter`, toastConfig)
    : toast.warning("ℹ️ No requests in selected range", toastConfig);
};


  /* 🔸 Clear */
  const handleClearFilters = () => {
    setFromDate("");
    setFromTime("");
    setToDate("");
    setToTime("");
    setFiltered([]);
    setSelectedIds([]);
    toast.info("🧹 Filters cleared", toastConfig);
  };

  /* 🔸 Select Handlers */
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map((r) => r._id));
  };

  /* 🔸 Confirm + Update */
/* 🔸 Confirm + Update (with custom toast confirmation) */
const handleBulkUpdate = async (status) => {
  if (selectedIds.length === 0)
    return toast.warning("⚠️ No records selected", toastConfig);

  // 🟢 show confirmation toast
  toast.info(
    <div style={{ textAlign: "center" }}>
      <p style={{ fontWeight: 600, marginBottom: "8px" }}>
        Are you sure you want to <b>{status}</b> {selectedIds.length} request(s)?
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <Button
          variant="contained"
          color={status === "ACCEPT" ? "success" : "error"}
          size="small"
          onClick={async () => {
            toast.dismiss(); // close confirmation toast
            try {
              for (const id of selectedIds) {
                await axios.put(`${API_URL}/status/${id}`, { status });
              }
              toast.success(
                `✅ ${selectedIds.length} request(s) ${status}ED successfully!`,
                toastConfig
              );
              // Update UI
              const updated = filtered.filter((req) => !selectedIds.includes(req._id));
              setFiltered(updated);
              setData((prev) => prev.filter((req) => !selectedIds.includes(req._id)));
              setSelectedIds([]);
            } catch (err) {
              console.error("❌ Bulk update error:", err);
              toast.error("❌ Failed to update status", toastConfig);
            }
          }}
        >
          Yes
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => toast.dismiss()}
        >
          No
        </Button>
      </div>
    </div>,
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      position: "top-center",
      style: {
        background: status === "ACCEPT"
          ? "linear-gradient(135deg,#2E7D32,#81C784)"
          : "linear-gradient(135deg,#C62828,#EF5350)",
        color: "#fff",
        borderRadius: "10px",
      },
    }
  );
};

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <ToastContainer />
      <Box
        sx={{
          bgcolor: "#f8fafc",
          minHeight: "100vh",
          p: { xs: 2, sm: 3, md: 4 },
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          sx={{
            mb: 4,
            background: "linear-gradient(135deg, #1e3c72, #2a5298)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Messcut Bulk Approval
        </Typography>

        {/* ===== Filter Section ===== */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="From Date" type="date" InputLabelProps={{ shrink: true }}
                value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>From Time</InputLabel>
                <Select value={fromTime} label="From Time" onChange={(e) => setFromTime(e.target.value)}>
                  {timeOptions.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="To Date" type="date" InputLabelProps={{ shrink: true }}
                value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>To Time</InputLabel>
                <Select value={toTime} label="To Time" onChange={(e) => setToTime(e.target.value)}>
                  {timeOptions.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
              <Button fullWidth variant="contained" onClick={handleLoadData}>
                Load Data
              </Button>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Button fullWidth variant="outlined" onClick={handleClearFilters}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* ===== Data Table ===== */}
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f0f4ff" }}>
                  <TableCell align="center">
                    <Checkbox
                      checked={selectedIds.length === filtered.length && filtered.length > 0}
                      indeterminate={selectedIds.length > 0 && selectedIds.length < filtered.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {["#", "Name", "Leaving Date", "Leaving Time", "Returning Date", "Returning Time", "Status"].map((head) => (
                    <TableCell key={head} align="center" sx={{ fontWeight: "bold" }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((req, index) => (
                    <TableRow key={req._id}>
                      <TableCell align="center">
                        <Checkbox
                          checked={selectedIds.includes(req._id)}
                          onChange={() => handleSelect(req._id)}
                        />
                      </TableCell>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{req.name}</TableCell>
                      <TableCell align="center">{req.leavingDate}</TableCell>
                      <TableCell align="center">{req.leavingTime}</TableCell>
                      <TableCell align="center">{req.returningDate}</TableCell>
                      <TableCell align="center">{req.returningTime}</TableCell>
                      <TableCell align="center">
                        <Chip label={req.status} color={req.status === "ACCEPT" ? "success" : "warning"} variant="outlined" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={8}>
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* ===== Action Buttons ===== */}
        {filtered.length > 0 && (
          <Box mt={3} display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              color="success"
              onClick={() => handleBulkUpdate("ACCEPT")}
              disabled={selectedIds.length === 0}
            >
              ✅ Accept Selected ({selectedIds.length})
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleBulkUpdate("REJECT")}
              disabled={selectedIds.length === 0}
            >
              ❌ Reject Selected ({selectedIds.length})
            </Button>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

export default RequestBulkApproval;
