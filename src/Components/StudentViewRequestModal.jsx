import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

const StudentViewRequestModal = ({ open, handleClose }) => {
  // 🔹 Dummy Data (replace later with API)
  const requests = [
    {
      roomNo: "319",
      name: "ADITYARAJ S",
      admissionNo: "12312019",
      leavingDate: "2025-10-17",
      leavingTime: "06:58:00",
      returningDate: "2026-01-01",
      returningTime: "16:00:00",
      reason: "College bus",
      status: "APPROVED",
      remarks: "",
      messCut: "",
    },
    {
      roomNo: "319",
      name: "ADITYARAJ S",
      admissionNo: "12312019",
      leavingDate: "2025-09-20",
      leavingTime: "06:34:00",
      returningDate: "2025-10-06",
      returningTime: "16:00:00",
      reason: "College bus",
      status: "APPROVED",
      remarks: "",
      messCut: "",
    },
    {
      roomNo: "319",
      name: "ADITYARAJ S",
      admissionNo: "12312019",
      leavingDate: "2025-08-28",
      leavingTime: "06:00:00",
      returningDate: "2025-09-15",
      returningTime: "06:00:00",
      reason: "Weekends",
      status: "APPROVED",
      remarks: "",
      messCut: 18,
    },
    {
      roomNo: "319",
      name: "ADITYARAJ S",
      admissionNo: "12312019",
      leavingDate: "2025-10-10",
      leavingTime: "06:02:00",
      returningDate: "2025-12-01",
      returningTime: "06:00:00",
      reason: "Day scholar",
      status: "REJECTED",
      remarks: "",
      messCut: "",
    },
  ];

  return (
    <Modal open={open} onClose={handleClose} sx={{ zIndex: 1500 }}>
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
            p: 3,
          }}
        >
          {/* Header */}
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
              sx={{ color: "#00bfa6", fontFamily: "Poppins, sans-serif" }}
            >
              STUDENT DETAILS
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Table Section */}
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
                  <TableCell sx={{ fontWeight: 700 }}>Room No</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Admission No</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Leaving Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Leaving Time</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Returning Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Returning Time</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Remarks</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Mess Cut Available</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((req, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      bgcolor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                      "&:hover": { bgcolor: "#eefbf9" },
                    }}
                  >
                    <TableCell>{req.roomNo}</TableCell>
                    <TableCell>{req.name}</TableCell>
                    <TableCell>{req.admissionNo}</TableCell>
                    <TableCell>{req.leavingDate}</TableCell>
                    <TableCell>{req.leavingTime}</TableCell>
                    <TableCell>{req.returningDate}</TableCell>
                    <TableCell>{req.returningTime}</TableCell>
                    <TableCell>{req.reason}</TableCell>
                    <TableCell>
                      {req.status === "APPROVED" ? (
                        <Chip
                          label="APPROVED"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      ) : req.status === "REJECTED" ? (
                        <Chip
                          label="REJECTED"
                          color="error"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      ) : (
                        <Chip
                          label={req.status}
                          color="warning"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{req.remarks || "-"}</TableCell>
                    <TableCell>{req.messCut || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* Footer Button */}
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

export default StudentViewRequestModal;
