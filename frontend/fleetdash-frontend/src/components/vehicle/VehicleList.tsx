import useVehicles from "../../hooks/useVehicles";
import EmptyState from "../common/EmptyState";
import ErrorMessage from "../common/ErrorMessage";
import Loader from "../common/Loader";

function VehicleList() {
  const { vehicles, loading, error } = useVehicles();

  if (loading) return <Loader />;

  if (error) return <ErrorMessage message={error} />;

  if (vehicles.length === 0) return <EmptyState />;
  
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="font-bold text-xl mb-4">Vehicles</h2>

      {vehicles.map((vehicle) => (
        <div
          key={vehicle.vehicleId}
          className="flex justify-between border-b py-3"
        >
          {/* <span>{vehicle.vehicleId}</span> */}
          <div>
            <p className="font-semibold">{vehicle.vehicleId}</p>
          </div>

          <span
            className={
              vehicle.status === "moving"
                ? "text-green-600"
                : vehicle.status === "idle"
                ? "text-yellow-500"
                : "text-red-600"
            }
          >
            {vehicle.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export default VehicleList;