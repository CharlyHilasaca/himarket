"use client";
import { useEffect } from "react";
import PagoEstado from "../componentes/pagos/PagoEstado";

export default function PagoExitosoPage() {
  useEffect(() => {
    // Limpia el carrito del localStorage al llegar a esta página
    localStorage.removeItem("carrito");
    window.dispatchEvent(new Event("carrito-limpiado"));

    // Obtiene el email del usuario autenticado usando el token de sesión
    fetch("/api/clientes/customerData", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const email = data?.email;
        if (email) {
          // Llama al backend para limpiar el carrito y crear la venta (solo para pruebas)
          fetch("/api/pagos/checkoutpro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pagoExitoso: true, email }),
            credentials: "include",
          });

          // Actualiza el carrito del cliente en el backend (lo deja vacío)
          fetch("/api/carrito", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ productos: [], total: 0 }),
          });
        }
      });
  }, []);

  return <PagoEstado />;
}
