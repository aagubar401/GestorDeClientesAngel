import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ListCustomers = ({
  data,
  loading,
  error,
  handleSort,
  sortColumn,
  sortDirection,
  removeCustomer,
}) => {
  const [deleteError, setDeleteError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const arrow = (col) =>
    sortColumn === col ? (sortDirection === "asc" ? " ↑" : " ↓") : "";

  const deleteCustomer = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar este cliente?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_CUSTOMERS}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        setDeleteError(json.error || "Error al eliminar cliente");
        return;
      }

      removeCustomer(id);

      setMessage("Cliente eliminado correctamente");
      setTimeout(() => setMessage(""), 5000);
    } catch {
      setDeleteError("Error de conexión con el servidor");
    }
  };

  if (deleteError) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded shadow border border-red-300">
        {deleteError}
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

  if (loading) {
    return (
      <div className="p-4 bg-blue-100 text-blue-800 rounded shadow border border-blue-300">
        <p>Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col max-h-[745px] p-4">
      {message && (
        <div className="p-3 mb-3 bg-green-100 text-green-800 rounded shadow flex-shrink-0">
          {message}
        </div>
      )}

      <div className="overflow-x-auto overflow-y-auto rounded-lg border flex-1">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr className="text-gray-700 text-left">
              <th
                className="p-3 font-semibold cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Nombre{arrow("name")}
              </th>

              <th
                className="p-3 font-semibold cursor-pointer"
                onClick={() => handleSort("phone")}
              >
                Teléfono{arrow("phone")}
              </th>

              <th
                className="p-3 font-semibold cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email{arrow("email")}
              </th>

              <th
                className="p-3 font-semibold cursor-pointer"
                onClick={() => handleSort("taxId")}
              >
                DNI{arrow("taxId")}
              </th>

              <th
                className="p-3 font-semibold cursor-pointer"
                onClick={() => handleSort("address")}
              >
                Dirección{arrow("address")}
              </th>

              <th
                className="p-3 font-semibold cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Estado{arrow("status")}
              </th>

              <th className="p-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {data.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-100 transition">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.taxId}</td>
                <td className="p-3">{c.address}</td>
                <td className="p-3">{c.status ? "Activo" : "Inactivo"}</td>

                <td className="p-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/customers/modify/${c.id}/true`)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                  >
                    Consultar
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/customers/modify/${c.id}/false`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                  >
                    Modificar
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCustomer(c.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListCustomers;
