import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { motion } from "framer-motion";

/* 🔹 Dummy Data for dropdowns */
const studentData = {
  "101": [
    { name: "Alfred George", admissionNo: "JEC856" },
    { name: "Edwin Paul", admissionNo: "12213015" },
  ],
  "102": [
    { name: "Lins A T", admissionNo: "12423045" },
    { name: "Thomas Sabu", admissionNo: "12215033" },
  ],
  "103": [
    { name: "Ajith Varghese", admissionNo: "12217009" },
    { name: "Anand Krishnan", admissionNo: "JEC730" },
  ],
};

function ApologyRequest() {
  const [formData, setFormData] = useState({
    roomNo: "",
    studentName: "",
    admissionNo: "",
    reason: "",
  });

  /* 🔸 Handle Changes */
  const handleRoomChange = (e) => {
    setFormData({
      roomNo: e.target.value,
      studentName: "",
      admissionNo: "",
      reason: formData.reason,
    });
  };

  const handleStudentChange = (e) => {
    const selectedStudent = e.target.value;
    const student = studentData[formData.roomNo]?.find(
      (s) => s.name === selectedStudent
    );
    setFormData((prev) => ({
      ...prev,
      studentName: selectedStudent,
      admissionNo: student ? student.admissionNo : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { roomNo, studentName, admissionNo, reason } = formData;

    if (!roomNo || !studentName || !admissionNo || !reason) {
      alert("⚠️ Please fill in all fields before submitting!");
      return;
    }

    alert(
      `✅ Apology request submitted successfully!\n\n${JSON.stringify(
        formData,
        null,
        2
      )}`
    );

    setFormData({
      roomNo: "",
      studentName: "",
      admissionNo: "",
      reason: "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          backgroundColor: "#f5f5f5", // Simple light gray background
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            width: { xs: "100%", sm: "85%", md: "65%", lg: "45%" },
            backdropFilter: "blur(12px)",
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
        >
          {/* ===== Header ===== */}
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            sx={{
              mb: 4,
              fontSize: { xs: "1.8rem", sm: "2.2rem" },
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Apology Request
          </Typography>

          {/* ===== Form ===== */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Room No */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>Room No</InputLabel>
                  <Select
                    name="roomNo"
                    value={formData.roomNo}
                    onChange={handleRoomChange}
                    displayEmpty
                    sx={{ borderRadius: 2, backgroundColor: "#f7f9fc" }}
                  >
                    <MenuItem value="">
                      <em>Select Room No</em>
                    </MenuItem>
                    {Object.keys(studentData).map((room) => (
                      <MenuItem key={room} value={room}>
                        {room}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Student Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!formData.roomNo}>
                  <InputLabel shrink>Student Name</InputLabel>
                  <Select
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleStudentChange}
                    displayEmpty
                    sx={{ borderRadius: 2, backgroundColor: "#f7f9fc" }}
                  >
                    <MenuItem value="">
                      <em>Select Student</em>
                    </MenuItem>
                    {formData.roomNo &&
                      studentData[formData.roomNo]?.map((student) => (
                        <MenuItem key={student.name} value={student.name}>
                          {student.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Admission No */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Admission No"
                  name="admissionNo"
                  value={formData.admissionNo}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  placeholder="Auto-filled"
                  disabled
                  sx={{
                    backgroundColor: "#f7f9fc",
                    borderRadius: 2,
                  }}
                />
              </Grid>

              {/* Reason */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Write your apology reason..."
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{
                    backgroundColor: "#f7f9fc",
                    borderRadius: 2,
                  }}
                />
              </Grid>

              {/* Submit */}
              <Grid item xs={12} textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    px: 5,
                    py: 1.4,
                    mt: 1,
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: "none",
                    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                    boxShadow: "0 4px 14px rgba(25,118,210,0.4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1565c0, #1e88e5)",
                      boxShadow: "0 6px 20px rgba(25,118,210,0.5)",
                    },
                  }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </motion.div>
  );
}

export default ApologyRequest;