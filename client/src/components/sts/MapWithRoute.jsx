import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../apiConfig";
import { Card } from "flowbite-react";

const MapWithRoute = () => {
  const [originLat, setOriginLat] = useState("");
  const [originLng, setOriginLng] = useState("");
  const [destLat, setDestLat] = useState("24.056053598322737");
  const [destLng, setDestLng] = useState("90.42655695310111");
  const [response, setResponse] = useState(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const [stsDetails, setSTSDetails] = useState({});
  const [sourceAddress, setSourceAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  useEffect(() => {
    const userId = currentUser._id;
    const fetchSTS = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/sts/userstsdetails/${userId}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setSTSDetails(data.data);
          setOriginLat(data.data.gps_coordinates.latitude);
          setOriginLng(data.data.gps_coordinates.longitude);
        } else {
          console.error("Failed to fetch user's STS:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user's STS:", error);
      }
    };

    if (userId) {
      fetchSTS();
    }
  }, [currentUser._id]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAnyAOLqhtDXxiHl5yXUMzZluPqHWCl5lY&libraries=geometry,drawing,places`;
    script.onload = () => setGoogleMapsLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originLat || !originLng || !destLat || !destLng) {
      alert("Please enter all coordinates.");
      return;
    }

    if (!googleMapsLoaded) {
      alert("Google Maps JavaScript API is not loaded yet.");
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
          alert("Directions request failed due to " + status);
        }
      }
    );
  };

  useEffect(() => {
    getAddressFromCoordinates(originLat, originLng, setSourceAddress);
    getAddressFromCoordinates(destLat, destLng, setDestinationAddress);
  }, [stsDetails]);

  const getAddressFromCoordinates = async (latitude, longitude, setAddress) => {
    const apiKey = "AIzaSyAnyAOLqhtDXxiHl5yXUMzZluPqHWCl5lY";
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === "OK") {
        setAddress(data.results[0].formatted_address);
      } else {
        throw new Error("Failed to fetch address");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("");
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 className="text-lg font-semibold">Find Route (STS to Landfill)</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div className="flex flex-col w-96">
          <label className="py-2" htmlFor="originLat">
            Origin(STS) Latitude:
          </label>
          <input
            type="text"
            className="rounded border-gray-500 shadow-md border-2"
            id="originLat"
            value={originLat}
            onChange={(e) => setOriginLat(e.target.value)}
          />
          <label className="py-2" htmlFor="originLng">
            Origin(STS) Longitude:
          </label>
          <input
            type="text"
            className="rounded border-gray-500 shadow-md border-2"
            id="originLng"
            value={originLng}
            onChange={(e) => setOriginLng(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-96">
          <label className="py-2" htmlFor="destLat">
            Destination(Landfill) Latitude:
          </label>
          <input
            type="text"
            className="rounded border-gray-500 shadow-md border-2"
            id="destLat"
            value={destLat}
            onChange={(e) => setDestLat(e.target.value)}
          />
          <label className="py-2" htmlFor="destLng">
            Destination(Landfill) Longitude:
          </label>
          <input
            className="rounded border-gray-500 shadow-md border-2"
            type="text"
            id="destLng"
            value={destLng}
            onChange={(e) => setDestLng(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 py-2 mt-2 rounded-lg text-center px-5 text-white"
          type="submit"
        >
          Calculate Route
        </button>
      </form>
      <div className="py-5">
        <Card className="w-80">
          <p>STS Address: {sourceAddress}</p>
          <p>Landfill Address: {destinationAddress} </p>
        </Card>
      </div>

      <div style={{ width: "80%", height: "400px" }}>
        {googleMapsLoaded && (
          <GoogleMap
            id="directions-example"
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            zoom={8}
            center={{
              lat: parseFloat(originLat) || 0,
              lng: parseFloat(originLng) || 0,
            }}
          >
            {response && (
              <DirectionsRenderer options={{ directions: response }} />
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default MapWithRoute;
