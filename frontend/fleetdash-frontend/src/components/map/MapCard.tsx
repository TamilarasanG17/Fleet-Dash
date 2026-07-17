import LiveMap from "./LiveMap";

function MapCard() {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            🗺 Live Fleet Map
          </h2>

          <p className="text-sm text-gray-500">
            Real-time GPS Tracking
          </p>
        </div>
      </div>

      <LiveMap />
    </div>
  );
}

export default MapCard;