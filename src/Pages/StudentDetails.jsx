import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  TableContainer,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Stack,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import { motion, AnimatePresence } from "framer-motion";

const StudentDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [students, setStudents] = useState([
    {
      id: 1,
      admissionNo: "12325038",
      semester: "S7",
      class: "ME",
      roomNo: "121",
      studentName: "ABHINAV P",
      reason: "LEAVE FROM HOSTEL WITHOUT PERMISSION",
      apologyNumber: "2025-07-16/5",
      applyDate: "2025-07-16",
      status: "APPROVED",
    },
    {
      id: 2,
      admissionNo: "12212022",
      semester: "S7",
      class: "CSE",
      roomNo: "118",
      studentName: "ALAN JOSEPH P V",
      reason: "LEAVE FROM HOSTEL WITHOUT PERMISSION",
      apologyNumber: "2025-07-16/6",
      applyDate: "2025-07-16",
      status: "APPROVED",
    },
    {
      id: 3,
      admissionNo: "12216005",
      semester: "S7",
      class: "MR",
      roomNo: "229",
      studentName: "ADNAN SADATH",
      reason: "MOBILE USE ON PRAYER TIME",
      apologyNumber: "2025-10-02/121",
      applyDate: "2025-10-02",
      status: "PENDING",
    },
    {
      id: 4,
      admissionNo: "12211009",
      semester: "S7",
      class: "CE",
      roomNo: "230",
      studentName: "GOKUL S",
      reason: "Another student room entry",
      apologyNumber: "2025-10-09/136",
      applyDate: "2025-10-09",
      status: "PENDING",
    },
  ]);

  const [search, setSearch] = useState("");

  const filtered = students.filter(
    (s) =>
      s.admissionNo.toLowerCase().includes(search.toLowerCase()) ||
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.class.toLowerCase().includes(search.toLowerCase()) ||
      s.roomNo.toLowerCase().includes(search.toLowerCase()) ||
      s.reason.toLowerCase().includes(search.toLowerCase())
  );

  const handleAccept = (id) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status: "APPROVED" } : student
      )
    );
  };

  // Mobile Card View
  const MobileCardView = ({ student }) => (
    <Card 
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ 
        mb: 2, 
        border: `1px solid ${
          student.status === "APPROVED" ? "#c6f6d5" : "#fed7d7"
        }`,
        background: student.status === "APPROVED" ? "#f0fff4" : "#fff5f5"
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {student.studentName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {student.admissionNo}
              </Typography>
            </Box>
            <Chip
              icon={student.status === "APPROVED" ? <CheckCircleIcon /> : <PendingActionsIcon />}
              label={student.status}
              size="small"
              color={student.status === "APPROVED" ? "success" : "warning"}
            />
          </Box>

          {/* Details */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary" display="block">
                Class & Sem
              </Typography>
              <Typography variant="body2" fontWeight="500">
                {student.class} • {student.semester}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary" display="block">
                Room No
              </Typography>
              <Typography variant="body2" fontWeight="500">
                {student.roomNo}
              </Typography>
            </Grid>
          </Grid>

          {/* Reason */}
          <Box>
            <Typography variant="caption" color="textSecondary" display="block">
              Reason
            </Typography>
            <Typography variant="body2">
              {student.reason}
            </Typography>
          </Box>

          {/* Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="textSecondary" display="block">
                Apology No
              </Typography>
              <Typography variant="body2" fontWeight="500">
                {student.apologyNumber.split('/')[1]}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <CalendarTodayIcon sx={{ fontSize: 16, color: '#64748b' }} />
              <Typography variant="caption" color="textSecondary">
                {student.applyDate}
              </Typography>
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 1 }}>
            <Tooltip title="View Details">
              <IconButton size="small">
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {student.status === "PENDING" && (
              <Button
                variant="contained"
                size="small"
                onClick={() => handleAccept(student.id)}
                startIcon={<CheckCircleIcon />}
                sx={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Approve
              </Button>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  // Tablet View - Compact Table
  const TabletTableView = () => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ 
            background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
            "& th": {
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderBottom: "none",
              py: 1,
            }
          }}>
            <TableCell>ID</TableCell>
            <TableCell>Student</TableCell>
            <TableCell>Class</TableCell>
            <TableCell>Room</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence>
            {filtered.map((row, index) => (
              <TableRow 
                key={row.id}
                component={motion.tr}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                hover
                sx={{ 
                  '&:last-child td': { borderBottom: "none" },
                  '&:hover': { backgroundColor: '#f8fafc' },
                }}
              >
                <TableCell sx={{ fontWeight: 600 }}>#{row.id}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="600" fontSize="0.875rem">
                      {row.studentName.split(' ')[0]}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {row.admissionNo}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${row.class}-${row.semester}`} 
                    size="small" 
                    sx={{ 
                      fontSize: "0.7rem",
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.roomNo} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontSize: "0.7rem" }}
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 150 }}>
                  <Tooltip title={row.reason}>
                    <Typography variant="caption" noWrap>
                      {row.reason.length > 30 ? row.reason.substring(0, 30) + '...' : row.reason}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={row.status === "APPROVED" ? "success" : "warning"}
                    sx={{ fontSize: "0.7rem", fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {row.status === "PENDING" && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAccept(row.id)}
                        sx={{
                          fontSize: "0.7rem",
                          background: "#10b981",
                          textTransform: "none",
                          minWidth: 60,
                        }}
                      >
                        Approve
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Desktop View - Full Table
  const DesktopTableView = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ 
            background: "linear-gradient(135deg, #0c5fbdff, #0889f3ff)",
            "& th": {
              color: "white",
              fontWeight: 600,
              fontSize: "0.875rem",
              borderBottom: "none",
              py: 2,
            }
          }}>
            <TableCell>ID</TableCell>
            <TableCell>Admission No</TableCell>
            <TableCell>Semester</TableCell>
            <TableCell>Class</TableCell>
            <TableCell>Room No</TableCell>
            <TableCell>Student Name</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Apology No</TableCell>
            <TableCell>Apply Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence>
            {filtered.map((row, index) => (
              <TableRow 
                key={row.id}
                component={motion.tr}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                hover
                sx={{ 
                  '&:last-child td': { borderBottom: "none" },
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>#{row.id}</TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="600">
                    {row.admissionNo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.semester} 
                    size="small" 
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.class} 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.roomNo} 
                    size="small" 
                    variant="filled"
                    sx={{ 
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="600">
                    {row.studentName}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Tooltip title={row.reason}>
                    <Typography variant="body2" noWrap>
                      {row.reason}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="#64748b" fontWeight="500">
                    {row.apologyNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="#64748b">
                    {row.applyDate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={row.status === "APPROVED" ? <CheckCircleIcon /> : <PendingActionsIcon />}
                    label={row.status}
                    size="small"
                    color={row.status === "APPROVED" ? "success" : "warning"}
                    sx={{ fontWeight: 600, minWidth: 120 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {row.status === "PENDING" && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAccept(row.id)}
                        startIcon={<CheckCircleIcon />}
                        sx={{
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Approve
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            textAlign: "center",
            mb: 1,
            background: "linear-gradient(135deg, #0c5fbdff, #0889f3ff)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Student Apology Management
        </Typography>
        <Typography
          variant={isMobile ? "body2" : "subtitle1"}
          sx={{
            color: "#64748b",
            textAlign: "center",
            mb: 3,
          }}
        >
          Review and manage student apology requests
        </Typography>
      </motion.div>

      {/* Main Card */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        {/* Search Section */}
        <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: "1px solid #e2e8f0" }}>
          <TextField
            fullWidth
            size={isMobile ? "small" : "medium"}
            placeholder="Search students..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#64748b" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: "#f8fafc",
              },
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <SearchIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 2 }} />
                <Typography variant="h6" color="#64748b" sx={{ mb: 1 }}>
                  No records found
                </Typography>
                <Typography variant="body2" color="#94a3b8">
                  Try adjusting your search criteria
                </Typography>
              </motion.div>
            </Box>
          ) : isMobile ? (
            <Box>
              {filtered.map((student) => (
                <MobileCardView key={student.id} student={student} />
              ))}
            </Box>
          ) : isTablet ? (
            <TabletTableView />
          ) : (
            <DesktopTableView />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentDetails;