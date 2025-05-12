



export const handleSelectSuggestion = ({
    placeId,
    description,
    activeInput,
    setSelectedA,
    setSelectedB,
    setInputA,
    setInputB,
    setSuggestions,
  }) => {
    if (activeInput === 'A') {
      setSelectedA(placeId);
      setInputA(description);
    } else {
      setSelectedB(placeId);
      setInputB(description);
    }
    setSuggestions([]);
  };

  export const searchPlaces = (query, setSuggestions, setSearchCount) => {
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
  
  