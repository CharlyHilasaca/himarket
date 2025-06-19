import React, { useState } from "react";
import "./tables.css";

interface TablesProps {
  clienteId: number;
}

interface Venta {
  id: number;
  fecha: string;
  total: string;
  metodo: string;
}

interface Detalle {
  producto: string;
  precio: string;
}

interface ClienteData {
  ventas: Venta[];
  detalles: {
    [ventaId: number]: Detalle[];
  };
}

const data: { [clienteId: number]: ClienteData } = {
  1: {
    ventas: [
      { id: 1, fecha: "2024-06-01", total: "$150", metodo: "Efectivo" },
      { id: 2, fecha: "2024-06-02", total: "$100", metodo: "Tarjeta" },
    ],
    detalles: {
      1: [
        { producto: "Producto-01", precio: "$100" },
        { producto: "Producto-02", precio: "$50" },
      ],
      2: [{ producto: "Producto-03", precio: "$100" }],
    },
  },
  2: {
    ventas: [
      { id: 3, fecha: "2024-06-03", total: "$200", metodo: "Transferencia" },
    ],
    detalles: {
      3: [
        { producto: "Producto-04", precio: "$200" },
      ],
    },
  },
  3: {
    ventas: [],
    detalles: {},
  },
};

export default function Tables({ clienteId }: TablesProps) {
  const [selectedVenta, setSelectedVenta] = useState<number | null>(null);

  const historialVentas = data[clienteId]?.ventas || [];
  const detalleVenta = selectedVenta ? data[clienteId]?.detalles[selectedVenta] || [] : [];

  return (
    <div className="tables-container">
      {/* Tabla de historial de ventas */}
      <div className="table historial">
        <h3>Historial de Ventas</h3>
        {historialVentas.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Total</th>
                <th>Método</th>
              </tr>
            </thead>
            <tbody>
              {historialVentas.map((venta) => (
                <tr
                  key={venta.id}
                  onClick={() => setSelectedVenta(venta.id)}
                  className={selectedVenta === venta.id ? "selected" : ""}
                >
                  <td>{venta.fecha}</td>
                  <td>{venta.total}</td>
                  <td>{venta.metodo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay historial de ventas para este cliente.</p>
        )}
      </div>

      {/* Tabla de detalles de la venta */}
      <div className="table detalles">
        <h3>Detalles de la Venta</h3>
        {detalleVenta.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {detalleVenta.map((detalle, idx) => (
                <tr key={idx}>
                  <td>{detalle.producto}</td>
                  <td>{detalle.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Seleccione una venta para ver los detalles.</p>
        )}
      </div>
    </div>
  );
}
