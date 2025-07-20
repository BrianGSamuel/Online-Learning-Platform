import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import StudentSidebar from "../../../components/TeacherSidebar/index";
import StudentHeader from "../../../components/TeacherHeader/index";
import axios from "axios";
import { 
    Box, 
    TextField, 
    Button, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Alert, 
    Grid,
    Paper,
    Fade,
    Chip
} from "@mui/material";
import { 
    InsertDriveFile, 
    VideoLibrary, 
    Link as LinkIcon, 
    CalendarToday, 
    ClassOutlined,
    CloudUpload,
    CheckCircle,
    School
} from "@mui/icons-material";

const UploadMaterial = ({ classId }) => {
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [title, setTitle] = useState("");
    const [lessonName, setLessonName] = useState("");
    const [type, setType] = useState("pdf");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [uploadDate, setUploadDate] = useState("");
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(classId || "");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

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

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}` }
                };
                const { data } = await axios.get("http://localhost:5000/api/teacher/classes", config);
                setClasses(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch classes");
            }
        };
        fetchClasses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsUploading(true);

        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
                "Content-Type": "multipart/form-data"
            }
        };

        const formData = new FormData();
        formData.append("title", title);
        formData.append("lessonName", lessonName);
        formData.append("type", type);
        formData.append("uploadDate", uploadDate);

        if (type === "link") {
            formData.append("content", content);
        } else {
            formData.append("file", file);
        }

        try {
            await axios.post(
                `http://localhost:5000/api/teacher/classes/${selectedClass}/materials`,
                formData,
                config
            );
            setSuccess("Material uploaded successfully!");
            setTitle("");
            setLessonName("");
            setType("pdf");
            setContent("");
            setFile(null);
            setUploadDate("");
            setSelectedClass("");
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    // Update document title
    useEffect(() => {
        document.title = "Upload Material - EduConnect";
    }, [location]);

    const getTypeIcon = (materialType) => {
        switch (materialType) {
            case 'pdf': return <InsertDriveFile sx={{ color: '#ef4444' }} />;
            case 'video': return <VideoLibrary sx={{ color: '#3b82f6' }} />;
            case 'link': return <LinkIcon sx={{ color: '#10b981' }} />;
            default: return <InsertDriveFile />;
        }
    };

    const getTypeChip = (materialType) => {
        const configs = {
            pdf: { label: 'PDF Document', color: 'error' },
            video: { label: 'Video File', color: 'primary' },
            link: { label: 'External Link', color: 'success' }
        };
        return (
            <Chip 
                {...configs[materialType]} 
                size="small" 
                variant="outlined"
                icon={getTypeIcon(materialType)}
            />
        );
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
            <StudentHeader
                isSidebarCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ${
                    isSidebarCollapsed ? "w-[60px]" : "w-[18%] md:w-[250px]"
                } bg-white border-r border-gray-200 shadow-lg`}>
                    <StudentSidebar
                        isCollapsed={isSidebarCollapsed}
                        toggleSidebar={toggleSidebar}
                    />
                </div>

                {/* Main Content */}
                <div className={`flex-1 transition-all duration-300 ${
                    isSidebarCollapsed ? "ml-[60px]" : "ml-[18%] md:ml-[250px]"
                }`}>
                    {/* Header Section */}
                    <div className="mt-[64px] p-6 md:p-8">
                        <Fade in timeout={800}>
                            <Box sx={{ mb: 4 }}>
                                <Typography 
                                    variant="h3" 
                                    sx={{ 
                                        fontWeight: 800,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        mb: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    <School sx={{ color: '#6366f1', fontSize: '2.5rem' }} />
                                    Upload Class Material
                                </Typography>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        color: 'text.secondary',
                                        fontSize: '1.1rem',
                                        fontWeight: 500
                                    }}
                                >
                                    Share educational content with your students
                                </Typography>
                            </Box>
                        </Fade>

                        {/* Form Container */}
                        <Fade in timeout={1000}>
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    maxWidth: 900, 
                                    mx: "auto", 
                                    p: { xs: 3, md: 5 },
                                    borderRadius: 4,
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                                }}
                            >
                                {(error || success) && (
                                    <Fade in timeout={500}>
                                        <Alert 
                                            severity={error ? 'error' : 'success'} 
                                            sx={{ 
                                                mb: 4,
                                                borderRadius: 3,
                                                '& .MuiAlert-icon': {
                                                    fontSize: '1.5rem'
                                                }
                                            }}
                                            icon={success ? <CheckCircle /> : undefined}
                                        >
                                            {error || success}
                                        </Alert>
                                    </Fade>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel sx={{ fontWeight: 600 }}>Select Class</InputLabel>
                                                <Select
                                                    value={selectedClass}
                                                    onChange={(e) => setSelectedClass(e.target.value)}
                                                    required
                                                    sx={{
                                                        borderRadius: 3,
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderWidth: 2,
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="">Select Class</MenuItem>
                                                    {classes.map(cls => (
                                                        <MenuItem key={cls._id} value={cls._id}>
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <ClassOutlined sx={{ color: '#6366f1' }} />
                                                                {cls.subject}
                                                            </Box>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Lesson Name"
                                                value={lessonName}
                                                onChange={(e) => setLessonName(e.target.value)}
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 3,
                                                        '& fieldset': {
                                                            borderWidth: 2,
                                                        }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        fontWeight: 600
                                                    }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <VideoLibrary sx={{ color: '#6366f1', mr: 1 }} />
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Material Title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 3,
                                                        '& fieldset': {
                                                            borderWidth: 2,
                                                        }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        fontWeight: 600
                                                    }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InsertDriveFile sx={{ color: '#6366f1', mr: 1 }} />
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                               
                                                <Select
                                                    value={type}
                                                    onChange={(e) => setType(e.target.value)}
                                                    required
                                                    sx={{
                                                        borderRadius: 3,
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderWidth: 2,
                                                        }
                                                    }}
                                                    renderValue={(selected) => (
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            {getTypeChip(selected)}
                                                        </Box>
                                                    )}
                                                >
                                                    <MenuItem value="pdf">
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <InsertDriveFile sx={{ color: '#ef4444' }} />
                                                            PDF Document
                                                        </Box>
                                                    </MenuItem>
                                                    <MenuItem value="video">
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <VideoLibrary sx={{ color: '#3b82f6' }} />
                                                            Video File
                                                        </Box>
                                                    </MenuItem>
                                                    <MenuItem value="link">
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <LinkIcon sx={{ color: '#10b981' }} />
                                                            External Link
                                                        </Box>
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Upload Date"
                                                type="date"
                                                value={uploadDate}
                                                onChange={(e) => setUploadDate(e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 3,
                                                        '& fieldset': {
                                                            borderWidth: 2,
                                                        }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        fontWeight: 600
                                                    }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <CalendarToday sx={{ color: '#6366f1', mr: 1 }} />
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            {type === "link" ? (
                                                <TextField
                                                    fullWidth
                                                    label="Content URL"
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 3,
                                                            '& fieldset': {
                                                                borderWidth: 2,
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            fontWeight: 600
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <LinkIcon sx={{ color: '#10b981', mr: 1 }} />
                                                        ),
                                                    }}
                                                />
                                            ) : (
                                                <Paper 
                                                    sx={{ 
                                                        p: 4,
                                                        borderRadius: 3,
                                                        border: '2px dashed #d1d5db',
                                                        backgroundColor: '#f9fafb',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            borderColor: '#6366f1',
                                                            backgroundColor: '#f0f9ff'
                                                        }
                                                    }}
                                                >
                                                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                                                        <CloudUpload sx={{ fontSize: '3rem', color: '#6366f1' }} />
                                                        <Button
                                                            variant="contained"
                                                            component="label"
                                                            size="large"
                                                            startIcon={getTypeIcon(type)}
                                                            sx={{
                                                                borderRadius: 3,
                                                                px: 4,
                                                                py: 1.5,
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                                                }
                                                            }}
                                                        >
                                                            Choose {type === 'pdf' ? 'PDF' : 'Video'} File
                                                            <input
                                                                type="file"
                                                                hidden
                                                                accept={type === "pdf" ? ".pdf" : ".mp4"}
                                                                onChange={(e) => setFile(e.target.files[0])}
                                                                required
                                                            />
                                                        </Button>
                                                        {file && (
                                                            <Chip
                                                                icon={<CheckCircle />}
                                                                label={`Selected: ${file.name}`}
                                                                color="success"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    </Box>
                                                </Paper>
                                            )}
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                disabled={isUploading}
                                                sx={{
                                                    mt: 3,
                                                    py: 2,
                                                    fontSize: 18,
                                                    fontWeight: 700,
                                                    borderRadius: 3,
                                                    background: isUploading 
                                                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    '&:hover': {
                                                        background: isUploading 
                                                            ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                                            : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                                startIcon={isUploading ? <CloudUpload className="animate-pulse" /> : <CloudUpload />}
                                            >
                                                {isUploading ? 'Uploading Material...' : 'Upload Material'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>
                        </Fade>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadMaterial;