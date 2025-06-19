import React from "react";
import Header from "../header/header";
import Etiquetas from "./etiquetas/etiquetas";

interface ProductosContentProps {
  adminName: string;
  selectedOption: string;
  projectImage: string;
  handleLogout: () => void;
}

export default function ProductosContent({
  adminName,
  selectedOption,
  projectImage,
  handleLogout,
}: ProductosContentProps) {
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