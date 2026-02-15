import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Heart, Star, Clock, Banknote } from 'lucide-react';

const PlaceCard = ({ place, index, stateName, stateId, onAddToTrip, isInTrip, isFavorite, onToggleFavorite }) => {
    const handleAddToTrip = () => {
        if (!isInTrip) {
            onAddToTrip({
                placeName: place.name,
                placeImage: place.image,
                placeDescription: place.description,
                stateName: stateName,
                stateId: stateId
            });
        }
    };

    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        onToggleFavorite({
            placeName: place.name,
            placeImage: place.image,
            placeDescription: place.description,
            stateName: stateName,
            stateId: stateId
        });
    };

    return (
        <motion.div
            className="place-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
        >
            <div className="place-image-container">
                <img src={place.image} alt={place.name} className="place-image" />

                {/* Favorite Button */}
                <button
                    onClick={handleToggleFavorite}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    className="fav-btn"
                >
                    <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#6b7280'} />
                </button>

                {isInTrip && (
                    <div className="trip-badge">
                        <Check size={16} />
                        Added
                    </div>
                )}

                {/* Rating Badge */}
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#fbbf24',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backdropFilter: 'blur(4px)'
                }}>
                    <Star size={14} fill="#fbbf24" />
                    {place.rating || '4.5'}
                </div>
            </div>

            <div className="place-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 className="place-title" style={{ margin: 0 }}>{place.name}</h3>
                    <span style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        background: '#f3f4f6',
                        padding: '0.1rem 0.5rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <Banknote size={14} />
                        {place.budget || 'Medium'}
                    </span>
                </div>

                <p className="place-description" style={{ marginBottom: '1rem' }}>{place.description}</p>

                {/* Meta Info */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {/* Mood Tags */}
                    {place.moods && place.moods.map((mood, idx) => (
                        <span key={idx} style={{
                            fontSize: '0.7rem',
                            color: '#4f46e5',
                            background: '#eef2ff',
                            padding: '0.1rem 0.5rem',
                            borderRadius: '10px',
                            fontWeight: 500
                        }}>
                            {mood}
                        </span>
                    ))}
                    <span style={{
                        fontSize: '0.7rem',
                        color: '#059669',
                        background: '#ecfdf5',
                        padding: '0.1rem 0.5rem',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <Clock size={12} />
                        {place.openingHours?.split(' - ')[0] || '09:00 AM'}
                    </span>
                </div>

                <button
                    className={`add-to-trip-btn ${isInTrip ? 'added' : ''}`}
                    onClick={handleAddToTrip}
                    disabled={isInTrip}
                >
                    {isInTrip ? (
                        <>
                            <Check size={18} />
                            Added to Trip
                        </>
                    ) : (
                        <>
                            <Plus size={18} />
                            Add to Trip
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default PlaceCard;
