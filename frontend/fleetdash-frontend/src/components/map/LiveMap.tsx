import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { vehicles } from "../../data/vehicles";

function LiveMap() {
  return (
    <MapContainer
      center={[13.0827, 80.2707]}
      zoom={12}
      className="h-[400px] rounded-xl"
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={[vehicle.lat, vehicle.lng]}
        >
          <Popup>
            <strong>{vehicle.name}</strong>
            <br />
            {vehicle.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default LiveMap;