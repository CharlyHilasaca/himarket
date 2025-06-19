import React from "react";
import './header.css';

interface HeaderProps {
  projectName: string;
  selectedOption: string;
  handleLogout: () => void;
}

export default function Header({ projectName, selectedOption, handleLogout }: HeaderProps) {
  return (
    <header className="header-container">
      <div className="header-info">
        <h1>{projectName}</h1>
        <h2 className="header-selected-option">{selectedOption}</h2> {/* Mostrar la opción seleccionada */}
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </header>
  );
}