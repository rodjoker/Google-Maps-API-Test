import React, { useState, useRef } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Formulario from './components/form/Formulario';
import MapContainer from './components/maps/MapContainer';

const libraries = ['places'];

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchCount, setSearchCount] = useState(0);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const debounceTimeout = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAPS,
    libraries,
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (value.trim() === '') {
      setSuggestions([]);
      return;
    }

    debounceTimeout.current = setTimeout(() => {
      searchPlaces(value);
    }, 3000);
  };

  const searchPlaces = (query) => {
    if (!window.google || !query) return;

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: query }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSuggestions(predictions);
        setSearchCount((prev) => prev + 1);
      } else {
        setSuggestions([]);
      }
    });
  };

  const handleSelectSuggestion = (placeId, description) => {
    setSelectedPlaceId(placeId);
    setInputValue(description);
    setSuggestions([]);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Formulario
        inputValue={inputValue}
        suggestions={suggestions}
        onInputChange={handleInputChange}
        onSelectSuggestion={handleSelectSuggestion}
      />
      <MapContainer placeId={selectedPlaceId} />
      <p>Intentos de búsqueda (tras 3s de inactividad): {searchCount}</p>
    </div>
  );
};

export default App;
