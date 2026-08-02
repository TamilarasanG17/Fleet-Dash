// import {
//   FaTachometerAlt,
//   FaTruck,
//   FaMapMarkedAlt,
//   FaBell,
//   FaChartBar,
//   FaCog,
// } from "react-icons/fa";

// const menus = [
//   {
//     name: "Dashboard",
//     icon: <FaTachometerAlt />,
//   },
//   {
//     name: "Vehicles",
//     icon: <FaTruck />,
//   },
//   {
//     name: "Live Map",
//     icon: <FaMapMarkedAlt />,
//   },
//   {
//     name: "Alerts",
//     icon: <FaBell />,
//   },
//   {
//     name: "Reports",
//     icon: <FaChartBar />,
//   },
//   {
//     name: "Settings",
//     icon: <FaCog />,
//   },
// ];

// function Sidebar() {
//   return (
//     <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white shadow-lg hidden lg:block">

//       <div className="text-2xl font-bold p-6 border-b border-slate-700">
//         FleetDash
//       </div>

//       <nav className="mt-6">

//           {menus.map((menu) => (

//             <button
//               key={menu.name}
//               className="w-full flex items-center gap-4 px-6 py-4 hover:bg-blue-600 transition rounded-lg"
//             >

//               <span>{menu.icon}</span>

//               <span>{menu.name}</span>

//             </button>

//           ))}

//         </nav>

//     </aside>
//   );
// }

// export default Sidebar;

// import { NavLink } from "react-router-dom";
// import {
//   FaTachometerAlt,
//   FaTruck,
//   FaMapMarkedAlt,
//   FaBell,
//   FaChartBar,
//   FaCog,
// } from "react-icons/fa";

// const menus = [
//   {
//     name: "Dashboard",
//     path: "/",
//     icon: <FaTachometerAlt />,
//   },
//   {
//     name: "Vehicles",
//     path: "/vehicles",
//     icon: <FaTruck />,
//   },
//   {
//     name: "Live Map",
//     path: "/live-map",
//     icon: <FaMapMarkedAlt />,
//   },
//   {
//     name: "Alerts",
//     path: "/alerts",
//     icon: <FaBell />,
//   },
//   {
//     name: "Reports",
//     path: "/reports",
//     icon: <FaChartBar />,
//   },
//   {
//     name: "Settings",
//     path: "/settings",
//     icon: <FaCog />,
//   },
// ];

// function Sidebar() {
//   return (
//     <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white shadow-lg hidden lg:flex flex-col">
//       {/* Logo */}
//       <div className="border-b border-slate-700 p-6">
//         <h1 className="text-3xl font-bold">FleetDash</h1>
//       </div>

//       {/* Menu */}
//       <nav className="flex-1 py-6 px-3">
//         {menus.map((menu) => (
//           <NavLink
//             key={menu.name}
//             to={menu.path}
//             end={menu.path === "/"}
//             className={({ isActive }) =>
//               `mb-2 flex items-center gap-4 rounded-xl px-5 py-4 text-lg font-medium transition-all duration-200 ${
//                 isActive
//                   ? "bg-blue-600 text-white shadow"
//                   : "text-slate-300 hover:bg-slate-800 hover:text-white"
//               }`
//             }
//           >
//             <span className="text-xl">{menu.icon}</span>
//             <span>{menu.name}</span>
//           </NavLink>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="border-t border-slate-700 p-4 text-center text-sm text-slate-400">
//         FleetDash v1.0
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;

import { NavLink } from "react-router-dom";
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
    path: "/",
    icon: <FaTachometerAlt />,
  },
  {
    name: "Vehicles",
    path: "/vehicles",
    icon: <FaTruck />,
  },
  {
    name: "Live Map",
    path: "/live-map",
    icon: <FaMapMarkedAlt />,
  },
  {
    name: "Alerts",
    path: "/alerts",
    icon: <FaBell />,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <FaChartBar />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <FaCog />,
  },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white shadow-lg hidden lg:block">
      <div className="text-2xl font-bold p-6 border-b border-slate-700">
        FleetDash
      </div>

      <nav className="mt-6">
        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            end={menu.path === "/"}
            className={({ isActive }) =>
              `w-full flex items-center gap-4 px-6 py-4 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-blue-600"
              }`
            }
          >
            <span>{menu.icon}</span>
            <span>{menu.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;