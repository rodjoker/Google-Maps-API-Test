import React, { useState, useRef } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Formulario from './components/form/Formulario';
import MapContainer from './components/maps/MapContainer';
import { handleSelectSuggestion as handleSelectSuggestionUtil, searchPlaces as searchPlacesUtil } from './utils/MapsFunction';


const libraries = ['places'];

const App = () => {
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchCount, setSearchCount] = useState(0);
  const [selectedA, setSelectedA] = useState(null);
  const [selectedB, setSelectedB] = useState(null);
  const [activeInput, setActiveInput] = useState('A');

  const debounceTimeout = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_MAPS,
    libraries,
  });

  const handleInputChangeA = (e) => {
    setInputA(e.target.value);
    setActiveInput('A');
    handleDebounceSearch(e.target.value);
  };

  const handleInputChangeB = (e) => {
    setInputB(e.target.value);
    setActiveInput('B');
    handleDebounceSearch(e.target.value);
  };

  const handleDebounceSearch = (value) => {
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
    searchPlacesUtil(query, setSuggestions, setSearchCount);
  };
  
  const handleSelectSuggestion = (placeId, description) => {
    handleSelectSuggestionUtil({
      placeId,
      description,
      activeInput,
      setSelectedA,
      setSelectedB,
      setInputA,
      setInputB,
      setSuggestions,
    });
  };  

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Formulario
        inputValueA={inputA}
        inputValueB={inputB}
        suggestions={suggestions}
        onInputChangeA={handleInputChangeA}
        onInputChangeB={handleInputChangeB}
        onSelectSuggestion={handleSelectSuggestion}
      />
      <MapContainer originPlaceId={selectedA} destinationPlaceId={selectedB} />
      <p>Intentos de búsqueda (tras 3s de inactividad): {searchCount}</p>
    </div>
  );
};

export default App;
