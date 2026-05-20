import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../../../utils/authFetch";

const useHandleCustomerCard = () => {
  const { id, isConsulting } = useParams();
  const createMode = !id;
  const modifyMode = id && isConsulting !== "true";
  const consultMode = id && isConsulting === "true";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: null, 
    name: "",
    taxId: "",
    email: "",
    phone: "",
    address: "",
    status: true,
    createdAt: "",
    updatedAt: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [tableMode, setTableMode] = useState(false);
  const [auditHistory, setAuditHistory] = useState([]);

  const validarDNI = (dni) => {
    const regex = /^[0-9]{8}[A-Za-z]$/;
    if (!regex.test(dni)) return false;
    const numero = parseInt(dni.substring(0, 8), 10);
    const letra = dni.charAt(8).toUpperCase();
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    return letra === letras[numero % 23];
  };

  const validarPhone = (phone) => /^[0-9]{9}$/.test(phone);

  const traducirKeys = (key) => {
    const traducciones = {
      name: "Nombre",
      taxId: "DNI",
      email: "Correo",
      phone: "Teléfono",
      address: "Dirección",
      status: "Estado",
    };
    return traducciones[key] || key;
  };

  const traducirEstado = (val) =>
    val === true ? "activo" : val === false ? "inactivo" : val;


  useEffect(() => {
    if (!id) return;

    const loadCustomer = async () => {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL_CUSTOMERS}/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error cargando cliente");
        return;
      }

      setForm(data.customer); // 🔥 AQUÍ YA VIENE form.id = 245
    };

    loadCustomer();
  }, [id]);


  useEffect(() => {
    if (!consultMode) return;
    if (!form.id) return; // 🔥 AHORA SÍ FUNCIONA

    const loadAudits = async () => {
      const res = await authFetch(
        `${import.meta.env.VITE_API_URL_AUDITORIES}/customers/${form.id}/history`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      const json = await res.json();
      if (!res.ok) return;

      const audits = json.history || [];

      const history = audits.map((audit) => {
        const oldData = audit.metadata?.old || {};
        const newData = audit.metadata?.new || {};

        // Normalizar estado
        if ("status" in oldData)
          oldData.status = traducirEstado(oldData.status);
        if ("status" in newData)
          newData.status = traducirEstado(newData.status);

        const diffs = [];

        Object.keys(newData).forEach((key) => {
          if (oldData[key] !== newData[key]) {
            diffs.push({
              field: traducirKeys(key),
              oldValue: oldData[key] ?? "",
              newValue: newData[key] ?? "",
            });
          }
        });

        return {
          date: audit.createdAt,
          diffs,
        };
      });
      console.log("HISTORIAL DE AUDITORÍAS PROCESADO:", history);
      setAuditHistory(history);
    };

    loadAudits();
  }, [consultMode, form.id]); 


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "status") {
      setForm({ ...form, status: value === "true" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const taxId = (form.taxId ?? "").trim();
    if (taxId !== "" && !validarDNI(taxId)) {
      setError("El DNI no es válido.");
      return;
    }

    const phone = (form.phone ?? "").trim();
    if (phone !== "" && !validarPhone(phone)) {
      setError("El teléfono no es válido.");
      return;
    }

    const payload = {
      ...form,
      taxId: taxId === "" ? null : taxId,
    };

    const url = `${import.meta.env.VITE_API_URL_CUSTOMERS}/${id}`;
    const method = modifyMode ? "PUT" : "POST";

    const res =
      modifyMode || consultMode
        ? await authFetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          })
        : await fetch(import.meta.env.VITE_API_URL_CUSTOMERS, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    if (modifyMode) {
      setMessage("Cliente modificado correctamente");
      setTimeout(() => navigate("/customers"), 1200);
    } else {
      setMessage("Cliente creado correctamente");
      setTimeout(() => navigate("/customers"), 1200);
    }
  };

  const setTableModeFunction = (mode) => {
    setTableMode(mode);
  };

  return {
    fields: {
      id,
      createMode,
      modifyMode,
      consultMode,
      navigate,
      form,
      error,
      message,
      auditHistory,
      tableMode,
    },
    handleChange,
    handleSubmit,
    setTableModeFunction,
  };
};

export default useHandleCustomerCard;
