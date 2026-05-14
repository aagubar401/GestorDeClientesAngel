import { useEffect, useState } from "react";
import { authFetch } from "../../../utils/authFetch";

const useHandleUserCard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [modifyMode, setModifyMode] = useState(false);
  const [consultMode, setConsultMode] = useState(true);

  // Puede ser: null | File | "DELETE"
  const [pendingAvatar, setPendingAvatar] = useState(null);

  const token = localStorage.getItem("token");

  const refreshUser = async () => {
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL_USERS}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setUser(data.user);
    } catch {
      setError("Error recargando usuario");
    }
  };

  useEffect(() => {
    if (!token) {
      setError("No hay sesión iniciada");
      return;
    }
    refreshUser();
  }, []);

  const uploadPendingAvatar = async () => {
    if (!pendingAvatar || pendingAvatar === "DELETE") return;

    const formData = new FormData();
    formData.append("avatar", pendingAvatar);

    const res = await fetch(`${import.meta.env.VITE_API_URL_USERS}/${user.id}/avatar`, {
      method: "POST",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      setError("Error subiendo avatar");
    }
  };

  const handleDeleteAvatar = async () => {
    if (modifyMode) {
      setPendingAvatar("DELETE");
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL_USERS}/${user.id}/avatar`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) refreshUser();
    else setError("Error eliminando avatar");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // 1) Subir avatar si hay uno pendiente
      if (pendingAvatar && pendingAvatar !== "DELETE") {
        await uploadPendingAvatar();
      }

      // 2) Borrar avatar si estaba marcado para borrar
      if (pendingAvatar === "DELETE") {
        await fetch(`${import.meta.env.VITE_API_URL_USERS}/${user.id}/avatar`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // 3) Actualizar nombre
      const res = await authFetch(`${import.meta.env.VITE_API_URL_USERS}/name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error actualizando nombre");
        return;
      }

      setMessage("Datos actualizados correctamente");

      setTimeout(() => {
        refreshUser();
        setPendingAvatar(null);
        setConsultMode(true);
        setModifyMode(false);
      }, 800);
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return {
    fields: {
      user,
      error,
      modifyMode,
      consultMode,
      setName,
      message,
      name,
      setModifyMode,
      setConsultMode,
      refreshUser,
      pendingAvatar,
      setPendingAvatar,
    },
    handleSubmit,
    handleDeleteAvatar,
  };
};

export default useHandleUserCard;
