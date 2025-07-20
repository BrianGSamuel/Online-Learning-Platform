import { useState, useEffect } from "react";
import TeacherSidebar from "../../../components/TeacherSidebar/index";
import TeacherHeader from "../../../components/TeacherHeader/index";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ViewAllClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const { data } = await axios.get(
                    "http://localhost:5000/api/teacher/classes",
                    config
                );

                setClasses(data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || "Error fetching classes");
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    // Auto-hide notification after 4 seconds
    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                setNotification({ message: "", type: "" });
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleEdit = (classId) => {
        navigate(`/teacher/classes/${classId}/update`);
    };

    const handleDeletePrompt = (classId) => {
        setClassToDelete(classId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!classToDelete) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.delete(`http://localhost:5000/api/classes/${classToDelete}`, config);
            setClasses(classes.filter((classItem) => classItem._id !== classToDelete));
            setNotification({ message: "Class deleted successfully!", type: "success" });
        } catch (error) {
            setNotification({
                message: error.response?.data?.message || "Error deleting class",
                type: "error",
            });
        } finally {
            setShowDeleteModal(false);
            setClassToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setClassToDelete(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100">
            {/* Notification */}
            <AnimatePresence>
                {notification.message && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 0.9, x: 16 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`fixed top-4 right-0 px-4 py-2 rounded-l-md shadow-lg text-white text-xs font-medium z-50 ${
                            notification.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Confirm Deletion
                            </h3>
                            <p className="text-gray-600 text-sm mb-6">
                                Are you sure you want to delete this class? This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDeleteCancel}
                                    className="w-1/2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 shadow-md"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDeleteConfirm}
                                    className="w-1/2 py-2 px-4 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 shadow-md"
                                >
                                    Confirm Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                    {/* Main Content Area */}
                    <div className="mt-[50px] p-6 md:p-8 overflow-y-auto h-[calc(100vh-50px)]">
                        <div className="max-w-7xl mx-auto">
                            {/* Header Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center mb-10"
                            >
                                <h1 className="text-4xl font-extrabold text-indigo-600 mb-4 tracking-tight">
                                    My Classes
                                </h1>
                                <div className="w-24 h-1 bg-indigo-500 rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-600 text-lg">
                                    Manage and organize your teaching classes
                                </p>
                            </motion.div>

                            {/* Content Section */}
                            {loading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                    <span className="text-indigo-600 font-semibold text-lg">Loading classes...</span>
                                </motion.div>
                            ) : error ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="bg-red-100 border border-red-300 rounded-xl p-6 max-w-md mx-auto">
                                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Classes</h3>
                                        <p className="text-red-600">{error}</p>
                                    </div>
                                </motion.div>
                            ) : classes.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="max-w-md mx-auto">
                                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <span className="text-2xl">📚</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">No Classes Yet</h3>
                                        <p className="text-gray-600">
                                            You haven't created any classes yet. Start by creating your first class!
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {classes.map((classItem, index) => (
                                        <motion.div
                                            key={classItem._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                                        >
                                            <div className="relative mb-4">
                                                {classItem.coverPhoto ? (
                                                    <img
                                                        src={`http://localhost:5000${classItem.coverPhoto}`}
                                                        alt={classItem.subject}
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-full h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                                                        <div className="text-center">
                                                            <span className="text-4xl mb-2 block">🎓</span>
                                                            <span className="text-indigo-600 font-medium">No Cover Photo</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <span
                                                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                                        classItem.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {classItem.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                            
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{classItem.subject}</h3>
                                            
                                            <div className="bg-indigo-50 px-3 py-1 rounded-lg inline-block mb-3">
                                                <p className="text-indigo-600 font-semibold text-sm">
                                                    Fee: ${classItem.monthlyFee}/month
                                                </p>
                                            </div>
                                            
                                            <p className="text-gray-600 text-sm mb-4 overflow-hidden" style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}>
                                                {classItem.description || "No description available"}
                                            </p>
                                            
                                            <div className="flex space-x-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleEdit(classItem._id)}
                                                    className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 shadow-md"
                                                >
                                                    Edit Details
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDeletePrompt(classItem._id)}
                                                    className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 shadow-md"
                                                >
                                                    Delete
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewAllClasses;