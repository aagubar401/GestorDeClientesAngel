import { useState, useRef, useEffect } from "react";
import ListAuditories from "./ListAuditories";
import useGetAllAuditories from "./hooks/useGetAllAuditories";

const AuditoryPage = () => {
  const {
    data,
    loading,
    error,
    handleFilterChange,
    filters,
    applyFilters,
    clearFilters,
    actionSearch,
    setActionSearch,
    textoBusqueda,
    setTextoBusqueda,

    // 🔥 IMPORTANTE: añadir estas 3 props del hook
    handleSort,
    sortColumn,
    sortDirection,
  } = useGetAllAuditories();

  const actions = [
    { value: "customer.modified", label: "Cliente modificado" },
    { value: "customer.deleted", label: "Cliente eliminado" },
    { value: "customer.created", label: "Cliente creado" },
    { value: "user.login", label: "Inicio de sesión" },
    { value: "user.logout", label: "Cierre de sesión" },
    { value: "user.register", label: "Registro de usuario" },
    { value: "user.modified", label: "Usuario modificado" },
    { value: "avatar.deleted", label: "Avatar eliminado" },
    { value: "avatar.uploaded", label: "Avatar modificado" },
  ];

  const [selectedActions, setSelectedActions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showActionList, setShowActionList] = useState(false);

  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const containerRef = useRef(null);

  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (buttonRef.current && containerRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const panelWidth = 380;
      let left = btnRect.left - containerRect.left;

      const maxLeft = containerRect.width - panelWidth - 20;
      if (left > maxLeft) left = maxLeft;

      setPanelPosition({
        top: btnRect.bottom - containerRect.top + 6,
        left,
      });
    }
  }, [showFilters]);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".action-autocomplete")) {
        setShowActionList(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!showFilters) return;

      const clickedInsidePanel = panelRef.current?.contains(e.target);
      const clickedButton = buttonRef.current?.contains(e.target);

      if (!clickedInsidePanel && !clickedButton) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white p-8 rounded-xl shadow border border-gray-300 h-full overflow-auto"
    >
      {/* 🔵 TÍTULO + BUSCADOR + BOTONES */}
      <div className="w-full flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Auditoría</h1>

        <input
          type="text"
          placeholder="Buscar en cualquier campo..."
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 flex-1 max-w-xl"
        />

        <div className="flex items-center gap-3">
          <button
            ref={buttonRef}
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {showFilters ? "Ocultar filtros" : "Filtros"}
          </button>

          <button
            onClick={() =>
              document.dispatchEvent(new Event("copy-auditory-table"))
            }
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Copiar tabla
          </button>
        </div>
      </div>

      {/* PANEL FLOTANTE */}
      <div
        ref={panelRef}
        className={`
          absolute z-50 bg-white border border-gray-300 rounded-xl shadow-xl p-6 
          transition-all duration-200 ease-out
          ${
            showFilters
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-3 pointer-events-none"
          }
        `}
        style={{
          top: panelPosition.top,
          left: panelPosition.left,
          width: "380px",
          maxWidth: "calc(100% - 20px)",
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>

        <div className="flex flex-col gap-6">
          {/* FILTRO POR ID */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">ID de usuario</label>
            <input
              type="text"
              name="userId"
              placeholder="ID del usuario"
              value={filters.userId}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* FILTRO POR EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email del usuario"
              value={filters.email}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* AUTOCOMPLETE DE ACCIONES */}
          <div className="flex flex-col gap-1 relative action-autocomplete">
            <label className="font-medium text-gray-700">Acciones</label>

            <input
              type="text"
              placeholder="Escribe para buscar..."
              value={actionSearch}
              onChange={(e) => {
                setActionSearch(e.target.value);
                setShowActionList(true);
              }}
              onFocus={() => setShowActionList(true)}
              className="border border-gray-300 rounded px-3 py-2"
            />

            {/* Chips */}
            {selectedActions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedActions.map((act) => {
                  const label =
                    actions.find((a) => a.value === act)?.label || act;
                  return (
                    <span
                      key={act}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-2"
                    >
                      {label}
                      <button
                        onClick={() =>
                          setSelectedActions(
                            selectedActions.filter((x) => x !== act),
                          )
                        }
                        className="text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Lista desplegable */}
            {showActionList && (
              <ul
                className="
                  absolute top-full left-0 w-full bg-white border border-gray-300 
                  rounded shadow-lg max-h-48 overflow-auto z-50
                "
              >
                {actions
                  .filter((a) =>
                    a.label.toLowerCase().includes(actionSearch.toLowerCase()),
                  )
                  .map((a) => (
                    <li
                      key={a.value}
                      onClick={() => {
                        if (!selectedActions.includes(a.value)) {
                          setSelectedActions([...selectedActions, a.value]);
                        }
                        setActionSearch("");
                        setShowActionList(false);
                      }}
                      className="
                        px-3 py-2 cursor-pointer hover:bg-blue-100 
                        transition text-gray-800
                      "
                    >
                      {a.label}
                    </li>
                  ))}

                {actions.filter((a) =>
                  a.label.toLowerCase().includes(actionSearch.toLowerCase()),
                ).length === 0 && (
                  <li className="px-3 py-2 text-gray-500 italic">
                    No hay coincidencias
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => {
                applyFilters({ actions: selectedActions });
                setShowFilters(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Aplicar
            </button>

            <button
              onClick={() => {
                clearFilters();
                setSelectedActions([]);
                setActionSearch("");
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <ListAuditories
        data={data}
        loading={loading}
        error={error}
        handleSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />
    </div>
  );
};

export default AuditoryPage;
