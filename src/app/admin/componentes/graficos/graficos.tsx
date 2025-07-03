import React, { useEffect, useState } from "react";
import Header from "../header/header";
import Barras from "./barras/barras";
import Tendencias from "./tendencias/tendencias";
import Circulares from "./circulares/circulares";

interface GraficosContentProps {
  adminName: string;
  selectedOption: string;
  projectImage: string;
  handleLogout: () => void;
}

interface Venta {
  tipoPago?: string;
  totalVenta: number;
  estado?: string;
  origen?: string;
}

interface ProductoMasVendido {
  name: string;
  cantidadVendida: number;
}

export default function GraficosContent({
  adminName,
  selectedOption,
  projectImage,
  handleLogout,
}: GraficosContentProps) {
  const [ganancias, setGanancias] = useState<{ efectivo: number; transferencia: number }>({
    efectivo: 0,
    transferencia: 0,
  });
  const [masVendidos, setMasVendidos] = useState<ProductoMasVendido[]>([]);

  useEffect(() => {
    // Cargar ganancias por método de pago
    fetch("/api/ventas", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((ventas: Venta[]) => {
        let efectivo = 0,
          transferencia = 0;
        ventas.forEach((v) => {
          // Solo sumar ventas con estado "pagado", "para entrega" o "entregado"
          if (!["pagado", "para entrega", "entregado"].includes((v.estado || "").toLowerCase())) return;
          if (v.tipoPago && v.tipoPago.toLowerCase() === "efectivo") {
            efectivo += v.totalVenta;
          } else {
            // Cualquier otro método de pago (incluye mercado pago, transferencia, etc.)
            // Si es web y estado para entrega/entregado, también suma como transferencia
            transferencia += v.totalVenta;
          }
        });
        setGanancias({ efectivo, transferencia });
      });

    // Cargar productos más vendidos
    fetch("/api/productos/masvendidos", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ProductoMasVendido[]) => setMasVendidos(data));
  }, []);

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
          <Barras ganancias={ganancias} />
          <Tendencias masVendidos={masVendidos} />
        </div>
        {/* Contenedor para los gráficos circulares */}
        <div className="circulares-container">
          <Circulares ganancias={ganancias} masVendidos={masVendidos} />
        </div>
      </div>
    </div>
  );
}