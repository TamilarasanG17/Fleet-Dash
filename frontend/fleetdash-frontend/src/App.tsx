import useSocket from "./hooks/useSocket";
import AppRoutes from "./routes/AppRoutes";

function App() {
  useSocket();
  return <AppRoutes />;
}

export default App;