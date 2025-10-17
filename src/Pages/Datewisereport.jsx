import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { Search } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

// Dummy Data
const dummyData = [
  { name: "HAREESH N. V.", sem: "S00", room: "13", dept: "Teacher", breakfast: true, lunch: true, tea: true, dinner: true },
  { name: "ABHISHEK AJI", sem: "S7", room: "214", dept: "MR", breakfast: true, lunch: true, tea: true, dinner: true },
  { name: "MUHAMMED NAHEEM T", sem: "S3", room: "517", dept: "CSE", breakfast: false, lunch: false, tea: false, dinner: false },
  { name: "FAHID BIN FIROZ", sem: "S3", room: "517", dept: "CSE", breakfast: false, lunch: false, tea: false, dinner: false },
  { name: "ROHAN M", sem: "S3", room: "530", dept: "ECE", breakfast: false, lunch: false, tea: false, dinner: false },
  { name: "JITHU RENU M", sem: "S3", room: "530", dept: "ECE", breakfast: false, lunch: false, tea: false, dinner: false },
  { name: "ARWIN SHANTO NEELAMKAVIL", sem: "S3", room: "529", dept: "CSE", breakfast: false, lunch: false, tea: false, dinner: false },
  { name: "ARON ALEX", sem: "S3", room: "529", dept: "CSE", breakfast: false, lunch: false, tea: false, dinner: false },
  { name: "ASHIK AHMED", sem: "S3", room: "518", dept: "CE", breakfast: false, lunch: false, tea: false, dinner: false },
  { name: "NIDHEEP JANARDHAN", sem: "S3", room: "518", dept: "CE", breakfast: false, lunch: false, tea: false, dinner: false },
];

function DateWiseReport() {
  const [selectedDate, setSelectedDate] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLoadData = () => {
    setTimeout(() => setData(dummyData), 500);
  };

  const filteredData = data.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        fontFamily: "Poppins, sans-serif",
        padding: isMobile ? "16px" : "40px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          borderRadius: 4,
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: "1200px",
          margin: "0 auto",
          background: "linear-gradient(135deg, #ffffff, #f5f9ff)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(135deg, #1565c0, #42a5f5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 3,
          }}
        >
          Date Wise Mess Report
        </Typography>

        {/* Controls */}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          alignItems="center"
          gap={2}
          mb={3}
        >
          <TextField
            type="date"
            fullWidth
            size="small"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "white",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleLoadData}
            fullWidth={isMobile}
            sx={{
              background: "linear-gradient(135deg, #1e3c72, #2a5298)",
              textTransform: "none",
              borderRadius: 2,
              py: 1.1,
              px: 3,
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #0d47a1, #1565c0)",
              },
            }}
          >
            Load Data
          </Button>
        </Box>

        {/* Search Bar */}
        <Box
          display="flex"
          justifyContent={isMobile ? "center" : "flex-end"}
          mb={2}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            width={isMobile ? "100%" : "250px"}
          >
            <Search color="action" />
            <TextField
              size="small"
              placeholder="Search..."
              fullWidth
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
                },
              }}
            />
          </Box>
        </Box>

        {/* Table */}
        {data.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                overflowX: "auto",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      "Sl. No",
                      "Name",
                      "Semester",
                      "Room No.",
                      "Department",
                      "Breakfast",
                      "Lunch",
                      "Tea",
                      "Dinner",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          background:
                            "linear-gradient(135deg, #1976d2, #42a5f5)",
                          color: "white",
                          fontSize: { xs: "0.75rem", sm: "0.9rem" },
                          border: "none",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        style={{
                          background:
                            index % 2 === 0 ? "#f9fbff" : "white",
                          transition: "0.3s",
                        }}
                      >
                        <TableCell align="center">
                          {index + 1 + page * rowsPerPage}
                        </TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">{row.sem}</TableCell>
                        <TableCell align="center">{row.room}</TableCell>
                        <TableCell align="center">{row.dept}</TableCell>
                        <TableCell align="center">
                          {row.breakfast ? "✔️" : "✖️"}
                        </TableCell>
                        <TableCell align="center">
                          {row.lunch ? "✔️" : "✖️"}
                        </TableCell>
                        <TableCell align="center">
                          {row.tea ? "✔️" : "✖️"}
                        </TableCell>
                        <TableCell align="center">
                          {row.dinner ? "✔️" : "✖️"}
                        </TableCell>
                      </motion.tr>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              sx={{
                borderTop: "1px solid #e0e0e0",
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    fontSize: "0.875rem",
                  },
              }}
            />
          </motion.div>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {selectedDate
                ? "No data found for the selected date."
                : "Please select a date and load data."}
            </Typography>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
}

export default DateWiseReport;
