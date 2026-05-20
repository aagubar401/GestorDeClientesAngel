import { useEffect, useState } from "react";
import { authFetch } from "../../../utils/authFetch";

const useHandleUserCard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [modifyMode, setModifyMode] = useState(false);
  const [consultMode, setConsultMode] = useState(true);

  const [pendingAvatar, setPendingAvatar] = useState(null);

  const [auditHistory, setAuditHistory] = useState([]); // 🔥 NUEVO
  const [tableMode, setTableMode] = useState(false); // 🔥 NUEVO

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

  // ---------------------------------------------------------
  // 🔥 CARGAR HISTORIAL user.modified
  // ---------------------------------------------------------
  useEffect(() => {
    if (!consultMode) return;
    if (!user?.id) return;

    const loadUserAudits = async () => {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL_AUDITORIES}/users/${user.id}/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const json = await res.json();
      if (!res.ok) return;

      const audits = json.history || [];

      const traducirCampo = (raw) => {
        const map = {
          UserName: "Nombre",
          Email: "Correo",
          Role: "Rol",
          Active: "Estado",
        };
        return map[raw] || raw;
      };

      const normalize = (v) =>
        v === true ? "activo" : v === false ? "inactivo" : v;

      const history = audits.map((audit) => {
        const meta = audit.metadata || {};

        const diffs = [];

        // Buscar pares oldX / newX
        Object.keys(meta).forEach((key) => {
          if (key.startsWith("old")) {
            const field = key.replace("old", ""); // oldUserName → UserName
            const newKey = "new" + field;

            if (meta[newKey] !== undefined) {
              const oldValue = meta[key];
              const newValue = meta[newKey];

              const displayOld =
                field === "Active" ? normalize(oldValue) : oldValue;
              const displayNew =
                field === "Active" ? normalize(newValue) : newValue;

              if (displayOld !== displayNew) {
                diffs.push({
                  field: traducirCampo(field),
                  oldValue: displayOld ?? "-",
                  newValue: displayNew ?? "-",
                });
              }
            }
          }
        });

        return {
          date: audit.createdAt,
          diffs,
        };
      });

      setAuditHistory(history);
    };

    loadUserAudits();
  }, [consultMode, user?.id]);



  const uploadPendingAvatar = async () => {
    if (!pendingAvatar || pendingAvatar === "DELETE") return;

    const formData = new FormData();
    formData.append("avatar", pendingAvatar);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL_USERS}/${user.id}/avatar`,
      {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!res.ok) {
      setError("Error subiendo avatar");
    }
  };

  const handleDeleteAvatar = async () => {
    if (modifyMode) {
      setPendingAvatar("DELETE");
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL_USERS}/${user.id}/avatar`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (res.ok) refreshUser();
    else setError("Error eliminando avatar");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (pendingAvatar && pendingAvatar !== "DELETE") {
        await uploadPendingAvatar();
      }

      if (pendingAvatar === "DELETE") {
        await fetch(`${import.meta.env.VITE_API_URL_USERS}/${user.id}/avatar`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const res = await authFetch(
        `${import.meta.env.VITE_API_URL_USERS}/name`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        },
      );

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

      auditHistory, 
      tableMode, 
      setTableMode, 
    },
    handleSubmit,
    handleDeleteAvatar,
  };
};

export default useHandleUserCard;
