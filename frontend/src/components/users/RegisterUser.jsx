import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "user",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!validateEmail(form.email)) {
      setErrorMessage("El correo electrónico no es válido");
      return;
    }

    if (form.password !== form.repeatPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_USERS}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Error desconocido");
        return;
      }

      setSuccessMessage("Usuario registrado correctamente");

      // 🔥 LOGIN AUTOMÁTICO
      const loginRes = await fetch(`${import.meta.env.VITE_API_URL_USERS}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setErrorMessage(
          "El usuario se registró, pero no se pudo iniciar sesión automáticamente",
        );
        return;
      }

      // Guardar token
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("userId", data.user.id); // ✔ NECESARIO
      localStorage.setItem("userEmail", data.user.email); // ✔ opcional
      localStorage.setItem("userName", data.user.name);

      // Redirigir al perfil
      setTimeout(() => {
        navigate("/profile");
        window.location.reload();
      }, 600);
    } catch {
      setErrorMessage("Error de conexión con el servidor");
    }
  };
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-300">
      <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-3">
        📝 Registro de Usuario
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
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={form.name}
          onChange={handleChange}
          required
          className="p-3 rounded border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

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

        <input
          type="password"
          name="repeatPassword"
          placeholder="Repetir contraseña"
          value={form.repeatPassword}
          onChange={handleChange}
          required
          className="p-3 rounded border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded transition font-semibold"
        >
          Registrarse
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="register">
          Inicia sesión
        </a>
      </p>
    </div>
  );
};

export default RegisterUser;
