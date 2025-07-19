import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ComingSoon = () => {
    const [email, setEmail] = useState("");
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Set launch date (you can modify this)
    const launchDate = new Date("2026-01-15T00:00:00").getTime();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [launchDate]);

    const handleEmailSubmit = () => {
        if (!email) {
            setNotification({ message: "Please enter your email address", type: "error" });
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setNotification({ message: "Please enter a valid email address", type: "error" });
            return;
        }
        
        // Simulate email subscription
        setNotification({ message: "Thank you! We'll notify you when we launch.", type: "success" });
        setEmail("");
        
        // Clear notification after 3 seconds
        setTimeout(() => {
            setNotification({ message: "", type: "" });
        }, 3000);
    };

    const features = [
        {
            icon: "✅",
            title: "Teacher Registration",
            description: "Already live! Educators can join now",
            status: "available"
        },
        {
            icon: "✅",
            title: "Student Registration",
            description: "Already live! Students can enroll now",
            status: "available"
        },
        {
            icon: "🏫",
            title: "Institute Registration",
            description: "Coming soon! Complete institutional management",
            status: "coming"
        },
        {
            icon: "📊",
            title: "Full Dashboard",
            description: "Complete ecosystem management tools",
            status: "coming"
        }
    ];

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
                <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
            </div>

            {/* Notification */}
            <AnimatePresence>
                {notification.message && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 0.9, x: 16 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`fixed top-4 right-0 px-6 py-3 rounded-l-lg shadow-lg text-white text-sm font-medium z-50 ${
                            notification.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-4xl text-center space-y-8"
                >
                    {/* Logo and Title */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                            <h1 className="text-6xl font-extrabold text-white tracking-tight">
                                EduConnect
                            </h1>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                            Institute Registration Coming Soon
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Complete your educational ecosystem! Teacher and Student registration are live. 
                            Institute management features are launching soon.
                        </p>
                    </motion.div>

                    {/* Countdown Timer */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex justify-center space-x-4 md:space-x-8"
                    >
                        {Object.entries(timeLeft).map(([unit, value], index) => (
                            <motion.div
                                key={unit}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 md:p-6 min-w-[80px] md:min-w-[100px] shadow-md"
                            >
                                <div className="text-2xl md:text-4xl font-bold text-gray-800">
                                    {value.toString().padStart(2, '0')}
                                </div>
                                <div className="text-sm md:text-base text-gray-600 capitalize mt-1">
                                    {unit}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Email Subscription */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email for updates"
                                    className="flex-1 px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleEmailSubmit}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                                >
                                    Notify Me
                                </motion.button>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mt-2">
                            Get notified when Institute Registration goes live!
                        </p>
                    </motion.div>

                    {/* Features Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.0 }}
                        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                                className={`bg-white border-2 rounded-xl p-6 shadow-lg transition duration-300 hover:shadow-xl hover:-translate-y-1 ${
                                    feature.status === 'available' 
                                        ? 'border-green-200 hover:border-green-300' 
                                        : 'border-gray-200 hover:border-purple-300'
                                }`}
                            >
                                <div className="text-4xl mb-3">{feature.icon}</div>
                                <h3 className="text-gray-800 font-semibold text-lg mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    {feature.description}
                                </p>
                                {feature.status === 'available' && (
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                        ✓ Available Now
                                    </div>
                                )}
                                {feature.status === 'coming' && (
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                                        ⏳ Coming Soon
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Available Now Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 2.0 }}
                        className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <motion.a
                            href="/register/teacher"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
                        >
                            Register as Teacher →
                        </motion.a>
                        <motion.a
                            href="/register/student"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                        >
                            Register as Student →
                        </motion.a>
                        <motion.a
                            href="/features/auth/InstituteRegister"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gray-400 cursor-not-allowed rounded-lg text-white font-medium opacity-60"
                            style={{ pointerEvents: 'none' }}
                        >
                            Institute Registration (Coming Soon)
                        </motion.a>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 2.2 }}
                        className="flex justify-center space-x-6 mt-12"
                    >
                        {['Twitter', 'LinkedIn', 'Facebook'].map((social, index) => (
                            <motion.a
                                key={social}
                                href="#"
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:from-blue-600 hover:to-purple-700 transition duration-200 shadow-md"
                            >
                                <span className="text-sm font-medium">
                                    {social.charAt(0)}
                                </span>
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 2.4 }}
                        className="mt-12 text-gray-500 text-sm"
                    >
                        <p>© 2025 EduConnect. Building the complete educational ecosystem.</p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default ComingSoon;