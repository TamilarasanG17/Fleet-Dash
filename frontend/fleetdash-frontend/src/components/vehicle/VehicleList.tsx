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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Vehicles</h2>

        <button
          onClick={() => window.location.reload()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {vehicles.map((vehicle) => (
        <div
          key={vehicle.vehicleId}
          className="flex justify-between border-b py-3"
        >
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