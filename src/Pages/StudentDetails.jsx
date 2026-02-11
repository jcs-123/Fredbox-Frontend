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
  Menu,
  MenuItem,
  Fab,
  Drawer,
  ListItemButton,
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SortIcon from "@mui/icons-material/Sort";
import RefreshIcon from "@mui/icons-material/Refresh";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import PrintIcon from "@mui/icons-material/Print";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = import.meta.env.VITE_API_URL || "https://fredbox-backend.onrender.com";

const StudentDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedAdmissionNo, setSelectedAdmissionNo] = useState(null);
  const [expandedAdmissionNos, setExpandedAdmissionNos] = useState({});
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [viewMode, setViewMode] = useState("grouped");
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [loadingBulk, setLoadingBulk] = useState(false);

  // Fetch all apology requests
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/apology/all`);
      if (res.data?.success) {
        setStudents(res.data.data || []);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Update Status (Approve/Reject)
  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/apology/update/${id}`, { status });
      fetchStudents();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Bulk Update Status
  const handleBulkStatusUpdate = async () => {
    try {
      setLoadingBulk(true);
      const promises = selectedRequests.map(id =>
        axios.put(`${API_URL}/api/apology/update/${id}`, { status: bulkStatus })
      );
      await Promise.all(promises);
      await fetchStudents();
      setSelectedRequests([]);
      setBulkActionDialog(false);
      setBulkStatus("");
    } catch (err) {
      console.error("Error updating bulk status:", err);
    } finally {
      setLoadingBulk(false);
    }
  };

  // Apply filters and sorting
  const filteredAndSorted = useMemo(() => {
    let filtered = students.filter(
      (s) =>
        s.admissionNo?.toLowerCase().includes(search.toLowerCase()) ||
        s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        s.roomNo?.toLowerCase().includes(search.toLowerCase()) ||
        s.reason?.toLowerCase().includes(search.toLowerCase())
    );

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || b.submittedAt) - new Date(a.createdAt || a.submittedAt);
        case "oldest":
          return new Date(a.createdAt || a.submittedAt) - new Date(b.createdAt || b.submittedAt);
        case "admissionNo":
          return a.admissionNo?.localeCompare(b.admissionNo);
        case "status":
          return a.status?.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [students, search, statusFilter, sortBy]);

  // Group by Admission Number
  const groupedByAdmissionNo = useMemo(() => {
    const groups = {};
    filteredAndSorted.forEach(student => {
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
  }, [filteredAndSorted]);

  const admissionNumbers = Object.keys(groupedByAdmissionNo);

  // Toggle expand/collapse for admission number
  const toggleAdmissionNo = (admissionNo) => {
    setExpandedAdmissionNos(prev => ({
      ...prev,
      [admissionNo]: !prev[admissionNo]
    }));
  };

  // Select/Deselect all requests
  const toggleSelectAllRequests = (admissionNo) => {
    const group = groupedByAdmissionNo[admissionNo];
    const allIds = group.requests.map(r => r._id);
    
    if (allIds.every(id => selectedRequests.includes(id))) {
      setSelectedRequests(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setSelectedRequests(prev => [...new Set([...prev, ...allIds])]);
    }
  };

  // Select/Deselect single request
  const toggleSelectRequest = (id) => {
    setSelectedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(requestId => requestId !== id)
        : [...prev, id]
    );
  };

  // Select all pending requests
  const selectAllPending = () => {
    const pendingIds = filteredAndSorted
      .filter(s => s.status === "Pending")
      .map(s => s._id);
    setSelectedRequests(pendingIds);
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedRequests([]);
  };

  // Status Chip Colors
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

  // Mobile Card View for Grouped Mode
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
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          border: pendingCount > 0 ? "2px solid #f59e0b" : "1px solid #e2e8f0",
          background: "#ffffff",
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 2 }}>
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
                  <Typography variant="subtitle1" fontWeight="700" color="#1e293b">
                    {admissionNo}
                  </Typography>
                  <Typography variant="caption" color="#64748b">
                    {group.studentName} • Room: {group.roomNo}
                  </Typography>
                </Box>
              </Stack>
              
              {/* Status Counts */}
              <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap" gap={0.5}>
                <Chip 
                  label={`Total: ${group.counts.total}`}
                  size="small"
                  sx={{ backgroundColor: '#e2e8f0', fontWeight: 600 }}
                />
                {group.counts.pending > 0 && (
                  <Chip 
                    label={`Pending: ${group.counts.pending}`}
                    size="small"
                    sx={{ 
                      backgroundColor: '#fef3c7', 
                      color: '#92400e',
                      fontWeight: 600 
                    }}
                  />
                )}
                {group.counts.approved > 0 && (
                  <Chip 
                    label={`Approved: ${group.counts.approved}`}
                    size="small"
                    sx={{ 
                      backgroundColor: '#d1fae5', 
                      color: '#065f46',
                      fontWeight: 600 
                    }}
                  />
                )}
                {group.counts.rejected > 0 && (
                  <Chip 
                    label={`Rejected: ${group.counts.rejected}`}
                    size="small"
                    sx={{ 
                      backgroundColor: '#fee2e2', 
                      color: '#991b1b',
                      fontWeight: 600 
                    }}
                  />
                )}
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
              <Typography variant="caption" color="#64748b">
                Select all pending requests
              </Typography>
            </Box>
          )}

          {/* Collapsed View - Quick Actions */}
          {!isExpanded && pendingCount > 0 && (
            <Stack direction="row" spacing={1} mt={1}>
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  const pendingIds = group.requests
                    .filter(r => r.status === "Pending")
                    .map(r => r._id);
                  setSelectedRequests(prev => [...new Set([...prev, ...pendingIds])]);
                  setBulkStatus("Approved");
                  setBulkActionDialog(true);
                }}
                startIcon={<CheckCircleIcon />}
                sx={{
                  background: "#10b981",
                  textTransform: "none",
                  fontSize: '0.7rem',
                }}
              >
                Approve All
              </Button>
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  const pendingIds = group.requests
                    .filter(r => r.status === "Pending")
                    .map(r => r._id);
                  setSelectedRequests(prev => [...new Set([...prev, ...pendingIds])]);
                  setBulkStatus("Rejected");
                  setBulkActionDialog(true);
                }}
                startIcon={<CancelIcon />}
                sx={{
                  background: "#ef4444",
                  textTransform: "none",
                  fontSize: '0.7rem',
                }}
              >
                Reject All
              </Button>
            </Stack>
          )}

          {/* Expanded View */}
          <Collapse in={isExpanded}>
            <Divider sx={{ my: 1.5 }} />
            
            {/* Requests List */}
            <List dense disablePadding>
              {group.requests.map((request, index) => {
                const statusColor = getStatusColor(request.status);
                
                return (
                  <ListItem
                    key={request._id}
                    disablePadding
                    secondaryAction={
                      <Stack direction="row" spacing={0.5}>
                        {request.status === "Pending" && (
                          <Checkbox
                            checked={selectedRequests.includes(request._id)}
                            onChange={() => toggleSelectRequest(request._id)}
                            size="small"
                            sx={{ p: 0.5 }}
                          />
                        )}
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setSelectedStudent(request);
                            setViewDialog(true);
                          }}
                          sx={{ p: 0.5 }}
                        >
                          <VisibilityIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Stack>
                    }
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f8fafc' : 'transparent',
                      borderRadius: 1,
                      mb: 0.5,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: statusColor.bg,
                          color: statusColor.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {index + 1}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" fontWeight="500" noWrap>
                          {request.reason.substring(0, 40)}...
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                          <Typography variant="caption" color="#64748b">
                            {request.submittedAt}
                          </Typography>
                          <Chip
                            label={request.status}
                            size="small"
                            sx={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.color,
                              fontSize: '0.6rem',
                              height: 18,
                              '& .MuiChip-label': { px: 0.5 }
                            }}
                          />
                        </Stack>
                      }
                      sx={{ '& .MuiListItemText-secondary': { display: 'flex', alignItems: 'center' } }}
                    />
                  </ListItem>
                );
              })}
            </List>

            {/* Quick Action Buttons for Pending Requests */}
            {group.requests.filter(r => r.status === "Pending").length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="#64748b" gutterBottom>
                  Quick Actions:
                </Typography>
                <Grid container spacing={0.5}>
                  {group.requests
                    .filter(r => r.status === "Pending")
                    .slice(0, 2) // Limit to 2 for mobile
                    .map(request => (
                      <Grid item xs={12} key={request._id}>
                        <Box sx={{ 
                          p: 1, 
                          borderRadius: 1,
                          backgroundColor: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <Typography variant="caption" noWrap sx={{ flex: 1, mr: 1 }}>
                            {request.reason.substring(0, 30)}...
                          </Typography>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              size="small"
                              onClick={() => handleStatusUpdate(request._id, "Approved")}
                              sx={{ 
                                backgroundColor: '#10b981',
                                color: 'white',
                                '&:hover': { backgroundColor: '#059669' },
                                p: 0.5
                              }}
                            >
                              <CheckCircleIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleStatusUpdate(request._id, "Rejected")}
                              sx={{ 
                                backgroundColor: '#ef4444',
                                color: 'white',
                                '&:hover': { backgroundColor: '#dc2626' },
                                p: 0.5
                              }}
                            >
                              <CancelIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Stack>
                        </Box>
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

  // Mobile List View for All Requests
  const MobileAllRequestsView = () => {
    return (
      <Box>
        {filteredAndSorted.map((request, index) => {
          const statusColor = getStatusColor(request.status);
          
          return (
            <Card
              key={request._id}
              sx={{
                mb: 1,
                borderRadius: 1,
                borderLeft: `4px solid ${statusColor.bg}`,
              }}
            >
              <CardContent sx={{ p: 1.5 }}>
                <Stack spacing={1}>
                  {/* Header */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600">
                        {request.studentName}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" color="#64748b">
                          {request.admissionNo}
                        </Typography>
                        <Typography variant="caption" color="#64748b">
                          • Room {request.roomNo}
                        </Typography>
                      </Stack>
                    </Box>
                    <Chip
                      label={request.status}
                      size="small"
                      sx={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.color,
                        fontSize: '0.65rem',
                        height: 22,
                      }}
                    />
                  </Box>

                  {/* Reason */}
                  <Typography variant="body2" color="text.secondary">
                    {request.reason.length > 80 
                      ? `${request.reason.substring(0, 80)}...` 
                      : request.reason}
                  </Typography>

                  {/* Footer */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="#64748b">
                      {request.submittedBy} • {request.submittedAt}
                    </Typography>
                    
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
                        onClick={() => {
                          setSelectedStudent(request);
                          setViewDialog(true);
                        }}
                      >
                        <VisibilityIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      {request.status === "Pending" && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleStatusUpdate(request._id, "Approved")}
                            sx={{ 
                              backgroundColor: '#10b981',
                              color: 'white',
                              '&:hover': { backgroundColor: '#059669' }
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleStatusUpdate(request._id, "Rejected")}
                            sx={{ 
                              backgroundColor: '#ef4444',
                              color: 'white',
                              '&:hover': { backgroundColor: '#dc2626' }
                            }}
                          >
                            <CancelIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );
  };

  // Tablet View (Combined card and table)
  const TabletView = () => {
    if (viewMode === "grouped") {
      return (
        <Grid container spacing={2}>
          {admissionNumbers.map(admissionNo => {
            const group = groupedByAdmissionNo[admissionNo];
            const isExpanded = expandedAdmissionNos[admissionNo];
            
            return (
              <Grid item xs={12} md={6} key={admissionNo}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    {/* Group Header */}
                    <Stack spacing={1}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Stack>
                          <Typography variant="h6" color="#0c5fbd">
                            {admissionNo}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {group.studentName} • Room {group.roomNo}
                          </Typography>
                        </Stack>
                        <IconButton 
                          size="small" 
                          onClick={() => toggleAdmissionNo(admissionNo)}
                        >
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>

                      {/* Stats */}
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip 
                          label={`Total: ${group.counts.total}`}
                          size="small"
                          color="default"
                        />
                        <Chip 
                          label={`Pending: ${group.counts.pending}`}
                          size="small"
                          sx={{ 
                            backgroundColor: '#fef3c7', 
                            color: '#92400e' 
                          }}
                        />
                        <Chip 
                          label={`Approved: ${group.counts.approved}`}
                          size="small"
                          sx={{ 
                            backgroundColor: '#d1fae5', 
                            color: '#065f46' 
                          }}
                        />
                      </Box>

                      {/* Quick Actions */}
                      {group.counts.pending > 0 && (
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            onClick={() => {
                              const pendingIds = group.requests
                                .filter(r => r.status === "Pending")
                                .map(r => r._id);
                              setSelectedRequests(prev => [...new Set([...prev, ...pendingIds])]);
                              setBulkStatus("Approved");
                              setBulkActionDialog(true);
                            }}
                            startIcon={<CheckCircleIcon />}
                            sx={{
                              background: "#10b981",
                              textTransform: "none",
                            }}
                          >
                            Approve All
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            onClick={() => {
                              const pendingIds = group.requests
                                .filter(r => r.status === "Pending")
                                .map(r => r._id);
                              setSelectedRequests(prev => [...new Set([...prev, ...pendingIds])]);
                              setBulkStatus("Rejected");
                              setBulkActionDialog(true);
                            }}
                            startIcon={<CancelIcon />}
                            sx={{
                              background: "#ef4444",
                              textTransform: "none",
                            }}
                          >
                            Reject All
                          </Button>
                        </Stack>
                      )}
                    </Stack>

                    {/* Expanded Content */}
                    <Collapse in={isExpanded}>
                      <Divider sx={{ my: 2 }} />
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell align="right">Actions</TableCell>
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
                                    <Typography variant="body2" noWrap>
                                      {request.reason.substring(0, 40)}...
                                    </Typography>
                                  </Tooltip>
                                </TableCell>
                                <TableCell align="right">
                                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedStudent(request);
                                        setViewDialog(true);
                                      }}
                                    >
                                      <VisibilityIcon />
                                    </IconButton>
                                    {request.status === "Pending" && (
                                      <>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleStatusUpdate(request._id, "Approved")}
                                          sx={{ color: '#10b981' }}
                                        >
                                          <CheckCircleIcon />
                                        </IconButton>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleStatusUpdate(request._id, "Rejected")}
                                          sx={{ color: '#ef4444' }}
                                        >
                                          <CancelIcon />
                                        </IconButton>
                                      </>
                                    )}
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      );
    } else {
      return (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell>Student</TableCell>
                <TableCell>Admission No</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSorted.map((request) => {
                const statusColor = getStatusColor(request.status);
                
                return (
                  <TableRow key={request._id} hover>
                    <TableCell>
                      <Stack>
                        <Typography variant="body2" fontWeight="500">
                          {request.studentName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Room {request.roomNo}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{request.admissionNo}</TableCell>
                    <TableCell>
                      <Tooltip title={request.reason}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {request.reason.substring(0, 50)}...
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        size="small"
                        sx={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.color,
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        {request.status === "Pending" && (
                          <Checkbox
                            checked={selectedRequests.includes(request._id)}
                            onChange={() => toggleSelectRequest(request._id)}
                            size="small"
                          />
                        )}
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedStudent(request);
                            setViewDialog(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        {request.status === "Pending" && (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => handleStatusUpdate(request._id, "Approved")}
                              sx={{ color: '#10b981' }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleStatusUpdate(request._id, "Rejected")}
                              sx={{ color: '#ef4444' }}
                            >
                              <CancelIcon />
                            </IconButton>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  // Desktop Table View
  const DesktopGroupedView = () => {
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
              <TableCell>#</TableCell>
              <TableCell>Student Details</TableCell>
              <TableCell>Room</TableCell>
              <TableCell align="center">Requests</TableCell>
              <TableCell align="center">Status Summary</TableCell>
              <TableCell align="center">Actions</TableCell>
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
                      backgroundColor: isExpanded ? '#f8fafc' : 'transparent',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleAdmissionNo(admissionNo)}
                  >
                    <TableCell>
                      <Typography fontWeight="600">{index + 1}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography fontWeight="700" color="#0c5fbd">
                          {admissionNo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {group.studentName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`Room ${group.roomNo}`}
                        size="small"
                        variant="outlined"
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
                    <TableCell>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        {group.counts.pending > 0 && (
                          <Chip 
                            label={`${group.counts.pending} Pending`}
                            size="small"
                            sx={{ 
                              backgroundColor: '#fef3c7', 
                              color: '#92400e' 
                            }}
                          />
                        )}
                        {group.counts.approved > 0 && (
                          <Chip 
                            label={`${group.counts.approved} Approved`}
                            size="small"
                            sx={{ 
                              backgroundColor: '#d1fae5', 
                              color: '#065f46' 
                            }}
                          />
                        )}
                        {group.counts.rejected > 0 && (
                          <Chip 
                            label={`${group.counts.rejected} Rejected`}
                            size="small"
                            sx={{ 
                              backgroundColor: '#fee2e2', 
                              color: '#991b1b' 
                            }}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
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
                        {group.counts.pending > 0 && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              const pendingIds = group.requests
                                .filter(r => r.status === "Pending")
                                .map(r => r._id);
                              setSelectedRequests(pendingIds);
                              setBulkStatus("Approved");
                              setBulkActionDialog(true);
                            }}
                            sx={{
                              background: "#10b981",
                              textTransform: "none",
                            }}
                          >
                            Approve All
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ backgroundColor: '#f8fafc', py: 2 }}>
                        <Box sx={{ pl: 4, pr: 2 }}>
                          <Stack spacing={2}>
                            {/* Selection Controls */}
                            {group.counts.pending > 0 && (
                              <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                  <Checkbox
                                    checked={group.requests.every(r => selectedRequests.includes(r._id))}
                                    onChange={() => toggleSelectAllRequests(admissionNo)}
                                    size="small"
                                  />
                                  <Typography variant="body2" color="text.secondary">
                                    Select all {group.counts.pending} pending requests
                                  </Typography>
                                </Box>
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() => {
                                    const pendingIds = group.requests
                                      .filter(r => r.status === "Pending")
                                      .map(r => r._id);
                                    setSelectedRequests(pendingIds);
                                    setBulkStatus("Approved");
                                    setBulkActionDialog(true);
                                  }}
                                  sx={{ textTransform: 'none' }}
                                >
                                  Quick Approve All
                                </Button>
                              </Box>
                            )}

                            {/* Requests Table */}
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell width="60px">#</TableCell>
                                  <TableCell>Reason</TableCell>
                                  <TableCell width="120px">Submitted By</TableCell>
                                  <TableCell width="150px">Date</TableCell>
                                  <TableCell width="100px">Status</TableCell>
                                  <TableCell width="180px" align="center">Actions</TableCell>
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
                                        <Typography variant="body2">
                                          {request.reason}
                                        </Typography>
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
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                          <Button
                                            size="small"
                                            onClick={() => {
                                              setSelectedStudent(request);
                                              setViewDialog(true);
                                            }}
                                            startIcon={<VisibilityIcon />}
                                            sx={{ textTransform: 'none' }}
                                          >
                                            View
                                          </Button>
                                          {request.status === "Pending" && (
                                            <>
                                              <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleStatusUpdate(request._id, "Approved")}
                                                sx={{
                                                  background: "#10b981",
                                                  textTransform: "none",
                                                  minWidth: 90,
                                                }}
                                              >
                                                Approve
                                              </Button>
                                              <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleStatusUpdate(request._id, "Rejected")}
                                                sx={{
                                                  background: "#ef4444",
                                                  textTransform: "none",
                                                  minWidth: 90,
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
                          </Stack>
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

  // Bulk Action Dialog
  const BulkActionDialog = () => (
    <Dialog 
      open={bulkActionDialog} 
      onClose={() => !loadingBulk && setBulkActionDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          {bulkStatus === "Approved" ? (
            <CheckCircleIcon sx={{ color: '#10b981' }} />
          ) : (
            <CancelIcon sx={{ color: '#ef4444' }} />
          )}
          <Typography variant="h6">
            {bulkStatus} Selected Requests
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Alert 
          severity={bulkStatus === "Approved" ? "success" : "warning"} 
          sx={{ mb: 2 }}
        >
          You are about to {bulkStatus.toLowerCase()} {selectedRequests.length} apology request(s).
          This action cannot be undone.
        </Alert>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Selected Requests ({selectedRequests.length}):
        </Typography>
        
        <List dense sx={{ 
          maxHeight: 200, 
          overflow: 'auto',
          border: '1px solid #e2e8f0',
          borderRadius: 1,
          p: 1,
        }}>
          {selectedRequests.slice(0, 10).map((id, index) => {
            const request = students.find(s => s._id === id);
            return request ? (
              <ListItem key={id} dense>
                <ListItemText
                  primary={`${index + 1}. ${request.reason.substring(0, 50)}...`}
                  secondary={`${request.admissionNo} • ${request.studentName}`}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ) : null;
          })}
          {selectedRequests.length > 10 && (
            <ListItem>
              <Typography variant="caption" color="text.secondary">
                ...and {selectedRequests.length - 10} more
              </Typography>
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={() => setBulkActionDialog(false)} 
          disabled={loadingBulk}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleBulkStatusUpdate}
          disabled={loadingBulk}
          color={bulkStatus === "Approved" ? "success" : "error"}
          startIcon={loadingBulk ? <CircularProgress size={20} /> : null}
        >
          {loadingBulk ? 'Processing...' : `Confirm ${bulkStatus}`}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Filter Menu
  const FilterMenu = () => (
    <Menu
      anchorEl={filterMenuAnchor}
      open={Boolean(filterMenuAnchor)}
      onClose={() => setFilterMenuAnchor(null)}
    >
      <MenuItem disabled>
        <Typography variant="subtitle2">Status Filter</Typography>
      </MenuItem>
      <MenuItem 
        selected={statusFilter === 'all'}
        onClick={() => {
          setStatusFilter('all');
          setFilterMenuAnchor(null);
        }}
      >
        All Status
      </MenuItem>
      <MenuItem 
        selected={statusFilter === 'Pending'}
        onClick={() => {
          setStatusFilter('Pending');
          setFilterMenuAnchor(null);
        }}
      >
        <PendingActionsIcon sx={{ mr: 1, fontSize: 20, color: '#f59e0b' }} />
        Pending
      </MenuItem>
      <MenuItem 
        selected={statusFilter === 'Approved'}
        onClick={() => {
          setStatusFilter('Approved');
          setFilterMenuAnchor(null);
        }}
      >
        <CheckCircleIcon sx={{ mr: 1, fontSize: 20, color: '#10b981' }} />
        Approved
      </MenuItem>
      <MenuItem 
        selected={statusFilter === 'Rejected'}
        onClick={() => {
          setStatusFilter('Rejected');
          setFilterMenuAnchor(null);
        }}
      >
        <CancelIcon sx={{ mr: 1, fontSize: 20, color: '#ef4444' }} />
        Rejected
      </MenuItem>
      
      <Divider />
      
      <MenuItem disabled>
        <Typography variant="subtitle2">Sort By</Typography>
      </MenuItem>
      <MenuItem 
        selected={sortBy === 'newest'}
        onClick={() => {
          setSortBy('newest');
          setFilterMenuAnchor(null);
        }}
      >
        Newest First
      </MenuItem>
      <MenuItem 
        selected={sortBy === 'oldest'}
        onClick={() => {
          setSortBy('oldest');
          setFilterMenuAnchor(null);
        }}
      >
        Oldest First
      </MenuItem>
      <MenuItem 
        selected={sortBy === 'admissionNo'}
        onClick={() => {
          setSortBy('admissionNo');
          setFilterMenuAnchor(null);
        }}
      >
        Admission Number
      </MenuItem>
    </Menu>
  );

  // Mobile Filter Drawer
  const MobileFilterDrawer = () => (
    <Drawer
      anchor="bottom"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '80vh',
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Filter & Sort</Typography>
          <IconButton onClick={() => setMobileDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Status Filter */}
        <Typography variant="subtitle2" gutterBottom>Status</Typography>
        <Stack direction="row" spacing={1} mb={3}>
          <Button
            variant={statusFilter === 'all' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setStatusFilter('all')}
            fullWidth
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'Pending' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setStatusFilter('Pending')}
            fullWidth
            sx={{
              borderColor: '#f59e0b',
              color: statusFilter === 'Pending' ? 'white' : '#f59e0b',
              backgroundColor: statusFilter === 'Pending' ? '#f59e0b' : 'transparent',
            }}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'Approved' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setStatusFilter('Approved')}
            fullWidth
            sx={{
              borderColor: '#10b981',
              color: statusFilter === 'Approved' ? 'white' : '#10b981',
              backgroundColor: statusFilter === 'Approved' ? '#10b981' : 'transparent',
            }}
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === 'Rejected' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setStatusFilter('Rejected')}
            fullWidth
            sx={{
              borderColor: '#ef4444',
              color: statusFilter === 'Rejected' ? 'white' : '#ef4444',
              backgroundColor: statusFilter === 'Rejected' ? '#ef4444' : 'transparent',
            }}
          >
            Rejected
          </Button>
        </Stack>

        {/* Sort Options */}
        <Typography variant="subtitle2" gutterBottom>Sort By</Typography>
        <List>
          {[
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
            { value: 'admissionNo', label: 'Admission Number' },
            { value: 'status', label: 'Status' },
          ].map((option) => (
            <ListItemButton
              key={option.value}
              selected={sortBy === option.value}
              onClick={() => {
                setSortBy(option.value);
                setMobileDrawerOpen(false);
              }}
            >
              <ListItemText primary={option.label} />
              {sortBy === option.value && <CheckCircleIcon color="primary" />}
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setStatusFilter('all');
              setSortBy('newest');
              setMobileDrawerOpen(false);
            }}
          >
            Reset Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );

  // Floating Action Button for Mobile
  const MobileFAB = () => (
    <Fab
      color="primary"
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        display: { xs: 'flex', md: 'none' },
        background: 'linear-gradient(135deg, #0c5fbd 0%, #0889f3 100%)',
      }}
      onClick={() => setMobileDrawerOpen(true)}
    >
      <FilterListIcon />
    </Fab>
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
      <Box sx={{ mb: 3 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          textAlign="center"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #0c5fbd 0%, #0889f3 100%)",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Student Apology Management
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          textAlign="center"
          sx={{ mb: 2 }}
        >
          Manage and review student apology requests
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            }}
          >
            <Typography variant="h4" color="#0c5fbd" fontWeight="700">
              {admissionNumbers.length}
            </Typography>
            <Typography variant="caption" color="#64748b">
              Unique Students
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            }}
          >
            <Typography variant="h4" color="#0c5fbd" fontWeight="700">
              {filteredAndSorted.length}
            </Typography>
            <Typography variant="caption" color="#64748b">
              Total Requests
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            }}
          >
            <Typography variant="h4" color="#f59e0b" fontWeight="700">
              {filteredAndSorted.filter(s => s.status === "Pending").length}
            </Typography>
            <Typography variant="caption" color="#64748b">
              Pending
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            }}
          >
            <Typography variant="h4" color="#10b981" fontWeight="700">
              {selectedRequests.length}
            </Typography>
            <Typography variant="caption" color="#64748b">
              Selected
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content Card */}
      <Paper
        sx={{
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          background: "#ffffff",
          overflow: "hidden",
          mb: 3,
        }}
      >
        {/* Header with Controls */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: '#f8fafc',
          }}
        >
          <Stack spacing={2}>
            {/* Top Row: Search and Filter */}
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={1} 
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              {/* Search Bar */}
              <TextField
                fullWidth
                placeholder="Search by Admission No, Name, Room, Reason..."
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
                  sx: { 
                    borderRadius: 1, 
                    backgroundColor: "white",
                    flex: 1,
                  },
                }}
              />

              {/* Filter Button (Mobile) */}
              <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
                <Button
                  variant="outlined"
                  onClick={() => setMobileDrawerOpen(true)}
                  startIcon={<FilterListIcon />}
                  fullWidth
                  sx={{ textTransform: 'none' }}
                >
                  Filter & Sort
                </Button>
              </Box>

              {/* Filter Button (Desktop) */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Button
                  variant="outlined"
                  onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                  startIcon={<FilterListIcon />}
                  sx={{ textTransform: 'none', minWidth: 120 }}
                >
                  Filter & Sort
                </Button>
              </Box>

              {/* Refresh Button */}
              <Button
                variant="outlined"
                onClick={fetchStudents}
                startIcon={<RefreshIcon />}
                sx={{ textTransform: 'none' }}
              >
                Refresh
              </Button>
            </Stack>

            {/* Middle Row: View Toggle and Selection Controls */}
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={1}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              {/* View Mode Toggle */}
              <Stack direction="row" spacing={1}>
                <Button
                  variant={viewMode === "grouped" ? "contained" : "outlined"}
                  onClick={() => setViewMode("grouped")}
                  startIcon={<GroupIcon />}
                  size="small"
                  sx={{ textTransform: "none" }}
                >
                  Grouped View
                </Button>
                <Button
                  variant={viewMode === "all" ? "contained" : "outlined"}
                  onClick={() => setViewMode("all")}
                  startIcon={<FilterListIcon />}
                  size="small"
                  sx={{ textTransform: "none" }}
                >
                  All Requests
                </Button>
              </Stack>

              {/* Selection Controls */}
              <Stack direction="row" spacing={1} alignItems="center">
                {selectedRequests.length > 0 && (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      {selectedRequests.length} selected
                    </Typography>
                    <Button
                      size="small"
                      onClick={clearAllSelections}
                      startIcon={<ClearAllIcon />}
                      sx={{ textTransform: 'none' }}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
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
                      Approve Selected
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
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
                      Reject Selected
                    </Button>
                  </>
                )}
                
                {/* Select All Pending Button */}
                {filteredAndSorted.filter(s => s.status === "Pending").length > 0 && (
                  <Button
                    size="small"
                    onClick={selectAllPending}
                    startIcon={<SelectAllIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Select All Pending
                  </Button>
                )}
              </Stack>
            </Stack>

            {/* Bottom Row: Active Filters */}
            {(statusFilter !== 'all' || sortBy !== 'newest') && (
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="caption" color="text.secondary">
                  Active filters:
                </Typography>
                {statusFilter !== 'all' && (
                  <Chip
                    label={`Status: ${statusFilter}`}
                    size="small"
                    onDelete={() => setStatusFilter('all')}
                  />
                )}
                {sortBy !== 'newest' && (
                  <Chip
                    label={`Sorted by: ${sortBy}`}
                    size="small"
                    onDelete={() => setSortBy('newest')}
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Box>

        {/* Content Area */}
        <Box sx={{ p: { xs: 1, sm: 2 }, minHeight: 400 }}>
          {loading ? (
            <Box textAlign="center" py={8}>
              <CircularProgress size={60} sx={{ color: '#0c5fbd' }} />
              <Typography mt={2} color="#64748b">
                Loading apology requests...
              </Typography>
            </Box>
          ) : filteredAndSorted.length === 0 ? (
            <Box textAlign="center" py={6}>
              <SearchIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
              <Typography variant="h6" color="#64748b" gutterBottom>
                No apology requests found
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                {search ? 'Try a different search term' : 'No requests available'}
              </Typography>
            </Box>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Mobile View */}
                {isMobile ? (
                  viewMode === "grouped" ? (
                    <Box>
                      <Typography variant="subtitle2" color="#64748b" mb={2}>
                        Showing {admissionNumbers.length} student(s)
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
                    <MobileAllRequestsView />
                  )
                ) : isTablet ? (
                  <TabletView />
                ) : (
                  // Desktop View
                  viewMode === "grouped" ? (
                    <DesktopGroupedView />
                  ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                            <TableCell>Student Details</TableCell>
                            <TableCell>Admission No</TableCell>
                            <TableCell>Room</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Submitted</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredAndSorted.map((request) => {
                            const statusColor = getStatusColor(request.status);
                            
                            return (
                              <TableRow key={request._id} hover>
                                <TableCell>
                                  <Stack>
                                    <Typography fontWeight="500">
                                      {request.studentName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {request.submittedBy}
                                    </Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell>{request.admissionNo}</TableCell>
                                <TableCell>{request.roomNo}</TableCell>
                                <TableCell>
                                  <Tooltip title={request.reason}>
                                    <Typography noWrap sx={{ maxWidth: 300 }}>
                                      {request.reason}
                                    </Typography>
                                  </Tooltip>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={request.status}
                                    size="small"
                                    sx={{
                                      backgroundColor: statusColor.bg,
                                      color: statusColor.color,
                                      fontWeight: 500,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {request.submittedAt}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Stack direction="row" spacing={1} justifyContent="center">
                                    {request.status === "Pending" && (
                                      <Checkbox
                                        checked={selectedRequests.includes(request._id)}
                                        onChange={() => toggleSelectRequest(request._id)}
                                        size="small"
                                      />
                                    )}
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedStudent(request);
                                        setViewDialog(true);
                                      }}
                                    >
                                      <VisibilityIcon />
                                    </IconButton>
                                    {request.status === "Pending" && (
                                      <>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleStatusUpdate(request._id, "Approved")}
                                          sx={{ color: '#10b981' }}
                                        >
                                          <CheckCircleIcon />
                                        </IconButton>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleStatusUpdate(request._id, "Rejected")}
                                          sx={{ color: '#ef4444' }}
                                        >
                                          <CancelIcon />
                                        </IconButton>
                                      </>
                                    )}
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </Box>
      </Paper>

      {/* Info Footer */}
      <Typography 
        variant="caption" 
        color="text.secondary" 
        textAlign="center"
        display="block"
        sx={{ mb: 2 }}
      >
        Total {students.length} requests • Last updated: {new Date().toLocaleTimeString()}
      </Typography>

      {/* Dialogs and Menus */}
      <BulkActionDialog />
      <FilterMenu />
      <MobileFilterDrawer />
      <MobileFAB />
    </Box>
  );
};

export default StudentDetails;