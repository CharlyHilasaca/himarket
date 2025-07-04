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
    tipoPago: "efectivo";
  }) => void;
}

export default function ModalVenta({
  isOpen,
  onClose,
  cliente,
  total,
  onVenta,
}: ModalVentaProps) {
  const [tipoPago] = useState<"efectivo">("efectivo");

  if (!isOpen) return null;

  return (
    <div className="modalventa-overlay">
      <div className="modalventa-content">
        <h2>Confirmar Venta</h2>
        <div className="modalventa-tipopago">
          <button className="active">
            Efectivo
          </button>
        </div>
        <div className="modalventa-factura">
          {cliente && (
            <>
              <p><b>Cliente:</b> {cliente.nombres} {cliente.apellidos}</p>
              <p><b>DNI:</b> {cliente.dni}</p>
              <p><b>Email:</b> {cliente.email}</p>
            </>
          )}
          <p><b>Total:</b> S/ {total.toFixed(2)}</p>
        </div>
        <div className="modalventa-actions">
          <button onClick={() => onVenta({ estado: "pendiente", tipoPago })}>
            Guardar como Pendiente
          </button>
          <button onClick={() => onVenta({ estado: "pagado", tipoPago })}>
            Guardar como Pagado
          </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}