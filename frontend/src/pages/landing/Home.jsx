import { Link } from "react-router-dom"
import { assets } from "../../assets"
import Facilities from "./Facilities"
import FeaturedLibraryItems from "./FeaturedLibraryItems"
import FeaturedLabResources from "./FeaturedLabResources"
import FeaturedDiscussionRooms from "./FeaturedDiscussionRooms"
import { useSelector } from "react-redux"
import Footer from "../../components/Footer"
import { FiBook, FiLayers, FiUsers, FiArrowRight } from "react-icons/fi"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useEffect, useState } from 'react'

const Home = () => {
    const { isAuthenticated } = useSelector((state) => state.user);
    const { scrollY } = useScroll();
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const featuresRef = useRef(null);
    const testimonialsRef = useRef(null);
    const ctaRef = useRef(null);
    
    // Refs for featured sections
    const featuredLibraryRef = useRef(null);
    const featuredLabRef = useRef(null);
    const featuredRoomsRef = useRef(null);
    
    const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 });
    const isFeaturesInView = useInView(featuresRef, { once: false, amount: 0.3 });
    const isTestimonialsInView = useInView(testimonialsRef, { once: false, amount: 0.3 });
    const isCtaInView = useInView(ctaRef, { once: false, amount: 0.5 });
    
    // InView hooks for featured sections
    const isLibraryInView = useInView(featuredLibraryRef, { once: false, amount: 0.3 });
    const isLabInView = useInView(featuredLabRef, { once: false, amount: 0.3 });
    const isRoomsInView = useInView(featuredRoomsRef, { once: false, amount: 0.3 });
    
    // Parallax effects
    const heroImageY = useTransform(scrollY, [0, 500], [0, 100]);
    const heroContentY = useTransform(scrollY, [0, 500], [0, -50]);
    const heroBackgroundY = useTransform(scrollY, [0, 500], [0, 50]);
    
    // Animation for sections appearing on scroll
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1,
                duration: 0.6,
                ease: "easeOut"
            } 
        }
    };
    
    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    // Animation for featured sections
    const featuredSectionVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.7,
                ease: "easeOut"
            }
        }
    };

    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Slider auto-play effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
        }, 5000); // Change slide every 5 seconds
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section - Enhanced Design with Interactive Elements */}
            <section className="relative min-h-screen px-4 pt-24 pb-24 overflow-hidden md:px-8">
                {/* Dynamic Background with University Campus */}
                <motion.div 
                    style={{ y: heroBackgroundY }}
                    className="absolute inset-0 -z-10"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0e345a]/90 via-[#0e345a]/80 to-[#0e345a]/70"></div>
                    <img 
                        src={assets.comsats_wah} 
                        alt="University Campus" 
                        className="object-cover w-full h-full opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                </motion.div>
                
                <div ref={heroRef} className="relative pt-12 mx-auto max-w-7xl">
                    {/* Platform Logo and Branding */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-12"
                    >
                        <div className="inline-flex items-center px-6 py-3 space-x-2 rounded-full bg-white/10 backdrop-blur-md">
                            <img src={assets.logo} alt="Resourcify" className="w-10 h-10" />
                            <span className="text-lg font-medium text-white">Resourcify - Educational Resource Management</span>
                        </div>
                    </motion.div>

                    <div className="grid items-center gap-12 md:grid-cols-2">
                        <motion.div 
                            style={{ y: heroContentY }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="z-10 text-center md:text-left"
                        >
                            <motion.h1 
                                className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                            >
                                Your Gateway to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300">Knowledge Resources</span>
                            </motion.h1>
                            
                            <motion.p 
                                className="max-w-xl mx-auto mb-8 text-xl leading-relaxed text-gray-100 md:mx-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                Resourcify brings together library materials, lab equipment, and discussion rooms in one powerful platform. Simplify access, streamline management, and enhance the educational experience.
                            </motion.p>
                            
                            <motion.div 
                                className="flex flex-wrap justify-center gap-4 md:justify-start"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <Link to="/library" className="px-8 py-4 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/50 group">
                                    <span className="flex items-center">
                                        Browse Library
                                        <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </Link>
                                <Link to="/lab-resources" className="flex items-center px-8 py-4 font-medium text-white transition-all border-2 rounded-lg border-white/30 group backdrop-blur-sm hover:bg-white/10 hover:border-white/50">
                                    Explore Lab Resources
                                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </motion.div>
                            
                            {/* Key Features Quick Access */}
                            <motion.div 
                                className="grid grid-cols-3 gap-4 mt-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                {[
                                    { icon: <FiBook />, label: "Digital Library", desc: "Access thousands of resources" },
                                    { icon: <FiLayers />, label: "Lab Equipment", desc: "Book equipment with ease" },
                                    { icon: <FiUsers />, label: "Discussion Rooms", desc: "Collaborate seamlessly" }
                                ].map((feature, index) => (
                                    <div key={index} className="flex flex-col items-center p-4 text-center text-white transition-all rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10">
                                        <span className="p-2 mb-2 text-2xl">{feature.icon}</span>
                                        <span className="text-sm font-medium">{feature.label}</span>
                                        <span className="mt-1 text-xs text-gray-300">{feature.desc}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                        
                        <motion.div 
                            style={{ y: heroImageY }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="flex justify-center"
                        >
                            <div className="relative">
                                {/* Multiple layered images for depth */}
                                <div className="absolute w-full h-full transform bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-2xl blur-2xl -z-10 rotate-3"></div>
                                
                                <div className="relative z-10 overflow-hidden border-8 shadow-2xl border-white/20 rounded-2xl backdrop-blur-sm bg-white/10">
                                    <img 
                                        src={assets.comsats_wah_2} 
                                        alt="University Campus" 
                                        className="relative w-full max-w-lg transition-transform rounded-lg duration-10000 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e345a]/80 to-transparent opacity-60"></div>
                                    
                                    {/* Interactive overlay elements */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0e345a] to-transparent">
                                        <h3 className="mb-2 text-2xl font-bold text-white">Modernize Your Campus</h3>
                                        <p className="text-gray-200">Transform resource management with a unified digital solution</p>
                                    </div>
                                    
                                    {/* Floating statistics */}
                                    <div className="absolute px-4 py-2 text-sm font-medium text-white rounded-full top-4 right-4 bg-blue-600/80 backdrop-blur-sm">
                                        24/7 Access
                                    </div>
                                </div>
                                
                                {/* Decorative elements */}
                                <div className="absolute w-24 h-24 rounded-full -bottom-6 -right-6 bg-gradient-to-br from-indigo-500 to-purple-600 blur-xl opacity-70"></div>
                                <div className="absolute w-20 h-20 rounded-full -top-6 -left-6 bg-gradient-to-br from-blue-500 to-indigo-600 blur-xl opacity-70"></div>
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Scroll indicator */}
                    <motion.div 
                        className="absolute flex flex-col items-center text-white transform -translate-x-1/2 bottom-8 left-1/2"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <span className="mb-2 text-sm">Scroll to explore platform features</span>
                        <div className="flex justify-center w-6 h-10 border-2 rounded-full border-white/50">
                            <motion.div 
                                className="w-1.5 h-1.5 bg-white rounded-full mt-2"
                                animate={{ y: [0, 16, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            ></motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
            
            {/* Stats Section - With Scroll Reveal */}
            <section ref={statsRef} className="px-4 py-12 bg-white md:px-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate={isStatsInView ? "visible" : "hidden"}
                        className="grid grid-cols-2 gap-6 md:grid-cols-4"
                    >
                        {[
                            { number: "10,000+", label: "Resources Available" },
                            { number: "500+", label: "Lab Equipment" },
                            { number: "24/7", label: "Digital Access" },
                            { number: "1000+", label: "Daily Users" }
                        ].map((stat, index) => (
                            <motion.div 
                                key={index}
                                variants={itemVariants}
                                className="p-6 text-center transition-all duration-300 border border-gray-100 rounded-lg hover:shadow-md hover:border-blue-200"
                            >
                                <motion.p 
                                    initial={{ scale: 0.5 }}
                                    animate={isStatsInView ? { scale: 1 } : { scale: 0.5 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="mb-1 text-3xl font-bold text-indigo-600"
                                >
                                    {stat.number}
                                </motion.p>
                                <p className="text-gray-600">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            
            {/* Features Section - Modern Cards with Scroll Animations */}
            <section ref={featuresRef} className="px-4 py-16 bg-gradient-to-b from-white to-gray-50 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.7 }}
                        className="mb-16 text-center"
                    >
                        <h2 className="mb-4 text-3xl font-bold">Comprehensive Resource Management</h2>
                        <p className="max-w-3xl mx-auto text-xl text-gray-600">
                            Resourcify streamlines the management of academic resources across your institution
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        initial="hidden"
                        animate={isFeaturesInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="relative w-full overflow-hidden rounded-xl"
                    >
                        <div className="relative w-full slider-container">
                            <div 
                                className="flex transition-transform duration-500 ease-in-out slider-track"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {[
                                    {
                                        icon: <FiBook className="text-4xl text-blue-600" />,
                                        title: "Library Management",
                                        description: "Access and manage books, journals, and other library resources with an intuitive interface",
                                        image: assets.image1,
                                        link: "/library"
                                    },
                                    {
                                        icon: <FiLayers className="text-4xl text-indigo-600" />,
                                        title: "Lab Resources",
                                        description: "Streamline lab equipment and resource management for enhanced learning experiences",
                                        image: assets.image2,
                                        link: "/lab-resources"
                                    },
                                    {
                                        icon: <FiUsers className="text-4xl text-violet-600" />,
                                        title: "Discussion Rooms",
                                        description: "Easily book and manage discussion rooms for collaborative study sessions",
                                        image: assets.image3,
                                        link: "/discussion-rooms"
                                    }
                                ].map((feature, index) => (
                                    <motion.div 
                                        key={index}
                                        variants={itemVariants}
                                        className="min-w-full overflow-hidden transition-all duration-300 bg-gradient-to-b from-gray-100 to-white"
                                    >
                                        <div className="relative flex flex-col items-center h-full px-4 py-10 md:px-12">
                                            {/* Centered Image with Overlay */}
                                            <div className="relative w-full max-w-3xl mb-8 overflow-hidden rounded-2xl shadow-2xl aspect-[16/9]">
                                                <img 
                                                    src={feature.image} 
                                                    alt={feature.title} 
                                                    className="object-cover w-full h-full transition-transform duration-700 scale-105 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                                <div className="absolute bottom-0 left-0 flex items-center p-8">
                                                    <div className="p-3 mr-4 bg-white rounded-full shadow-lg">
                                                        {feature.icon}
                                                    </div>
                                                    <h3 className="text-3xl font-bold text-white">{feature.title}</h3>
                                                </div>
                                            </div>
                                            
                                            {/* Info Cards */}
                                            <div className="z-10 flex flex-col w-full max-w-3xl gap-6 -mt-4 md:flex-row">
                                                <div className="flex-1 p-6 transition-transform bg-white shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-1">
                                                    <h4 className="mb-2 text-lg font-semibold text-gray-900">Key Features</h4>
                                                    <p className="text-gray-700">
                                                        {index === 0 && "Digital catalogs, reservations, lending history, and personalized recommendations."}
                                                        {index === 1 && "Equipment booking, usage tutorials, maintenance schedules, and resource tracking."}
                                                        {index === 2 && "Room availability, advanced booking, capacity information, and multimedia support."}
                                                    </p>
                                                </div>
                                                <div className="flex-1 p-6 transition-transform bg-white shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-1">
                                                    <h4 className="mb-2 text-lg font-semibold text-gray-900">Benefits</h4>
                                                    <p className="text-gray-700">
                                                        {index === 0 && "Quick access to academic resources, efficient search, and streamlined borrowing process."}
                                                        {index === 1 && "Optimized resource allocation, reduced wait times, and enhanced learning experiences."}
                                                        {index === 2 && "Seamless collaboration, dedicated study spaces, and improved group productivity."}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* CTA Button */}
                                            <Link 
                                                to={feature.link} 
                                                className="flex items-center px-8 py-4 mt-8 text-lg font-medium text-white transition-all transform rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl hover:scale-105"
                                            >
                                                <span>Explore {feature.title}</span>
                                                <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-2" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <button 
                                className="absolute left-4 z-10 p-4 text-white transform -translate-y-1/2 border border-white/30 bg-black/40 rounded-full hover:bg-black/60 top-[40%] backdrop-blur-sm hover:scale-110 transition-all"
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
                                aria-label="Previous slide"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button 
                                className="absolute right-4 z-10 p-4 text-white transform -translate-y-1/2 border border-white/30 bg-black/40 rounded-full hover:bg-black/60 top-[40%] backdrop-blur-sm hover:scale-110 transition-all"
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
                                aria-label="Next slide"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                            
                            <div className="absolute left-0 right-0 flex items-center justify-center space-x-4 bottom-6">
                                {[0, 1, 2].map((i) => (
                                    <button
                                        key={i}
                                        className={`transition-all duration-300 ${currentSlide === i 
                                            ? 'w-12 h-3 bg-blue-500' 
                                            : 'w-3 h-3 bg-gray-300'} rounded-full hover:bg-blue-400`}
                                        aria-label={`Go to slide ${i + 1}`}
                                        onClick={() => setCurrentSlide(i)}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
            
            {/* Featured Sections with Animations */}
            {/* Featured Library Items */}
            <motion.div 
                ref={featuredLibraryRef}
                initial="hidden"
                animate={isLibraryInView ? "visible" : "hidden"}
                variants={featuredSectionVariants}
            >
                <FeaturedLibraryItems />
            </motion.div>
            
            {/* Featured Lab Resources */}
            <motion.div 
                ref={featuredLabRef}
                initial="hidden"
                animate={isLabInView ? "visible" : "hidden"}
                variants={featuredSectionVariants}
            >
                <FeaturedLabResources />
            </motion.div>
            
            {/* Featured Discussion Rooms */}
            <motion.div 
                ref={featuredRoomsRef}
                initial="hidden"
                animate={isRoomsInView ? "visible" : "hidden"}
                variants={featuredSectionVariants}
            >
                <FeaturedDiscussionRooms />
            </motion.div>
            
            {/* Testimonials Section - With Scroll Effects */}
            <section ref={testimonialsRef} className="px-4 py-16 bg-gradient-to-br from-indigo-50 to-white md:px-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12 text-center"
                    >
                        <h2 className="mb-4 text-3xl font-bold">What Our Users Say</h2>
                        <p className="max-w-3xl mx-auto text-xl text-gray-600">
                            Hear from students and faculty members who use Resourcify every day
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate={isTestimonialsInView ? "visible" : "hidden"}
                        className="grid gap-8 md:grid-cols-3"
                    >
                        {[
                            {
                                quote: "Resourcify has transformed how I access library resources. The interface is intuitive and I can find what I need quickly.",
                                name: "Sophia Chen",
                                role: "Graduate Student"
                            },
                            {
                                quote: "Managing lab resources has never been easier. The booking system is seamless and saves us so much time.",
                                name: "Dr. James Wilson",
                                role: "Professor of Chemistry"
                            },
                            {
                                quote: "The discussion room reservation system is fantastic. I can always find a quiet place to study with my peers.",
                                name: "Michael Rodriguez",
                                role: "Undergraduate Student"
                            }
                        ].map((testimonial, index) => (
                            <motion.div 
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="p-6 bg-white shadow-md rounded-xl"
                            >
                                <div className="mb-4 text-5xl text-indigo-200">"</div>
                                <p className="mb-6 text-gray-700">{testimonial.quote}</p>
                                <div>
                                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                                    <p className="text-gray-500">{testimonial.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            
            <Facilities />
            
            {/* Call to Action - With Scroll Effects */}
            <section ref={ctaRef} className="relative px-4 py-16 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 md:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isCtaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                    className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMCAwaDIwMDB2NTAwSDB6Ii8+PHBhdGggZD0iTTAgMGgyMDAwdjUwMEgweiIvPjxjaXJjbGUgZmlsbC1vcGFjaXR5PSIuMSIgZmlsbD0iI0ZGRiIgY3g9IjExMDAiIGN5PSIxMDAiIHI9IjgwIi8+PGNpcmNsZSBmaWxsLW9wYWNpdHk9Ii4xNSIgZmlsbD0iI0ZGRiIgY3g9IjExNTAiIGN5PSIyNTAiIHI9IjQwIi8+PGNpcmNsZSBmaWxsLW9wYWNpdHk9Ii4xIiBmaWxsPSIjRkZGIiBjeD0iMTMwMCIgY3k9IjIwMCIgcj0iNDAiLz48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjEiIGZpbGw9IiNGRkYiIGN4PSI5MDAiIGN5PSIyMDAiIHI9IjYwIi8+PC9nPjwvc3ZnPg==')] opacity-30 bg-no-repeat bg-cover"
                />
                
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Ready to streamline your resource management?</h2>
                        <p className="max-w-3xl mx-auto mb-8 text-xl text-blue-100">
                            Join thousands of students and faculty already using Resourcify to access and manage academic resources.
                        </p>
                        <motion.div 
                            className="flex flex-wrap justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <Link to="/register" className="px-8 py-3 font-medium text-blue-700 transition-all bg-white rounded-lg hover:shadow-lg hover:shadow-blue-900/20">
                                Get Started
                            </Link>
                            <Link to="/library" className="px-8 py-3 font-medium text-white transition-all border-2 border-white rounded-lg hover:bg-white/10">
                                Explore Resources
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}

export default Home
