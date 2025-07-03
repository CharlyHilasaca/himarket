"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../componentes/sliderbar/sliderbar";
import MainContent from "../componentes/main/main";
import LoadingSpinner from "../componentes/loading/page";
import Historial from "../componentes/historial/historial";
import Clientes from "../componentes/clientes/clientes";
import Graficos from "../componentes/graficos/graficos";
import Inventario from "../componentes/inventario/inventario";
import Productos from "../componentes/productos/productos";
import './page.css';

export default function AdminPanelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectImage, setProjectImage] = useState('');
  const [proyectoId, setProyectoId] = useState<string | number>(""); // <--- Añadido
  const [selectedOption, setSelectedOption] = useState("Ventas");

  useEffect(() => {
    const fetchUserAndProject = async () => {
      try {
        const resUser = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
        });

        if (!resUser.ok) {
          throw new Error("No autorizado");
        }

        const userData = await resUser.json();
        setAdminName(userData.username);

        const resProject = await fetch("/api/userp", {
          method: "GET",
          credentials: "include",
        });

        if (!resUser.ok) {
          if (resUser.status === 401) {
            console.error("Usuario no autenticado");
            router.push("/admin");
          } else {
            throw new Error("No autorizado");
          }
        }

        const projectData = await resProject.json();
        setProjectName(projectData.nombre);
        setProjectImage(projectData.imagen_url);
        setProyectoId(projectData.proyecto_id); // <--- Añadido

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        router.push("/admin");
      }
    };

    fetchUserAndProject();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-panel">
      <Sidebar
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        projectName={projectName} />
      {selectedOption === "Ventas" && (
        <MainContent
          adminName={adminName}
          selectedOption={selectedOption}
          projectImage={projectImage}
          handleLogout={handleLogout}
        />
      )}
      {selectedOption === "Historiales" && (
        <Historial
          selectedOption={selectedOption}
          adminName={adminName}
          projectImage={projectImage}
          handleLogout={handleLogout}
        />
      )}
      {selectedOption === "Clientes" && (
      <Clientes
        selectedOption={selectedOption}
        adminName={adminName}
        projectImage={projectImage}
        handleLogout={handleLogout}
        />
      )}
      {selectedOption === "Gráficos" && (
      <Graficos
        selectedOption={selectedOption}
        adminName={adminName}
        projectImage={projectImage}
        handleLogout={handleLogout}
      />
      )}
      {selectedOption === "Inventario" && (
        <Inventario
          selectedOption={selectedOption}
          adminName={adminName}
          projectImage={projectImage}
          handleLogout={handleLogout}
          proyectoId={proyectoId} // <--- Añadido
        />
      )}
      {selectedOption === "Productos" && (
        <Productos
          adminName={adminName}
          selectedOption={selectedOption}
          projectImage={projectImage}
          handleLogout={handleLogout}
        />
      )}
    </div>
  );
}