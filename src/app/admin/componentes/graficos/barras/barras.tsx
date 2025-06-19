import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./barras.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Barras() {
  const data = {
    labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    datasets: [
      {
        label: "Efectivo",
        data: [500, 700, 800, 600, 900, 1000, 1200],
        backgroundColor: "#2D8F2F",
      },
      {
        label: "Transferencia",
        data: [300, 400, 500, 300, 600, 700, 800],
        backgroundColor: "#256D25",
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
        text: "Ganancias de la Semana",
      },
    },
  };

  return (
    <div className="barras-container">
      <Bar data={data} options={options} />
    </div>
  );
}