import React, { useState } from "react";
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";

/* 🔹 Dummy Request Data (Indian-style 12-hour time) */
const dummyRequests = [
  {
    id: 1,
    name: "ALFRED GEORGE",
    leavingDate: "2025-10-18",
    leavingTime: "08:00 AM",
    returnDate: "2025-10-20",
    returnTime: "04:00 PM",
    status: "Pending",
  },
  {
    id: 2,
    name: "EDWIN PAUL",
    leavingDate: "2025-10-19",
    leavingTime: "09:15 AM",
    returnDate: "2025-10-20",
    returnTime: "03:30 PM",
    status: "Pending",
  },
  {
    id: 3,
    name: "LINS A T",
    leavingDate: "2025-10-18",
    leavingTime: "07:45 AM",
    returnDate: "2025-10-19",
    returnTime: "06:15 PM",
    status: "Pending",
  },
  {
    id: 4,
    name: "AJITH VARGHESE",
    leavingDate: "2025-10-19",
    leavingTime: "10:00 AM",
    returnDate: "2025-10-21",
    returnTime: "05:00 PM",
    status: "Pending",
  },
  {
    id: 5,
    name: "THOMAS SABU",
    leavingDate: "2025-10-20",
    leavingTime: "11:30 AM",
    returnDate: "2025-10-22",
    returnTime: "07:00 PM",
    status: "Pending",
  },
];

/* 🔹 Generate Indian Time Options (12-hour format) */
const generateTimeOptions = () => {
  const times = [];
  
  // AM Times
  for (let hour = 6; hour < 12; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} AM`;
      times.push(timeString);
    }
  }
  
  // 12 PM
  for (let minute = 0; minute < 60; minute += 15) {
    const timeString = `12:${minute.toString().padStart(2, '0')} PM`;
    times.push(timeString);
  }
  
  // PM Times (1-11)
  for (let hour = 1; hour < 12; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} PM`;
      times.push(timeString);
    }
  }
  
  return times;
};

const timeOptions = generateTimeOptions();

/* 🔹 Helper: Convert Indian Time to 24-hour for comparison */
const convertTo24Hour = (timeStr) => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return { hours, minutes };
};

/* 🔹 Helper: DateTime Compare */
const isWithinRange = (req, fromDate, fromTime, toDate, toTime) => {
  if (!fromDate || !fromTime || !toDate || !toTime) return false;

  const reqLeaveDate = new Date(req.leavingDate);
  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);

  // Convert times to minutes for easy comparison
  const reqTime = convertTo24Hour(req.leavingTime);
  const fromTimeObj = convertTo24Hour(fromTime);
  const toTimeObj = convertTo24Hour(toTime);

  const reqMinutes = reqTime.hours * 60 + reqTime.minutes;
  const fromMinutes = fromTimeObj.hours * 60 + fromTimeObj.minutes;
  const toMinutes = toTimeObj.hours * 60 + toTimeObj.minutes;

  // Check if request date is within range
  if (reqLeaveDate < startDate || reqLeaveDate > endDate) {
    return false;
  }

  // If same as start date, check time is after fromTime
  if (reqLeaveDate.getTime() === startDate.getTime() && reqMinutes < fromMinutes) {
    return false;
  }

  // If same as end date, check time is before toTime
  if (reqLeaveDate.getTime() === endDate.getTime() && reqMinutes > toMinutes) {
    return false;
  }

  return true;
};

function RequestBulkApproval() {
  const [fromDate, setFromDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toDate, setToDate] = useState("");
  const [toTime, setToTime] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [data, setData] = useState(dummyRequests);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /* 🔸 Load Data */
  const handleLoadData = () => {
    if (!fromDate || !fromTime || !toDate || !toTime) {
      alert("Please select all fields (From Date/Time and To Date/Time)");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      alert("From Date cannot be after To Date!");
      return;
    }

    const result = data.filter((req) =>
      isWithinRange(req, fromDate, fromTime, toDate, toTime)
    );
    setFiltered(result);
  };

  /* 🔸 Clear Filters */
  const handleClearFilters = () => {
    setFromDate("");
    setFromTime("");
    setToDate("");
    setToTime("");
    setFiltered([]);
  };

  /* 🔸 Approve All */
  const handleApproveAll = () => {
    if (filtered.length === 0) {
      alert("No records to approve!");
      return;
    }

    const updated = data.map((req) =>
      filtered.find((f) => f.id === req.id)
        ? { ...req, status: "Approved" }
        : req
    );
    setData(updated);
    setFiltered(updated.filter((req) =>
      isWithinRange(req, fromDate, fromTime, toDate, toTime)
    ));
    alert("✅ All requests in the current list have been approved!");
  };

  /* 🔸 Mobile Card View */
  const MobileCardView = ({ request, index }) => (
    <Card sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" fontSize={isSmallMobile ? "0.9rem" : "1rem"}>
            {request.name}
          </Typography>
          <Chip
            label={request.status}
            size="small"
            color={request.status === "Approved" ? "success" : "warning"}
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>

        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Leaving</Typography>
            <Typography variant="body2">
              {request.leavingDate}<br/>
              {request.leavingTime}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Returning</Typography>
            <Typography variant="body2">
              {request.returnDate}<br/>
              {request.returnTime}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Box
        sx={{
          bgcolor: "#f8fafc",
          minHeight: "100vh",
          p: { xs: 2, sm: 3, md: 4 },
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {/* ===== Header ===== */}
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            mb: 4,
            textAlign: "center",
            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.2rem" },
            background: "linear-gradient(135deg, #1e3c72, #2a5298)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Request Bulk Approval
        </Typography>

        {/* ===== Filter Section ===== */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            mb: 4,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* From Date */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                size={isSmallMobile ? "small" : "medium"}
              />
            </Grid>

            {/* From Time */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size={isSmallMobile ? "small" : "medium"}>
                <InputLabel>From Time</InputLabel>
                <Select
                  value={fromTime}
                  label="From Time"
                  onChange={(e) => setFromTime(e.target.value)}
                >
                  {timeOptions.map((time) => (
                    <MenuItem key={`from-${time}`} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* To Date */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                size={isSmallMobile ? "small" : "medium"}
                inputProps={{ 
                  min: fromDate // To date cannot be before from date
                }}
              />
            </Grid>

            {/* To Time */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size={isSmallMobile ? "small" : "medium"}>
                <InputLabel>To Time</InputLabel>
                <Select
                  value={toTime}
                  label="To Time"
                  onChange={(e) => setToTime(e.target.value)}
                >
                  {timeOptions.map((time) => (
                    <MenuItem key={`to-${time}`} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={6} sm={4} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleLoadData}
                disabled={!fromDate || !fromTime || !toDate || !toTime}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0d285b, #1b3c7a)",
                  },
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  py: 1,
                }}
              >
                Load Data
              </Button>
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  py: 1,
                }}
              >
                Clear
              </Button>
            </Grid>

            {/* Results Count */}
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                {filtered.length} request(s) found
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* ===== Data Display ===== */}
        {filtered.length > 0 && (
          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              overflow: "hidden",
              p: 2,
              mb: 2,
            }}
          >
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              mb: 2 
            }}>
              <Typography variant="h6">
                Filtered Requests ({filtered.length})
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={handleApproveAll}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
              >
                Approve All ({filtered.length})
              </Button>
            </Box>
          </Paper>
        )}

        {/* ===== Mobile Card View ===== */}
        {isMobile ? (
          <Box>
            {filtered.length > 0 ? (
              filtered.map((request, index) => (
                <MobileCardView key={request.id} request={request} index={index} />
              ))
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  {fromDate && fromTime && toDate && toTime 
                    ? "No requests found in the selected time range" 
                    : "Please select date and time range to load data"
                  }
                </Typography>
              </Paper>
            )}
          </Box>
        ) : (
          /* ===== Desktop Table View ===== */
          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              overflowX: "auto",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f4ff" }}>
                    {[
                      "#",
                      "Name",
                      "Leaving Date",
                      "Leaving Time",
                      "Returning Date",
                      "Returning Time",
                      "Status",
                    ].map((head) => (
                      <TableCell
                        key={head}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "0.75rem", sm: "0.85rem" },
                          whiteSpace: "nowrap",
                          py: 2,
                        }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((req, index) => (
                      <TableRow
                        key={req.id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                          "&:hover": { backgroundColor: "#eef3fc" },
                        }}
                      >
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{req.name}</TableCell>
                        <TableCell align="center">{req.leavingDate}</TableCell>
                        <TableCell align="center">{req.leavingTime}</TableCell>
                        <TableCell align="center">{req.returnDate}</TableCell>
                        <TableCell align="center">{req.returnTime}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={req.status}
                            color={req.status === "Approved" ? "success" : "warning"}
                            variant="outlined"
                            size={isSmallMobile ? "small" : "medium"}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={7} sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          {fromDate && fromTime && toDate && toTime 
                            ? "No requests found in the selected time range" 
                            : "Please select date and time range to load data"
                          }
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </motion.div>
  );
}

export default RequestBulkApproval;