import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion, AnimatePresence } from "framer-motion";

const ComplaintDetails = () => {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      name: "Alfred George",
      admissionNo: "JEC2025123",
      roomNo: "B12",
      message: "Fan not working in room",
      status: "Pending",
    },
    {
      id: 2,
      name: "Neeraj Babu",
      admissionNo: "JEC2025150",
      roomNo: "A10",
      message: "Wi-Fi disconnected since morning",
      status: "In Progress",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      admissionNo: "JEC2025189",
      roomNo: "C05",
      message: "Water leakage in bathroom",
      status: "Resolved",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "success";
      case "In Progress": return "warning";
      case "Pending": return "error";
      default: return "default";
    }
  };

  const filteredData = complaints.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roomNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1a237e",
            textAlign: "center",
            mb: 1,
          }}
        >
          Complaint Details
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#546e7a",
            textAlign: "center",
            mb: 4,
          }}
        >
          View and manage hostel or student complaints
        </Typography>
      </motion.div>

      {/* Search and Table */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          background: "#fff",
          border: "1px solid #e0e0e0",
        }}
      >
        {/* Search */}
        <TextField
          placeholder="Search by name, admission no, room, or message..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#5c6bc0" }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              "&:hover fieldset": {
                borderColor: "#5c6bc0",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#5c6bc0",
                borderWidth: 2,
              },
            }
          }}
        />

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                background: "linear-gradient(135deg, #0c5fbdff, #0889f3ff)",
                "& th": {
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  borderBottom: "none",
                }
              }}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Admission No</TableCell>
                <TableCell>Room No</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <AnimatePresence>
                {filteredData.length > 0 ? (
                  filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow 
                        key={row.id} 
                        component={motion.tr}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        hover
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': {
                            backgroundColor: '#f8f9ff',
                            transform: 'scale(1.01)',
                            transition: 'all 0.2s ease',
                          }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: "#37474f" }}>
                          #{row.id}
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="600">
                            {row.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={row.admissionNo} 
                            size="small" 
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={row.roomNo} 
                            size="small" 
                            variant="filled"
                            sx={{ 
                              backgroundColor: '#e3f2fd',
                              color: '#1565c0',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" noWrap title={row.message}>
                            {row.message}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} 
                            size="small"
                            color={getStatusColor(row.status)}
                            sx={{ 
                              fontWeight: 600,
                              minWidth: 100
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Typography 
                          variant="h6" 
                          color="textSecondary"
                          sx={{ mb: 1 }}
                        >
                          No complaints found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Try adjusting your search criteria
                        </Typography>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            borderTop: '1px solid #e0e0e0',
            mt: 2,
            '& .MuiTablePagination-toolbar': {
              padding: 2,
            }
          }}
        />
      </Paper>
    </Box>
  );
};

export default ComplaintDetails;