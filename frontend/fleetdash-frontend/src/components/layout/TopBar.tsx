import { useEffect, useState } from "react";
import type { ConnectionState } from "../../types/fleet";

interface TopBarProps {
  readonly connectionState: ConnectionState;
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

const CONNECTION_LABEL: Record<ConnectionState, string> = {
  online: "Online",
  connecting: "Connecting",
  offline: "Offline"
};

export default function TopBar({ connectionState }: TopBarProps): JSX.Element {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__mark" aria-hidden="true" />
        <span className="topbar__title">FleetDash</span>
      </div>

      <div className="topbar__meta">
        <time className="topbar__clock" dateTime={now.toISOString()}>
          {formatClock(now)}
        </time>
        <div className={`topbar__status topbar__status--${connectionState}`}>
          <span className="topbar__status-dot" aria-hidden="true" />
          {CONNECTION_LABEL[connectionState]}
        </div>
      </div>
    </header>
  );
}
