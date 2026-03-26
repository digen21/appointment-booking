import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import Booking from "@/pages/Booking";
import Host from "@/pages/Host";
import { NotFound } from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { useProfile } from "@/hooks/useProfile";

const ProtectedRoutes = ({ children }) => {
  const { isLoading, isError } = useProfile();

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (isError) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/host"
          element={
            <ProtectedRoutes>
              <Host />
            </ProtectedRoutes>
          }
        />
        <Route path="/book/:userId" element={<Booking />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
