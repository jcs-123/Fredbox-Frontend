import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Container,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import ComplaintIcon from "@mui/icons-material/ReportProblem";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StudentViewRequestModal from "../Components/StudentViewRequestModal";
import ApologyViewModal from "../Components/ApologyViewModal";

const UserForm = () => {
  const [formData, setFormData] = useState({
    admissionNo: "",
    roomNo: "",
    name: "",
    leavingDate: "",
    leavingTime: "",
    returningDate: "",
    returningTime: "",
    reason: "",
    complaint: "",
  });
   const [openModal, setOpenModal] = useState(false);
  const [openApology, setOpenApology] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Sample payment data for all months
  const paymentData = [
    { month: "January 2025", amount: 4500, status: "Paid", dueDate: "05-01-2025", paidDate: "03-01-2025", transactionId: "TXN001234" },
    { month: "February 2025", amount: 4500, status: "Paid", dueDate: "05-02-2025", paidDate: "02-02-2025", transactionId: "TXN001235" },
    { month: "March 2025", amount: 4500, status: "Paid", dueDate: "05-03-2025", paidDate: "04-03-2025", transactionId: "TXN001236" },
    { month: "April 2025", amount: 4500, status: "Paid", dueDate: "05-04-2025", paidDate: "01-04-2025", transactionId: "TXN001237" },
    { month: "May 2025", amount: 4500, status: "Pending", dueDate: "05-05-2025", paidDate: "-", transactionId: "-" },
    { month: "June 2025", amount: 4500, status: "Pending", dueDate: "05-06-2025", paidDate: "-", transactionId: "-" },
    { month: "July 2025", amount: 4500, status: "Pending", dueDate: "05-07-2025", paidDate: "-", transactionId: "-" },
    { month: "August 2025", amount: 4500, status: "Pending", dueDate: "05-08-2025", paidDate: "-", transactionId: "-" },
    { month: "September 2025", amount: 4500, status: "Pending", dueDate: "05-09-2025", paidDate: "-", transactionId: "-" },
    { month: "October 2025", amount: 4500, status: "Pending", dueDate: "05-10-2025", paidDate: "-", transactionId: "-" },
    { month: "November 2025", amount: 4500, status: "Pending", dueDate: "05-11-2025", paidDate: "-", transactionId: "-" },
    { month: "December 2025", amount: 4500, status: "Pending", dueDate: "05-12-2025", paidDate: "-", transactionId: "-" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (section) => {
    alert(`${section} submitted successfully!`);
    console.log("Form Data:", formData);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePaymentDialogOpen = () => {
    setPaymentDialogOpen(true);
  };

  const handlePaymentDialogClose = () => {
    setPaymentDialogOpen(false);
  };

  const getStatusChip = (status) => {
    return status === "Paid" ? 
      <Chip label="Paid" color="success" size="small" /> : 
      <Chip label="Pending" color="warning" size="small" />;
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, color: "#00bfa6" }}>
        SIM Portal
      </Typography>
      <List>
        <ListItem button>
          <LogoutIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
          <ListItemText primary="Logout" />
        </ListItem>
        <ListItem button>
          <LockResetIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
          <ListItemText primary="Change Password" />
        </ListItem>
      </List>
    </Box>
  );

  const totalPaid = paymentData.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = paymentData.filter(p => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0);

  return (
    <Box
      sx={{
        fontFamily: "'Inter', 'Poppins', sans-serif",
        bgcolor: "#f8fafc",
        minHeight: "100vh",
        color: "#1e293b",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ---------- Modern Header ---------- */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "white",
          color: "#1e293b",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              background: "linear-gradient(135deg, #00bfa6 0%, #009688 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SIM
          </Typography>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: "#64748b" }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box display="flex" gap={3} alignItems="center">
              <Button
                startIcon={<LockResetIcon />}
                sx={{
                  color: "#64748b",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    color: "#00bfa6",
                    backgroundColor: "rgba(0, 191, 166, 0.04)",
                  },
                }}
              >
                Change Password
              </Button>
              <Button
                startIcon={<LogoutIcon />}
                sx={{
                  color: "#64748b",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    color: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.04)",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* ---------- Main Content ---------- */}
      <Container maxWidth="lg" sx={{ mt: { xs: 3, md: 5 }, mb: 6, px: { xs: 2, sm: 3 }, flex: 1 }}>
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              mb: 4,
              background: "linear-gradient(135deg, #00bfa6 0%, #009688 100%)",
              color: "white",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0, 191, 166, 0.2)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Welcome to Student Portal
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage your mess cut permissions, complaints
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <Grid container spacing={3}>
          {/* Student Details Card */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  background: "white",
                  height: "100%",
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <PersonIcon sx={{ color: "#00bfa6", mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Student Details
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="admissionNo"
                      label="Admission No."
                      fullWidth
                      size="small"
                      value={formData.admissionNo}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="roomNo"
                      label="Room No."
                      fullWidth
                      size="small"
                      value={formData.roomNo}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      label="Full Name"
                      fullWidth
                      size="small"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          </Grid>

          {/* Mess Cut Permission Form */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  background: "white",
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <EventIcon sx={{ color: "#00bfa6", mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Mess Cut Permission
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 3, color: "gray", fontSize: "0.875rem" }}>
                  Permission requested here is just for mess cut only. Permission to leave and enter
                  hostel should be sought separately via proper channel.
                  <br />
                  <Box component="span" fontWeight={600} color="#00bfa6">
                    For further enquiry: 9446047155
                  </Box>
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="leavingDate"
                      label="Leaving Date"
                      type="date"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={formData.leavingDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="leavingTime"
                      label="Leaving Time"
                      type="time"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={formData.leavingTime}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="returningDate"
                      label="Returning Date"
                      type="date"
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={formData.returningDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="returningTime"
                      label="Returning Time"
                      select
                      fullWidth
                      size="small"
                      value={formData.returningTime}
                      onChange={handleChange}
                    >
                      <MenuItem value="">Select Time</MenuItem>
                      <MenuItem value="Morning">Morning</MenuItem>
                      <MenuItem value="Evening">Evening</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="reason"
                      label="Reason for Mess Cut"
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      value={formData.reason}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Box mt={4} display="flex" gap={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#00bfa6",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 3,
                      "&:hover": { bgcolor: "#009688" },
                    }}
                    onClick={() => handleSubmit("Mess Cut Permission")}
                  >
                    Submit Request
                  </Button>
                      <Button
        variant="outlined"
        sx={{
          borderColor: "#64748b",
          color: "#64748b",
          textTransform: "none",
          fontWeight: 500,
          "&:hover": {
            borderColor: "#00bfa6",
            color: "#00bfa6",
          },
        }}
        onClick={() => setOpenModal(true)} // ✅ Open modal on click
      >
        View Requests
      </Button>

      {/* ---------- Modal Component ---------- */}
      <StudentViewRequestModal
        open={openModal}
        handleClose={() => setOpenModal(false)} // ✅ Close modal function
      />
                      <Button
        variant="outlined"
        sx={{
          borderColor: "#64748b",
          color: "#64748b",
          textTransform: "none",
          fontWeight: 500,
          "&:hover": {
            borderColor: "#00bfa6",
            color: "#00bfa6",
          },
        }}
        onClick={() => setOpenApology(true)} // ✅ open modal
      >
        Apology View
      </Button>

      <ApologyViewModal
        open={openApology}
        handleClose={() => setOpenApology(false)}
      />
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Payment Summary Card */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  background: "white",
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
                  <Box display="flex" alignItems="center">
                    <PaymentIcon sx={{ color: "#00bfa6", mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Payment Summary
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={handlePaymentDialogOpen}
                    sx={{
                      bgcolor: "#00bfa6",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#009688" },
                    }}
                  >
                    View All Payment Sessions
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="body2" color="#16a34a" fontWeight={600} gutterBottom>
                          Total Paid
                        </Typography>
                        <Typography variant="h5" color="#16a34a" fontWeight={700}>
                          ₹{totalPaid}
                        </Typography>
                        <Typography variant="caption" color="#16a34a">
                          {paymentData.filter(p => p.status === "Paid").length} months paid
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: "#fef2f2", border: "1px solid #fecaca" }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="body2" color="#dc2626" fontWeight={600} gutterBottom>
                          Total Pending
                        </Typography>
                        <Typography variant="h5" color="#dc2626" fontWeight={700}>
                          ₹{totalPending}
                        </Typography>
                        <Typography variant="caption" color="#dc2626">
                          {paymentData.filter(p => p.status === "Pending").length} months pending
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                 
                </Grid>

                <Box mt={3} display="flex" gap={2} flexWrap="wrap">
              
                  <Button
                    variant="outlined"
                    startIcon={<ReceiptIcon />}
                    sx={{
                      borderColor: "#00bfa6",
                      color: "#00bfa6",
                      textTransform: "none",
                      fontWeight: 500,
                      "&:hover": {
                        bgcolor: "#00bfa6",
                        color: "white",
                      },
                    }}
                  >
                    Download Payment History
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Complaint Form */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  background: "white",
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <ComplaintIcon sx={{ color: "#00bfa6", mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Submit Complaint
                  </Typography>
                </Box>

                <TextField
                  name="complaint"
                  label="Describe your complaint..."
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.complaint}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />

                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#00bfa6",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 3,
                      "&:hover": { bgcolor: "#009688" },
                    }}
                    onClick={() => handleSubmit("Complaint")}
                  >
                    Submit Complaint
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#64748b",
                      color: "#64748b",
                      textTransform: "none",
                      fontWeight: 500,
                      "&:hover": {
                        borderColor: "#00bfa6",
                        color: "#00bfa6",
                      },
                    }}
                  >
                    View Complaints
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Payment Details Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={handlePaymentDialogClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <CalendarMonthIcon sx={{ color: "#00bfa6", mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              Monthly Payment Details - All Sessions
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8fafc" }}>Month</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8fafc" }}>Amount (₹)</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8fafc" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8fafc" }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8fafc" }}>Paid Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8fafc" }}>Transaction ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#f8fafc" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentData.map((payment, index) => (
                  <TableRow 
                    key={index}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { bgcolor: '#f8fafc' }
                    }}
                  >
                    <TableCell>{payment.month}</TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                    <TableCell>{getStatusChip(payment.status)}</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell>{payment.paidDate}</TableCell>
                    <TableCell>{payment.transactionId}</TableCell>
                    <TableCell>
                      {payment.status === "Pending" ? (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<PaymentIcon />}
                          sx={{
                            bgcolor: "#00bfa6",
                            textTransform: "none",
                            fontSize: "0.75rem",
                            "&:hover": { bgcolor: "#009688" },
                          }}
                        >
                          Pay Now
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ReceiptIcon />}
                          sx={{
                            textTransform: "none",
                            fontSize: "0.75rem",
                            borderColor: "#00bfa6",
                            color: "#00bfa6",
                          }}
                        >
                          Receipt
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePaymentDialogClose} sx={{ textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------- Full Width Footer ---------- */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#1e293b",
          color: "white",
          py: 4,
          width: '100%',
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
     
          
          <Box 
            sx={{ 
              borderTop: '1px solid #374151', 
              mt: 4, 
              pt: 3, 
              textAlign: 'center',
              opacity: 0.7
            }}
          >
            <Typography variant="body2">
              © 2025 All Rights Reserved By JCS@JEC | Student Information Management System
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.6 }}>
              Version 2.1.0 | Last updated: October 2025
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default UserForm;