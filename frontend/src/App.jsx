import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import RegisterUser from "./components/users/RegisterUser";
import LoginUser from "./components/users/LoginUser";
import UserCard from "./components/users/UserCard";
import CustomersPage from "./components/customers/card/CustomersPage";
import AuditoryPage from "./components/auditory/AuditoryPage";
import CustomerCard from "./components/customers/card/CustomerCard";
import AuditoryCard from "./components/auditory/card/AuditoryCard";

import PrivateRoute from "./components/auth/PrivateRoute";

import { useState, useEffect, useRef } from "react";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const [refreshUserFlag, setRefreshUserFlag] = useState(0);

  // 🔥 Referencias para cerrar menú al hacer click fuera
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // 🔥 1) Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuOpen) return;

      const clickedInsideMenu = menuRef.current?.contains(e.target);
      const clickedButton = menuButtonRef.current?.contains(e.target);

      if (!clickedInsideMenu && !clickedButton) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // 🔥 2) Cerrar menú al pulsar ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // 🔥 3) Cerrar menú al navegar a otra ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Validar token y cargar perfil
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setToken("");
        setUserData(null);
        setIsAuthChecked(true);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL_USERS}/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          setToken("");
          setUserData(null);
          setIsAuthChecked(true);
          return;
        }

        const data = await res.json();
        setUserData(data.user);
        setToken(storedToken);
        setIsAuthChecked(true);
      } catch (err) {
        localStorage.removeItem("token");
        setToken("");
        setUserData(null);
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, [refreshUserFlag]);

  const handleLogout = async () => {
    if (token) {
      await fetch(`${import.meta.env.VITE_API_URL_USERS}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    localStorage.removeItem("token");
    setToken("");
    setUserData(null);
    navigate("/login");
  };

  if (!isAuthChecked) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-white text-xl">
        Verificando sesión...
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-primary text-primary-text flex">
      {/* Sidebar solo si hay token válido */}
      {token && (
        <div className="w-64 bg-gray-900 text-white flex flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/customers")}
              className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Clientes
            </button>

            <button
              onClick={() => navigate("/audit-logs")}
              className="w-full text-left px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Auditoria
            </button>
          </div>

          <div className="relative">
            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded flex items-center gap-3"
            >
              {/* AVATAR EN SIDEBAR */}
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold">
                {userData?.avatar ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL_AVATAR}${userData.avatar}`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userData?.name?.charAt(0).toUpperCase() || "?"
                )}
              </div>

              <span>{userData?.name || "Cargando..."}</span>
            </button>

            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute bottom-12 left-0 w-full bg-gray-800 border border-gray-700 rounded shadow-lg flex flex-col animate-fadeIn"
              >
                <button
                  onClick={() => {
                    navigate("/profile");
                  }}
                  className="px-4 py-2 text-left hover:bg-gray-700"
                >
                  Ver perfil
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-left hover:bg-gray-700 text-red-400"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-start p-10">
        {!token &&
          (location.pathname === "/login" ||
            location.pathname === "/register") && (
            <h1 className="text-3xl font-bold mb-6 text-white-text">
              Bienvenidos a la sección de prácticas
            </h1>
          )}

        <Routes>
          <Route
            path="/login"
            element={
              token ? <Navigate to="/customers" replace /> : <LoginUser />
            }
          />
          <Route
            path="/register"
            element={
              token ? <Navigate to="/customers" replace /> : <RegisterUser />
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserCard
                  onUserUpdated={() => setRefreshUserFlag((prev) => prev + 1)}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/audit-logs/:id"
            element={
              <PrivateRoute>
                <AuditoryCard />
              </PrivateRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <CustomersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/audit-logs"
            element={
              <PrivateRoute>
                <AuditoryPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/customers/modify/:id?/:isConsulting?"
            element={
              <PrivateRoute>
                <CustomerCard />
              </PrivateRoute>
            }
          />

          <Route
            path="/"
            element={
              token ? (
                <Navigate to="/customers" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="*"
            element={
              token ? (
                <Navigate to="/customers" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
