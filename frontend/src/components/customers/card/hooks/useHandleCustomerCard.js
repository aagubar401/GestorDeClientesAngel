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

  const validarDNI = (dni) => {
    const regex = /^[0-9]{8}[A-Za-z]$/;
    if (!regex.test(dni)) return false;
    const numero = parseInt(dni.substring(0, 8), 10);
    const letra = dni.charAt(8).toUpperCase();
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    return letra === letras[numero % 23];
  };

  const validarPhone = (phone) => {
    const regex = /^[0-9]{9}$/
    if (!regex.test(phone)) {
      return false
    } else {
      return true
    }
  }
  

  useEffect(() => {
    if (!id) return;
    const loadCustomer = async () => {
      const res = await authFetch(`${import.meta.env.VITE_API_URL_CUSTOMERS}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error cargando cliente");
        return;
      }

      setForm(data.customer);
    };

    loadCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // status debe convertirse a boolean
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
      taxId: taxId === "" ? null : taxId
    };

    
    const res = (consultMode || modifyMode) ? await authFetch(`${import.meta.env.VITE_API_URL_CUSTOMERS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(payload)
    }) : await fetch(`${import.meta.env.VITE_API_URL_CUSTOMERS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });
  

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }
    // cambiar mensaje según mode
    if (modifyMode) {
      setMessage("Cliente modificado correctamente");
      setTimeout(() => navigate("/customers"), 1200);
    } else {
      setMessage("Cliente creado correctamente");
      setTimeout(() => navigate("/customers"), 1200);
    }
    
  };
  return {
    fields: {id, createMode, modifyMode, consultMode, navigate, form, error, message},
    handleChange, handleSubmit
  }
}

export default useHandleCustomerCard