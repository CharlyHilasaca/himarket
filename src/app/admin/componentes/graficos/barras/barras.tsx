import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./barras.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Barras({ ganancias }: { ganancias: { efectivo: number; transferencia: number } }) {
  const data = {
    labels: ["Efectivo", "Transferencia"],
    datasets: [
      {
        label: "Ganancias por método de pago",
        data: [ganancias.efectivo, ganancias.transferencia],
        backgroundColor: ["#2D8F2F", "#256D25"],
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
        text: "Ganancias por Método de Pago",
      },
    },
  };

  return (
    <div className="barras-container">
      <Bar data={data} options={options} />
    </div>
  );
}