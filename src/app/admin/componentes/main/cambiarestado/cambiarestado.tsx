import React, { useState } from "react";

interface CambiarEstadoProps {
  ventaId: string;
  onEstadoActualizado: () => void;
}

export default function CambiarEstado({ ventaId, onEstadoActualizado }: CambiarEstadoProps) {
  const [loading, setLoading] = useState(false);

  const actualizarEstado = async (nuevoEstado: "entregado" | "cancelado") => {
    let reponerStock = false;
    if (nuevoEstado === "cancelado") {
      reponerStock = window.confirm("¿Deseas reponer el stock de los productos de esta venta?");
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/ventas/${ventaId}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nuevoEstado, reponerStock }),
      });
      if (res.ok) {
        alert("Estado actualizado correctamente");
        onEstadoActualizado();
      } else {
        const data = await res.json();
        alert(data.message || "Error al actualizar el estado");
      }
    } catch {
      alert("Error de red al actualizar el estado");
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <button
        className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
        disabled={loading}
        onClick={() => actualizarEstado("entregado")}
      >
        Marcar como Entregado
      </button>
      <button
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        disabled={loading}
        onClick={() => actualizarEstado("cancelado")}
      >
        Cancelar Venta
      </button>
    </div>
  );
}
