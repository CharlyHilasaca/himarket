import React, { useState } from "react";
import "./modal.css";

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
      // Puedes ajustar el endpoint según tu backend
      const res = await fetch(`/api/clientespg`);
      if (!res.ok) throw new Error("Error al buscar clientes");
      const data: Cliente[] = await res.json();
      // Filtra en frontend por dni, nombres, apellidos o email
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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="close-modal-button">
          X
        </button>
        <h3 className="title-modal">Buscar Cliente</h3>
        <input
          type="text"
          placeholder="Buscar por DNI, nombres, apellidos o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {loading && <div className="text-gray-500 text-sm my-2">Buscando...</div>}
        {error && <div className="text-red-500 text-sm my-2">{error}</div>}
        <ul className="clientes-list">
          {clientes.map((cliente) => (
            <li
              key={cliente.id}
              onClick={() => {
                onSelectCliente(cliente.id);
                onClose();
              }}
              className="cliente-item"
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