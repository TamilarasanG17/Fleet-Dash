function Header() {
  return (
    <header className="h-16 bg-white shadow flex justify-between items-center px-8">

      <h2 className="text-2xl font-bold">
        Fleet Telemetry Dashboard
      </h2>

      <div className="flex items-center gap-3">

        <div className="text-right">
          <p className="font-semibold">
            Admin
          </p>

          <p className="text-sm text-gray-500">
            Fleet Manager
          </p>
        </div>

        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="rounded-full"
        />

      </div>

    </header>
  );
}

export default Header;