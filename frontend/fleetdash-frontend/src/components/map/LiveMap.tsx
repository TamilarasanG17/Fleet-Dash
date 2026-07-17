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

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
// } from "react-leaflet";

// import useVehicles from "../../hooks/useVehicles";

// function LiveMap() {
//   const { vehicles } = useVehicles();

//   return (
//     <MapContainer
//       center={[13.0827, 80.2707]}
//       zoom={12}
//       scrollWheelZoom
//       className="h-[500px] w-full rounded-xl"
//     >
//       <TileLayer
//         attribution="© OpenStreetMap"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {vehicles.map((vehicle) => (
//         <Marker
//           key={vehicle._id}
//           position={[
//             vehicle.latitude,
//             vehicle.longitude,
//           ]}
//         >
//           <Popup>
//             <h2 className="font-bold">
//               {vehicle.vehicleId}
//             </h2>

//             <p>Status: {vehicle.status}</p>

//             <p>Speed: {vehicle.speed} km/h</p>
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }

// export default LiveMap;