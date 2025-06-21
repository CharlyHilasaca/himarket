import React, { useState } from "react";
import "./modalventa.css";

interface ModalVentaProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: { nombres: string; apellidos: string; email: string; dni: string } | null;
  total: number;
  proyectoid: string;
  carrito: {
    _id: string;
    name: string;
    marca?: string;
    salePrice: number;
    unidad: string;
    stock: number;
    cantidad: number;
  }[];
  onVenta: (venta: {
    estado: "pendiente" | "pagado";
    tipoPago: "efectivo" | "yape";
    nfac: string;
  }) => void;
}

function generarNfac(proyectoid: string) {
  // Ejemplo simple: T<proyectoid>-<timestamp>
  return `T${proyectoid}-${Date.now()}`;
}

export default function ModalVenta({
  isOpen,
  onClose,
  cliente,
  total,
  proyectoid,
  carrito,
  onVenta,
}: ModalVentaProps) {
  const [tipoPago, setTipoPago] = useState<"efectivo" | "yape">("efectivo");
  const nfac = generarNfac(proyectoid);

  if (!isOpen) return null;

  return (
    <div className="modalventa-overlay">
      <div className="modalventa-content">
        <h2>Confirmar Venta</h2>
        <div className="modalventa-tipopago">
          <button
            className={tipoPago === "efectivo" ? "active" : ""}
            onClick={() => setTipoPago("efectivo")}
          >
            Efectivo
          </button>
          <button
            className={tipoPago === "yape" ? "active" : ""}
            onClick={() => setTipoPago("yape")}
          >
            Yape
          </button>
        </div>
        <div className="modalventa-factura">
          <p><b>N° Factura:</b> {nfac}</p>
          {cliente && (
            <>
              <p><b>Cliente:</b> {cliente.nombres} {cliente.apellidos}</p>
              <p><b>DNI:</b> {cliente.dni}</p>
              <p><b>Email:</b> {cliente.email}</p>
            </>
          )}
          <p><b>Total:</b> S/ {total.toFixed(2)}</p>
        </div>
        {/* Puedes agregar aquí el formulario específico para Yape si lo necesitas */}
        <div className="modalventa-actions">
          <button onClick={() => onVenta({ estado: "pendiente", tipoPago, nfac })}>
            Guardar como Pendiente
          </button>
          <button onClick={() => onVenta({ estado: "pagado", tipoPago, nfac })}>
            Guardar como Pagado
          </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
