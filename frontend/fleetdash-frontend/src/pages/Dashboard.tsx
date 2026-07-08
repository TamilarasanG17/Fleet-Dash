function Dashboard() {
  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Fleet Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-5">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Total Vehicles</h2>

          <p className="text-3xl font-bold mt-3">
            245
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Running</h2>

          <p className="text-3xl font-bold mt-3 text-green-600">
            198
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Idle</h2>

          <p className="text-3xl font-bold mt-3 text-yellow-500">
            32
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Alerts</h2>

          <p className="text-3xl font-bold mt-3 text-red-600">
            15
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;