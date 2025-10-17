import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Chip,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Search,
  MoreVert,
  CheckCircle,
  Cancel,
  Visibility,
} from "@mui/icons-material";

/* 🔹 Dummy Data */
const dummyRequests = [
  {
    id: 1,
    room: "15",
    name: "ALFRED GEORGE",
    admn: "JEC856",
    sem: "S00",
    class: "Teacher",
    applyDate: "2025-10-16",
    applyTime: "04:18:00",
    leavingDate: "2025-10-18",
    leavingTime: "06:00:00",
    returnDate: "2025-10-21",
    returnTime: "06:00:00",
    reason: "Going Home",
    status: "Pending",
  },
  {
    id: 2,
    room: "233",
    name: "EDWIN PAUL",
    admn: "12213015",
    sem: "S7",
    class: "EEE",
    applyDate: "2025-10-17",
    applyTime: "08:36:45",
    leavingDate: "2025-10-18",
    leavingTime: "06:00:00",
    returnDate: "2025-10-21",
    returnTime: "06:00:00",
    reason: "Holiday",
    status: "Pending",
  },
  {
    id: 3,
    room: "516",
    name: "LINS A T",
    admn: "12423045",
    sem: "S5",
    class: "EEE",
    applyDate: "2025-10-17",
    applyTime: "10:10:13",
    leavingDate: "2025-10-18",
    leavingTime: "17:00:00",
    returnDate: "2025-10-21",
    returnTime: "06:00:00",
    reason: "Weekend home going",
    status: "Pending",
  },
];

/* 🔹 Component */
function RequestView() {
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [actionMenu, setActionMenu] = useState({ anchor: null, requestId: null });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // up to 600px

  const filtered = dummyRequests.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.admn.toLowerCase().includes(search.toLowerCase()) ||
      r.room.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (id, newStatus) => {
    alert(`Request ID ${id} marked as ${newStatus}`);
    setActionMenu({ anchor: null, requestId: null });
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailDialog(true);
  };

  const handleOpenMenu = (event, requestId) => {
    setActionMenu({ anchor: event.currentTarget, requestId });
  };

  const handleCloseMenu = () => {
    setActionMenu({ anchor: null, requestId: null });
  };

  /* 🔸 Mobile Card */
  const MobileCard = ({ request }) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: "0.95rem" }}>
              {request.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
              Room {request.room} • {request.admn}
            </Typography>
          </Box>
          <Chip
            label={request.status}
            color={
              request.status === "Pending"
                ? "warning"
                : request.status === "Accepted"
                ? "success"
                : "error"
            }
            size="small"
          />
        </Box>

        <Typography variant="body2" sx={{ mb: 1, fontSize: "0.8rem" }}>
          <strong>Leave:</strong> {request.leavingDate} → {request.returnDate}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, fontSize: "0.8rem" }}
        >
          <strong>Reason:</strong> {request.reason}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button
            size="small"
            startIcon={<Visibility fontSize="small" />}
            onClick={() => handleViewDetails(request)}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              px: 1.5,
              color: "primary.main",
            }}
          >
            View
          </Button>

          <IconButton size="small" onClick={(e) => handleOpenMenu(e, request.id)}>
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: "#f8fafc",
          minHeight: "100vh",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {/* ===== Header ===== */}
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          sx={{
            mb: 3,
            fontSize: { xs: "1.6rem", sm: "2.1rem" },
            background: "linear-gradient(135deg, #1e3c72, #2a5298)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Student Requests
        </Typography>

        {/* ===== Search ===== */}
        <Grid container justifyContent="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={8} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, room or admission no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
                },
              }}
            />
          </Grid>
        </Grid>

        {/* ===== Mobile View ===== */}
        {isMobile ? (
          <>
            {filtered.length > 0 ? (
              filtered.map((r) => <MobileCard key={r.id} request={r} />)
            ) : (
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">No matching records found</Typography>
              </Paper>
            )}
          </>
        ) : (
          /* ===== Desktop Table ===== */
          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              overflowX: "auto",
            }}
          >
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f4ff" }}>
                    {[
                      "ID",
                      "Room No",
                      "Student Name",
                      "Admission No",
                      "Semester",
                      "Class",
                      "Apply Date",
                      "Leaving Date",
                      "Return Date",
                      "Reason",
                      "Status",
                      "Action",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                          "&:hover": { backgroundColor: "#eef3fc" },
                        }}
                      >
                        <TableCell align="center">{row.id}</TableCell>
                        <TableCell align="center">{row.room}</TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">{row.admn}</TableCell>
                        <TableCell align="center">{row.sem}</TableCell>
                        <TableCell align="center">{row.class}</TableCell>
                        <TableCell align="center">{row.applyDate}</TableCell>
                        <TableCell align="center">{row.leavingDate}</TableCell>
                        <TableCell align="center">{row.returnDate}</TableCell>
                        <TableCell align="center">{row.reason}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={row.status}
                            color={
                              row.status === "Pending"
                                ? "warning"
                                : row.status === "Accepted"
                                ? "success"
                                : "error"
                            }
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => handleAction(row.id, "Accepted")}
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Cancel />}
                              onClick={() => handleAction(row.id, "Rejected")}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No matching records found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* ===== Detail Dialog ===== */}
        <Dialog
          open={detailDialog}
          onClose={() => setDetailDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Request Details</DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {[
                  ["Name", selectedRequest.name],
                  ["Admission No", selectedRequest.admn],
                  ["Room", selectedRequest.room],
                  ["Class", selectedRequest.class],
                  ["Reason", selectedRequest.reason],
                  [
                    "Leave Period",
                    `${selectedRequest.leavingDate} ${selectedRequest.leavingTime} → ${selectedRequest.returnDate} ${selectedRequest.returnTime}`,
                  ],
                ].map(([label, value]) => (
                  <Grid item xs={12} key={label}>
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="body1">{value}</Typography>
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* ===== Action Menu ===== */}
        <Menu
          anchorEl={actionMenu.anchor}
          open={Boolean(actionMenu.anchor)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleAction(actionMenu.requestId, "Accepted")}>
            <CheckCircle sx={{ mr: 1, color: "success.main" }} />
            Accept
          </MenuItem>
          <MenuItem onClick={() => handleAction(actionMenu.requestId, "Rejected")}>
            <Cancel sx={{ mr: 1, color: "error.main" }} />
            Reject
          </MenuItem>
        </Menu>
      </Box>
    </motion.div>
  );
}

export default RequestView;
