import { useEffect, useMemo, useState } from "react";
import { authFetch } from "../../../utils/authFetch";

const useGetAllCustomers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  // Ordenación
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);

        const res = await authFetch(`${import.meta.env.VITE_API_URL_CUSTOMERS}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const json = await res.json();

        if (!res.ok) {
          setError(json?.error || "Error al cargar los clientes.");
          setLoading(false);
          return;
        }

        setData(json.customers || []);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar los clientes. Inténtalo de nuevo.");
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Búsqueda global
  const filteredData = useMemo(() => {
    if (!textoBusqueda.trim()) return data;

    const termino = textoBusqueda.toLowerCase();

    return data.filter((item) => {
      const estado = item.status ? "Activo" : "Inactivo";

      const campos = [
        item.name,
        item.phone,
        item.email,
        item.taxId,
        item.address,
        estado,
      ];

      return campos.some((campo) =>
        String(campo || "")
          .toLowerCase()
          .includes(termino),
      );
    });
  }, [textoBusqueda, data]);

  // Ordenación profesional
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (sortColumn === "status") {
        valA = a.status ? 1 : 0;
        valB = b.status ? 1 : 0;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === "asc" ? valA - valB : valB - valA;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Ordenación con 3 estados
  const handleSort = (column) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection("asc");
      return;
    }

    if (sortDirection === "asc") {
      setSortDirection("desc");
      return;
    }

    if (sortDirection === "desc") {
      setSortColumn(null);
      setSortDirection("asc");
    }
  };

  // 🔥 Permite eliminar un cliente sin recargar
  const removeCustomer = (id) => {
    setData((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    data: sortedData,
    loading,
    error,
    textoBusqueda,
    setTextoBusqueda,

    handleSort,
    sortColumn,
    sortDirection,

    removeCustomer,
  };
};

export default useGetAllCustomers;
