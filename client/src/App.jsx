import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import IndiaMap from './components/IndiaMap';
import StateDetail from './components/StateDetail';
import PlanTrip from './components/PlanTrip';
import PopularDestinations from './components/PopularDestinations';
import FavoritesModal from './components/FavoritesModal';
import ChatAdvisor from './components/ChatAdvisor';
import './index.css';

function App() {
  const [selectedState, setSelectedState] = useState(null);
  const [tripPlaces, setTripPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isPopularModalOpen, setIsPopularModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [tripMetadata, setTripMetadata] = useState({
    startDate: '',
    duration: 0,
    timeAllocations: {} // placeId -> days
  });

  const handleStateSelect = (stateName) => {
    setSelectedState(stateName);
    // Scroll to details section smoothly
    setTimeout(() => {
      const element = document.getElementById('places');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCloseDetail = () => {
    setSelectedState(null);
  };

  const handleAddToTrip = (place) => {
    // Check if place is already in trip
    const exists = tripPlaces.some(
      p => p.placeName === place.placeName && p.stateName === place.stateName
    );
    if (!exists) {
      setTripPlaces([...tripPlaces, place]);
    }
  };

  const handleRemoveFromTrip = (place) => {
    setTripPlaces(tripPlaces.filter(
      p => !(p.placeName === place.placeName && p.stateName === place.stateName)
    ));
  };

  const handleToggleFavorite = (place) => {
    const exists = favorites.some(
      p => p.placeName === place.placeName && p.stateName === place.stateName
    );

    if (exists) {
      setFavorites(favorites.filter(
        p => !(p.placeName === place.placeName && p.stateName === place.stateName)
      ));
    } else {
      setFavorites([...favorites, place]);
    }
  };

  const handleClearTrip = () => {
    if (window.confirm('Are you sure you want to clear all places from your trip?')) {
      setTripPlaces([]);
      setIsTripModalOpen(false);
    }
  };

  const handleOpenTripModal = () => {
    setIsTripModalOpen(true);
  };

  const handleCloseTripModal = () => {
    setIsTripModalOpen(false);
  };

  const handleOpenPopularModal = () => {
    setIsPopularModalOpen(true);
  };

  const handleClosePopularModal = () => {
    setIsPopularModalOpen(false);
  };

  const handleOpenFavorites = () => {
    setIsFavoritesOpen(true);
  };

  const handleCloseFavorites = () => {
    setIsFavoritesOpen(false);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectPopularDestination = (stateId) => {
    // Convert state ID to state name for display
    const stateNames = {
      'uttar-pradesh': 'Uttar Pradesh',
      'rajasthan': 'Rajasthan',
      'kerala': 'Kerala',
      'punjab': 'Punjab',
      'maharashtra': 'Maharashtra',
      'goa': 'Goa'
    };
    const stateName = stateNames[stateId] || stateId;
    handleStateSelect(stateName);
  };

  return (
    <div className="app">
      <Navbar
        tripCount={tripPlaces.length}
        onOpenTrip={handleOpenTripModal}
        onToggleSidebar={handleToggleSidebar}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenTrip={handleOpenTripModal}
        favCount={favorites.length}
        onOpenFavorites={handleOpenFavorites}
      />

      <Hero onOpenPopular={handleOpenPopularModal} />

      <div className="container" id="map">
        <h2 className="section-title" style={{ textAlign: 'center', marginTop: '4rem' }}>
          Explore States
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '2rem' }}>
          Click on any state to view its top tourist attractions
        </p>
        <IndiaMap onSelectState={handleStateSelect} />
      </div>

      {selectedState && (
        <StateDetail
          stateName={selectedState}
          onClose={handleCloseDetail}
          onAddToTrip={handleAddToTrip}
          tripPlaces={tripPlaces}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      <PlanTrip
        isOpen={isTripModalOpen}
        onClose={handleCloseTripModal}
        tripPlaces={tripPlaces}
        onRemovePlace={handleRemoveFromTrip}
        onClearTrip={handleClearTrip}
        tripMetadata={tripMetadata}
        setTripMetadata={setTripMetadata}
      />

      <PopularDestinations
        isOpen={isPopularModalOpen}
        onClose={handleClosePopularModal}
        onSelectDestination={handleSelectPopularDestination}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={handleCloseFavorites}
        favorites={favorites}
        onRemoveFavorite={handleToggleFavorite}
      />

      <ChatAdvisor />

      <footer style={{ textAlign: 'center', padding: '2rem', color: '#666', borderTop: '1px solid #eee', marginTop: '4rem' }}>
        <p>&copy; 2026 All India Tourist Guide. Made with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
