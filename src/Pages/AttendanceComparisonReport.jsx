import React, { useEffect, useState } from "react";
import $ from "jquery";

// ✅ Core DataTables
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/dataTables.dataTables.min.css"; // ✅ use this name (check in node_modules)

// ✅ Buttons + Export
import "datatables.net-buttons/js/dataTables.buttons";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";

import jszip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
} from "@mui/material";

pdfMake.vfs = pdfFonts.vfs;
window.JSZip = jszip;

const AttendanceComparisonReport = () => {
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Dummy data
  const allData = [
    { slno: 1, semester: "S7", branch: "ME", roomNo: 121, name: "ABHINAV P", before: 0, selected: 1 },
    { slno: 2, semester: "S7", branch: "CSE", roomNo: 118, name: "ALAN JOSE SANTO", before: 0, selected: 1 },
    { slno: 3, semester: "S7", branch: "CSE", roomNo: 119, name: "SANJAY P J", before: 0, selected: 1 },
    { slno: 4, semester: "S5", branch: "ME", roomNo: 316, name: "EPHRAYIM THEKKINIYATH ALEX", before: 0, selected: 1 },
    { slno: 5, semester: "S5", branch: "AD", roomNo: 320, name: "LLOYD SEBASTIAN", before: 0, selected: 1 },
    { slno: 6, semester: "S5", branch: "AD", roomNo: 334, name: "NASEEF RAHMAN ASHARAF", before: 0, selected: 1 },
    { slno: 7, semester: "S3", branch: "MR", roomNo: 411, name: "NAVANEETH J VELLARA", before: 0, selected: 1 },
    { slno: 8, semester: "S3", branch: "CY", roomNo: 419, name: "JOYAL GEORGE JOSEPH", before: 0, selected: 1 },
    { slno: 9, semester: "S3", branch: "CY", roomNo: 419, name: "MOHAMMED BILAL A T", before: 0, selected: 1 },
    { slno: 10, semester: "S3", branch: "MR", roomNo: 420, name: "EVAN PATHIPARAMBIL SUNIL", before: 0, selected: 1 },
  ];

  // Load data
  const handleLoadData = () => {
    if (!date) return alert("Please select a date!");
    setData(allData);
    setIsLoaded(true);
  };

  // Initialize DataTable
  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable("#comparisonTable")) {
          $("#comparisonTable").DataTable().destroy();
        }
        $("#comparisonTable").DataTable({
          paging: true,
          searching: true,
          dom: "Bfrtip",
          buttons: ["copy", "excel", "csv", "pdf"],
        });
      }, 200);
    }
  }, [isLoaded]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #eef3fb 100%)",
        p: { xs: 2, md: 5 },
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#1e4fa3",
          mb: 4,
          textAlign: "center",
        }}
      >
        Attendance Comparison Reports
      </Typography>

      {/* Input section */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(30,79,163,0.15)",
          background: "#ffffff",
          maxWidth: 800,
          mx: "auto",
        }}
      >
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} sm={6} md={5}>
            <TextField
              label="Select Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleLoadData}
              sx={{
                background: "#1e4fa3",
                textTransform: "none",
                fontWeight: 600,
                py: 1.4,
                "&:hover": { background: "#153a7a" },
              }}
            >
              Load Data
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table Section */}
      {!isLoaded ? (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#1e4fa3",
            fontWeight: 600,
            mt: 6,
          }}
        >
          NO DATA FOUND
        </Typography>
      ) : (
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0 8px 25px rgba(30,79,163,0.1)",
            background: "#ffffff",
          }}
        >
          <div className="table-responsive">
            <table
              id="comparisonTable"
              className="display nowrap"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Semester</th>
                  <th>Branch</th>
                  <th>Room No</th>
                  <th>Name</th>
                  <th>Before Date</th>
                  <th>Selected Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.slno}</td>
                    <td>{row.semester}</td>
                    <td>{row.branch}</td>
                    <td>{row.roomNo}</td>
                    <td>{row.name}</td>
                    <td>{row.before}</td>
                    <td>{row.selected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </Paper>
      )}
    </Box>
  );
};

export default AttendanceComparisonReport;
