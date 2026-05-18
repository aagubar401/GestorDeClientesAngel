import useHandleCustomerCard from "./hooks/useHandleCustomerCard";

const CustomerCard = () => {
  const {
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
      tableMode
    },
    handleChange,
    handleSubmit,
    setTableModeFunction,
  } = useHandleCustomerCard();


  return (
    <div className="w-full bg-white p-8 rounded-xl shadow border border-gray-300 h-full overflow-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        {consultMode
          ? "📄 Datos del Cliente"
          : createMode
            ? "➕ Crear Cliente"
            : "✏️ Modificar Cliente"}
      </h2>

      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded mb-3">{error}</div>
      )}

      {message && (
        <div className="p-3 bg-green-100 text-green-800 rounded mb-3">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
        {/* Nombre */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="font-medium text-gray-700">Nombre:</label>
          <input
            className="input col-span-2"
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            required
            disabled={consultMode}
          />
        </div>

        {/* DNI */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="font-medium text-gray-700">DNI:</label>
          <input
            className="input col-span-2"
            type="text"
            name="taxId"
            value={form.taxId || ""}
            onChange={handleChange}
            disabled={consultMode}
          />
        </div>

        {/* Email */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="font-medium text-gray-700">Correo:</label>
          <input
            className="input col-span-2"
            type="email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            disabled={consultMode}
          />
        </div>

        {/* Teléfono */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="font-medium text-gray-700">Teléfono:</label>
          <input
            className="input col-span-2"
            type="text"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            disabled={consultMode}
          />
        </div>

        {/* Dirección */}
        <div className="grid grid-cols-3 items-center gap-4">
          <label className="font-medium text-gray-700">Dirección:</label>
          <input
            className="input col-span-2"
            type="text"
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            disabled={consultMode}
          />
        </div>

        {/* Estado */}
        {(modifyMode || consultMode) && (
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="font-medium text-gray-700">Estado:</label>
            <select
              name="status"
              value={form.status ? "true" : "false"}
              onChange={handleChange}
              disabled={consultMode || createMode}
              className="input col-span-2"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        )}

        {/* Botones */}
        {(modifyMode || createMode) && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
            >
              Guardar
            </button>

            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              Cancelar
            </button>
          </div>
        )}

        {consultMode && !tableMode && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              Volver al listado
            </button>
            <button
              type="button"
              onClick={() => navigate(`/customers/modify/${id}/false`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded transition"
            >
              Modificar
            </button>
          </div>
        )}

        {consultMode && tableMode && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              Volver al listado
            </button>
            <button
              type="button"
              onClick={() => navigate(`/customers/modify/${id}/false`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded transition"
            >
              Modificar
            </button>
          </div>
        )}

        {consultMode && (
          <div className="grid grid-cols-1 gap-3 text-gray-800">
            <p>
              <span className="font-semibold">Creado:</span>{" "}
              {new Date(form.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Actualizado:</span>{" "}
              {new Date(form.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
        {consultMode && auditHistory.length > 0 && tableMode && (
          <div className="mt-8 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Historial de cambios</h3>

              <button
                type="button"
                onClick={() => setTableModeFunction(false)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded transition"
              >
                Ver registro en lista
              </button>
            </div>
          </div>
        )}

        {consultMode && auditHistory.length > 0 && !tableMode && (
          <div className="mt-8 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Historial de cambios</h3>

              <button
                type="button"
                onClick={() => setTableModeFunction(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded transition"
              >
                Ver registro en tabla
              </button>
            </div>
          </div>
        )}

        {consultMode && auditHistory.length > 0 && !tableMode && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg border">
            {auditHistory.map((entry, index) => (
              <div key={index} className="mb-4 pb-4 border-b last:border-none">
                <p className="font-medium text-gray-700">
                  Fecha: {new Date(entry.date).toLocaleString("es-ES")}
                </p>

                {entry.diffs.length === 0 ? (
                  <p className="text-gray-600 italic mt-1">
                    No se detectaron cambios en esta modificación.
                  </p>
                ) : (
                  <ul className="mt-2 ml-4 list-disc text-gray-800">
                    {entry.diffs.map((d, i) => (
                      <li key={i}>
                        <span className="font-semibold capitalize">
                          {d.field}:
                        </span>{" "}
                        {d.oldValue || "-"} {"-->"} {d.newValue || "-"}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {consultMode && auditHistory.length > 0 && tableMode && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg border">
            {auditHistory.map((entry, index) => (
              <div key={index} className="mb-4 pb-4 border-b last:border-none">
                <p className="font-medium text-gray-700">
                  Fecha: {new Date(entry.date).toLocaleString("es-ES")}
                </p>

                {entry.diffs.length === 0 ? (
                  <p className="text-gray-600 italic mt-1">
                    No se detectaron cambios en esta modificación.
                  </p>
                ) : (
                  <table className="w-full mt-2 text-gray-800">
                    <thead>
                      <tr>
                        <th>Campo</th>
                        <th>Valor Anterior</th>
                        <th>Valor Nuevo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry.diffs.map((d, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 font-semibold capitalize">
                            {d.field}:
                          </td>
                          <td className="px-4 py-2">{d.oldValue || "-"}</td>
                          <td className="px-4 py-2">{d.newValue || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default CustomerCard;
