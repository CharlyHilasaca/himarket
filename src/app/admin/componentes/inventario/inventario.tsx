import React from "react";
import Header from "../header/header";
import Etiquetas from "./etiquetas/etiquetas";

interface InventarioProps {
  adminName: string;
  selectedOption: string;
  projectImage: string;
  handleLogout: () => void;
  proyectoId: string | number; // Asegúrate de pasar este prop desde el panel principal
}

export default function Inventario({
  adminName,
  selectedOption,
  projectImage,
  handleLogout,
  proyectoId, // <-- Añade este prop
}: InventarioProps) {
  return (
    <div className="main-content">
      <Header
        adminName={adminName}
        selectedOption={selectedOption}
        projectImage={projectImage}
        handleLogout={handleLogout}
      />
      <Etiquetas proyectoId={proyectoId} />
    </div>
  );
}