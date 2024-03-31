import React, { useState, useEffect } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const MapWithRoute = () => {
  const [originLat, setOriginLat] = useState('');
  const [originLng, setOriginLng] = useState('');
  const [destLat, setDestLat] = useState('');
  const [destLng, setDestLng] = useState('');
  const [response, setResponse] = useState(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAnyAOLqhtDXxiHl5yXUMzZluPqHWCl5lY&libraries=geometry,drawing,places`;
    script.onload = () => setGoogleMapsLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originLat || !originLng || !destLat || !destLng) {
      alert('Please enter all coordinates.');
      return;
    }

    if (!googleMapsLoaded) {
      alert('Google Maps JavaScript API is not loaded yet.');
      return;
    }

    const origin = { lat: parseFloat(originLat), lng: parseFloat(originLng) };
    const destination = { lat: parseFloat(destLat), lng: parseFloat(destLng) };

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setResponse(result);
        } else {
          alert('Directions request failed due to ' + status);
        }
      }
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 className='text-lg font-semibold'>Find Route (STS to Landfill)</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div className='flex flex-col w-96'>
          <label className='py-2' htmlFor="originLat">Origin(STS) Latitude:</label>
          <input type="text" className='rounded border-gray-500 shadow-md border-2' id="originLat" value={originLat} onChange={(e) => setOriginLat(e.target.value)} />
          <label className='py-2' htmlFor="originLng">Origin(STS) Longitude:</label>
          <input type="text" className='rounded border-gray-500 shadow-md border-2' id="originLng" value={originLng} onChange={(e) => setOriginLng(e.target.value)} />
        </div>
        <div className='flex flex-col w-96'>
          <label className='py-2' htmlFor="destLat">Destination(Landfill) Latitude:</label>
          <input type="text" className='rounded border-gray-500 shadow-md border-2' id="destLat" value={destLat} onChange={(e) => setDestLat(e.target.value)} />
          <label className='py-2' htmlFor="destLng">Destination(Landfill) Longitude:</label>
          <input className='rounded border-gray-500 shadow-md border-2' type="text" id="destLng" value={destLng} onChange={(e) => setDestLng(e.target.value)} />
        </div>
        <button className="bg-blue-500 py-2 mt-2 rounded-lg text-center px-5 text-white" type="submit">Calculate Route</button>
      </form>

      <div style={{ width: '80%', height: '400px' }}>
        {googleMapsLoaded && (
          <GoogleMap
            id="directions-example"
            mapContainerStyle={{
              width: '100%',
              height: '100%'
            }}
            zoom={8}
            center={{
              lat: parseFloat(originLat) || 0,
              lng: parseFloat(originLng) || 0,
            }}
          >
            {response && <DirectionsRenderer options={{ directions: response }} />}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default MapWithRoute;
