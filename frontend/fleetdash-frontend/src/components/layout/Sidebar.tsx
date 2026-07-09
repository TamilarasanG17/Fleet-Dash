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
    <aside className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white shadow-lg">

      <div className="text-2xl font-bold p-6 border-b border-slate-700">
        FleetDash
      </div>

      <nav className="mt-6">

          {menus.map((menu) => (

            <button
              key={menu.name}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-blue-600 transition rounded-lg"
            >

              <span>{menu.icon}</span>

              <span>{menu.name}</span>

            </button>

          ))}

        </nav>

    </aside>
  );
}

export default Sidebar;