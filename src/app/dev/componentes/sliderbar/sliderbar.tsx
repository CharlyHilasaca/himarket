import React from "react";
import './sliderbar.css';

interface SidebarProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

export default function Sliderbar({ selectedOption, setSelectedOption }: SidebarProps) {
  const options = [
    { label: "Proyectos"},
    { label: "Catalogo"},
    { label: "Configuración"},
  ];

  return (
    <aside className="sliderbar-container">
      <div className="sliderbar-header">
        <h2>Panel Dev</h2>
      </div>
      <nav>
        <ul className="sliderbar-menu">
          {options.map((option) => (
            <li
              key={option.label}
              className={selectedOption === option.label ? "active" : ""}
              onClick={() => setSelectedOption(option.label)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}