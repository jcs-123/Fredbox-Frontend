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
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AttendanceReport = () => {
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  /* =====================================================
     LOAD DATA
  ===================================================== */
  const handleLoadData = async () => {
    if (!date) {
      showToast("Please select a date!", "warning");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/attendance?date=${date}`);
      setData(res.data.data);
      setIsLoaded(true);
      showToast("Data loaded successfully!", "success");
    } catch (error) {
      showToast("Error fetching data", "error");
      console.log(error);
    }
  };

  /* =====================================================
     TOGGLE ATTENDANCE
  ===================================================== */
  const toggleAttendance = (index) => {
    const updated = [...data];
    updated[index].attendance = !updated[index].attendance;
    setData(updated);
  };

  /* =====================================================
     SEARCH
  ===================================================== */
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.semester.toLowerCase().includes(search.toLowerCase()) ||
      item.roomNo.toString().includes(search)
  );

  /* =====================================================
     SAVE ATTENDANCE
  ===================================================== */
  const handleSave = async () => {
    if (data.length === 0) {
      showToast("No data to save!", "warning");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        date,
        records: data.map((item) => ({
          admissionNumber: item.admissionNumber,
          name: item.name,
          semester: item.semester,
          roomNo: item.roomNo,
          messcut: item.messcut,
          attendance: item.attendance,
        })),
      };

      await axios.post(`${API_URL}/attendance/save`, payload);

      showToast("Attendance saved successfully!", "success");
    } catch (error) {
      showToast("Failed to save attendance", "error");
      console.log(error);
    }

    setSaving(false);
  };

  /* =====================================================
     EXPORT EXCEL
  ===================================================== */
 const handleExportExcel = async () => {
  if (data.length === 0) return showToast("No data to export!", "warning");

  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance Report");

    /* ================== HEADER STYLE ================== */
    const headerStyle = {
      font: { bold: true, color: { argb: "FFFFFFFF" }, size: 12 },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "1E4FA3" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };

    /* ================== ROW STYLE ================== */
    const rowStyle = {
      alignment: { vertical: "middle", horizontal: "center" },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };

    /* ================== DEFINE COLUMNS ================== */
    sheet.columns = [
      { header: "Sl.No", key: "slno", width: 8 },
      { header: "Admission No", key: "admissionNumber", width: 18 },
      { header: "Name", key: "name", width: 25 },
      { header: "Semester", key: "semester", width: 12 },
      { header: "Room No", key: "roomNo", width: 12 },
      { header: "Messcut", key: "messcut", width: 12 },
      { header: "Attendance", key: "attendance", width: 14 },
    ];

    /* ================== APPLY HEADER STYLES ================== */
    sheet.getRow(1).eachCell((cell) => {
      cell.style = headerStyle;
    });

    /* ================== INSERT DATA ROWS ================== */
    data.forEach((item, index) => {
      const row = sheet.addRow({
        slno: index + 1,
        admissionNumber: item.admissionNumber,
        name: item.name,
        semester: item.semester,
        roomNo: item.roomNo,
        messcut: item.messcut ? "Yes" : "No",
        attendance: item.attendance ? "Present" : "Absent",
      });

      row.eachCell((cell) => {
        cell.style = rowStyle;
      });
    });

    /* ================== AUTO FILTER ================== */
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: 7 },
    };

    /* ================== SAVE FILE ================== */
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `AttendanceReport_${date}.xlsx`);

    showToast("Excel file created successfully!", "success");

  } catch (error) {
    console.error(error);
    showToast("Excel export failed!", "error");
  }
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

      {/* DATE INPUT */}
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

      {/* BEFORE LOAD */}
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
          {/* SEARCH + SAVE */}
      {/* SEARCH + ACTION BUTTONS (Excel moved to TOP) */}
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
    flexWrap: "wrap",
    gap: 2,
  }}
>
  {/* 🔍 SEARCH BAR */}
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

  {/* BUTTON GROUP */}
  <Box sx={{ display: "flex", gap: 1 }}>
    {/* 🟢 EXPORT EXCEL */}
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

    {/* 🟢 SAVE BUTTON */}
    <Button
      variant="contained"
      color="success"
      disabled={saving}
      onClick={handleSave}
      sx={{
        px: 3,
        py: 0.8,
        textTransform: "none",
        fontWeight: 600,
        display: "flex",
        gap: 1,
      }}
    >
      {saving ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Save"}
    </Button>
  </Box>
</Box>


          {/* MAIN TABLE */}
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
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.semester}</TableCell>
                    <TableCell>{row.roomNo}</TableCell>
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

 
        </Paper>
      )}

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttendanceReport;
