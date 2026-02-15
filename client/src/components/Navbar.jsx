import React from 'react';
import { MapPin, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ tripCount = 0, onOpenTrip, onToggleSidebar }) => {
    return (
        <nav className="navbar">
            <div className="container">
                <div className="nav-content">
                    <button className="icon-btn" onClick={onToggleSidebar} style={{ marginRight: '1rem' }}>
                        <Menu size={24} />
                    </button>
                    <div className="logo">
                        <motion.div
                            whileHover={{ rotate: 10 }}
                            className="logo-icon"
                        >
                            <MapPin size={28} />
                        </motion.div>
                        <span className="brand-name">
                            Tre<span className="highlight">go</span>
                        </span>
                    </div>

                    <div className="nav-links">
                        <a href="#" className="nav-link">Home</a>
                        <a href="#map" className="nav-link">Explore Map</a>
                        <a href="#places" className="nav-link">Places</a>
                    </div>

                    <div className="nav-actions">
                        <button className="icon-btn">
                            <Search size={20} />
                        </button>
                        <button className="primary-btn trip-btn" onClick={onOpenTrip}>
                            Plan Trip
                            {tripCount > 0 && (
                                <span className="trip-badge-count">{tripCount}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
