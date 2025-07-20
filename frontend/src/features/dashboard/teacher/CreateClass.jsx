import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import TeacherSidebar from "../../../components/TeacherSidebar/index";
import TeacherHeader from "../../../components/TeacherHeader/index";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CreateClass = () => {
    const [subject, setSubject] = useState("");
    const [monthlyFee, setMonthlyFee] = useState("");
    const [description, setDescription] = useState("");
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [notification, setNotification] = useState({ message: "", type: "" });
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    // Validation function
    const validateForm = () => {
        const errors = {};

        // Subject validation
        if (!subject.trim()) {
            errors.subject = "Subject is required";
        } else if (subject.length < 2) {
            errors.subject = "Subject must be at least 2 characters long";
        } else if (subject.length > 50) {
            errors.subject = "Subject must be less than 50 characters";
        }

        // Monthly fee validation
        if (!monthlyFee) {
            errors.monthlyFee = "Monthly fee is required";
        } else if (isNaN(monthlyFee) || Number(monthlyFee) <= 0) {
            errors.monthlyFee = "Monthly fee must be a positive number";
        } else if (Number(monthlyFee) > 10000) {
            errors.monthlyFee = "Monthly fee cannot exceed $10,000";
        }

        // Description validation (optional field)
        if (description && description.length > 500) {
            errors.description = "Description must be less than 500 characters";
        }

        // Cover photo validation (optional field)
        if (coverPhoto) {
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(coverPhoto.type)) {
                errors.coverPhoto = "Cover photo must be a JPEG or PNG file";
            } else if (coverPhoto.size > 5 * 1024 * 1024) { // 5MB limit
                errors.coverPhoto = "Cover photo must be less than 5MB";
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Run validation before submission
        if (!validateForm()) {
            return;
        }

        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "multipart/form-data"
                },
            };

            const formData = new FormData();
            formData.append("subject", subject);
            formData.append("monthlyFee", Number(monthlyFee));
            formData.append("description", description);
            if (coverPhoto) {
                formData.append("coverPhoto", coverPhoto);
            }

            await axios.post(
                "http://localhost:5000/api/classes/create",
                formData,
                config
            );

            setNotification({ message: "Class created successfully! Redirecting...", type: "success" });
            setTimeout(() => navigate("/teacher/classses/view-all"), 1500);
        } catch (error) {
            setNotification({
                message: error.response?.data?.message || "Error creating class",
                type: "error",
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCoverPhoto(file);
    };

    const handleRemoveCoverPhoto = () => {
        setCoverPhoto(null);
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
        document.title = `TeacherDashboard - EduConnect`;
    }, [location]);

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Subtle background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
            </div>

            {/* Notification with enhanced styling */}
            <AnimatePresence>
                {notification.message && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className={`fixed top-6 right-6 px-6 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold z-50 backdrop-blur-md border border-white/20 ${
                            notification.type === "success" 
                                ? "bg-gradient-to-r from-emerald-500 to-green-600" 
                                : "bg-gradient-to-r from-red-500 to-pink-600"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {notification.type === "success" ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            )}
                            {notification.message}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <TeacherHeader 
                isSidebarCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />

            <div className="flex min-h-screen relative z-10">
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
                    <div className="pt-20 p-4 md:p-8 overflow-y-auto h-screen">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="max-w-2xl mx-auto mt-12"
                        >
                            {/* Header Section */}
                            <div className="text-center mb-12">
                                
                                <motion.h1 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                                >
                                    Create New Class
                                </motion.h1>
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="text-gray-600 text-lg"
                                >
                                    Build an engaging learning experience for your students
                                </motion.p>
                            </div>

                            {/* Form Container */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Two Column Layout */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Class Information Section */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">1</span>
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-800">Class Information</h2>
                                            </div>

                                            {/* Subject Field */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 block">Subject Name</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., Advanced Mathematics"
                                                        value={subject}
                                                        onChange={(e) => setSubject(e.target.value)}
                                                        required
                                                        className={`w-full h-12 px-4 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200 ${
                                                            validationErrors.subject ? "border-red-500" : "border-gray-200"
                                                        }`}
                                                    />
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                {validationErrors.subject && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-400 text-sm flex items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        {validationErrors.subject}
                                                    </motion.p>
                                                )}
                                            </div>

                                            {/* Monthly Fee Field */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 block">Monthly Fee (USD)</label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                        <span className="text-gray-500 font-medium">$</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        placeholder="99.00"
                                                        value={monthlyFee}
                                                        onChange={(e) => setMonthlyFee(e.target.value)}
                                                        required
                                                        className={`w-full h-12 pl-8 pr-4 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200 ${
                                                            validationErrors.monthlyFee ? "border-red-500" : "border-gray-200"
                                                        }`}
                                                    />
                                                </div>
                                                {validationErrors.monthlyFee && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-400 text-sm flex items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        {validationErrors.monthlyFee}
                                                    </motion.p>
                                                )}
                                            </div>

                                            {/* Description Field */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 block">Class Description (Optional)</label>
                                                <textarea
                                                    placeholder="Describe your class objectives, teaching methodology, and what students will learn..."
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    rows="4"
                                                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200 resize-none ${
                                                        validationErrors.description ? "border-red-500" : "border-gray-200"
                                                    }`}
                                                />
                                                {validationErrors.description && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-400 text-sm flex items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        {validationErrors.description}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Cover Photo Section */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">2</span>
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-800">Visual Appeal</h2>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-sm font-medium text-gray-700 block">Cover Photo (Optional)</label>
                                                
                                                {!coverPhoto ? (
                                                    <motion.div 
                                                        whileHover={{ scale: 1.02 }}
                                                        className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-all duration-200 cursor-pointer bg-gray-50"
                                                    >
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg,image/png"
                                                            onChange={handleFileChange}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                        <div className="space-y-4">
                                                            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-800 font-medium">Upload a cover photo</p>
                                                                <p className="text-gray-500 text-sm">JPG or PNG, max 5MB</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div 
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="relative rounded-xl overflow-hidden bg-white shadow-lg border border-gray-200"
                                                    >
                                                        <img
                                                            src={URL.createObjectURL(coverPhoto)}
                                                            alt="Cover Photo Preview"
                                                            className="w-full h-48 object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            type="button"
                                                            onClick={handleRemoveCoverPhoto}
                                                            className="absolute top-3 right-3 w-8 h-8 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                            </svg>
                                                        </motion.button>
                                                        <div className="absolute bottom-3 left-3 text-white">
                                                            <p className="text-sm font-medium">Cover Photo Preview</p>
                                                            <p className="text-xs opacity-75">{coverPhoto.name}</p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                                
                                                {validationErrors.coverPhoto && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-400 text-sm flex items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        {validationErrors.coverPhoto}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-200 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                                        <span className="relative flex items-center justify-center gap-3">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                            </svg>
                                            Create Class
                                        </span>
                                    </motion.button>
                                </form>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default CreateClass;