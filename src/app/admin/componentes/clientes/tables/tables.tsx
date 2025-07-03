import React, { useEffect, useState } from "react";
import "./tables.css";

interface TablesProps {
  clienteId: number;
}

interface Venta {
  _id: string;
  createdAt: string;
  nfac: string;
  totalVenta: number;
  tipoPago?: string;
  estado?: string;
  items: { producto: string; precio: number; cantidad: number; nombre?: string }[];
}

export default function Tables({ clienteId }: TablesProps) {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [selectedVenta, setSelectedVenta] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clienteId) return;
    setLoading(true);
    // Usa el endpoint que retorna los nombres de productos en los items
    fetch(`/api/clientes/historial?clienteId=${clienteId}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Venta[]) => setVentas(data))
      .finally(() => setLoading(false));
  }, [clienteId]);

  const detalleVenta = selectedVenta
    ? ventas.find((v) => v._id === selectedVenta)?.items || []
    : [];

  return (
    <div className="tables-container">
      {/* Tabla de historial de ventas */}
      <div className="table historial">
        <h3>Historial de Ventas</h3>
        <div className="table-scroll">
          {loading ? (
            <div className="text-gray-500 text-sm my-2">Cargando...</div>
          ) : ventas.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Método</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr
                    key={venta._id}
                    onClick={() => setSelectedVenta(venta._id)}
                    className={
                      (selectedVenta === venta._id ? "selected " : "") +
                      "clickable-row"
                    }
                  >
                    <td>{new Date(venta.createdAt).toLocaleDateString()}</td>
                    <td>S/ {venta.totalVenta.toFixed(2)}</td>
                    <td>{venta.tipoPago || "-"}</td>
                    <td>{venta.estado || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay historial de ventas para este cliente.</p>
          )}
        </div>
      </div>

      {/* Tabla de detalles de la venta */}
      <div className="table detalles">
        <h3>Detalles de la Venta</h3>
        <div className="table-scroll">
          {detalleVenta.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {detalleVenta.map((detalle, idx) => (
                  <tr key={idx}>
                    <td>{detalle.nombre || detalle.producto}</td>
                    <td>S/ {detalle.precio}</td>
                    <td>{detalle.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Seleccione una venta para ver los detalles.</p>
          )}
        </div>
      </div>
    </div>
  );
}
