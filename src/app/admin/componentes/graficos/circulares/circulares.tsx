import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./circulares.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Circulares() {
  const dataGanancias = {
    labels: ["Efectivo", "Transferencia"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["#2D8F2F", "#256D25"],
      },
    ],
  };

  const dataProductos = {
    labels: ["Producto 1", "Producto 2", "Producto 3", "Producto 4"],
    datasets: [
      {
        data: [30, 25, 25, 20],
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
        <h3>Distribución de Productos Más Vendidos</h3>
        <Doughnut data={dataProductos} />
      </div>
    </div>
  );
}