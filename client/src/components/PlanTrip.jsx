import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, MapPin, Calendar, Clock, Download } from 'lucide-react';

const PlanTrip = ({ isOpen, onClose, tripPlaces, onRemovePlace, onClearTrip, tripMetadata, setTripMetadata }) => {
    const [showSchedule, setShowSchedule] = useState(false);

    // Group places by state
    const groupedPlaces = tripPlaces.reduce((acc, place) => {
        if (!acc[place.stateName]) {
            acc[place.stateName] = [];
        }
        acc[place.stateName].push(place);
        return acc;
    }, {});

    const calculateSchedule = () => {
        if (!tripMetadata.startDate || !tripMetadata.duration || tripPlaces.length === 0) {
            alert('Please enter start date and duration first!');
            return;
        }

        // Calculate places per day to distribute them evenly
        const totalPlaces = tripPlaces.length;
        const duration = tripMetadata.duration;
        const placesPerDay = Math.ceil(totalPlaces / duration);

        const allocations = {};

        tripPlaces.forEach((place, index) => {
            const placeId = `${place.stateName}-${place.placeName}`;
            // Determine day number (1-based)
            // e.g. if 2 places per day: index 0,1 -> Day 1; index 2,3 -> Day 2
            const dayNumber = Math.min(duration, Math.floor(index / placesPerDay) + 1);
            allocations[placeId] = dayNumber;
        });

        setTripMetadata({
            ...tripMetadata,
            timeAllocations: allocations
        });

        setShowSchedule(true);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Add Title and Header
        doc.setFillColor(240, 247, 255); // Light blue background
        doc.rect(0, 0, 210, 40, 'F');

        doc.setFontSize(24);
        doc.setTextColor(0, 53, 128); // Primary Blue
        doc.text('My Trip Itinerary', 14, 25);

        // Add Trip Details
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        let yPos = 50;

        if (tripMetadata.startDate) {
            const startDate = new Date(tripMetadata.startDate);
            const endDate = new Date(startDate);
            if (tripMetadata.duration) {
                endDate.setDate(endDate.getDate() + tripMetadata.duration);
            }

            doc.text(`Start Date: ${startDate.toLocaleDateString()}`, 14, yPos);
            doc.text(`End Date: ${endDate.toLocaleDateString()}`, 80, yPos);
            yPos += 7;
        }

        if (tripMetadata.duration) {
            doc.text(`Duration: ${tripMetadata.duration} Days`, 14, yPos);
            doc.text(`Total Places: ${tripPlaces.length}`, 80, yPos);
            yPos += 15;
        }

        // Prepare table data
        const tableData = [];

        if (showSchedule && Object.keys(tripMetadata.timeAllocations).length > 0) {
            // Group places by day
            const placesByDay = {};
            tripPlaces.forEach((place) => {
                const placeId = `${place.stateName}-${place.placeName}`;
                const dayNum = tripMetadata.timeAllocations[placeId] || 1;
                if (!placesByDay[dayNum]) placesByDay[dayNum] = [];
                placesByDay[dayNum].push(place);
            });

            // Iterate through days 1 to duration
            for (let day = 1; day <= tripMetadata.duration; day++) {
                const places = placesByDay[day] || [];
                if (places.length > 0) {
                    // Calculate date for this day
                    let dateStr = `Day ${day}`;
                    if (tripMetadata.startDate) {
                        const date = new Date(tripMetadata.startDate);
                        date.setDate(date.getDate() + (day - 1));
                        dateStr += ` - ${date.toLocaleDateString()}`;
                    }

                    // Add a header row for the Day
                    tableData.push([{ content: dateStr, colSpan: 4, styles: { fillColor: [219, 234, 254], textColor: 0, fontStyle: 'bold' } }]);

                    places.forEach((place) => {
                        tableData.push([
                            '', // Empty indent
                            place.placeName,
                            place.stateName,
                            place.placeDescription
                        ]);
                    });
                }
            }
        } else {
            tripPlaces.forEach((place) => {
                tableData.push([
                    '-',
                    place.placeName,
                    place.stateName,
                    place.placeDescription
                ]);
            });
        }

        autoTable(doc, {
            startY: yPos,
            head: [['Date/Day', 'Place', 'State', 'Description']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [0, 53, 128],
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 4,
                overflow: 'linebreak'
            },
            columnStyles: {
                0: { cellWidth: 40 }, // Expanded for Day Header
                1: { cellWidth: 40 },
                2: { cellWidth: 30 },
                3: { cellWidth: 'auto' }
            },
            alternateRowStyles: {
                fillColor: [240, 247, 255]
            }
        });

        // Add Footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(150);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text('Generated by India Tourist Guide', 14, doc.internal.pageSize.height - 10);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
        }

        doc.save(`Trip-Itinerary-${Date.now()}.pdf`);
    };

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
                            zIndex: 101
                        }}
                    >
                        <div className="trip-modal-header">
                            <div>
                                <h2>My Trip Plan</h2>
                                <p>{tripPlaces.length} {tripPlaces.length === 1 ? 'place' : 'places'} selected</p>
                            </div>
                            <button className="icon-btn" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="trip-modal-content">
                            {tripPlaces.length === 0 ? (
                                <div className="trip-empty">
                                    <MapPin size={48} opacity={0.3} />
                                    <h3>No places added yet</h3>
                                    <p>Click on any state and add places to your trip!</p>
                                </div>
                            ) : (
                                <>
                                    {/* Trip Summary Dashboard */}
                                    {tripMetadata.startDate && tripMetadata.duration > 0 && (
                                        <div className="trip-summary">
                                            <div className="summary-card">
                                                <div className="summary-card-icon"><Calendar size={24} /></div>
                                                <div className="summary-card-value">{new Date(tripMetadata.startDate).toLocaleDateString()}</div>
                                                <div className="summary-card-label">Start Date</div>
                                            </div>
                                            <div className="summary-card">
                                                <div className="summary-card-icon"><Clock size={24} /></div>
                                                <div className="summary-card-value">{tripMetadata.duration} Days</div>
                                                <div className="summary-card-label">Duration</div>
                                            </div>
                                            <div className="summary-card">
                                                <div className="summary-card-icon"><MapPin size={24} /></div>
                                                <div className="summary-card-value">{tripPlaces.length}</div>
                                                <div className="summary-card-label">Places to Visit</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Trip Configuration */}
                                    <div className="trip-config">
                                        <h3 className="trip-config-title">
                                            <Calendar size={20} />
                                            Plan Your Trip
                                        </h3>
                                        <div className="trip-config-inputs">
                                            <div className="trip-input-group">
                                                <label>Start Date</label>
                                                <input
                                                    type="date"
                                                    value={tripMetadata.startDate}
                                                    onChange={(e) => setTripMetadata({ ...tripMetadata, startDate: e.target.value })}
                                                    className="trip-date-input"
                                                />
                                            </div>
                                            <div className="trip-input-group">
                                                <label>Duration (days)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={tripMetadata.duration || ''}
                                                    onChange={(e) => setTripMetadata({ ...tripMetadata, duration: parseInt(e.target.value) || 0 })}
                                                    className="trip-duration-input"
                                                    placeholder="e.g., 7"
                                                />
                                            </div>
                                            <button
                                                className="btn-primary calculate-btn"
                                                onClick={calculateSchedule}
                                            >
                                                <Clock size={18} />
                                                Calculate Schedule
                                            </button>
                                        </div>
                                    </div>

                                    {/* Places List & Timeline */}
                                    {showSchedule && Object.keys(tripMetadata.timeAllocations).length > 0 ? (
                                        <div className="timeline-container">
                                            {(() => {
                                                // Group places by day
                                                const placesByDay = {};
                                                tripPlaces.forEach((place) => {
                                                    const placeId = `${place.stateName}-${place.placeName}`;
                                                    const dayNum = tripMetadata.timeAllocations[placeId] || 1;
                                                    if (!placesByDay[dayNum]) placesByDay[dayNum] = [];
                                                    placesByDay[dayNum].push(place);
                                                });

                                                const sortedDays = Object.keys(placesByDay).sort((a, b) => parseInt(a) - parseInt(b));

                                                return sortedDays.map((dayNum) => {
                                                    const places = placesByDay[dayNum];
                                                    let dateStr = `Day ${dayNum}`;
                                                    if (tripMetadata.startDate) {
                                                        const date = new Date(tripMetadata.startDate);
                                                        date.setDate(date.getDate() + (parseInt(dayNum) - 1));
                                                        dateStr += ` • ${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
                                                    }

                                                    return (
                                                        <div key={dayNum} className="timeline-row" style={{ marginBottom: '2rem' }}>
                                                            <div className="timeline-marker" style={{ backgroundColor: 'var(--primary-color)' }}>{dayNum}</div>
                                                            <div className="timeline-content-wrapper">
                                                                <div className="timeline-date">{dateStr}</div>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                                    {places.map((place, pIndex) => (
                                                                        <div key={`${place.stateName}-${place.placeName}-${pIndex}`} className="timeline-card">
                                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                                                <div>
                                                                                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{place.placeName}</h4>
                                                                                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600 }}>{place.stateName}</span>
                                                                                </div>
                                                                                <button
                                                                                    className="trip-remove-btn"
                                                                                    onClick={() => onRemovePlace(place)}
                                                                                    title="Remove from trip"
                                                                                >
                                                                                    <Trash2 size={18} />
                                                                                </button>
                                                                            </div>
                                                                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                                                                {place.placeDescription}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    ) : (
                                        Object.entries(groupedPlaces).map(([stateName, places]) => (
                                            <div key={stateName} className="trip-state-group">
                                                <h3 className="trip-state-title">
                                                    <MapPin size={20} />
                                                    {stateName}
                                                </h3>
                                                <div className="trip-places-list">
                                                    {places.map((place, index) => {
                                                        const placeId = `${place.stateName}-${place.placeName}`;
                                                        const allocatedDays = tripMetadata.timeAllocations[placeId];

                                                        return (
                                                            <motion.div
                                                                key={`${place.stateName}-${place.placeName}-${index}`}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: 20 }}
                                                                className="trip-place-item"
                                                            >
                                                                <img
                                                                    src={place.placeImage}
                                                                    alt={place.placeName}
                                                                    className="trip-place-image"
                                                                />
                                                                <div className="trip-place-info">
                                                                    <h4>{place.placeName}</h4>
                                                                    <p>{place.placeDescription.substring(0, 100)}...</p>
                                                                </div>
                                                                <button
                                                                    className="trip-remove-btn"
                                                                    onClick={() => onRemovePlace(place)}
                                                                    title="Remove from trip"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}
                        </div>

                        {tripPlaces.length > 0 && (
                            <div className="trip-modal-footer">
                                <button className="btn-secondary" onClick={onClearTrip}>
                                    Clear All Places
                                </button>
                                <button className="btn-primary" onClick={handleDownloadPDF} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Download size={18} />
                                    Download Itinerary
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PlanTrip;
