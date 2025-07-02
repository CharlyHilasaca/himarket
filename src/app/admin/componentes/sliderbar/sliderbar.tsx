import React from "react";
import './sliderbar.css';
import Image from 'next/image';

interface SidebarProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  projectName: string;
}

export default function Sidebar({ selectedOption, setSelectedOption, projectName }: SidebarProps) {
  const options = [
    { label: "Ventas", icon: <Image  src="/ventas.webp" alt="Ventas" width={200} height={200} className="sidebar-icon" /> },
    { label: "Historiales", icon: <Image  src="/historiales.webp" alt="Historiales" width={200} height={200} className="sidebar-icon" /> },
    { label: "Clientes", icon: <Image  src="/clientes.webp" alt="Clientes" width={200} height={200} className="sidebar-icon" /> },
    { label: "Gráficos", icon: <Image  src="/graficos.webp" alt="Gráficos" width={200} height={200} className="sidebar-icon" /> },
    { label: "Inventario", icon: <Image  src="/inventario.webp" alt="Inventario" width={200} height={200} className="sidebar-icon" /> },
    { label: "Productos", icon: <Image  src="/productos.webp" alt="Productos" width={200} height={200} className="sidebar-icon" /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-admin">
        <Image src="/admin.png" alt="Administrador" width={50} height={50} className="sidebar-admin-icon" />
        <div className="sidebar-admin-text">
          <h2>{projectName}</h2>
          <p>Control preciso, decisiones inteligentes</p>
        </div>
      </div>
      <nav>
        <ul>
          {options.map((option) => (
            <li
              key={option.label}
              className={selectedOption === option.label ? "selected" : ""}
              onClick={() => setSelectedOption(option.label)}
            >
              <span className="icon">{option.icon}</span> {option.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}