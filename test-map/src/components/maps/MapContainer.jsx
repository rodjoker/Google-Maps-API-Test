import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px',
};

const MapContainer = ({ originPlaceId, destinationPlaceId }) => {
  //const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    console.log("Origen:", originPlaceId, "Destino:", destinationPlaceId);
  }, [originPlaceId, destinationPlaceId]);

  useEffect(() => {
    if (!originPlaceId || !destinationPlaceId) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { placeId: originPlaceId },
        destination: { placeId: destinationPlaceId },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Error al calcular ruta:', status);
        }
      }
    );
  }, [originPlaceId, destinationPlaceId]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: 19.4326, lng: -99.1332 }}
      zoom={12}
      //onLoad={setMap}
    >
      {directions && 
      <DirectionsRenderer 
       directions={directions}
      options={{
        polylineOptions: {
          strokeColor:" #FF8744",
          strokeOpacity: 0.8,
          strokeWeight: 5,
        },
      }}

      />}
    </GoogleMap>
  );
};

export default MapContainer;
