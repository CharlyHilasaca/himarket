import React, { useEffect, useState } from "react";

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
    fetch(`/api/clientespg/historialcompras?clienteId=${clienteId}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Venta[]) => setVentas(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [clienteId]);

  const detalleVenta = selectedVenta
    ? ventas.find((v) => v._id === selectedVenta)?.items || []
    : [];

  return (
    <div className="flex gap-8 flex-wrap">
      {/* Tabla de historial de ventas */}
      <div className="flex-1 min-w-[320px] max-w-[500px] bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2 text-green-800">Historial de Ventas</h3>
        <div className="max-h-[420px] overflow-y-auto rounded-lg border border-gray-200">
          {loading ? (
            <div className="text-gray-500 text-sm my-2">Cargando...</div>
          ) : ventas.length > 0 ? (
            <table className="w-full border-collapse text-black">
              <thead>
                <tr>
                  <th className="bg-green-700 text-white p-2">Fecha</th>
                  <th className="bg-green-700 text-white p-2">Total</th>
                  <th className="bg-green-700 text-white p-2">Método</th>
                  <th className="bg-green-700 text-white p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr
                    key={venta._id}
                    onClick={() => setSelectedVenta(venta._id)}
                    className={`cursor-pointer ${selectedVenta === venta._id ? "bg-green-100 font-bold" : "hover:bg-green-50"}`}
                  >
                    <td className="border p-2 text-black">{new Date(venta.createdAt).toLocaleDateString()}</td>
                    <td className="border p-2 text-black">S/ {venta.totalVenta.toFixed(2)}</td>
                    <td className="border p-2 text-black">{venta.tipoPago || "-"}</td>
                    <td className="border p-2 text-black">{venta.estado || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-gray-500">No hay historial de ventas para este cliente.</p>
          )}
        </div>
      </div>

      {/* Tabla de detalles de la venta */}
      <div className="flex-1 min-w-[320px] max-w-[500px] bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2 text-green-800">Detalles de la Venta</h3>
        <div className="max-h-[420px] overflow-y-auto rounded-lg border border-gray-200">
          {detalleVenta.length > 0 ? (
            <table className="w-full border-collapse text-black">
              <thead>
                <tr>
                  <th className="bg-green-700 text-white p-2">Producto</th>
                  <th className="bg-green-700 text-white p-2">Precio</th>
                  <th className="bg-green-700 text-white p-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {detalleVenta.map((detalle, idx) => (
                  <tr key={idx}>
                    <td className="border p-2 text-black">{detalle.nombre || detalle.producto}</td>
                    <td className="border p-2 text-black">S/ {detalle.precio}</td>
                    <td className="border p-2 text-black">{detalle.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-gray-500">Seleccione una venta para ver los detalles.</p>
          )}
        </div>
      </div>
    </div>
  );
}