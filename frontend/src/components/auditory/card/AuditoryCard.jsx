import { useParams } from "react-router-dom";
import useHandleAuditoryCard from "./hooks/useHandleAuditoryCard";

const AuditoryCard = () => {
  const { id } = useParams();
  const { data, loading, error } = useHandleAuditoryCard(id);

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

    // Acción
    if (actionsList.includes(action)) {
      const pos = actionsList.indexOf(action);
      actionTraduced = actionsListTraduced[pos];
    }

    // Entidad
    if (entity === "customer") entityTraduced = "cliente";
    else if (entity === "user") entityTraduced = "usuario";

    // Servicio
    if (service === "customers-service")
      serviceTraduced = "Servicio de clientes";
    else if (service === "users-service")
      serviceTraduced = "Servicio de usuarios";

    return { actionTraduced, entityTraduced, serviceTraduced };
  };

  // ⛔️ No podemos traducir hasta que data exista
  if (loading) {
    return <div className="p-4 bg-blue-100">Cargando detalles...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100">{error}</div>;
  }

  // ✅ Ahora sí: data existe
  const { actionTraduced, entityTraduced, serviceTraduced } = traduce({
    action: data.action,
    entity: data.entityType,
    service: data.serviceName,
  });

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow border">
      <h2 className="text-2xl font-bold mb-4">Detalle de Auditoría #{id}</h2>

      <p>
        <strong>Usuario:</strong> {data.userName || "Desconocido"}
      </p>

      <p>
        <strong>ID de Usuario:</strong> {data.userId}
      </p>

      <p>
        <strong>Email del Usuario:</strong> {data.userEmail}
      </p>

      <hr className="my-4" />

      <p>
        <strong>Acción:</strong> {actionTraduced}
      </p>
      <p>
        <strong>Entidad:</strong> {entityTraduced}
      </p>
      <p>
        <strong>ID Entidad:</strong> {data.entityId}
      </p>
      <p>
        <strong>Servicio:</strong> {serviceTraduced}
      </p>
      <p>
        <strong>Descripción:</strong> {data.description}
      </p>

      <p className="mt-4">
        <strong>Metadata:</strong>
      </p>
      <pre className="bg-gray-100 p-3 rounded">
        {JSON.stringify(data.metadata, null, 2)}
      </pre>

      <p className="mt-4 text-gray-600">
        <strong>Fecha:</strong>{" "}
        {new Date(data.createdAt).toLocaleString("es-ES")}
      </p>

      <a
        href={`/audit-logs`}
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Volver a la lista
      </a>
    </div>
  );
};

export default AuditoryCard;
