import { useEffect, useState, useMemo } from "react";
import { authFetch } from "../../../utils/authFetch";

const useGetAllAuditories = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [filters, setFilters] = useState({
    userId: "",
    email: "",
    acciones: [],
  });

  const [actionSearch, setActionSearch] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    userId: "",
    email: "",
    acciones: [],
  });

  const traduce = ({ action, entity, service }) => {
    const actionsList = [
      "customer.modified",
      "customer.deleted",
      "customer.created",
      "user.login",
      "user.logout",
      "user.register",
      "user.modified",
      "avatar.deleted",
      "avatar.uploaded",
    ];

    const actionsListTraduced = [
      "Cliente modificado",
      "Cliente eliminado",
      "Cliente creado",
      "Inicio de sesión",
      "Cierre de sesión",
      "Registro de usuario",
      "Usuario modificado",
      "Avatar eliminado",
      "Avatar modificado",
    ];

    let actionTraduced = "Acción desconocida";
    let entityTraduced = "Entidad desconocida";
    let serviceTraduced = "Servicio desconocido";

    if (actionsList.includes(action)) {
      const pos = actionsList.indexOf(action);
      actionTraduced = actionsListTraduced[pos];
    }

    if (entity === "customer") entityTraduced = "cliente";
    else if (entity === "user") entityTraduced = "usuario";

    if (service === "customers-service")
      serviceTraduced = "Servicio de clientes";
    else if (service === "users-service")
      serviceTraduced = "Servicio de usuarios";

    return { actionTraduced, entityTraduced, serviceTraduced };
  };

  useEffect(() => {
    const fetchAuditories = async () => {
      try {
        setLoading(true);

        const [resAudits, resUsers] = await Promise.all([
          authFetch(`${import.meta.env.VITE_API_URL_AUDITORIES}`),
          authFetch(`${import.meta.env.VITE_API_URL_USERS}`),
        ]);

        const auditsJson = await resAudits.json().catch(() => ({}));
        const usersJson = await resUsers.json().catch(() => ({}));

        if (!resAudits.ok) {
          setError(auditsJson?.error || "Error al cargar auditorías");
          setLoading(false);
          return;
        }

        const auditories = Array.isArray(auditsJson.auditories)
          ? auditsJson.auditories
          : [];

        let usersList = [];
        if (Array.isArray(usersJson?.users)) usersList = usersJson.users;
        else if (Array.isArray(usersJson)) usersList = usersJson;

        const usersMap = {};
        usersList.forEach((u) => {
          if (!u) return;
          const idNum = Number(u.id ?? u.userId);
          if (!Number.isNaN(idNum)) usersMap[idNum] = u;
        });

        const enriched = auditories.map((a) => {
          const idNum = Number(a.userId);
          const user = usersMap[idNum];

          return {
            ...a,
            userName: user?.name || user?.userName || "Desconocido",
            userEmail: user?.email || user?.userEmail || "Desconocido",
          };
        });

        setAllData(enriched);
        setLoading(false);
      } catch (err) {
        console.error("Error cargando auditorías:", err);
        setError("Error al cargar auditorías. Inténtalo de nuevo.");
        setLoading(false);
      }
    };

    fetchAuditories();
  }, []);

  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      const userId = String(item.userId || "");
      const email = item.userEmail || "";
      const accion = item.action || "";

      const matchUserId =
        !appliedFilters.userId || userId.includes(appliedFilters.userId);

      const matchEmail =
        !appliedFilters.email ||
        email.toLowerCase().includes(appliedFilters.email.toLowerCase());

      const matchAcciones =
        appliedFilters.acciones.length === 0 ||
        appliedFilters.acciones.includes(accion);

      return matchUserId && matchEmail && matchAcciones;
    });
  }, [allData, appliedFilters]);

  const searchedData = useMemo(() => {
    if (!textoBusqueda.trim()) return filteredData;

    const termino = textoBusqueda.toLowerCase();

    return filteredData.filter((item) => {
      const { actionTraduced, entityTraduced, serviceTraduced } = traduce({
        action: item.action,
        entity: item.entityType,
        service: item.serviceName,
      });

      const fecha = new Date(item.createdAt).toLocaleString("es-ES");

      const metadata = item.metadata
        ? JSON.stringify(item.metadata).replace(/"/g, "")
        : "";

      const campos = [
        item.userName,
        item.userId,
        item.userEmail,
        actionTraduced,
        entityTraduced,
        serviceTraduced,
        item.description,
        item.entityId,
        fecha,
        metadata,
      ];

      return campos.some((campo) =>
        String(campo).toLowerCase().includes(termino),
      );
    });
  }, [filteredData, textoBusqueda]);

  const sortedData = useMemo(() => {
    // 🔥 Estado sin ordenar
    if (!sortColumn) return searchedData;

    return [...searchedData].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

     
      if (sortColumn === "createdAt") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

 
      if (sortColumn === "userId" || sortColumn === "entityId") {
        valA = Number(valA);
        valB = Number(valB);
      }

   
      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

    
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });
  }, [searchedData, sortColumn, sortDirection]);


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



  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = ({ actions = [] } = {}) => {
    setAppliedFilters({
      userId: filters.userId,
      email: filters.email,
      acciones: actions,
    });
  };

  const clearFilters = () => {
    setFilters({
      userId: "",
      email: "",
      acciones: [],
    });

    setAppliedFilters({
      userId: "",
      email: "",
      acciones: [],
    });

    setActionSearch("");
    setTextoBusqueda("");
  };

  return {
    data: sortedData,
    loading,
    error,
    filters,
    handleFilterChange,
    applyFilters,
    clearFilters,
    actionSearch,
    setActionSearch,
    textoBusqueda,
    setTextoBusqueda,
    handleSort,
    sortColumn,
    sortDirection,
  };
};

export default useGetAllAuditories;
