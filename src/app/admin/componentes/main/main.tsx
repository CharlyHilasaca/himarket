import React, { useState } from "react";
import Header from "../header/header";
import Actions from "./actions/actions";
import Tables from "./tables/tables";
import Venta from "./venta/venta";
import AddStock from "./addstock/addstock";
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
  const [addStockOpen, setAddStockOpen] = useState(false);

  return (
    <div className="main-content">
      {!ventaOpen && !addStockOpen && (
        <>
          <Header
            adminName={adminName}
            selectedOption={selectedOption}
            projectImage={projectImage}
            handleLogout={handleLogout}
          />
          <Actions
            onVentaClick={() => setVentaOpen(true)}
            onAddStockClick={() => setAddStockOpen(true)}
          />
          <Tables />
        </>
      )}
      {ventaOpen && (
        <div className="venta-overlay-full">
          <Venta onClose={() => setVentaOpen(false)} />
        </div>
      )}
      {addStockOpen && (
        <div className="venta-overlay-full">
          <AddStock onClose={() => setAddStockOpen(false)} />
        </div>
      )}
    </div>
  );
}