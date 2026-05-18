import { useEffect, useState } from "react";
import { authFetch } from "../../../../utils/authFetch";
const useHandleAuditoryCard = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditory = async () => {
      try {
        setLoading(true);

        // 1️⃣ Obtener auditoría
        const res = await authFetch(`${import.meta.env.VITE_API_URL_AUDITORIES}/${id}`);
        const json = await res.json();

        if (!res.ok) {
          setError(json.error || "Error al obtener auditoría");
          setLoading(false);
          return;
        }

        const audit = json.auditory;

        // 2️⃣ Obtener usuario real por userId
        let userName = "Desconocido";
        let userEmail = "Desconocido";

        try {
          const userRes = await authFetch(
            `${import.meta.env.VITE_API_URL_USERS}/${audit.userId}`,
          );

          const userJson = await userRes.json();

          if (userRes.ok) {
            // Ajustamos según estructura real
            const user = userJson.user || userJson;

            userName = user.name || user.userName || "Desconocido";
            userEmail = user.email || user.userEmail || "Desconocido";
          }
        } catch (err) {
          console.warn("No se pudo obtener el usuario:", err);
        }

        // 3️⃣ Devolver auditoría enriquecida
        setData({
          ...audit,
          userName,
          userEmail,
        });

        setLoading(false);
      } catch (err) {
        setError("Error al cargar auditoría");
        setLoading(false);
      }
    };

    fetchAuditory();
  }, [id]);

  return { data, loading, error };
};

export default useHandleAuditoryCard;
