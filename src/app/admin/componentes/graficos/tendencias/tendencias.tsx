import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./tendencias.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Tendencias({ masVendidos }: { masVendidos: { name: string; cantidadVendida: number }[] }) {
  // Simula tendencia semanal para cada producto más vendido (puedes adaptar a tus datos reales)
  const labels = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const datasets = masVendidos.map((prod, idx) => ({
    label: prod.name,
    data: Array(7).fill(prod.cantidadVendida), // Puedes reemplazar por datos reales diarios si los tienes
    borderColor: ["#2D8F2F", "#256D25", "#94FF92", "#A3D9A5"][idx % 4],
    backgroundColor: ["#2D8F2F", "#256D25", "#94FF92", "#A3D9A5"][idx % 4],
  }));

  const data = {
    labels,
    datasets,
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