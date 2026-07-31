// import { useEffect } from "react";

// import socket from "../socket/socket";
// import { useVehicleContext } from "../context/VehicleContext";

// // import type { Vehicle } from "../types/vehicle";

// function useSocket() {
//   const {
//     setConnected,
//     setVehicles,
//     setAlerts,
//     setLoading,
//     setError,
//   } = useVehicleContext();

//   useEffect(() => {
//     socket.connect();

//     socket.on("connect", () => {
//       setConnected(true);
//       setLoading(false);
//       setError(null);

//       console.log("Connected");
//     });

//     socket.on("disconnect", (reason) => {
//       setConnected(false);

//       console.log("Disconnected:", reason);
//     });

//     socket.on("connect_error", (err) => {
//       setError("Unable to connect to server");
//       setLoading(false);

//       console.log("Connection Error:", err.message);
//     });

//     socket.on("reconnect_attempt", (attempt) => {
//       console.log(`Reconnect Attempt: ${attempt}`);
//     });

//     socket.on("reconnect", (attempt) => {
//       console.log(`Reconnected after ${attempt} attempts`);
//     });

//     socket.on("reconnect_failed", () => {
//       console.log("Reconnect Failed");
//     });

//     // socket.on("vehicle-update", (vehicles: Vehicle[]) => {
//     //   console.log("Vehicle Update:", vehicles);

//     //   setVehicles(vehicles);
//     //   setLoading(false);

//     //   const alerts = vehicles
//     //     .filter(
//     //       (vehicle) =>
//     //         vehicle.speed > 80 ||
//     //         vehicle.status === "offline"
//     //     )
//     //     .map((vehicle) =>
//     //       vehicle.status === "offline"
//     //         ? `${vehicle.vehicleId} Offline`
//     //         : `${vehicle.vehicleId} Overspeed (${vehicle.speed})`
//     //     );

//     //   setAlerts(alerts);
//     // });

// //     socket.on("vehicle-update", (vehicles: Vehicle[]) => {
// //   console.log("Vehicle Update:", vehicles);

// //   setVehicles(vehicles);
// //   setLoading(false);

// //   const alerts = vehicles
// //     .filter((vehicle) => vehicle.speed > 80)
// //     .map(
// //       (vehicle) =>
// //         `${vehicle.vehicleId} Overspeed (${vehicle.speed} km/h)`
// //     );

// //   setAlerts(alerts);
// // });

// socket.on("telemetry-update", (telemetry) => {
//   console.log("Telemetry:", telemetry);

//   setVehicles((prev) => {
//     const updatedVehicles = prev.map((vehicle) =>
//       vehicle.vehicleId === telemetry.vehicleId
//         ? {
//             ...vehicle,
//             latitude: telemetry.latitude,
//             longitude: telemetry.longitude,
//             speed: telemetry.speed,
//             heading: telemetry.heading,
//             timestamp: telemetry.timestamp,
//           }
//         : vehicle
//     );

//     const alerts = updatedVehicles
//       .filter((vehicle) => vehicle.speed > 80)
//       .map(
//         (vehicle) =>
//           `${vehicle.vehicleId} Overspeed (${vehicle.speed} km/h)`
//       );

//     setAlerts(alerts);

//     return updatedVehicles;
//   });

//   setLoading(false);
// });

//     return () => {
//       socket.removeAllListeners();
//       socket.disconnect();
//     };
//   }, []);

//   return socket;
// }

// export default useSocket;

import { useEffect } from "react";

import socket from "../socket/socket";
import { useVehicleContext } from "../context/VehicleContext";

import type { GeofenceAlert } from "../types/geofence";
// import type { Vehicle } from "../types/vehicle";

function useSocket() {
  const {
    setConnected,
    setVehicles,
    setAlerts,
    setGeofenceAlerts,
    setLoading,
    setError,
  } = useVehicleContext();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
      setLoading(false);
      setError(null);

      console.log("Connected");
    });

    socket.on("disconnect", (reason) => {
      setConnected(false);

      console.log("Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      setError("Unable to connect to server");
      setLoading(false);

      console.log("Connection Error:", err.message);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnect Attempt: ${attempt}`);
    });

    socket.on("reconnect", (attempt) => {
      console.log(`Reconnected after ${attempt} attempts`);
    });

    socket.on("reconnect_failed", () => {
      console.log("Reconnect Failed");
    });

    // Live telemetry updates
    socket.on("telemetry-update", (telemetry) => {
      console.log("Telemetry:", telemetry);

      setVehicles((prev) => {
        const updatedVehicles = prev.map((vehicle) =>
          vehicle.vehicleId === telemetry.vehicleId
            ? {
                ...vehicle,
                latitude: telemetry.latitude,
                longitude: telemetry.longitude,
                speed: telemetry.speed,
                heading: telemetry.heading,
                timestamp: telemetry.timestamp,
              }
            : vehicle
        );

        const alerts = updatedVehicles
          .filter((vehicle) => vehicle.speed > 80)
          .map(
            (vehicle) =>
              `${vehicle.vehicleId} Overspeed (${vehicle.speed} km/h)`
          );

        setAlerts(alerts);

        return updatedVehicles;
      });

      setLoading(false);
    });

    // Geofence alerts
    socket.on(
      "geofence-alert",
      (alert: GeofenceAlert) => {
        console.log("Geofence Alert:", alert);

        setGeofenceAlerts((previous) => [
          alert,
          ...previous.slice(0, 19),
        ]);
      }
    );

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("reconnect_attempt");
      socket.off("reconnect");
      socket.off("reconnect_failed");
      socket.off("telemetry-update");
      socket.off("geofence-alert");

      socket.disconnect();
    };
  }, [
    setConnected,
    setVehicles,
    setAlerts,
    setGeofenceAlerts,
    setLoading,
    setError,
  ]);

  return socket;
}

export default useSocket;