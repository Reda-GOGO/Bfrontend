import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    getCurrentUser();
  }, []);
  const getCurrentUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/check-auth`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Error checking user session:", err);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };
  const login = async (email, password, setMessage) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        await getCurrentUser();
        navigate("/");
      } else {
        setCurrentUser(null);
        setError("Login failed. Please try again.");
        setMessage("Invalid Creantials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setCurrentUser(null);
      setError("An error occurred. Please check your network connection.");
      setMessage("Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };
  const logout = () => { };
  return (
    <AuthContext.Provider
      value={{ currentUser, loading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
