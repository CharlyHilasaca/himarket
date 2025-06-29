"use client";
import { useEffect } from "react";
import PagoEstado from "../componentes/pagos/PagoEstado";

export default function PagoExitosoPage() {
  useEffect(() => {
    // Limpia el carrito del localStorage al llegar a esta página
    localStorage.removeItem("carrito");
    window.dispatchEvent(new Event("carrito-limpiado"));
  }, []);

  return <PagoEstado />;
}
