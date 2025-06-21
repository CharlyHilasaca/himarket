import React, { useState } from "react";
import Header from "../header/header";
import Actions from "./actions/actions";
import Tables from "./tables/tables";
import Venta from "./venta/venta";
import "./main.css"; // Importa el CSS aquí

interface MainContentProps {
  adminName: string;
  selectedOption: string;
  projectImage: string;
  handleLogout: () => void;
}

export default function MainContent({
  adminName,
  selectedOption,
  projectImage,
  handleLogout,
}: MainContentProps) {
  const [ventaOpen, setVentaOpen] = useState(false);

  return (
    <div className="main-content">
      {!ventaOpen && (
        <>
          <Header
            adminName={adminName}
            selectedOption={selectedOption}
            projectImage={projectImage}
            handleLogout={handleLogout}
          />
          <Actions onVentaClick={() => setVentaOpen(true)} />
          <Tables />
        </>
      )}
      {ventaOpen && (
        <div className="venta-overlay-full">
          <Venta onClose={() => setVentaOpen(false)} />
        </div>
      )}
    </div>
  );
}