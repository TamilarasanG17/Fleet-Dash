function Header() {
  return (
    <header className="h-16 w-full bg-white shadow flex items-center justify-between px-8">
    {/* // <header className="flex h-16 items-center justify-between border-b bg-white px-8 shadow-sm"> */}

      <h2 className="text-2xl font-bold">
        Fleet Telemetry Dashboard
      </h2>

      <div className="flex items-center gap-3">

        <div className="text-right">
          <h3 className="font-bold">Admin</h3>
          <p className="text-sm text-gray-500">Fleet Manager</p>
        </div>

        <img
          src="https://i.pravatar.cc/45"
          alt="profile"
          className="w-10 h-10 rounded-full"
        />

      </div>

    </header>
  );
}

export default Header;