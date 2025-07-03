import React, { useState, useEffect } from "react";
import Header from "../header/header";
import Modal from "./modal/modal";
import Tables from "./tables/tables";

interface ClientesContentProps {
  adminName: string;
  selectedOption: string;
  projectImage: string;
  handleLogout: () => void;
}

interface ClienteInfo {
  id: number;
  nombres: string;
  apellidos: string;
  dni?: string;
  email?: string;
}

export default function ClientesContent({
  adminName,
  selectedOption,
  projectImage,
  handleLogout,
}: ClientesContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<number | null>(null);
  const [clienteInfo, setClienteInfo] = useState<ClienteInfo | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Cuando seleccionas un cliente, busca su info para mostrar el nombre
  useEffect(() => {
    if (!selectedCliente) {
      setClienteInfo(null);
      return;
    }
    // Busca el cliente en la API (ajusta el endpoint si es necesario)
    fetch(`/api/clientespg`)
      .then((res) => (res.ok ? res.json() : []))
      .then((clientes: ClienteInfo[]) => {
        const found = clientes.find((c) => c.id === selectedCliente);
        setClienteInfo(found || null);
      })
      .catch(() => setClienteInfo(null));
  }, [selectedCliente]);

  return (
    <div className="main-content">
      <Header
        adminName={adminName}
        selectedOption={selectedOption}
        projectImage={projectImage}
        handleLogout={handleLogout}
      />
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleOpenModal}
          className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900 transition font-semibold"
        >
          Buscar Cliente
        </button>
        {clienteInfo && (
          <span className="text-green-900 font-semibold text-base">
            {clienteInfo.nombres} {clienteInfo.apellidos}
            {clienteInfo.dni && (
              <span className="ml-2 text-gray-600 text-sm">
                DNI: {clienteInfo.dni}
              </span>
            )}
            {clienteInfo.email && (
              <span className="ml-2 text-gray-600 text-sm">
                Email: {clienteInfo.email}
              </span>
            )}
          </span>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectCliente={setSelectedCliente}
      />
      {selectedCliente && <Tables clienteId={selectedCliente} />}
    </div>
  );
}