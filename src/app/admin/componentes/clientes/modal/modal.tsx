import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCliente: (clienteId: number) => void;
}

interface Cliente {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  email: string;
}

export default function Modal({ isOpen, onClose, onSelectCliente }: ModalProps) {
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar clientes por nombre, apellido, dni o email
  const handleSearch = async (value: string) => {
    setSearch(value);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/clientespg`);
      if (!res.ok) throw new Error("Error al buscar clientes");
      const data: Cliente[] = await res.json();
      const filtered = data.filter((cliente) =>
        (cliente.dni && cliente.dni.toLowerCase().includes(value.toLowerCase())) ||
        (cliente.nombres && cliente.nombres.toLowerCase().includes(value.toLowerCase())) ||
        (cliente.apellidos && cliente.apellidos.toLowerCase().includes(value.toLowerCase())) ||
        (cliente.email && cliente.email.toLowerCase().includes(value.toLowerCase()))
      );
      setClientes(filtered);
    } catch {
      setError("No se pudo buscar clientes");
      setClientes([]);
    }
    setLoading(false);
  };

  // Buscar automáticamente al escribir
  React.useEffect(() => {
    if (search.length === 0) {
      setClientes([]);
      setError(null);
      return;
    }
    const timeout = setTimeout(() => {
      handleSearch(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-8 rounded-lg w-[90%] max-w-[400px] max-h-[480px] text-center shadow-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-green-900"
        >
          X
        </button>
        <h3 className="text-2xl text-green-800 mb-4 font-bold">Buscar Cliente</h3>
        <input
          type="text"
          placeholder="Buscar por DNI, nombres, apellidos o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        {loading && <div className="text-gray-500 text-sm my-2">Buscando...</div>}
        {error && <div className="text-red-500 text-sm my-2">{error}</div>}
        <ul className="list-none p-0 m-0 text-green-800 max-h-[300px] overflow-y-auto">
          {clientes.map((cliente) => (
            <li
              key={cliente.id}
              onClick={() => {
                onSelectCliente(cliente.id);
                onClose();
              }}
              className="p-2 border border-gray-300 mb-2 rounded cursor-pointer bg-white hover:bg-green-800 hover:text-white transition"
            >
              <div>
                <span className="font-bold">{cliente.nombres} {cliente.apellidos}</span>
                <span className="block text-xs text-gray-600">DNI: {cliente.dni} | Email: {cliente.email}</span>
              </div>
            </li>
          ))}
        </ul>
        {search.length > 0 && !loading && clientes.length === 0 && !error && (
          <div className="text-gray-500 text-sm my-2">No se encontraron clientes.</div>
        )}
      </div>
    </div>
  );
}