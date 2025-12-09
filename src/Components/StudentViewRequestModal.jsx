import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Avatar,
  Divider,
  IconButton,
  Collapse
} from "@mui/material";
import {
  ExpandMore,
  CalendarToday,
  Schedule,
  Assignment,
  Close
} from "@mui/icons-material";
import axios from "axios";

const StudentViewRequestModal = ({ open, handleClose }) => {
  const [requests, setRequests] = useState([]);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (open) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.admissionNumber) return;

      axios
        .get("https://fredbox-backend.onrender.com/messcut/student", {
          params: { admissionNo: user.admissionNumber },
        })
        .then((res) => setRequests(res.data.data))
        .catch((err) => console.error("Error fetching:", err));
    } else {
      setExpandedRequest(null);
    }
  }, [open]);

  const getChip = (status) => {
    const chipProps = {
      size: isMobile ? "small" : "medium",
      sx: { 
        fontWeight: 600,
        borderRadius: 2,
        minWidth: 80
      }
    };

    if (status === "ACCEPT") return <Chip color="success" label="ACCEPT" {...chipProps} />;
    if (status === "REJECT") return <Chip color="error" label="REJECT" {...chipProps} />;
    return <Chip color="warning" label="Pending" {...chipProps} />;
  };

  const getStatusColor = (status) => {
    if (status === "ACCEPT") return theme.palette.success.main;
    if (status === "REJECT") return theme.palette.error.main;
    return theme.palette.warning.main;
  };

  const handleExpandClick = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Desktop Table View
  const renderDesktopView = () => (
    <Fade in timeout={500}>
      <Table sx={{ 
        minWidth: 650,
        '& .MuiTableCell-root': {
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }
      }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Leaving</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Returning</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((r) => (
            <TableRow 
              key={r._id}
              sx={{ 
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[1]
                }
              }}
            >
              <TableCell>{formatDate(r.createdAt)}</TableCell>
              <TableCell>{r.leavingDate} ({r.leavingTime})</TableCell>
              <TableCell>{r.returningDate} ({r.returningTime})</TableCell>
              <TableCell sx={{ maxWidth: 200 }}>
                <Typography 
                  variant="body2" 
                  noWrap 
                  title={r.reason}
                >
                  {r.reason}
                </Typography>
              </TableCell>
              <TableCell>{getChip(r.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fade>
  );

  // Mobile Card View
  const renderMobileView = () => (
    <Box sx={{ mt: 1 }}>
      {requests.map((r, index) => (
        <Slide 
          key={r._id} 
          in 
          timeout={500} 
          direction="up"
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <Card 
            sx={{ 
              mb: 2,
              borderRadius: 3,
              boxShadow: theme.shadows[2],
              borderLeft: `4px solid ${getStatusColor(r.status)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: getStatusColor(r.status),
                      fontSize: '0.875rem'
                    }}
                  >
                    {r.status.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {formatDate(r.createdAt)}
                    </Typography>
                    {getChip(r.status)}
                  </Box>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={() => handleExpandClick(r._id)}
                  sx={{
                    transform: expandedRequest === r._id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <ExpandMore />
                </IconButton>
              </Box>

              {/* Basic Info */}
              <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="caption" fontWeight={500}>
                      Leave: {r.leavingDate}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Schedule sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="caption" fontWeight={500}>
                      {r.leavingTime}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarToday sx={{ fontSize: 16, color: 'secondary.main' }} />
                    <Typography variant="caption" fontWeight={500}>
                      Return: {r.returningDate}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Schedule sx={{ fontSize: 16, color: 'secondary.main' }} />
                    <Typography variant="caption" fontWeight={500}>
                      {r.returningTime}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Expandable Details */}
              <Collapse in={expandedRequest === r._id} timeout="auto">
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Assignment sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25 }} />
                  <Box>
                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                      REASON:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {r.reason}
                    </Typography>
                  </Box>
                </Box>
              </Collapse>

              {/* Quick Reason Preview */}
              {expandedRequest !== r._id && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 1,
                    color: 'text.secondary',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {r.reason}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Slide>
      ))}
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="md"
      fullScreen={isMobile}
      TransitionComponent={Slide}
      transitionDuration={400}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          background: isMobile 
            ? theme.palette.background.default 
            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          minHeight: isMobile ? '100vh' : 'auto'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" fontWeight={700}>
            My Mess Cut Requests
          </Typography>
          {isMobile && (
            <IconButton onClick={handleClose} size="large">
              <Close />
            </IconButton>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {requests.length} request{requests.length !== 1 ? 's' : ''} found
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ 
        p: isMobile ? 2 : 3,
        maxHeight: isMobile ? 'none' : '70vh',
        overflow: 'auto'
      }}>
        {requests.length === 0 ? (
          <Fade in timeout={600}>
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              color: 'text.secondary'
            }}>
              <Typography variant="h6" gutterBottom>
                No requests found
              </Typography>
              <Typography variant="body2">
                You haven't submitted any mess cut requests yet.
              </Typography>
            </Box>
          </Fade>
        ) : (
          isMobile ? renderMobileView() : renderDesktopView()
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.default
      }}>
        <Button 
          onClick={handleClose}
          variant={isMobile ? "contained" : "outlined"}
          fullWidth={isMobile}
          size={isMobile ? "large" : "medium"}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            py: isMobile ? 1.5 : 1
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentViewRequestModal;