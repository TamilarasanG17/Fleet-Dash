// import ConnectionStatus from "../common/ConnectionStatus";
// import LastUpdated from "../common/LastUpdated";

// function Header() {
//   return (
//     <header className="flex h-16 items-center justify-between border-b bg-white px-8 shadow-sm">
//       <h2 className="text-2xl font-bold">
//         Fleet Telemetry Dashboard
//       </h2>

//       <div className="flex items-center gap-6">
//         <ConnectionStatus />
//         <LastUpdated />

//         <div className="flex items-center gap-3">
//           <div className="text-right">
//             <p className="font-semibold">Admin</p>
//             <p className="text-sm text-gray-500">
//               Fleet Manager
//             </p>
//           </div>

//           <img
//             src="https://i.pravatar.cc/45"
//             alt="profile"
//             className="h-10 w-10 rounded-full"
//           />
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

import { useState } from "react";

import ConnectionStatus from "../common/ConnectionStatus";
import LastUpdated from "../common/LastUpdated";

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

interface HeaderProps {
  // Optional: wire this up to open your Sidebar on small screens, where it's
  // currently `hidden` below the `lg` breakpoint with no other way in.
  // Header renders fine without it — the button just won't show.
  onMenuClick?: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-slate-100 bg-white/80 px-4 shadow-sm backdrop-blur-md animate-[headerFadeIn_0.4s_ease-out] sm:px-8">
      <style>{`
        @keyframes headerFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex min-w-0 items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
          >
            <MenuIcon />
          </button>
        )}

        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-slate-800 sm:text-2xl">
            Fleet Telemetry Dashboard
          </h2>
          <p className="hidden text-xs text-slate-400 sm:block">
            Real-time vehicle tracking &amp; alerts
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        <div className="hidden items-center gap-3 md:flex">
          <ConnectionStatus />
          <span className="h-5 w-px bg-slate-200" />
          <LastUpdated />
        </div>

        <div className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-slate-50 sm:gap-3 sm:pr-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">Admin</p>
            <p className="text-xs text-gray-500">Fleet Manager</p>
          </div>

          <span className="relative inline-flex shrink-0">
            {!avatarError ? (
              <img
                src="https://i.pravatar.cc/45"
                alt="profile"
                onError={() => setAvatarError(true)}
                className="h-9 w-9 rounded-full shadow ring-2 ring-white sm:h-10 sm:w-10"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow ring-2 ring-white sm:h-10 sm:w-10">
                A
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;