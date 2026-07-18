import ConnectionStatus from "../common/ConnectionStatus";
import LastUpdated from "../common/LastUpdated";

function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8 shadow-sm">
      <h2 className="text-2xl font-bold">
        Fleet Telemetry Dashboard
      </h2>

      <div className="flex items-center gap-6">
        <ConnectionStatus />
        <LastUpdated />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold">Admin</p>
            <p className="text-sm text-gray-500">
              Fleet Manager
            </p>
          </div>

          <img
            src="https://i.pravatar.cc/45"
            alt="profile"
            className="h-10 w-10 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;