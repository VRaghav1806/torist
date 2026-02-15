import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Heart, Calendar, Home, Settings, User, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, onOpenTrip, favCount = 0, onOpenFavorites }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="sidebar-overlay"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 998,
                            backdropFilter: 'blur(4px)'
                        }}
                        onClick={onClose}
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="sidebar"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: '280px',
                            backgroundColor: 'white',
                            zIndex: 999,
                            boxShadow: '4px 0 15px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Header */}
                        <div className="sidebar-header" style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid #f3f4f6',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div className="logo" style={{ fontSize: '1.25rem' }}>
                                <span className="brand-name">
                                    Tre<span className="highlight">go</span>
                                </span>
                            </div>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="sidebar-content" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
                            <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <SidebarItem icon={<Home size={20} />} label="Home" onClick={() => { window.scrollTo(0, 0); onClose(); }} active />
                                <SidebarItem icon={<MapPin size={20} />} label="Explore Map" onClick={() => { document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' }); onClose(); }} />
                                <SidebarItem icon={<Heart size={20} />} label="My Favorites" badge={favCount} onClick={() => { onOpenFavorites(); onClose(); }} />
                                <SidebarItem icon={<Calendar size={20} />} label="Plan Trip" onClick={() => { onOpenTrip(); onClose(); }} />
                            </nav>

                            <div style={{ margin: '2rem 0', borderTop: '1px solid #f3f4f6' }}></div>

                            <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <SidebarItem icon={<User size={20} />} label="Profile" onClick={onClose} />
                                <SidebarItem icon={<Settings size={20} />} label="Settings" onClick={onClose} />
                            </nav>
                        </div>

                        {/* Footer */}
                        <div className="sidebar-footer" style={{
                            padding: '1.5rem',
                            borderTop: '1px solid #f3f4f6',
                            backgroundColor: '#f9fafb'
                        }}>
                            <button className="logout-btn" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                width: '100%',
                                padding: '0.75rem',
                                color: '#ef4444',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}>
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const SidebarItem = ({ icon, label, onClick, active, badge }) => (
    <button
        onClick={onClick}
        onMouseEnter={(e) => {
            if (!active) e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
            if (!active) e.currentTarget.style.backgroundColor = 'transparent';
        }}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 1rem',
            width: '100%',
            backgroundColor: active ? '#eff6ff' : 'transparent',
            color: active ? 'var(--primary-color)' : '#4b5563',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            textAlign: 'left',
            fontWeight: active ? 600 : 500,
            transition: 'all 0.2s',
            position: 'relative'
        }}
    >
        {icon}
        <span style={{ flex: 1 }}>{label}</span>
        {badge > 0 && (
            <span style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                fontSize: '0.75rem',
                padding: '0.1rem 0.5rem',
                borderRadius: '999px',
                fontWeight: 700
            }}>
                {badge}
            </span>
        )}
    </button>
);

export default Sidebar;
