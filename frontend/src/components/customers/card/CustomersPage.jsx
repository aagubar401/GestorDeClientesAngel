import ListCustomers from "../ListCustomers";
import { Link } from "react-router-dom";
import useGetAllCustomers from "../hooks/useGetAllCustomers";

const CustomersPage = () => {
  const {
    data,
    loading,
    error,
    textoBusqueda,
    setTextoBusqueda,

    handleSort,
    sortColumn,
    sortDirection,

    removeCustomer,
  } = useGetAllCustomers();

  return (
    <div className="w-full h-full bg-gray-100 text-gray-900 flex">
      <div className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Clientes
          </h1>

          <input
            type="text"
            placeholder="Buscar clientes por cualquier campo..."
            value={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
          />

          <Link
            to="/customers/modify"
            className="px-4 py-2 bg-buttons hover:bg-buttons-hover transition text-black rounded shadow"
          >
            Crear cliente
          </Link>
        </div>

        <ListCustomers
          data={data}
          loading={loading}
          error={error}
          handleSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          removeCustomer={removeCustomer}
        />
      </div>
    </div>
  );
};

export default CustomersPage;
