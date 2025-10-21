import React from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Paper,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

const ApologyViewModal = ({ open, handleClose }) => {
  // 🔹 Dummy Data (replace with API data later)
  const apologyList = [
    {
      id: 1,
      admissionNo: "12312019",
      semester: "S5",
      class: "CSE",
      roomNo: "319",
      studentName: "ADITYARAJ S",
      reason: "Late return",
      apologyNo: "APO-001",
      applyDate: "2025-10-05",
      status: "Accepted",
    },
    {
      id: 2,
      admissionNo: "12312019",
      semester: "S5",
      class: "CSE",
      roomNo: "319",
      studentName: "ADITYARAJ S",
      reason: "Missed attendance",
      apologyNo: "APO-002",
      applyDate: "2025-09-10",
      status: "Pending",
    },
  ];

  return (
    <Modal open={open} onClose={handleClose} sx={{ zIndex: 1600 }}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", md: "90%" },
            maxHeight: "85vh",
            overflow: "auto",
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: 24,
            p: { xs: 2, md: 3 },
          }}
        >
          {/* ---------- Header ---------- */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              borderBottom: "2px solid #00bfa6",
              pb: 1,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: "#00bfa6",
                fontFamily: "Poppins, sans-serif",
                fontSize: { xs: "1rem", md: "1.2rem" },
              }}
            >
              STUDENT DETAILS
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* ---------- Table Section ---------- */}
          <Paper
            elevation={2}
            sx={{
              overflowX: "auto",
              borderRadius: 2,
              "&::-webkit-scrollbar": { height: 8 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ccc",
                borderRadius: 4,
              },
            }}
          >
            <Table size="small" sx={{ minWidth: 1100 }}>
              <TableHead sx={{ bgcolor: "#f3f4f6" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Id</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Admission No</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Semester</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Class</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Room No</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Apology Number</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Apply Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apologyList.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      bgcolor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                      "&:hover": { bgcolor: "#eefbf9" },
                    }}
                  >
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.admissionNo}</TableCell>
                    <TableCell>{row.semester}</TableCell>
                    <TableCell>{row.class}</TableCell>
                    <TableCell>{row.roomNo}</TableCell>
                    <TableCell>{row.studentName}</TableCell>
                    <TableCell>{row.reason}</TableCell>
                    <TableCell>{row.apologyNo}</TableCell>
                    <TableCell>{row.applyDate}</TableCell>
                    <TableCell>
                      {row.status === "Accepted" ? (
                        <Chip
                          label="ACCEPTED"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      ) : row.status === "Rejected" ? (
                        <Chip
                          label="REJECTED"
                          color="error"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      ) : (
                        <Chip
                          label="PENDING"
                          color="warning"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: "none",
                          borderColor: "#64748b",
                          color: "#64748b",
                          "&:hover": {
                            borderColor: "#00bfa6",
                            color: "#00bfa6",
                          },
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* ---------- Footer Button ---------- */}
          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                bgcolor: "#00bfa6",
                "&:hover": { bgcolor: "#009e8d" },
                fontWeight: 600,
                px: 4,
                borderRadius: 2,
              }}
            >
              CLOSE
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Modal>
  );
};

export default ApologyViewModal;
