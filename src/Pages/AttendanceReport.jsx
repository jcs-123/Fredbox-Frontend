import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";

const AttendanceReport = () => {
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Dummy data
  const allData = [
    { slno: 1, semester: "S3", roomNo: 517, name: "Muhammed Naheem T", messcut: false, attendance: false, selected: false },
    { slno: 2, semester: "S3", roomNo: 517, name: "Fahid Bin Firoz", messcut: false, attendance: false, selected: false },
    { slno: 3, semester: "S3", roomNo: 530, name: "Rohan M", messcut: true, attendance: false, selected: false },
    { slno: 4, semester: "S3", roomNo: 530, name: "Jithin P C", messcut: true, attendance: false, selected: false },
    { slno: 5, semester: "S5", roomNo: 401, name: "Alfred George", messcut: false, attendance: false, selected: false },
    { slno: 6, semester: "S5", roomNo: 402, name: "Ashik M S", messcut: true, attendance: false, selected: false },
    { slno: 7, semester: "S7", roomNo: 215, name: "Ronald K S", messcut: false, attendance: false, selected: false },
    { slno: 8, semester: "S7", roomNo: 212, name: "Akshayraj M V", messcut: true, attendance: false, selected: false },
  ];

  // Load data
  const handleLoadData = () => {
    if (!date) {
      alert("Please select a date!");
      return;
    }
    setTimeout(() => {
      setData(allData);
      setIsLoaded(true);
    }, 600); // mimic API delay
  };

  // Toggle attendance & room
  const toggleAttendance = (index) => {
    const updated = [...data];
    updated[index].attendance = !updated[index].attendance;
    setData(updated);
  };
  const toggleRoom = (index) => {
    const updated = [...data];
    updated[index].selected = !updated[index].selected;
    setData(updated);
  };

  // Search filter
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.semester.toLowerCase().includes(search.toLowerCase()) ||
      item.roomNo.toString().includes(search)
  );

  // Dynamic summary
  const semesters = ["S1", "S3", "S5", "S7", "MTech", "Staff"];
  const summary = {};
  semesters.forEach((sem) => {
    const students = data.filter((s) => s.semester === sem);
    const total = students.length;
    const present = students.filter((s) => s.attendance).length;
    summary[sem] = { absent: total - present, present };
  });

  const totalAbsent = Object.values(summary).reduce((a, b) => a + (b.absent || 0), 0);
  const totalPresent = Object.values(summary).reduce((a, b) => a + (b.present || 0), 0);

  const handleSave = () => alert("Attendance saved successfully!");
  const handleExportExcel = () => {
    if (data.length === 0) return alert("No data to export!");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AttendanceReport");
    XLSX.writeFile(workbook, `AttendanceReport_${date}.xlsx`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #eef3fb 100%)",
        p: { xs: 2, md: 5 },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#1e4fa3",
          mb: 3,
          textAlign: "center",
        }}
      >
        Attendance Report
      </Typography>

      {/* Date + Load Button */}
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          textAlign: "center",
          mb: 4,
        }}
      >
        <TextField
          label="Select Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleLoadData}
          sx={{
            background: "#1e4fa3",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { background: "#163b7a" },
          }}
        >
          Load Data
        </Button>
      </Box>

      {/* Before load - No Data Message */}
      {!isLoaded ? (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#1e4fa3",
            fontWeight: 600,
            mt: 5,
          }}
        >
          NO DATA FOUND
        </Typography>
      ) : (
        // After load show full table
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0 8px 25px rgba(30,79,163,0.1)",
            background: "#ffffff",
          }}
        >
          {/* Summary Table */}
          <TableContainer sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead sx={{ background: "#f4f7fc" }}>
                <TableRow>
                  <TableCell></TableCell>
                  {semesters.map((s) => (
                    <TableCell key={s} align="center">
                      {s}
                    </TableCell>
                  ))}
                  <TableCell align="center">TotalCount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Absent Count</TableCell>
                  {semesters.map((s) => (
                    <TableCell key={s} align="center">
                      {summary[s]?.absent || 0}
                    </TableCell>
                  ))}
                  <TableCell align="center">{totalAbsent}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Present Count</TableCell>
                  {semesters.map((s) => (
                    <TableCell key={s} align="center">
                      {summary[s]?.present || 0}
                    </TableCell>
                  ))}
                  <TableCell align="center">{totalPresent}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Search + Save */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <TextField
              size="small"
              placeholder="Search..."
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#1e4fa3" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              sx={{
                px: 3,
                py: 0.8,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Save
            </Button>
          </Box>

          {/* Attendance Table */}
          <TableContainer>
            <Table>
              <TableHead sx={{ background: "#f4f7fc" }}>
                <TableRow>
                  <TableCell>Sl.No.</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Room No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>MessCut</TableCell>
                  <TableCell>Attendance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{row.slno}</TableCell>
                    <TableCell>{row.semester}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Checkbox
                          checked={row.selected}
                          onChange={() => toggleRoom(index)}
                          color="secondary"
                        />
                        {row.roomNo}
                      </Box>
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="center">
                      {row.messcut ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={row.attendance}
                        onChange={() => toggleAttendance(index)}
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box textAlign="right" mt={2}>
            <Button
              variant="contained"
              onClick={handleExportExcel}
              sx={{
                background: "#00b4d8",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { background: "#0096c7" },
              }}
            >
              Create Excel
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AttendanceReport;
