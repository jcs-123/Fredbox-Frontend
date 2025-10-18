import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";

const DateSelect = () => {
  const [formData, setFormData] = useState({ date: "", reason: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date) return alert("Please select a date!");
    alert(`Selected Date: ${formData.date}\nReason: ${formData.reason || "None"}`);
    setFormData({ date: "", reason: "" });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.98 }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2,
        px: 2,
      }}
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: "center", marginBottom: "1rem" }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "  rgba(11, 103, 179, 0.89)",
            mb: 0.5,
          }}
        >
          Select Date
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#6c757d",
          }}
        >
          Choose a date and add an optional reason below
        </Typography>
      </motion.div>

      {/* Main Card */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: "100%",
          maxWidth: 700,
          p: 3,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(30, 79, 163, 0.08)",
          background: "#fff",
          border: "1px solid #e0e0e0",
        }}
      >
        <motion.form 
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <TextField
                  label="Date"
                  type="date"
                  name="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={handleChange}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <TextField
                  label="Reason (optional)"
                  name="reason"
                  fullWidth
                  value={formData.reason}
                  onChange={handleChange}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} textAlign="center">
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  variant="contained"
                  component={motion.button}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  sx={{
                    px: 4,
                    py: 1,
                    borderRadius: 1,
                    fontWeight: 600,
                    background: "rgba(11, 103, 179, 0.89)f",
                    textTransform: "none",
                    "&:hover": {
                      background: "#083961ff",
                    },
                  }}
                >
                  Submit
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </motion.form>
      </Paper>

      {/* Footer message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textAlign: "center",
            color: "#5f6b7a",
          }}
        >
          Welcome to the <strong>Holiday Selection System</strong>
          <br />
          Please select a date to continue
        </Typography>
      </motion.div>
    </Box>
  );
};

export default DateSelect;