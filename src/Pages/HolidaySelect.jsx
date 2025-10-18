import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Alert,
  Snackbar,
  Card,
  CardContent,
  InputAdornment,
  Divider,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  CalendarToday,
  Category,
  Description,
  Send,
} from "@mui/icons-material";

const HolidaySelect = () => {
  const [formData, setFormData] = useState({
    date: "",
    reason: "",
    holidayType: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const holidayOptions = [
    { 
      value: "public", 
      label: "Public Holiday"
    },
    { 
      value: "academic", 
      label: "Academic Holiday"
    },
    { 
      value: "festival", 
      label: "Festival Holiday"
    },
    { 
      value: "special", 
      label: "Special Leave"
    },
    { 
      value: "leave", 
      label: "Leave"
    },
    { 
      value: "drop", 
      label: "Drop"
    },
    { 
      value: "hostel", 
      label: "Hostel Holiday"
    },
    { 
      value: "college", 
      label: "College Holiday"
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Form submitted:", formData);
    
    setSnackbar({
      open: true,
      message: "Event successfully added to calendar",
      severity: "success",
    });
    
    setFormData({
      date: "",
      reason: "",
      holidayType: "",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        backgroundColor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              py: 4,
              px: 3,
              textAlign: "center",
            }}
          >
            <CalendarToday 
              sx={{ 
                fontSize: 48, 
                mb: 2,
                opacity: 0.9 
              }} 
            />
            <Typography 
              variant="h4" 
              fontWeight="600" 
              gutterBottom
            >
              Holiday Select
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ opacity: 0.9 }}
            >
              Add new events to the academic calendar
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Date Field */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    name="date"
                    label="Event Date"
                    value={formData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday color="action" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                {/* Event Type Field */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Event Type"
                    name="holidayType"
                    value={formData.holidayType}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Category color="action" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    size="medium"
                  >
                    <MenuItem value="">
                      <Typography color="text.secondary">
                        Select event type
                      </Typography>
                    </MenuItem>
                    {holidayOptions.map((opt) => (
                      <MenuItem 
                        key={opt.value} 
                        value={opt.value}
                      >
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Reason Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Event Description"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Provide details about this event..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment 
                          position="start" 
                          sx={{ alignSelf: 'flex-start', mt: 1.8 }}
                        >
                          <Description color="action" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>

                {/* Preview Section */}
                {(formData.date || formData.holidayType || formData.reason) && (
                  <Grid item xs={12}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Paper
                        sx={{
                          p: 3,
                          backgroundColor: "grey.50",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          gutterBottom 
                          color="primary.main"
                          fontWeight="600"
                        >
                          Event Preview
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={4}>
                            <Typography 
                              variant="subtitle2" 
                              color="text.secondary" 
                              gutterBottom
                            >
                              Date
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {formData.date 
                                ? new Date(formData.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : "Not specified"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography 
                              variant="subtitle2" 
                              color="text.secondary" 
                              gutterBottom
                            >
                              Type
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {formData.holidayType 
                                ? holidayOptions.find(opt => opt.value === formData.holidayType)?.label 
                                : "Not specified"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography 
                              variant="subtitle2" 
                              color="text.secondary" 
                              gutterBottom
                            >
                              Description
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {formData.reason || "Not specified"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </motion.div>
                  </Grid>
                )}

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box 
                    sx={{ 
                      display: "flex", 
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<Send />}
                      sx={{
                        px: 6,
                        py: 1.5,
                        borderRadius: 2,
                        minWidth: 200,
                        fontSize: "1rem",
                        fontWeight: "600",
                        textTransform: "none",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      Add Event
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {/* Success Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default HolidaySelect;