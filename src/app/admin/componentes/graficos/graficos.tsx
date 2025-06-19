import React from "react";
import Header from "../header/header";
import Barras from "./barras/barras";
import Tendencias from "./tendencias/tendencias";
import Circulares from "./circulares/circulares";
import "./circulares/circulares.css";

interface GraficosContentProps {
  adminName: string;
  selectedOption: string;
  projectImage: string;
  handleLogout: () => void;
}

export default function GraficosContent({
  adminName,
  selectedOption,
  projectImage,
  handleLogout,
}: GraficosContentProps) {
  return (
    <div className="main-content">
      <Header
        adminName={adminName}
        selectedOption={selectedOption}
        projectImage={projectImage}
        handleLogout={handleLogout}
      />
      <div className="graficos-layout">
        {/* Contenedor para las tablas */}
        <div className="tablas-container">
          <Barras />
          <Tendencias />
        </div>

        {/* Contenedor para los gráficos circulares */}
        <div className="circulares-container">
          <Circulares />
        </div>
      </div>
    </div>
  );
}