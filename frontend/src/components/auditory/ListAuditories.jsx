import React, { useEffect } from "react";

const ListAuditories = ({
  data,
  loading,
  error,
  handleSort,
  sortColumn,
  sortDirection,
}) => {
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

  const arrow = (col) =>
    sortColumn === col ? (sortDirection === "asc" ? " ↑" : " ↓") : "";

  const copyToClipboardWithFormat = async () => {
    try {
      const rowsHtml = data
        .map((a) => {
          const { actionTraduced, entityTraduced, serviceTraduced } = traduce({
            action: a.action,
            entity: a.entityType,
            service: a.serviceName,
          });

          return `
            <tr>
              <td>${a.userName}</td>
              <td>${a.userId}</td>
              <td>${a.userEmail}</td>
              <td>${actionTraduced}</td>
              <td>${entityTraduced}</td>
              <td>${a.entityId}</td>
              <td>${serviceTraduced}</td>
              <td>${a.description}</td>
              <td>${new Date(a.createdAt).toLocaleString("es-ES")}</td>
              <td>${a.metadata ? JSON.stringify(a.metadata).replace(/"/g, "") : ""}</td>
            </tr>
          `;
        })
        .join("");

      const htmlContent = `
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>ID Usuario</th>
              <th>Email</th>
              <th>Acción</th>
              <th>Entidad</th>
              <th>ID Entidad</th>
              <th>Servicio</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Metadata</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" });

      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": blob,
          "text/plain": new Blob([htmlContent], { type: "text/plain" }),
        }),
      ]);

      alert("Tabla copiada con formato. Pégala en Excel con Ctrl+V.");
    } catch (err) {
      console.error("Error al copiar:", err);
      alert("Error al copiar. Asegúrate de estar en HTTPS o localhost.");
    }
  };

  useEffect(() => {
    const handler = () => copyToClipboardWithFormat();
    document.addEventListener("copy-auditory-table", handler);
    return () => document.removeEventListener("copy-auditory-table", handler);
  }, [data]);

  if (loading) {
    return (
      <div className="p-4 bg-blue-100 text-blue-800 rounded shadow border border-blue-300">
        Cargando auditorías...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded shadow border border-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[745px] rounded-lg border">
      <table className="w-full border-collapse">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr className="text-gray-700 text-left">
            <th
              className="p-3 font-semibold cursor-pointer"
              onClick={() => handleSort("userName")}
            >
              Usuario{arrow("userName")}
            </th>

            <th
              className="p-3 font-semibold cursor-pointer"
              onClick={() => handleSort("userId")}
            >
              ID Usuario{arrow("userId")}
            </th>

            <th
              className="p-3 font-semibold cursor-pointer"
              onClick={() => handleSort("userEmail")}
            >
              Email{arrow("userEmail")}
            </th>

            <th
              className="p-3 font-semibold cursor-pointer"
              onClick={() => handleSort("action")}
            >
              Acción{arrow("action")}
            </th>

            <th
              className="p-3 font-semibold cursor-pointer"
              onClick={() => handleSort("entityType")}
            >
              Entidad{arrow("entityType")}
            </th>

            <th
              className="p-3 font-semibold cursor-pointer"
              onClick={() => handleSort("entityId")}
            >
              ID Entidad{arrow("entityId")}
            </th>

            <th
              className="p-3 font-semibold cursor-pointer"
              onClick={() => handleSort("serviceName")}
            >
              Servicio{arrow("serviceName")}
            </th>

            <th className="p-3 font-semibold">Descripción</th>

            <th
              className="p-3 font-semibold cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              Fecha{arrow("createdAt")}
            </th>

            <th className="p-3 font-semibold">Detalles</th>
          </tr>
        </thead>

        <tbody>
          {data.map((a) => {
            const { actionTraduced, entityTraduced, serviceTraduced } = traduce(
              {
                action: a.action,
                entity: a.entityType,
                service: a.serviceName,
              },
            );

            return (
              <tr key={a.id} className="border-b hover:bg-gray-100 transition">
                <td className="p-3">{a.userName}</td>
                <td className="p-3">{a.userId}</td>
                <td className="p-3">{a.userEmail}</td>
                <td className="p-3">{actionTraduced}</td>
                <td className="p-3">{entityTraduced}</td>
                <td className="p-3">{a.entityId}</td>
                <td className="p-3">{serviceTraduced}</td>
                <td className="p-3">{a.description}</td>
                <td className="p-3">
                  {new Date(a.createdAt).toLocaleString("es-ES")}
                </td>
                <td className="p-3">
                  <a
                    href={`/audit-logs/${a.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Ver
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListAuditories;
