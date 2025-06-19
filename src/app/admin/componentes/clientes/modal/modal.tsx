import React, { useState } from "react";
import "./modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCliente: (clienteId: number) => void;
}

const clientes = [
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "María López" },
  { id: 3, nombre: "Carlos Gómez" },
];

export default function Modal({ isOpen, onClose, onSelectCliente }: ModalProps) {
  const [search, setSearch] = useState("");

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(search.toLowerCase())
  );

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
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <ul className="clientes-list">
          {filteredClientes.map((cliente) => (
            <li
              key={cliente.id}
              onClick={() => {
                onSelectCliente(cliente.id);
                onClose();
              }}
              className="cliente-item"
            >
              {cliente.nombre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}