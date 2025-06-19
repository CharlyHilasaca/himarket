import React from "react";
import Header from "../header/header";
import Etiquetas from "./etiquetas/etiquetas";

interface InventarioContentProps {
  adminName: string;
  selectedOption: string;
  projectImage: string;
  handleLogout: () => void;
}

export default function InventarioContent({
  adminName,
  selectedOption,
  projectImage,
  handleLogout,
}: InventarioContentProps) {
  return (
    <div className="main-content">
      <Header
        adminName={adminName}
        selectedOption={selectedOption}
        projectImage={projectImage}
        handleLogout={handleLogout}
      />
      <Etiquetas />
    </div>
  );
}