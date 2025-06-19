"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sliderbar from "../componentes/sliderbar/sliderbar";
import Header from "../componentes/header/header";
import Proyectos from "../componentes/proyectos/proyectos";
import './page.css';
import Catalogo from "../componentes/catalogo/catalogo"; // <--- Agrega esta línea

export default function DevPanelPage() {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState<string>("Proyectos");
    const [projectName, setProjectName] = useState<string>("");

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const res = await fetch("/api/dev", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("No autorizado");
                }

                const data = await res.json();
                setProjectName(data.nombre);
            } catch (error) {
                console.error("Error al obtener datos del proyecto:", error);
                router.push("/dev");
            }
        };

        fetchProjectData();
    }, [router]);

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/dev/logout", {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {
                router.push("/dev");
            } else {
                console.error("Error al cerrar sesión");
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <div className="panel-layout">
            <Sliderbar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <Header
                projectName={projectName}
                selectedOption={selectedOption}
                handleLogout={handleLogout}
            />      <main className="panel-content">
                {selectedOption === "Proyectos" && <Proyectos />}
                {selectedOption === "Catalogo" && <Catalogo />}
            </main>
        </div>
    );
}