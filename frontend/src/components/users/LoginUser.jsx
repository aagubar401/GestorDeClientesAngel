import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!validateEmail(form.email)) {
      setErrorMessage("El correo electrónico no es válido");
      return;
    }

    if (!form.password.trim()) {
      setErrorMessage("La contraseña no puede estar vacía");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_USERS}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Credenciales incorrectas");
        return;
      }

      setSuccessMessage("Inicio de sesión exitoso");

      // 🔥 GUARDAR TODO LO NECESARIO
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id); // ✔ NECESARIO
      localStorage.setItem("userEmail", data.user.email); // ✔ opcional
      localStorage.setItem("userName", data.user.name);

      setTimeout(() => {
        navigate("/profile");
        window.location.reload();
      }, 500);
    } catch {
      setErrorMessage("Error de conexión con el servidor");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-300">
      <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-3">
        🔐 Iniciar Sesión
      </h2>

      {successMessage && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700 border border-green-300">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="p-3 rounded border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="p-3 rounded border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition font-semibold"
        >
          Iniciar sesión
        </button>
      </form>

      <p>
        ¿Aún no tienes cuenta?{" "}
        <a href="/register" className="register">
          Regístrate
        </a>
      </p>
    </div>
  );
};

export default LoginUser;
