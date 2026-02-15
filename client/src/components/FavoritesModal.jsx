import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MapPin, Trash2 } from 'lucide-react';

const FavoritesModal = ({ isOpen, onClose, favorites, onRemoveFavorite }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="trip-modal-overlay"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="trip-modal"
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1001, // Higher than sidebar
                            width: '90%',
                            maxWidth: '600px',
                            maxHeight: '80vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div className="trip-modal-header" style={{ background: '#eff6ff', borderBottom: '1px solid #dbeafe' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Heart size={24} fill="var(--primary-color)" color="var(--primary-color)" />
                                <div>
                                    <h2 style={{ color: 'var(--primary-color)' }}>My Favorites</h2>
                                    <p>{favorites.length} {favorites.length === 1 ? 'place' : 'places'} saved</p>
                                </div>
                            </div>
                            <button className="icon-btn" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="trip-modal-content" style={{ padding: '1.5rem', overflowY: 'auto' }}>
                            {favorites.length === 0 ? (
                                <div className="trip-empty">
                                    <Heart size={48} opacity={0.3} />
                                    <h3>No favorites yet</h3>
                                    <p>Click the heart icon on any place to save it here!</p>
                                </div>
                            ) : (
                                <div className="trip-places-list">
                                    {favorites.map((place, index) => (
                                        <div key={`${place.stateName}-${place.placeName}-${index}`} className="trip-place-item">
                                            <img
                                                src={place.placeImage}
                                                alt={place.placeName}
                                                className="trip-place-image"
                                            />
                                            <div className="trip-place-info">
                                                <h4>{place.placeName}</h4>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                                                    {place.stateName}
                                                </span>
                                                <p>{place.placeDescription.substring(0, 80)}...</p>
                                            </div>
                                            <button
                                                className="trip-remove-btn"
                                                onClick={() => onRemoveFavorite(place)}
                                                title="Remove from favorites"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FavoritesModal;
