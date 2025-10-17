import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Fade,
  useMediaQuery,
} from "@mui/material";
import { Download, PictureAsPdf, Refresh, Check, Close } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

const NameWiseReport = () => {
  const semesters = ["Sem1", "Sem2", "Sem3", "Sem4", "Sem5", "Sem6", "Sem7", "Sem8"];
  const dummyStudents = {
    Sem1: ["Aarav", "Diya", "Nikhil", "Meera", "Arjun"],
    Sem2: ["Aditya", "Kiran", "Sneha", "Ravi", "Priya"],
    Sem3: ["Rahul", "Ananya", "Vivek", "Sana", "Joseph"],
    Sem4: ["Alan", "Chris", "Benny", "Athira", "George"],
    Sem5: ["Harsha", "Shreya", "Kavya", "Rohit", "Mathew"],
    Sem6: ["Teena", "Manu", "Aravind", "Fathima", "Naveen"],
    Sem7: ["Riya", "Sujith", "Amal", "Anju", "Abin"],
    Sem8: ["Rohini", "Dev", "Arya", "Vishnu", "Gokul"],
  };

  const [semester, setSemester] = useState("");
  const [student, setStudent] = useState("");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLoadData = () => {
    if (!semester || !student) {
      alert("Please select semester and student");
      return;
    }
    const dummyData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      date: `2025-09-${(i + 1).toString().padStart(2, "0")}`,
      breakfast: Math.random() > 0.2 ? "Yes" : "No",
      lunch: Math.random() > 0.1 ? "Yes" : "No",
      tea: Math.random() > 0.3 ? "Yes" : "No",
      dinner: Math.random() > 0.2 ? "Yes" : "No",
    }));
    setRows(dummyData);
    setPage(0);
  };

  const handleExportExcel = () => {
    if (!rows.length) return alert("No data to export!");
    const headers = ["Sl.No", "Date", "Breakfast", "Lunch", "Tea", "Dinner"];
    const csvContent = [
      headers.join(","),
      ...rows.map(
        (r) => `${r.id},"${r.date}","${r.breakfast}","${r.lunch}","${r.tea}","${r.dinner}"`
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${student}_${semester}_MessReport.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!rows.length) return alert("No data to export!");
    const html = `
      <html>
        <head>
          <title>${student} - ${semester} Mess Report</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; background: #f8fafc; }
            .container { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            h1 { color: #1565c0; text-align: center; margin-bottom: 10px; font-size: 28px; }
            h3 { text-align: center; color: #666; margin-bottom: 25px; font-weight: 500; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th { background: linear-gradient(135deg, #1976d2, #42a5f5); color: white; padding: 12px; font-weight: 600; }
            td { padding: 10px; text-align: center; border-bottom: 1px solid #e0e0e0; }
            .tick { color: #2e7d32; font-weight: bold; font-size: 16px; }
            .cross { color: #d32f2f; font-weight: bold; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Name Wise Mess Report</h1>
            <h3>Student: ${student} | Semester: ${semester}</h3>
            <table>
              <thead>
                <tr><th>Sl.No</th><th>Date</th><th>Breakfast</th><th>Lunch</th><th>Tea</th><th>Dinner</th></tr>
              </thead>
              <tbody>
                ${rows
                  .map(
                    (r) => `
                      <tr>
                        <td>${r.id}</td>
                        <td>${r.date}</td>
                        <td class="${r.breakfast === "Yes" ? "tick" : "cross"}">${r.breakfast === "Yes" ? "✓" : "✗"}</td>
                        <td class="${r.lunch === "Yes" ? "tick" : "cross"}">${r.lunch === "Yes" ? "✓" : "✗"}</td>
                        <td class="${r.tea === "Yes" ? "tick" : "cross"}">${r.tea === "Yes" ? "✓" : "✗"}</td>
                        <td class="${r.dinner === "Yes" ? "tick" : "cross"}">${r.dinner === "Yes" ? "✓" : "✗"}</td>
                      </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </body>
      </html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.print();
  };

  const handleReset = () => {
    setSemester("");
    setStudent("");
    setRows([]);
  };

  const StatusIcon = ({ value }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: value === "Yes" ? "#e8f5e8" : "#ffebee",
        color: value === "Yes" ? "#2e7d32" : "#d32f2f",
        fontWeight: "bold",
        border: `2px solid ${value === "Yes" ? "#2e7d32" : "#d32f2f"}`,
        transition: "all 0.3s ease",
      }}
    >
      {value === "Yes" ? <Check fontSize="small" /> : <Close fontSize="small" />}
    </Box>
  );

  return (
    <Fade in timeout={700}>
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography
            variant={isMobile ? "h4" : "h3"}
            fontWeight="bold"
            sx={{
              background: "linear-gradient(135deg, #1565c0, #42a5f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Name Wise Mess Report
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.8 }}>
            Track student meal attendance with detailed analytics
          </Typography>
        </Box>

        {/* Filter Section */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #ffffff, #f8fafc)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={5}>
              <TextField
                select
                label="Select Semester"
                fullWidth
                value={semester}
                onChange={(e) => {
                  setSemester(e.target.value);
                  setStudent("");
                  setRows([]);
                }}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "white",
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select Semester</em>
                </MenuItem>
                {semesters.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                select
                label="Select Student"
                fullWidth
                value={student}
                onChange={(e) => setStudent(e.target.value)}
                disabled={!semester}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "white",
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select Student</em>
                </MenuItem>
                {(dummyStudents[semester] || []).map((name, i) => (
                  <MenuItem key={i} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                onClick={handleLoadData}
                disabled={!semester || !student}
                fullWidth
                sx={{
                  borderRadius: 2,
                  py: 1.1,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0d47a1, #1565c0)",
                  },
                }}
              >
                Load Data
              </Button>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          {rows.length > 0 && (
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              gap={1.5}
              mt={3}
            >
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleExportExcel}
                sx={{
                  background: "linear-gradient(135deg, #2e7d32, #4caf50)",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Export Excel
              </Button>
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={handleExportPDF}
                sx={{
                  background: "linear-gradient(135deg, #d32f2f, #f44336)",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Export PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleReset}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Reset
              </Button>
            </Box>
          )}
        </Paper>

        {/* Table */}
        {rows.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Paper
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
            >
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {["Sl.No", "Date", "Breakfast", "Lunch", "Tea", "Dinner"].map(
                        (h) => (
                          <TableCell
                            key={h}
                            align="center"
                            sx={{
                              fontWeight: "bold",
                              background:
                                "linear-gradient(135deg, #1976d2, #42a5f5)",
                              color: "white",
                              py: 2,
                              border: "none",
                            }}
                          >
                            {h}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((r, i) => (
                        <motion.tr
                          key={r.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          style={{
                            background: i % 2 === 0 ? "#fafafa" : "white",
                          }}
                        >
                          <TableCell align="center">{r.id}</TableCell>
                          <TableCell align="center">{r.date}</TableCell>
                          {["breakfast", "lunch", "tea", "dinner"].map((meal) => (
                            <TableCell key={meal} align="center">
                              <StatusIcon value={r[meal]} />
                            </TableCell>
                          ))}
                        </motion.tr>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </Paper>
          </motion.div>
        )}

        {/* Empty States */}
        {!rows.length && semester && student && (
          <Box textAlign="center" py={8}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No data available for {student} - {semester}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Click “Load Data” to generate sample attendance records
            </Typography>
          </Box>
        )}

        {!semester && !student && (
          <Box textAlign="center" py={8}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Welcome to Mess Report System
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please select a semester and student to begin
            </Typography>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default NameWiseReport;
