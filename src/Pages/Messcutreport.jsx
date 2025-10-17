import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Card,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import {
  Search,
  FilterList,
  CalendarToday,
  DateRange,
  Download,
  Refresh,
} from "@mui/icons-material";

/* ============================================================
   🔹 Dummy Dataset (now includes Applied Date)
============================================================ */
const rawData = [
  { name: "ADITYARAJ S", admn: "12312019", sem: "S5", class: "CSE", count: 0, date: "2025-09-01" },
  { name: "NEERAJ BABU N S", admn: "12212093", sem: "S7", class: "CSE", count: 7, date: "2025-09-05" },
  { name: "ASHIK MS", admn: "JEC786", sem: "S00", class: "Teacher", count: 8, date: "2025-09-10" },
  { name: "ALFRED GEORGE", admn: "JEC856", sem: "S00", class: "Teacher", count: 8, date: "2025-09-11" },
  { name: "DR ANAND KRISHNAN N", admn: "JEC730", sem: "S00", class: "Teacher", count: 9, date: "2025-09-12" },
  { name: "ANS RENNY P", admn: "12423037", sem: "S5", class: "EEE", count: 7, date: "2025-09-15" },
  { name: "ALPHIN DOMINIC", admn: "12313006", sem: "S5", class: "EEE", count: 5, date: "2025-09-17" },
  { name: "KIRAN M B", admn: "12311010", sem: "S5", class: "CE", count: 5, date: "2025-09-18" },
  { name: "LINS A T", admn: "12423045", sem: "S5", class: "EEE", count: 7, date: "2025-09-19" },
  { name: "MUHAMMED RAZAL YAS P", admn: "12317039", sem: "S5", class: "AD", count: 2, date: "2025-09-22" },
  { name: "PRANAV RAJ A", admn: "12413032", sem: "S3", class: "EEE", count: 2, date: "2025-09-25" },
];

/* ============================================================
   🔹 Component
============================================================ */
const Messcutreport = () => {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* 🔸 Filtering logic with memoization */
  const filtered = useMemo(() => {
    return rawData.filter((row) => {
      const matchSearch =
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.admn.toLowerCase().includes(search.toLowerCase());
      const matchFrom = fromDate ? row.date >= fromDate : true;
      const matchTo = toDate ? row.date <= toDate : true;
      return matchSearch && matchFrom && matchTo;
    });
  }, [search, fromDate, toDate]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  /* 🔹 Reset Function */
  const handleReset = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setPage(0);
  };

  /* 🔹 Excel Export Function */
  const exportToExcel = () => {
    const headers = ["Sl.No", "Name", "Admission No", "Semester", "Class", "Mess Cut Count", "Applied Date"];
    const csvContent = [
      headers.join(","),
      ...filtered.map((row, i) =>
        [
          i + 1,
          `"${row.name}"`,
          `"${row.admn}"`,
          `"${row.sem}"`,
          `"${row.class}"`,
          row.count,
          `"${new Date(row.date).toLocaleDateString("en-IN")}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `messcut-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ============================================================
     🔹 UI
  ============================================================ */
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 3 },
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      {/* ===== Header ===== */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: { xs: 3, sm: 2 },
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
        }}
      >
        Mess Cut Report
      </Typography>

      {/* ===== Filter Card ===== */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 4,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "bold",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            <FilterList /> Filters
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={exportToExcel}
              disabled={filtered.length === 0}
              sx={{
                background: "linear-gradient(135deg, #2e7d32, #4caf50)",
                textTransform: "none",
                borderRadius: 1.5,
                fontSize: { xs: "0.75rem", sm: "0.9rem" },
                "&:hover": {
                  background: "linear-gradient(135deg, #1b5e20, #388e3c)",
                },
              }}
            >
              Export Excel
            </Button>

            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleReset}
              sx={{
                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                textTransform: "none",
                borderRadius: 1.5,
                fontSize: { xs: "0.75rem", sm: "0.9rem" },
                "&:hover": {
                  background: "linear-gradient(135deg, #0d47a1, #1565c0)",
                },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>

        {/* 🔹 Date + Search Inputs */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="From Date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="To Date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search by Name / Admission No"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search..."
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ===== Data Table ===== */}
      <Paper
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {["Sl.No", "Name", "Admn No", "Sem", "Class", "Count", "Date"].map((h) => (
                  <TableCell
                    key={h}
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f0f4ff",
                      fontSize: { xs: "0.7rem", sm: "0.875rem" },
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => (
                  <TableRow
                    key={i}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "#f8f9fa" },
                    }}
                  >
                    <TableCell align="center">{i + 1 + page * rowsPerPage}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.admn}</TableCell>
                    <TableCell align="center">{row.sem}</TableCell>
                    <TableCell align="center">{row.class}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.count}
                        size="small"
                        color={row.count === 0 ? "success" : row.count >= 7 ? "error" : "warning"}
                        variant="outlined"
                        sx={{
                          fontSize: { xs: "0.65rem", sm: "0.85rem" },
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {new Date(row.date).toLocaleDateString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          sx={{
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
          }}
        />
      </Paper>

      {/* ===== Empty State ===== */}
      {filtered.length === 0 && (
        <Box textAlign="center" py={6}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }}
          >
            No records found
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            Try adjusting the date range or search criteria.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Messcutreport;
