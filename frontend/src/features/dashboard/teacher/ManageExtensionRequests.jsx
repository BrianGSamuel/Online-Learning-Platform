import { useState, useEffect } from "react";
import { 
  Typography, 
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Avatar,
  Stack,
  Tooltip,
  IconButton,
  Fade
} from "@mui/material";
import { 
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Class as ClassIcon,
  Schedule as ScheduleIcon
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import TeacherSidebar from "../../../components/TeacherSidebar/index";
import TeacherHeader from "../../../components/TeacherHeader/index";
import axios from "axios";

const ManageExtensionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reasonDialog, setReasonDialog] = useState({ open: false, reason: "", studentName: "" });
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleResize = () => {
    const mobileView = window.innerWidth <= 768;
    setIsMobile(mobileView);
    setIsSidebarCollapsed(mobileView);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    document.title = `TeacherDashboard - EduConnect`;
  }, [location]);

  useEffect(() => {
    let updatedRequests = [...requests];
    if (filter !== "all") {
      updatedRequests = requests.filter((req) => req.status === filter);
    }
    updatedRequests.sort((a, b) => {
      const statusOrder = { pending: 1, approved: 2, rejected: 3 };
      const order = sortOrder === "asc" ? 1 : -1;
      return order * (statusOrder[a.status] - statusOrder[b.status]);
    });
    setFilteredRequests(updatedRequests);
  }, [requests, filter, sortOrder]);

  const fetchRequests = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get(
        "http://localhost:5000/api/classes/extension/requests",
        config
      );
      setRequests(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching extension requests");
    }
  };

  const handleRequest = async (materialId, requestId, status) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.post(
        "http://localhost:5000/api/classes/extension/handle",
        { materialId, requestId, status },
        config
      );
      setSuccess(`Request ${status} successfully`);
      fetchRequests();
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || `Error ${status.toLowerCase()} request`
      );
      // Auto-hide error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const openReasonDialog = (reason, studentName) => {
    setReasonDialog({ open: true, reason, studentName });
  };

  const closeReasonDialog = () => {
    setReasonDialog({ open: false, reason: "", studentName: "" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return { color: "success", bgColor: "#e8f5e8", textColor: "#2e7d32" };
      case "rejected":
        return { color: "error", bgColor: "#ffebee", textColor: "#d32f2f" };
      case "pending":
        return { color: "warning", bgColor: "#fff3e0", textColor: "#f57c00" };
      default:
        return { color: "default", bgColor: "#f5f5f5", textColor: "#666" };
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TeacherHeader
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      <div className="flex min-h-screen">
        <div
          className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ${
            isSidebarCollapsed ? "w-[60px]" : "w-[18%] md:w-[250px]"
          }`}
        >
          <TeacherSidebar 
            isCollapsed={isSidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
        </div>

        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? "ml-[60px]" : "ml-[18%] md:ml-[250px]"
          }`}
        >
          <Box sx={{ maxWidth: 1400, mx: "auto", p: 4, mt: 8 }}>
            <Card sx={{ mb: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    color: "#1a1a1a",
                    mb: 1
                  }}
                >
                  Extension Requests Management
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: "#666", 
                    mb: 3 
                  }}
                >
                  Review and manage student extension requests for assignments and materials
                </Typography>

                {error && (
                  <Fade in={!!error}>
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3, 
                        borderRadius: 2,
                        "& .MuiAlert-icon": { fontSize: "1.2rem" }
                      }}
                      onClose={() => setError(null)}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}
                
                {success && (
                  <Fade in={!!success}>
                    <Alert 
                      severity="success" 
                      sx={{ 
                        mb: 3, 
                        borderRadius: 2,
                        "& .MuiAlert-icon": { fontSize: "1.2rem" }
                      }}
                      onClose={() => setSuccess(null)}
                    >
                      {success}
                    </Alert>
                  </Fade>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <FormControl sx={{ minWidth: 220 }}>
                    <InputLabel sx={{ fontWeight: 500 }}>Filter by Status</InputLabel>
                    <Select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      label="Filter by Status"
                      sx={{ 
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "#1976d2",
                          },
                        }
                      }}
                    >
                      <MenuItem value="all">All Requests</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                    Total: {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {filteredRequests.length === 0 ? (
              <Card sx={{ textAlign: "center", p: 6, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
                  No extension requests found
                </Typography>
                <Typography variant="body2" sx={{ color: "#999" }}>
                  {filter !== "all" ? `No ${filter} requests available` : "No requests have been submitted yet"}
                </Typography>
              </Card>
            ) : (
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                <TableContainer>
                  <Table sx={{ "& .MuiTableCell-root": { borderColor: "#f0f0f0" } }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#fafafa" }}>
                        <TableCell sx={{ fontWeight: 700, color: "#333", py: 2 }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <ClassIcon sx={{ fontSize: "1.1rem", color: "#666" }} />
                            <span>Class & Lesson</span>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#333", py: 2 }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <PersonIcon sx={{ fontSize: "1.1rem", color: "#666" }} />
                            <span>Student</span>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#333", py: 2 }}>
                          Reason
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#333", py: 2 }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <ScheduleIcon sx={{ fontSize: "1.1rem", color: "#666" }} />
                            <span>Requested At</span>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#333", py: 2 }}>
                          <TableSortLabel
                            active
                            direction={sortOrder}
                            onClick={handleSort}
                            sx={{ fontWeight: 700 }}
                          >
                            Status
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#333", py: 2, textAlign: "center" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRequests.map((request, index) => (
                        <TableRow 
                          key={request.requestId}
                          sx={{ 
                            "&:hover": { 
                              backgroundColor: "#f8f9fa",
                              transform: "translateY(-1px)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            },
                            transition: "all 0.2s ease",
                            backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafbfc"
                          }}
                        >
                          <TableCell sx={{ py: 3 }}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1a1a1a", mb: 0.5 }}>
                                {request.classSubject}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#666" }}>
                                {request.lessonName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar 
                                sx={{ 
                                  width: 40, 
                                  height: 40, 
                                  backgroundColor: "#e3f2fd",
                                  color: "#1976d2",
                                  fontSize: "0.9rem",
                                  fontWeight: 600
                                }}
                              >
                                {request.studentName.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                                  {request.studentName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#666" }}>
                                  {request.studentEmail}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 3 }}>
                            <Tooltip title="Click to view full reason" arrow>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => openReasonDialog(request.reason, request.studentName)}
                                startIcon={<ViewIcon sx={{ fontSize: "1rem" }} />}
                                sx={{
                                  textTransform: "none",
                                  borderRadius: 2,
                                  borderColor: "#e0e0e0",
                                  color: "#666",
                                  fontWeight: 500,
                                  "&:hover": {
                                    borderColor: "#1976d2",
                                    backgroundColor: "#f5f5f5"
                                  }
                                }}
                              >
                                View Reason
                              </Button>
                            </Tooltip>
                          </TableCell>
                          <TableCell sx={{ py: 3 }}>
                            <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                              {new Date(request.requestedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 3 }}>
                            <Chip
                              label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              sx={{
                                backgroundColor: getStatusColor(request.status).bgColor,
                                color: getStatusColor(request.status).textColor,
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                border: `1px solid ${getStatusColor(request.status).textColor}20`,
                                "& .MuiChip-label": {
                                  px: 2
                                }
                              }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ py: 3, textAlign: "center" }}>
                            {request.status === "pending" ? (
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <Tooltip title="Approve Request" arrow>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() =>
                                      handleRequest(
                                        request.materialId,
                                        request.requestId,
                                        "approved"
                                      )
                                    }
                                    startIcon={<CheckIcon sx={{ fontSize: "1rem" }} />}
                                    sx={{
                                      minWidth: "auto",
                                      px: 2,
                                      py: 1,
                                      borderRadius: 2,
                                      textTransform: "none",
                                      fontWeight: 600,
                                      boxShadow: "0 2px 8px rgba(46, 125, 50, 0.3)",
                                      "&:hover": {
                                        boxShadow: "0 4px 12px rgba(46, 125, 50, 0.4)"
                                      }
                                    }}
                                  >
                                    Approve
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Reject Request" arrow>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() =>
                                      handleRequest(
                                        request.materialId,
                                        request.requestId,
                                        "rejected"
                                      )
                                    }
                                    startIcon={<CancelIcon sx={{ fontSize: "1rem" }} />}
                                    sx={{
                                      minWidth: "auto",
                                      px: 2,
                                      py: 1,
                                      borderRadius: 2,
                                      textTransform: "none",
                                      fontWeight: 600,
                                      boxShadow: "0 2px 8px rgba(211, 47, 47, 0.3)",
                                      "&:hover": {
                                        boxShadow: "0 4px 12px rgba(211, 47, 47, 0.4)"
                                      }
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </Tooltip>
                              </Stack>
                            ) : (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: "#999",
                                  fontStyle: "italic",
                                  fontWeight: 500
                                }}
                              >
                                Completed
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            )}
          </Box>
        </div>
      </div>

      {/* Reason Dialog */}
      <Dialog 
        open={reasonDialog.open} 
        onClose={closeReasonDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2, 
          borderBottom: "1px solid #f0f0f0",
          backgroundColor: "#fafafa"
        }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar 
              sx={{ 
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
                width: 48,
                height: 48,
                fontSize: "1.2rem",
                fontWeight: 600
              }}
            >
              {reasonDialog.studentName.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
                Extension Request Reason
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                From: {reasonDialog.studentName}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              backgroundColor: "#f8f9fa", 
              borderRadius: 2,
              border: "1px solid #e0e0e0"
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.7,
                color: "#333",
                fontSize: "1rem"
              }}
            >
              {reasonDialog.reason || "No reason provided"}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={closeReasonDialog}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 4
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageExtensionRequests;