import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px',
};

const defaultCenter = { lat: 19.4326, lng: -99.1332 };

const MapContainer = ({ placeId }) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (!placeId) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );
    service.getDetails({ placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSelectedPlace(place);
        const location = place.geometry.location;
        setCenter({ lat: location.lat(), lng: location.lng() });
      }
    });
  }, [placeId]);

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

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      <Marker position={center} />
    </GoogleMap>
  );
};

export default MapContainer;
