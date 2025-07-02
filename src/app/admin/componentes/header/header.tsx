import React from "react";
import './header.css';
import Image from 'next/image';

interface HeaderProps {
  adminName: string;
  selectedOption: string;
  projectImage: string;
  handleLogout: () => void;
}

export default function Header({ adminName, selectedOption, handleLogout }: HeaderProps) {
  return (
    <header className="header">
      <div className="project-info">
        <Image
          src={/*projectImage || */"/logo1.webp"}
          alt="Imagen del proyecto"
          width={50} height={50}
          className="project-image"
        />
        <h1>{selectedOption}</h1>
      </div>
      <div className="admin-profile">
        <span>{adminName}</span>
        <Image
          src="/logout-icon.webp" // Ícono de logout
          alt="Cerrar sesión"
          width={50} height={50}
          className="logout-icon"
          onClick={handleLogout} // Enviar la solicitud de cierre de sesión al hacer clic
        />
      </div>
    </header>
  );
}