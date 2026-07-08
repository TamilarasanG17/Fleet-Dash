import {
  FaTachometerAlt,
  FaTruck,
  FaMapMarkedAlt,
  FaBell,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

const menus = [
  {
    name: "Dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    name: "Vehicles",
    icon: <FaTruck />,
  },
  {
    name: "Live Map",
    icon: <FaMapMarkedAlt />,
  },
  {
    name: "Alerts",
    icon: <FaBell />,
  },
  {
    name: "Reports",
    icon: <FaChartBar />,
  },
  {
    name: "Settings",
    icon: <FaCog />,
  },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0">

      <div className="text-2xl font-bold p-6 border-b border-slate-700">
        FleetDash
      </div>

      <nav className="mt-6">

        {menus.map((menu) => (
          <div
            key={menu.name}
            className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800 cursor-pointer transition"
          >
            <span className="text-lg">{menu.icon}</span>

            <span>{menu.name}</span>
          </div>
        ))}

      </nav>

    </aside>
  );
}

export default Sidebar;