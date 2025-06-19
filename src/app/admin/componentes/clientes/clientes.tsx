import React, { useState } from "react";
import Header from "../header/header";
import Modal from "./modal/modal";
import Tables from "./tables/tables";
import "./clientes.css";

interface ClientesContentProps {
  adminName: string;
  selectedOption: string;
  projectImage: string;
  handleLogout: () => void;
}

export default function ClientesContent({
  adminName,
  selectedOption,
  projectImage,
  handleLogout,
}: ClientesContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<number | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="main-content">
      <Header
        adminName={adminName}
        selectedOption={selectedOption}
        projectImage={projectImage}
        handleLogout={handleLogout}
      />
      <button onClick={handleOpenModal} className="open-modal-button">
        Buscar Cliente
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectCliente={setSelectedCliente}
      />
      {selectedCliente && <Tables clienteId={selectedCliente} />}
    </div>
  );
}