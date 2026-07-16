import { useVehicleContext } from "../../context/VehicleContext";

function VehicleList() {
  const { vehicles } = useVehicleContext();

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="mb-4 text-xl font-bold">
        Live Vehicles
      </h2>

      {vehicles.length === 0 ? (
        <p className="text-center text-gray-500">
          No Vehicles Connected
        </p>
      ) : (
        vehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            className="flex justify-between border-b py-3"
          >
            <div>
              <h3 className="font-semibold">
                {vehicle.vehicleId}
              </h3>

              <p className="text-sm text-gray-500">
                Lat: {vehicle.latitude.toFixed(4)}
              </p>

              <p className="text-sm text-gray-500">
                Lng: {vehicle.longitude.toFixed(4)}
              </p>

              <p className="text-sm text-gray-500">
                Speed: {vehicle.speed} km/h
              </p>
            </div>

            <span
              className={`h-fit rounded-full px-3 py-1 text-white ${
                vehicle.status === "Running"
                  ? "bg-green-500"
                  : vehicle.status === "Idle"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {vehicle.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default VehicleList;