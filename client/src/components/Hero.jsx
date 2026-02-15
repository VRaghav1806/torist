import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = ({ onOpenPopular }) => {
    return (
        <div className="hero-section">
            <div className="hero-bg-gradient"></div>
            <div className="hero-blob blob-1"></div>
            <div className="hero-blob blob-2"></div>

            <div className="container hero-content">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-title"
                >
                    Discover the Soul of <span className="gradient-text">Incredible India</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hero-subtitle"
                >
                    Embark on a journey through vibrant states, ancient heritage, and breathtaking landscapes. Select a state on the map to begin your adventure.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="hero-buttons"
                >
                    <a href="#map" className="btn-primary">
                        Explore Interactive Map
                        <ArrowRight size={20} />
                    </a>
                    <button className="btn-secondary" onClick={onOpenPopular}>
                        View Popular Destinations
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
