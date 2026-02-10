import React, { useEffect, useState, useMemo } from "react";
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Badge,
  Tabs,
  Tab,
  Avatar,
  AvatarGroup,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RoomIcon from "@mui/icons-material/Room";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import GroupIcon from "@mui/icons-material/Group";
import NumbersIcon from "@mui/icons-material/Numbers";
import FilterListIcon from "@mui/icons-material/FilterList";
import axios from "axios";
import { motion } from "framer-motion";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = import.meta.env.VITE_API_URL || "https://fredbox-backend.onrender.com";

const StudentDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedAdmissionNo, setSelectedAdmissionNo] = useState(null);
  const [expandedAdmissionNos, setExpandedAdmissionNos] = useState({});
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [viewMode, setViewMode] = useState("grouped"); // "grouped" or "all"
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");

  // 🟢 Fetch all apology requests
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/apology/all`);
      if (res.data?.success) {
        setStudents(res.data.data || []);
      } else setStudents([]);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🟣 Update Status (Approve/Reject)
  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/apology/update/${id}`, { status });
      fetchStudents();
    } catch (err) {
      console.error("❌ Error updating status:", err);
    }
  };

  // 🟡 Bulk Update Status
  const handleBulkStatusUpdate = async () => {
    try {
      const promises = selectedRequests.map(id =>
        axios.put(`${API_URL}/api/apology/update/${id}`, { status: bulkStatus })
      );
      await Promise.all(promises);
      fetchStudents();
      setSelectedRequests([]);
      setBulkActionDialog(false);
      setBulkStatus("");
    } catch (err) {
      console.error("❌ Error updating bulk status:", err);
    }
  };

  // 🔍 Filter Search
  const filtered = students.filter(
    (s) =>
      s.admissionNo?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      s.roomNo?.toLowerCase().includes(search.toLowerCase()) ||
      s.reason?.toLowerCase().includes(search.toLowerCase())
  );

  // 📊 Group by Admission Number
  const groupedByAdmissionNo = useMemo(() => {
    const groups = {};
    filtered.forEach(student => {
      const key = student.admissionNo;
      if (!groups[key]) {
        groups[key] = {
          studentName: student.studentName,
          roomNo: student.roomNo,
          requests: [],
          counts: {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0
          }
        };
      }
      groups[key].requests.push(student);
      groups[key].counts.total++;
      
      switch(student.status) {
        case 'Pending': groups[key].counts.pending++; break;
        case 'Approved': groups[key].counts.approved++; break;
        case 'Rejected': groups[key].counts.rejected++; break;
      }
    });
    return groups;
  }, [filtered]);

  // 📋 Get all grouped admission numbers
  const admissionNumbers = Object.keys(groupedByAdmissionNo);

  // 🔄 Toggle expand/collapse for admission number
  const toggleAdmissionNo = (admissionNo) => {
    setExpandedAdmissionNos(prev => ({
      ...prev,
      [admissionNo]: !prev[admissionNo]
    }));
  };

  // ✅ Select/Deselect all requests for admission number
  const toggleSelectAllRequests = (admissionNo) => {
    const group = groupedByAdmissionNo[admissionNo];
    const allIds = group.requests.map(r => r._id);
    
    if (allIds.every(id => selectedRequests.includes(id))) {
      // Deselect all
      setSelectedRequests(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      // Select all
      setSelectedRequests(prev => [...new Set([...prev, ...allIds])]);
    }
  };

  // ✅ Select/Deselect single request
  const toggleSelectRequest = (id) => {
    setSelectedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(requestId => requestId !== id)
        : [...prev, id]
    );
  };

  // 🎨 Status Chip Colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return { bg: "#d4edda", color: "#155724", icon: <CheckCircleIcon /> };
      case "Rejected":
        return { bg: "#f8d7da", color: "#721c24", icon: <CancelIcon /> };
      default:
        return { bg: "#fff3cd", color: "#856404", icon: <PendingActionsIcon /> };
    }
  };

  // 📱 Open View Details Dialog
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setViewDialog(true);
  };

  // 📱 Open Group Details
  const handleViewGroup = (admissionNo) => {
    setSelectedAdmissionNo(admissionNo);
  };

  // ============================
  // 📱 RESPONSIVE CARD VIEW - GROUPED BY ADMISSION
  // ============================
  const MobileGroupCardView = ({ admissionNo, group }) => {
    const isExpanded = expandedAdmissionNos[admissionNo];
    const pendingCount = group.counts.pending;
    const allSelected = group.requests.every(r => selectedRequests.includes(r._id));
    
    return (
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: pendingCount > 0 ? "2px solid #f59e0b" : "1px solid #e2e8f0",
          background: "#ffffff",
          overflow: 'hidden',
        }}
      >
        <CardContent>
          {/* Group Header */}
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="flex-start"
            sx={{ cursor: 'pointer' }}
            onClick={() => toggleAdmissionNo(admissionNo)}
          >
            <Box flex={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <BadgeIcon sx={{ fontSize: 20, color: "#0c5fbd" }} />
                <Box>
                  <Typography variant="h6" fontWeight="700" color="#1e293b">
                    {admissionNo}
                  </Typography>
                  <Typography variant="body2" color="#64748b">
                    {group.studentName} • Room: {group.roomNo}
                  </Typography>
                </Box>
              </Stack>
              
              {/* Status Counts */}
              <Stack direction="row" spacing={1} mt={1}>
                <Chip 
                  label={`Total: ${group.counts.total}`}
                  size="small"
                  sx={{ backgroundColor: '#e2e8f0', fontWeight: 600 }}
                />
                <Chip 
                  label={`Pending: ${group.counts.pending}`}
                  size="small"
                  sx={{ 
                    backgroundColor: '#fef3c7', 
                    color: '#92400e',
                    fontWeight: 600 
                  }}
                />
                <Chip 
                  label={`Approved: ${group.counts.approved}`}
                  size="small"
                  sx={{ 
                    backgroundColor: '#d1fae5', 
                    color: '#065f46',
                    fontWeight: 600 
                  }}
                />
              </Stack>
            </Box>
            
            <IconButton size="small">
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          {/* Selection Checkbox */}
          {pendingCount > 0 && (
            <Box display="flex" alignItems="center" mt={1}>
              <Checkbox
                checked={allSelected}
                onChange={() => toggleSelectAllRequests(admissionNo)}
                size="small"
              />
              <Typography variant="body2" color="#64748b">
                Select all {pendingCount} pending requests for bulk action
              </Typography>
            </Box>
          )}

          {/* Bulk Action Buttons */}
          {selectedRequests.some(id => 
            group.requests.some(r => r._id === id)
          ) && (
            <Stack direction="row" spacing={1} mt={1}>
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={() => {
                  setBulkStatus("Approved");
                  setBulkActionDialog(true);
                }}
                startIcon={<CheckCircleIcon />}
                sx={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Approve Selected
              </Button>
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={() => {
                  setBulkStatus("Rejected");
                  setBulkActionDialog(true);
                }}
                startIcon={<CancelIcon />}
                sx={{
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Reject Selected
              </Button>
            </Stack>
          )}

          {/* Expanded List of Requests */}
          <Collapse in={isExpanded}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="#64748b" gutterBottom>
              All Apology Requests ({group.requests.length})
            </Typography>
            
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {group.requests.map((request, index) => {
                const statusColor = getStatusColor(request.status);
                
                return (
                  <ListItem
                    key={request._id}
                    secondaryAction={
                      <Stack direction="row" spacing={0.5}>
                        {request.status === "Pending" && (
                          <Checkbox
                            checked={selectedRequests.includes(request._id)}
                            onChange={() => toggleSelectRequest(request._id)}
                            size="small"
                          />
                        )}
                        <IconButton 
                          size="small"
                          onClick={() => handleViewDetails(request)}
                        >
                          <VisibilityIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Stack>
                    }
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f8fafc' : 'transparent',
                      borderRadius: 1,
                      mb: 0.5,
                    }}
                  >
                    <ListItemIcon>
                      <Badge
                        badgeContent={index + 1}
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.6rem',
                            height: 16,
                            minWidth: 16,
                          }
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="500">
                          {request.reason.substring(0, 50)}...
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={2} alignItems="center" mt={0.5}>
                          <Typography variant="caption" color="#64748b">
                            {request.submittedBy} • {request.submittedAt}
                          </Typography>
                          <Chip
                            label={request.status}
                            size="small"
                            sx={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.color,
                              fontSize: '0.6rem',
                              height: 20,
                            }}
                          />
                        </Stack>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>

            {/* Individual Action Buttons for Pending Requests */}
            {group.requests.filter(r => r.status === "Pending").length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" color="#64748b" gutterBottom>
                  Quick Actions for Pending Requests:
                </Typography>
                <Grid container spacing={1}>
                  {group.requests
                    .filter(r => r.status === "Pending")
                    .map(request => (
                      <Grid item xs={12} key={request._id}>
                        <Paper variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" noWrap sx={{ flex: 1, mr: 1 }}>
                              {request.reason.substring(0, 40)}...
                            </Typography>
                            <Stack direction="row" spacing={0.5}>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleStatusUpdate(request._id, "Approved")}
                                startIcon={<CheckCircleIcon />}
                                sx={{
                                  background: "#10b981",
                                  textTransform: "none",
                                  fontSize: '0.7rem',
                                  minWidth: 80,
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleStatusUpdate(request._id, "Rejected")}
                                startIcon={<CancelIcon />}
                                sx={{
                                  background: "#ef4444",
                                  textTransform: "none",
                                  fontSize: '0.7rem',
                                  minWidth: 80,
                                }}
                              >
                                Reject
                              </Button>
                            </Stack>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
              </>
            )}
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  // ============================
  // 🖥️ DESKTOP TABLE VIEW - GROUPED
  // ============================
  const DesktopGroupedView = () => {
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ 
              background: 'linear-gradient(135deg, #0c5fbd 0%, #0889f3 100%)',
              '& th': { 
                color: 'white', 
                fontWeight: 700, 
                fontSize: '0.875rem',
                borderBottom: 'none',
                py: 2,
                textAlign: 'center'
              }
            }}>
              <TableCell>#</TableCell>
              <TableCell>Admission No & Student</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Total Requests</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>Rejected</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admissionNumbers.map((admissionNo, index) => {
              const group = groupedByAdmissionNo[admissionNo];
              const isExpanded = expandedAdmissionNos[admissionNo];
              
              return (
                <React.Fragment key={admissionNo}>
                  {/* Group Row */}
                  <TableRow
                    hover
                    sx={{ 
                      backgroundColor: isExpanded ? '#f0f9ff' : 'transparent',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f8fafc' }
                    }}
                    onClick={() => toggleAdmissionNo(admissionNo)}
                  >
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body1" fontWeight="700" color="#0c5fbd">
                          {admissionNo}
                        </Typography>
                        <Typography variant="body2" color="#64748b">
                          {group.studentName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={group.roomNo}
                        size="small"
                        sx={{ backgroundColor: '#e0f2fe', fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Badge
                        badgeContent={group.counts.total}
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.75rem',
                            height: 24,
                            minWidth: 24,
                          }
                        }}
                      >
                        <GroupIcon sx={{ color: '#0c5fbd' }} />
                      </Badge>
                    </TableCell>
                    <TableCell align="center">
                      {group.counts.pending > 0 ? (
                        <Chip 
                          label={group.counts.pending}
                          size="small"
                          sx={{ 
                            backgroundColor: '#fef3c7', 
                            color: '#92400e',
                            fontWeight: 700 
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="#94a3b8">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {group.counts.approved > 0 ? (
                        <Chip 
                          label={group.counts.approved}
                          size="small"
                          sx={{ 
                            backgroundColor: '#d1fae5', 
                            color: '#065f46',
                            fontWeight: 700 
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="#94a3b8">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {group.counts.rejected > 0 ? (
                        <Chip 
                          label={group.counts.rejected}
                          size="small"
                          sx={{ 
                            backgroundColor: '#fee2e2', 
                            color: '#991b1b',
                            fontWeight: 700 
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="#94a3b8">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAdmissionNo(admissionNo);
                          }}
                          startIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          sx={{ textTransform: 'none' }}
                        >
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Select all pending requests
                            const pendingIds = group.requests
                              .filter(r => r.status === "Pending")
                              .map(r => r._id);
                            if (pendingIds.length > 0) {
                              setSelectedRequests(prev => [...new Set([...prev, ...pendingIds])]);
                              setBulkStatus("Approved");
                              setBulkActionDialog(true);
                            }
                          }}
                          disabled={group.counts.pending === 0}
                          sx={{
                            background: "linear-gradient(135deg, #0c5fbd 0%, #0889f3 100%)",
                            textTransform: "none",
                          }}
                        >
                          Approve All
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Details Row */}
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ backgroundColor: '#f8fafc', py: 2 }}>
                        <Box sx={{ pl: 4 }}>
                          <Typography variant="subtitle2" color="#64748b" gutterBottom>
                            All Apology Requests for {admissionNo}:
                          </Typography>
                          
                          {/* Selection Checkbox */}
                          {group.counts.pending > 0 && (
                            <Box display="flex" alignItems="center" mb={2}>
                              <Checkbox
                                checked={group.requests.every(r => selectedRequests.includes(r._id))}
                                onChange={() => toggleSelectAllRequests(admissionNo)}
                                size="small"
                              />
                              <Typography variant="body2" color="#64748b">
                                Select all {group.counts.pending} pending requests for bulk action
                              </Typography>
                            </Box>
                          )}

                          {/* Requests Table */}
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#e2e8f0' }}>
                                <TableCell width="50px">#</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell width="120px">Submitted By</TableCell>
                                <TableCell width="150px">Submitted At</TableCell>
                                <TableCell width="100px">Status</TableCell>
                                <TableCell width="200px" align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {group.requests.map((request, idx) => {
                                const statusColor = getStatusColor(request.status);
                                
                                return (
                                  <TableRow key={request._id} hover>
                                    <TableCell>
                                      <Box display="flex" alignItems="center">
                                        {request.status === "Pending" && (
                                          <Checkbox
                                            checked={selectedRequests.includes(request._id)}
                                            onChange={() => toggleSelectRequest(request._id)}
                                            size="small"
                                          />
                                        )}
                                        <Typography variant="body2" ml={1}>
                                          {idx + 1}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <Tooltip title={request.reason}>
                                        <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                                          {request.reason}
                                        </Typography>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell>{request.submittedBy}</TableCell>
                                    <TableCell>{request.submittedAt}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={request.status}
                                        size="small"
                                        sx={{
                                          backgroundColor: statusColor.bg,
                                          color: statusColor.color,
                                          fontWeight: 600,
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <Stack direction="row" spacing={1} justifyContent="center">
                                        <IconButton
                                          size="small"
                                          onClick={() => handleViewDetails(request)}
                                          sx={{ color: '#0369a1' }}
                                        >
                                          <VisibilityIcon />
                                        </IconButton>
                                        {request.status === "Pending" && (
                                          <>
                                            <Button
                                              variant="contained"
                                              size="small"
                                              onClick={() => handleStatusUpdate(request._id, "Approved")}
                                              startIcon={<CheckCircleIcon />}
                                              sx={{
                                                background: "#10b981",
                                                textTransform: "none",
                                                fontSize: '0.75rem',
                                              }}
                                            >
                                              Approve
                                            </Button>
                                            <Button
                                              variant="contained"
                                              size="small"
                                              onClick={() => handleStatusUpdate(request._id, "Rejected")}
                                              startIcon={<CancelIcon />}
                                              sx={{
                                                background: "#ef4444",
                                                textTransform: "none",
                                                fontSize: '0.75rem',
                                              }}
                                            >
                                              Reject
                                            </Button>
                                          </>
                                        )}
                                      </Stack>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // ============================
  // 📊 BULK ACTION DIALOG
  // ============================
  const BulkActionDialog = () => (
    <Dialog open={bulkActionDialog} onClose={() => setBulkActionDialog(false)}>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          {bulkStatus === "Approved" ? (
            <CheckCircleIcon sx={{ color: '#10b981' }} />
          ) : (
            <CancelIcon sx={{ color: '#ef4444' }} />
          )}
          <Typography variant="h6">
            {bulkStatus === "Approved" ? "Approve Selected" : "Reject Selected"} Requests
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are about to {bulkStatus.toLowerCase()} {selectedRequests.length} apology request(s).
          This action cannot be undone.
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Selected Requests: {selectedRequests.length}
        </Typography>
        <List dense sx={{ maxHeight: 200, overflow: 'auto', mt: 1 }}>
          {selectedRequests.map((id, index) => {
            const request = students.find(s => s._id === id);
            return request ? (
              <ListItem key={id}>
                <ListItemText
                  primary={`${index + 1}. ${request.reason.substring(0, 60)}...`}
                  secondary={`${request.admissionNo} • ${request.studentName}`}
                />
              </ListItem>
            ) : null;
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setBulkActionDialog(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleBulkStatusUpdate}
          color={bulkStatus === "Approved" ? "success" : "error"}
        >
          Confirm {bulkStatus}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Typography
        variant={isMobile ? "h5" : "h4"}
        textAlign="center"
        sx={{
          fontWeight: 800,
          background: "linear-gradient(135deg, #0c5fbd 0%, #0889f3 100%)",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 2,
        }}
      >
        Student Apology Management
      </Typography>

      {/* Statistics Bar */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Grid container spacing={2} textAlign="center">
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="#0c5fbd" fontWeight="700">
              {admissionNumbers.length}
            </Typography>
            <Typography variant="caption" color="#64748b">
              Unique Students
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="#0c5fbd" fontWeight="700">
              {filtered.length}
            </Typography>
            <Typography variant="caption" color="#64748b">
              Total Requests
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="#f59e0b" fontWeight="700">
              {filtered.filter(s => s.status === "Pending").length}
            </Typography>
            <Typography variant="caption" color="#64748b">
              Pending
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="#10b981" fontWeight="700">
              {selectedRequests.length}
            </Typography>
            <Typography variant="caption" color="#64748b">
              Selected
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Card */}
      <Paper
        sx={{
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          background: "#ffffff",
          overflow: "hidden",
        }}
      >
        {/* Search and Controls */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
          }}
        >
          <Stack spacing={2}>
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search by Admission No, Student Name, Room No, Reason..."
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748b" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 1, backgroundColor: "white" },
              }}
            />

            {/* Control Buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between">
              <Stack direction="row" spacing={1}>
                <Button
                  variant={viewMode === "grouped" ? "contained" : "outlined"}
                  onClick={() => setViewMode("grouped")}
                  startIcon={<GroupIcon />}
                  sx={{ textTransform: "none" }}
                >
                  Grouped View
                </Button>
                <Button
                  variant={viewMode === "all" ? "contained" : "outlined"}
                  onClick={() => setViewMode("all")}
                  startIcon={<FilterListIcon />}
                  sx={{ textTransform: "none" }}
                >
                  All Requests
                </Button>
              </Stack>

              <Stack direction="row" spacing={1}>
                {selectedRequests.length > 0 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setBulkStatus("Approved");
                        setBulkActionDialog(true);
                      }}
                      startIcon={<CheckCircleIcon />}
                      sx={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        textTransform: "none",
                      }}
                    >
                      Approve Selected ({selectedRequests.length})
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setBulkStatus("Rejected");
                        setBulkActionDialog(true);
                      }}
                      startIcon={<CancelIcon />}
                      sx={{
                        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        textTransform: "none",
                      }}
                    >
                      Reject Selected ({selectedRequests.length})
                    </Button>
                  </>
                )}
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => {/* Add export function */}}
                  sx={{ textTransform: "none" }}
                >
                  Export
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {/* Content Area */}
        <Box sx={{ p: { xs: 1, sm: 2 } }}>
          {loading ? (
            <Box textAlign="center" py={8}>
              <CircularProgress size={60} sx={{ color: '#0c5fbd' }} />
              <Typography mt={2} color="#64748b">
                Loading apology requests...
              </Typography>
            </Box>
          ) : filtered.length === 0 ? (
            <Box textAlign="center" py={6}>
              <SearchIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
              <Typography variant="h6" color="#64748b">
                No apology requests found
              </Typography>
            </Box>
          ) : viewMode === "grouped" ? (
            isMobile ? (
              <Box>
                <Typography variant="subtitle1" color="#64748b" mb={2}>
                  Showing {admissionNumbers.length} student(s) with {filtered.length} total requests
                </Typography>
                {admissionNumbers.map(admissionNo => (
                  <MobileGroupCardView 
                    key={admissionNo} 
                    admissionNo={admissionNo}
                    group={groupedByAdmissionNo[admissionNo]}
                  />
                ))}
              </Box>
            ) : (
              <DesktopGroupedView />
            )
          ) : (
            <Box>
              {/* All Requests View (non-grouped) */}
              <Typography variant="h6" color="#64748b" mb={2}>
                All Apology Requests ({filtered.length})
              </Typography>
              {/* Add your non-grouped view here */}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Dialogs */}
      <BulkActionDialog />
      
      {/* View Details Dialog would go here */}
    </Box>
  );
};

export default StudentDetails;