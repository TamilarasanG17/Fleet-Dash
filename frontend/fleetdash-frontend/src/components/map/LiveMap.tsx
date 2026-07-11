import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import useTelemetry from "../../hooks/useTelemetry";

function LiveMap() {
   const { telemetry, loading, error } = useTelemetry();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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

       {telemetry.map((vehicle) => {
        const latest =
          vehicle.telemetry[vehicle.telemetry.length - 1];

        return (
          <Marker
            key={vehicle.vehicleId}
            position={[latest.latitude, latest.longitude]}
          >
            <Popup>
              <strong>{vehicle.vehicleId}</strong>
              <br />
              Speed: {latest.speed} km/h
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default LiveMap;