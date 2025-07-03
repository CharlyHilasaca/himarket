import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./circulares.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Circulares({
  ganancias,
  masVendidos
}: {
  ganancias: { efectivo: number; transferencia: number };
  masVendidos: { name: string; cantidadVendida: number }[];
}) {
  const dataGanancias = {
    labels: ["Efectivo", "Transferencia"],
    datasets: [
      {
        data: [ganancias.efectivo, ganancias.transferencia],
        backgroundColor: ["#2D8F2F", "#256D25"],
      },
    ],
  };

  const dataProductos = {
    labels: masVendidos.map(p => p.name),
    datasets: [
      {
        data: masVendidos.map(p => p.cantidadVendida),
        backgroundColor: ["#2D8F2F", "#256D25", "#94FF92", "#A3D9A5"],
      },
    ],
  };

  return (
    <div className="circulares-container">
      <div className="grafico">
        <h3>Distribución de Ganancias</h3>
        <Doughnut data={dataGanancias} />
      </div>
      <div className="grafico">
        <h3>Productos Más Vendidos</h3>
        <Doughnut data={dataProductos} />
      </div>
    </div>
  );
}