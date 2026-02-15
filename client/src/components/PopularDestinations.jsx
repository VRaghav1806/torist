import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star } from 'lucide-react';

const PopularDestinations = ({ isOpen, onClose, onSelectDestination }) => {
    // Curated list of popular destinations
    const popularPlaces = [
        {
            name: "Taj Mahal",
            state: "Uttar Pradesh",
            stateId: "uttar-pradesh",
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
            description: "An ivory-white marble mausoleum, one of the Seven Wonders of the World",
            rating: 5
        },
        {
            name: "Jaipur City Palace",
            state: "Rajasthan",
            stateId: "rajasthan",
            image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
            description: "A magnificent palace complex showcasing Rajput and Mughal architecture",
            rating: 5
        },
        {
            name: "Kerala Backwaters",
            state: "Kerala",
            stateId: "kerala",
            image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
            description: "Serene network of lagoons, lakes, and canals perfect for houseboat cruises",
            rating: 5
        },
        {
            name: "Golden Temple",
            state: "Punjab",
            stateId: "punjab",
            image: "https://sacredsites.com/images/asia/india/punjab/Golden-Temple-1.webp",
            description: "The holiest Gurdwara of Sikhism, known for its stunning golden architecture",
            rating: 5
        },
        {
            name: "Gateway of India",
            state: "Maharashtra",
            stateId: "maharashtra",
            image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
            description: "Iconic monument overlooking the Arabian Sea in Mumbai",
            rating: 5
        },
        {
            name: "Goa Beaches",
            state: "Goa",
            stateId: "goa",
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
            description: "Pristine beaches, vibrant nightlife, and Portuguese heritage",
            rating: 5
        }
    ];

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
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="popular-modal"
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 101
                        }}
                    >
                        <div className="trip-modal-header">
                            <div>
                                <h2>Popular Destinations</h2>
                                <p>Explore India's most iconic tourist attractions</p>
                            </div>
                            <button className="icon-btn" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="popular-modal-content">
                            <div className="popular-grid">
                                {popularPlaces.map((place, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="popular-card"
                                        onClick={() => {
                                            onSelectDestination(place.stateId);
                                            onClose();
                                        }}
                                    >
                                        <div className="popular-card-image">
                                            <img src={place.image} alt={place.name} />
                                            <div className="popular-rating">
                                                {[...Array(place.rating)].map((_, i) => (
                                                    <Star key={i} size={14} fill="gold" color="gold" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="popular-card-content">
                                            <h3>{place.name}</h3>
                                            <div className="popular-location">
                                                <MapPin size={16} />
                                                <span>{place.state}</span>
                                            </div>
                                            <p>{place.description}</p>
                                            <button className="popular-explore-btn">
                                                Explore {place.state}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PopularDestinations;
