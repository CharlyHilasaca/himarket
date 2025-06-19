import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./tendencias.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Tendencias() {
  const data = {
    labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    datasets: [
      {
        label: "Producto 1",
        data: [50, 60, 70, 80, 90, 100, 110],
        borderColor: "#2D8F2F",
        backgroundColor: "#2D8F2F",
      },
      {
        label: "Producto 2",
        data: [40, 50, 60, 70, 80, 90, 100],
        borderColor: "#256D25",
        backgroundColor: "#256D25",
      },
      {
        label: "Producto 3",
        data: [30, 40, 50, 60, 70, 80, 90],
        borderColor: "#94FF92",
        backgroundColor: "#94FF92",
      },
      {
        label: "Producto 4",
        data: [20, 30, 40, 50, 60, 70, 80],
        borderColor: "#A3D9A5",
        backgroundColor: "#A3D9A5",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Tendencias de Productos Más Vendidos",
      },
    },
  };

  return (
    <div className="tendencias-container">
      <Line data={data} options={options} />
    </div>
  );
}