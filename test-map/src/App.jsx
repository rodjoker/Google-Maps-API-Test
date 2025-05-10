import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

const App = () => {
  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 19.4326, lng: -99.1332 });
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchCount, setSearchCount] = useState(0);
  const debounceTimeout = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAPS,
    libraries,
  });

  const containerStyle = {
    width: '400px',
    height: '400px',
  };

  useEffect(() => {
    if (selectedPlace && map) {
      const bounds = new window.google.maps.LatLngBounds();
      if (selectedPlace.geometry.viewport) {
        bounds.union(selectedPlace.geometry.viewport);
      } else {
        bounds.extend(selectedPlace.geometry.location);
      }
      map.fitBounds(bounds);
    }
  }, [selectedPlace, map]);

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
    }, 3000); // Espera de 3 segundos
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

  const handleSelectSuggestion = (placeId) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({ placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSelectedPlace(place);
        setMapCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        setSuggestions([]);
        setInputValue(place.formatted_address || '');
      }
    });
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        width: '300px',
        backgroundColor: 'white'
      }}>
        <input
          type="text"
          placeholder="Buscar dirección..."
          style={{
            width: '100%',
            height: '40px',
            padding: '0 12px',
            borderRadius: '3px',
            border: '1px solid #ccc',
            fontSize: '14px',
            outline: 'none'
          }}
          value={inputValue}
          onChange={handleInputChange}
        />
        {suggestions.length > 0 && (
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            border: '1px solid #ccc',
            borderTop: 'none',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {suggestions.map((suggestion) => (
              <li key={suggestion.place_id}
                onClick={() => handleSelectSuggestion(suggestion.place_id)}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  color: 'black'
                }}
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        <Marker position={mapCenter} />
      </GoogleMap>
      <p>Intentos de búsqueda (tras 3s de inactividad): {searchCount}</p>
    </div>
  );
};

export default App;
