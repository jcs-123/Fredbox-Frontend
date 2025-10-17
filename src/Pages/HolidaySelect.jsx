import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";

const HolidaySelect = () => {
  const [formData, setFormData] = useState({
    date: "",
    reason: "",
    holidayType: "",
  });

  const holidayOptions = [
    { value: "Public Holiday", label: "Public Holiday" },
    { value: "College Holiday", label: "College Holiday" },
    { value: "Festival Holiday", label: "Festival Holiday" },
    { value: "Special Leave", label: "Special Leave" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Holiday saved successfully!");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a2a43, #1e3c60)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          width: "100%",
          maxWidth: 900,
          p: 4,
          borderRadius: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          background: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "#1e3c60",
            textAlign: "center",
          }}
        >
          Holiday Select
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                name="date"
                label="Date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Holiday Type"
                name="holidayType"
                value={formData.holidayType}
                onChange={handleChange}
              >
                {holidayOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} textAlign="center" mt={2}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #1e3c72, #2a5298, #1e3c72)",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #264a8a, #3b6cb3, #264a8a)",
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
  );
};

export default HolidaySelect;
