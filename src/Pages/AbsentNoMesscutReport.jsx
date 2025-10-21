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

const AbsentNoMesscutReport = () => {
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 🔹 Dummy data (sample)
  const allData = [
    { slno: 1, semester: "S3", roomNo: 517, name: "FAHID BIN FIROZ" },
    { slno: 5, semester: "S3", roomNo: 519, name: "JOEL T JOSEPH" },
    { slno: 21, semester: "S5", roomNo: 534, name: "GOUTHAM KRISHNA K SURESH" },
    { slno: 24, semester: "S5", roomNo: 535, name: "EMIL BOSCO A" },
    { slno: 36, semester: "S3", roomNo: 416, name: "SUDEV S" },
    { slno: 41, semester: "S3", roomNo: 413, name: "ALVIN ANUP" },
    { slno: 45, semester: "S3", roomNo: 411, name: "NAVANEETH J VELLARA" },
  ];

  // 🔹 Load Data
  const handleLoadData = () => {
    if (!date) return alert("Please select a date!");
    setTimeout(() => {
      setData(allData);
      setIsLoaded(true);
    }, 400);
  };

  // 🔹 Filter data for search
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.semester.toLowerCase().includes(search.toLowerCase()) ||
      item.roomNo.toString().includes(search)
  );

  // 🔹 Excel Export
  const handleExportExcel = () => {
    if (data.length === 0) return alert("No data available to export!");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AbsentNoMesscut");
    XLSX.writeFile(workbook, `AbsentNoMesscut_${date}.xlsx`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #eef3fb 100%)",
        p: { xs: 2, md: 5 },
      }}
    >
      {/* Page Header */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#1e4fa3",
          mb: 3,
          textAlign: "center",
        }}
      >
        Absent NoMesscut Report
      </Typography>

      {/* Date + Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          label="Select Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: { xs: "100%", sm: 250 } }}
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

      <Box
        sx={{
          borderBottom: "1px solid #d4d8e3",
          mb: 2,
        }}
      ></Box>

      {/* If no data */}
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
          {/* Search bar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
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
          </Box>

          {/* Data Table */}
          <TableContainer>
            <Table>
              <TableHead sx={{ background: "#f4f7fc" }}>
                <TableRow>
                  <TableCell>Sl.No.</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Room No.</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{row.slno}</TableCell>
                      <TableCell>{row.semester}</TableCell>
                      <TableCell>{row.roomNo}</TableCell>
                      <TableCell>{row.name}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: "#6c757d" }}>
                      No matching data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default AbsentNoMesscutReport;
