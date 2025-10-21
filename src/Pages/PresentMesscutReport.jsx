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
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";

const PresentMesscutReport = () => {
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // 🔹 Dummy dataset
  const allData = [
    { slno: 1, semester: "S00", roomNo: 17, name: "DR SHYJITH M B" },
    { slno: 2, semester: "S00", roomNo: 2, name: "DR ANAND KRISHNAN N" },
    { slno: 3, semester: "S00", roomNo: 1, name: "DR JARIN T" },
    { slno: 4, semester: "S00", roomNo: 15, name: "ALFRED GEORGE" },
    { slno: 5, semester: "S00", roomNo: 16, name: "ASHIK MS" },
    { slno: 6, semester: "S00", roomNo: 12, name: "MERIN BABU" },
    { slno: 7, semester: "S00", roomNo: 14, name: "PRAVITHA K" },
    { slno: 8, semester: "S00", roomNo: 20, name: "FR ANSON NEELAMKAVIL" },
  ];

  // 🔹 Load Data
  const handleLoadData = () => {
    if (!date) {
      alert("Please select a date!");
      return;
    }
    setData(allData);
  };

  // 🔹 Excel Export
  const handleExportExcel = () => {
    if (data.length === 0) {
      alert("No data available to export!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PresentMesscut");
    XLSX.writeFile(workbook, `PresentMesscut_${date}.xlsx`);
  };

  // 🔹 Filter logic
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.semester.toLowerCase().includes(search.toLowerCase()) ||
      item.roomNo.toString().includes(search)
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #eef3fb 100%)",
        p: { xs: 2, md: 5 },
      }}
    >
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#1e4fa3",
          mb: 3,
          textAlign: "center",
        }}
      >
        Present Messcut Report
      </Typography>

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
        {/* Filters Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 3,
          }}
        >
          {/* Date Picker */}
          <TextField
            label="Select Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: "100%", sm: 250 } }}
          />

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
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
        </Box>

        {/* Search Field */}
        <TextField
          placeholder="Search by name, room no, or semester..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#1e4fa3" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead sx={{ background: "#f4f7fc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#1e4fa3" }}>
                  Sl.No.
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e4fa3" }}>
                  Semester
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e4fa3" }}>
                  Room No.
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1e4fa3" }}>
                  Name
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <TableRow key={row.slno} hover>
                    <TableCell>{row.slno}</TableCell>
                    <TableCell>{row.semester}</TableCell>
                    <TableCell>{row.roomNo}</TableCell>
                    <TableCell>{row.name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: "#6c757d" }}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default PresentMesscutReport;
