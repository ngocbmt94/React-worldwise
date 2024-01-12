import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useCities } from "../context/CitiesContext";
import { useGeoLocation } from "../hook/useGeoLocation";
import styles from "./Map.module.css";
import Button from "./Button";
import { useURLPosition } from "../hook/useURLPosition";

function Map() {
  const { cities } = useCities();
  const { isLoadingPosition, userPosition, getGeoLocation } = useGeoLocation();
  const [mapPosition, setMapPosition] = useState([90, -66]);
  const [mapLat, mapLng] = useURLPosition();

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (userPosition) setMapPosition(userPosition);
  }, [userPosition]);

  return (
    <div className={styles.mapContainer}>
      {!userPosition && (
        <Button typeClass="position" onClickEvent={() => getGeoLocation()}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}

      <MapContainer center={mapPosition} zoom={10} scrollWheelZoom={true} className={styles.map}>
        <MoveToCenter curPosition={mapPosition} />

        <LocationMarkerClickedByUser />
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {cities.map((city) => (
          <Marker key={city.id} position={[city.position.lat, city.position.lng]}>
            <Popup>
              {city.cityName}, <br /> {city.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function MoveToCenter({ curPosition }) {
  const map = useMap();
  map.setView(curPosition);

  return curPosition === null ? null : (
    <Marker position={curPosition}>
      <Popup>
        {curPosition[0]}, <br /> {curPosition[1]}
      </Popup>
    </Marker>
  );
}

function LocationMarkerClickedByUser() {
  const navigateFn = useNavigate(); // move to another URL without click any link. useNavigate() return a function
  const map = useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      navigateFn(`form?lat=${lat}&lng=${lng}`);
    },
  });

  return null;
}

export default Map;
