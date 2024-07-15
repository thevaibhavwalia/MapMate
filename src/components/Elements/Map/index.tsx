import { useState, useEffect } from 'react';
import * as React from 'React';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-toastify';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen';
import { LocationIQProvider } from 'leaflet-geosearch';
import { GeoSearchControl } from 'leaflet-geosearch';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

function LocationMarker({ location }: { location: { lat: number, lng: number } }) {
  const map = useMapEvents({
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom());
      setPosition(e.latlng);
    },
    locationerror(e) {
      console.error(e.message);
    },
  });

  const [position, setPosition] = useState({
    lat: location.lat,
    lng: location.lng,
  });

  useEffect(() => {
    setPosition({
      lat: location.lat,
      lng: location.lng,
    });
    map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
  }, [location, map]);

  return position === null ? null : (
    <Marker position={position} icon={DefaultIcon}>
      <Popup>User is here!</Popup>
    </Marker>
  );
}

function LocateControl() {
  const map = useMap();
  
  const locateUser = () => {
    toast.info('Finding and transporting to your location...', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  
    map.locate({
      setView: true,
      maxZoom: 16,
      timeout: 10000,
      enableHighAccuracy: true,
    })
    .on('locationfound', (e) => {
      toast.success('You have been transported to your location!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    // .on('locationerror', (e) => {
    //   toast.error('Error finding your location. Please try again.', {
    //     position: 'top-center',
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    // });
  };

  return (
    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
      <button onClick={locateUser}>
        Locate Me
      </button>
    </div>
  );
}

function SearchControl() {
  const map = useMap();
  const provider = new LocationIQProvider({
    params: {
      key: 'pk.011a7b6e456d6b803a8afb452180cffe', 
    },
  });

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
    });
    map.addControl(searchControl);

    return () => map.removeControl(searchControl);
  }, [map, provider]);

  return null;
}

function Map({ location }: { location: { lat: number, lng: number } }) {
  const [markers, setMarkers] = useState<{ lat: number, lng: number, description: string }[]>([]);

  const addMarker = (e: L.LeafletMouseEvent) => {
    const description = prompt('Enter a description for this marker:');
    if (description) {
      setMarkers([...markers, { lat: e.latlng.lat, lng: e.latlng.lng, description }]);
    }
  };

  if (!location) return 'No location found';

  return (
    <div className="w-full bg-gray-100 h-[600px] md:h-[550px]">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={16}
        scrollWheelZoom={true}
        className="h-full"
        fullscreenControl={true}
        onClick={addMarker}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker location={location} />
        <LocateControl />
        <SearchControl />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={DefaultIcon}>
            <Popup>{marker.description}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;






