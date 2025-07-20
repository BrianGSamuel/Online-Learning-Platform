import { useState, useEffect } from "react";
import { Typography, Box, Grid, Card, CardContent, CardMedia, Button, Alert, Skeleton, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { School, Person, AttachMoney, Description } from "@mui/icons-material";
import TeacherSidebar from "../../../components/TeacherSidebar/index";
import TeacherHeader from "../../../components/TeacherHeader/index";
import axios from "axios";

const SelectClassForMaterials = () => {
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
                setLoading(true);
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                };

                const { data } = await axios.get("http://localhost:5000/api/teacher/classes", config);
                setClasses(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch classes");
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const handleClassSelect = (classId) => {
        navigate(`/${classId}/materials`);
    };

    // Default image for classes without images
    const getDefaultImage = (subject) => {
        const images = {
            'Mathematics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
            'Science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
            'English': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
            'History': 'https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?w=400&h=250&fit=crop',
            'Physics': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=250&fit=crop',
            'Chemistry': 'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=400&h=250&fit=crop',
            'Biology': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
        };
        return images[subject] || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop';
    };

    const SkeletonCard = () => (
        <Grid item xs={12} sm={6} lg={4}>
            <Card sx={{ 
                borderRadius: 4, 
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
            }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="text" height={32} width="80%" />
                    <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
                    <Skeleton variant="text" height={20} width="90%" sx={{ mt: 1 }} />
                    <Skeleton variant="rectangular" height={36} width={140} sx={{ mt: 2, borderRadius: 3 }} />
                </CardContent>
            </Card>
        </Grid>
    );

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
            <TeacherHeader
                isSidebarCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ${
                    isSidebarCollapsed ? "w-[60px]" : "w-[18%] md:w-[250px]"
                } bg-white/90 backdrop-blur-lg border-r border-gray-200/50`}>
                    <TeacherSidebar
                        isCollapsed={isSidebarCollapsed}
                        toggleSidebar={toggleSidebar}
                    />
                </div>

                {/* Main Content */}
                <div className={`flex-1 transition-all duration-300 ${
                    isSidebarCollapsed ? "ml-[60px]" : "ml-[18%] md:ml-[250px]"
                }`}>
                    {/* Hero Section */}
                    <div className="pt-20 pb-8 px-6">
                        <Box sx={{ maxWidth: 1400, mx: "auto" }}>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                                    <School sx={{ fontSize: 32, color: 'white' }} />
                                </div>
                                <Typography 
                                    variant="h3" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 2
                                    }}
                                >
                                    Class Materials Hub
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    color="text.secondary" 
                                    sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
                                >
                                    Select a class to manage learning materials, resources, and educational content
                                </Typography>
                            </div>

                            {error && (
                                <Alert 
                                    severity="error" 
                                    sx={{ 
                                        mb: 4, 
                                        borderRadius: 3,
                                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}

                            {loading ? (
                                <Grid container spacing={4}>
                                    {[...Array(6)].map((_, index) => (
                                        <SkeletonCard key={index} />
                                    ))}
                                </Grid>
                            ) : classes.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                                        <School sx={{ fontSize: 48, color: 'text.secondary' }} />
                                    </div>
                                    <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                                        No Classes Found
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Start by creating your first class to manage materials and resources.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            mt: 3,
                                            borderRadius: 3,
                                            px: 4,
                                            py: 1.5,
                                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 12px 32px rgba(79, 70, 229, 0.4)',
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => navigate('/teacher/create-class')}
                                    >
                                        Create New Class
                                    </Button>
                                </div>
                            ) : (
                                <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
                                    {classes.map(cls => (
                                        <Grid item xs={12} sm={6} lg={4} key={cls._id} sx={{ display: 'flex' }}>
                                            <Card sx={{ 
                                                borderRadius: 4,
                                                overflow: 'hidden',
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'rgba(255,255,255,0.95)',
                                                backdropFilter: 'blur(10px)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                width: '100%',
                                                height: '100%',
                                                minHeight: '480px',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                                                }
                                            }}>
                                                <CardMedia
                                                    component="img"
                                                    height="200"
                                                    image={cls.image || getDefaultImage(cls.subject)}
                                                    alt={cls.subject}
                                                    sx={{
                                                        objectFit: 'cover',
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        flexShrink: 0
                                                    }}
                                                />
                                                <CardContent sx={{ 
                                                    p: 3,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    flexGrow: 1,
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div>
                                                        <div className="flex items-start justify-between mb-3">
                                                            <Typography 
                                                                variant="h6" 
                                                                sx={{ 
                                                                    fontWeight: 700,
                                                                    color: '#1e293b',
                                                                    fontSize: '1.25rem',
                                                                    lineHeight: 1.3,
                                                                    minHeight: '32px'
                                                                }}
                                                            >
                                                                {cls.subject}
                                                            </Typography>
                                                            <Chip 
                                                                label="Active"
                                                                size="small"
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                    color: 'white',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.75rem',
                                                                    flexShrink: 0
                                                                }}
                                                            />
                                                        </div>
                                                        
                                                        <div className="space-y-2 mb-4" style={{ minHeight: '120px' }}>
                                                            <div className="flex items-center gap-2">
                                                                <AttachMoney sx={{ fontSize: 18, color: '#10b981' }} />
                                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669' }}>
                                                                    ${cls.monthlyFee}/month
                                                                </Typography>
                                                            </div>
                                                            
                                                            {cls.studentsCount && (
                                                                <div className="flex items-center gap-2">
                                                                    <Person sx={{ fontSize: 18, color: '#6366f1' }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {cls.studentsCount} students enrolled
                                                                    </Typography>
                                                                </div>
                                                            )}
                                                            
                                                            {cls.description && (
                                                                <div className="flex items-start gap-2 mt-2">
                                                                    <Description sx={{ fontSize: 18, color: '#64748b', mt: 0.25, flexShrink: 0 }} />
                                                                    <Typography 
                                                                        variant="body2" 
                                                                        color="text.secondary"
                                                                        sx={{ 
                                                                            lineHeight: 1.5
                                                                        }}
                                                                    >
                                                                        {cls.description}
                                                                    </Typography>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <Button
                                                        variant="contained"
                                                        fullWidth
                                                        size="large"
                                                        onClick={() => handleClassSelect(cls._id)}
                                                        sx={{ 
                                                            borderRadius: 3,
                                                            py: 1.5,
                                                            fontWeight: 700,
                                                            fontSize: '0.95rem',
                                                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                                            boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)',
                                                            textTransform: 'none',
                                                            mt: 'auto',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
                                                                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)',
                                                                transform: 'translateY(-1px)'
                                                            },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        Manage Materials
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectClassForMaterials;