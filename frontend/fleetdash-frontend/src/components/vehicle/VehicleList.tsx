import { vehicles } from "../../data/vehicles";


function VehicleList() {
  return (
    <div className="bg-white rounded-xl shadow p-5">

      <h2 className="font-bold text-xl mb-4">
        Vehicles
      </h2>

      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="flex justify-between border-b py-3"
        >
          <span>{vehicle.name}</span>

          <span
            className={
              vehicle.status === "Running"
                ? "text-green-600"
                : "text-yellow-500"
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