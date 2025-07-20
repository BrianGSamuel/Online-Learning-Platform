//frontend/src/features/dashboard/teacher/FeeWaiverRequests.jsx
import { useState, useEffect } from "react";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import StudentSidebar from "../../../components/TeacherSidebar/index";
import StudentHeader from "../../../components/TeacherHeader/index";

import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import { HiPaperClip, HiEye, HiCheckCircle, HiXCircle, HiClock } from "react-icons/hi";
import { BiMessageDetail } from "react-icons/bi";

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FeeWaiverRequests = () => {
  
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
    const [openReasonDialog, setOpenReasonDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedReason, setSelectedReason] = useState("");
    const [status, setStatus] = useState("");
    const [teacherComments, setTeacherComments] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [imageError, setImageError] = useState(null);

  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (!userInfo || !userInfo.token) {
                throw new Error("User not authenticated");
            }
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get("http://localhost:5000/api/auth/teacher/fee-waiver-requests", config);
            setRequests(data);
        } catch (err) {
            setError(err.response?.data?.message || "Error loading fee waiver requests");
        } finally {
            setLoading(false);
        }
    };
    fetchRequests();
}, []);

const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setStatus("");
    setTeacherComments("");
    setDiscountPercentage(0);
    setOpenDialog(true);
};

const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
};

const handleOpenReasonDialog = (reason) => {
    setSelectedReason(reason);
    setOpenReasonDialog(true);
};

const handleCloseReasonDialog = () => {
    setOpenReasonDialog(false);
    setSelectedReason("");
};

const handleSubmit = async () => {
    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.put(
            `http://localhost:5000/api/auth/teacher/fee-waiver/${selectedRequest._id}/status`,
            { status, teacherComments, discountPercentage },
            config
        );

        setRequests(requests.map(req => req._id === selectedRequest._id ? data.feeWaiver : req));
        handleCloseDialog();
    } catch (err) {
        setError(err.response?.data?.message || "Error updating fee waiver request");
    }
};

const handleOpenDocumentDialog = (documentPath) => {
    console.log("Opening document:", `http://localhost:5000${documentPath}`);
    setSelectedDocument(documentPath);
    setPageNumber(1);
    setNumPages(null);
    setImageError(null);
    setOpenDocumentDialog(true);
};

const handleCloseDocumentDialog = () => {
    setOpenDocumentDialog(false);
    setSelectedDocument(null);
    setImageError(null);
};

const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
};

const handlePreviousPage = () => {
    if (pageNumber > 1) {
        setPageNumber(pageNumber - 1);
    }
};

const handleNextPage = () => {
    if (pageNumber < numPages) {
        setPageNumber(pageNumber + 1);
    }
};

const handleImageError = () => {
    setImageError("Failed to load image. The file may not exist or is inaccessible.");
};

const getFileType = (filePath) => {
    if (!filePath) return null;
    const extension = filePath.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png'].includes(extension) ? 'image' : extension === 'pdf' ? 'pdf' : null;
};

const getStatusIcon = (status) => {
    switch (status) {
        case "Approved":
            return <HiCheckCircle className="w-4 h-4 text-green-600" />;
        case "Rejected":
            return <HiXCircle className="w-4 h-4 text-red-600" />;
        default:
            return <HiClock className="w-4 h-4 text-yellow-600" />;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case "Approved":
            return "bg-green-100 text-green-800 border-green-200";
        case "Rejected":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
};

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobile(mobileView);
      setIsSidebarCollapsed(mobileView);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadcrumbItems = pathnames.map((value, index) => {
    const last = index === pathnames.length - 1;
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
    const displayName = value.charAt(0).toUpperCase() + value.slice(1);

    return last ? (
      <Typography key={to} color="text.primary">
        {displayName}
      </Typography>
    ) : (
      <MuiLink
        key={to}
        component={Link}
        to={to}
        underline="hover"
        color="inherit"
      >
        {displayName}
      </MuiLink>
    );
  });

  const pageTitle = pathnames.length > 0 
    ? pathnames[pathnames.length - 1].charAt(0).toUpperCase() + pathnames[pathnames.length - 1].slice(1)
    : "Dashboard";

  useEffect(() => {
    document.title = `TeacherDashboard - EduConnect`;
  }, [location, pageTitle]);

  return (
    <div>
      <StudentHeader 
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
          <StudentSidebar 
            isCollapsed={isSidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
          />
        </div>

        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? "ml-[60px]" : "ml-[18%] md:ml-[250px]"
          }`}
        >
          <div
            className={`mt-[50px] py-2 px-4 md:px-6 bg-gray-100 border-b fixed top-0 w-full z-30 transition-all duration-300 ${
              isSidebarCollapsed 
                ? "ml-[60px] w-[calc(100%-60px)]" 
                : "ml-[18%] w-[calc(100%-18%)] md:ml-[250px] md:w-[calc(100%-250px)]"
            }`}
          >
            <Breadcrumbs aria-label="breadcrumb">
              {breadcrumbItems}
            </Breadcrumbs>
          </div>
        
          <div className="mt-[90px] p-4 md:p-6 overflow-y-auto h-[calc(100vh-90px)]">
            <div className="max-w-7xl mx-auto p-6 bg-white-50 min-h-screen">
              <div className="bg-white rounded-xl shadow-md border border-blue-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BiMessageDetail className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-blue-900">Fee Waiver Requests</h2>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <div className="flex items-center">
                      <HiXCircle className="w-5 h-5 mr-2" />
                      {error}
                    </div>
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-blue-600">Loading requests...</span>
                  </div>
                ) : requests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-blue-50 text-blue-900">
                          <th className="px-4 py-3 text-left text-sm font-semibold">Student</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Reason</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Document</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Created At</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((request) => (
                          <tr key={request._id} className="border-b border-blue-100 hover:bg-blue-50 transition-all duration-300">
                            <td className="px-4 py-3 text-blue-600">
                              {request.studentId?.name || "Unknown Student"}
                            </td>
                            <td className="px-4 py-3 text-blue-600 max-w-xs">
                              <div className="relative">
                                <p className="truncate">
                                  {request.reason.length > 60 
                                    ? `${request.reason.substring(0, 60)}...`
                                    : request.reason
                                  }
                                </p>
                                {request.reason.length > 60 && (
                                  <button
                                    onClick={() => handleOpenReasonDialog(request.reason)}
                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1 flex items-center gap-1"
                                  >
                                    <HiEye className="w-3 h-3" />
                                    View Full
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {request.documentPath ? (
                                <button
                                  onClick={() => handleOpenDocumentDialog(request.documentPath)}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                >
                                  <HiPaperClip className="w-4 h-4" />
                                  <span className="text-sm">View</span>
                                </button>
                              ) : (
                                <span className="text-gray-400 text-sm">No Document</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                {getStatusIcon(request.status)}
                                {request.status}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-blue-600 text-sm">
                              {new Date(request.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-4 py-3">
                              {request.status === "Pending" && (
                                <button
                                  onClick={() => handleOpenDialog(request)}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300 text-sm font-medium"
                                >
                                  Review
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-white rounded-lg border border-blue-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BiMessageDetail className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Fee Waiver Requests</h3>
                    <p className="text-blue-600">No fee waiver requests available at the moment.</p>
                  </div>
                )}
              </div>

              {/* Reason Dialog */}
              {openReasonDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                        <BiMessageDetail className="w-5 h-5" />
                        Request Reason
                      </h3>
                      <button
                        onClick={handleCloseReasonDialog}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                      >
                        ×
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {selectedReason}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleCloseReasonDialog}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Dialog */}
              {openDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Review Fee Waiver Request</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">Status</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          required
                          className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 border-gray-300"
                        >
                          <option value="">Select status</option>
                          <option value="Approved">Approve</option>
                          <option value="Rejected">Reject</option>
                        </select>
                      </div>
                      {status === "Approved" && (
                        <div>
                          <label className="block text-sm font-medium text-blue-900 mb-1">Discount Percentage</label>
                          <input
                            type="number"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                            min="0"
                            max="100"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 border-gray-300"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">Comments (Optional)</label>
                        <textarea
                          value={teacherComments}
                          onChange={(e) => setTeacherComments(e.target.value)}
                          className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 border-gray-300 h-24 resize-none"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        onClick={handleCloseDialog}
                        className="px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400 transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!status}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 ${
                          !status ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Dialog */}
              {openDocumentDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">View Document</h3>
                    <div className="text-center">
                      {selectedDocument && (
                        <>
                          {getFileType(selectedDocument) === "pdf" ? (
                            <div>
                              <Document
                                file={`http://localhost:5000${selectedDocument}`}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={(error) => setError("Error loading PDF: " + error.message)}
                              >
                                <Page pageNumber={pageNumber} />
                              </Document>
                              <div className="mt-3">
                                <p className="text-blue-600 text-sm">
                                  Page {pageNumber} of {numPages}
                                </p>
                                <div className="flex justify-center gap-3 mt-2">
                                  <button
                                    onClick={handlePreviousPage}
                                    disabled={pageNumber <= 1}
                                    className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition-all duration-300"
                                  >
                                    Previous
                                  </button>
                                  <button
                                    onClick={handleNextPage}
                                    disabled={pageNumber >= numPages}
                                    className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition-all duration-300"
                                  >
                                    Next
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : getFileType(selectedDocument) === "image" ? (
                            <div>
                              {imageError ? (
                                <p className="text-red-600">{imageError}</p>
                              ) : (
                                <img
                                  src={`http://localhost:5000${selectedDocument}`}
                                  alt="Fee Waiver Document"
                                  className="max-w-full h-auto rounded-md mx-auto"
                                  style={{ maxHeight: "500px" }}
                                  onError={handleImageError}
                                />
                              )}
                            </div>
                          ) : (
                            <p className="text-red-600">Unsupported file type</p>
                          )}
                        </>
                      )}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleCloseDocumentDialog}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeWaiverRequests;