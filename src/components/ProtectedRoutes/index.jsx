import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute() {
  const [isValid, setIsValid] = useState(null);
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/getToken/frontend`,
          {
            params: { name, email },
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data && response.data.token) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (err) {
        console.error(err);
        setIsValid(false);
      }
    };

    checkToken();
  }, [name, email]);

  if (isValid === null) return <div>Loading...</div>;

  if (!isValid) return <Navigate to="/login" replace />;

  return <Outlet />; // renders nested routes
}
