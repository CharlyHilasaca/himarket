import React, { useEffect, useState } from "react";

interface VentaHistorial {
  _id: string;
  createdAt: string;
  nfac: string;
  totalVenta: number;
  tipoPago?: string;
  estado?: string;
  cliente?: string;
  email?: string;
  celular?: string;
  apellidos?: string;
  items?: { producto: string; precio: number; cantidad: number; nombre?: string }[];
}

export default function Tables() {
  const [historialData, setHistorialData] = useState<VentaHistorial[]>([]);
  const [selectedVenta, setSelectedVenta] = useState<VentaHistorial | null>(null);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await fetch("/api/ventas", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setHistorialData(data);
        }
      } catch {
        setHistorialData([]);
      }
    };
    fetchVentas();
  }, []);

  // Filtrado por número de venta y fecha
  const filteredRows = historialData.filter((row) => {
    const searchLower = search.toLowerCase();
    const matchNfac = search ? row.nfac?.toLowerCase().includes(searchLower) : true;
    const matchNombre = search ? (row.cliente?.toLowerCase().includes(searchLower) || false) : true;
    const matchApellidos = search ? (row.apellidos?.toLowerCase().includes(searchLower) || false) : true;
    const matchSearch = search ? (matchNfac || matchNombre || matchApellidos) : true;
    const matchDate = searchDate ? row.createdAt.slice(0, 10) === searchDate : true;
    return matchSearch && matchDate;
  });

  return (
    <div className="flex gap-4 p-4">
      <div className="bg-white p-4 rounded shadow-md h-[600px] flex flex-col text-black w-1/2">
        <h3 className="text-lg font-semibold mb-4 text-green-700">Historial de Ventas</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar por Nº de venta, nombre o apellidos"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          />
          <input
            type="date"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            placeholder="Buscar por fecha"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="min-h-full w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2 text-left whitespace-nowrap w-1">Fecha</th>
                <th className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2 text-left w-auto">Ventas</th>
                <th className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2 text-left whitespace-nowrap w-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-4">No hay ventas</td></tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row._id}
                    onClick={() => setSelectedVenta(row)}
                    className={
                      (selectedVenta?._id === row._id
                        ? "bg-green-200 font-bold"
                        : "hover:bg-gray-100 cursor-pointer")
                    }
                  >
                    <td className="border border-gray-300 px-2 py-2 whitespace-nowrap">{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <span className="block font-bold leading-tight">{row.cliente || ''} {row.apellidos || ''}</span>
                      <span className="block text-xs text-gray-500">{row.nfac}</span>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 whitespace-nowrap">{`S/.${row.totalVenta.toFixed(2)}`}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow-md text-black w-1/2">
        <h3 className="text-lg font-semibold mb-4 text-green-700">Detalles de la Venta</h3>
        {selectedVenta ? (
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <th className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2 whitespace-nowrap w-auto">Nombre</th>
                <td colSpan={3} className="border border-gray-300 px-2 py-2">{selectedVenta.cliente || "-"} {selectedVenta.apellidos || ""}</td>
              </tr>
              <tr>
                <th className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2 whitespace-nowrap w-auto">Celular</th>
                <td colSpan={3} className="border border-gray-300 px-2 py-2">{selectedVenta.celular || "-"}</td>
              </tr>
              <tr>
                <th className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2 whitespace-nowrap w-auto">Email</th>
                <td className="border border-gray-300 px-2 py-2">{selectedVenta.email || "-"}</td>
                <th className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2 whitespace-nowrap w-auto">Fecha</th>
                <td className="border border-gray-300 px-2 py-2">{new Date(selectedVenta.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th colSpan={4} className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2">Productos</th>
              </tr>
              <tr>
                <td colSpan={4} className="p-0">
                  <div className="max-h-[330px] overflow-y-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2 whitespace-nowrap w-1">Cantidad</th>
                          <th className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2 w-auto">Producto</th>
                          <th className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2 whitespace-nowrap w-1">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedVenta.items && selectedVenta.items.length > 0 ? (
                          selectedVenta.items.map((producto, idx) => (
                            <tr key={idx}>
                              <td className="border border-gray-300 px-2 py-2 whitespace-nowrap">{producto.cantidad}</td>
                              <td className="border border-gray-300 px-2 py-2">{producto.nombre || producto.producto}</td>
                              <td className="border border-gray-300 px-2 py-2 whitespace-nowrap">{`S/.${(producto.precio * producto.cantidad).toFixed(2)}`}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-center py-2">Sin productos</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <th className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2 whitespace-nowrap w-auto">Método de Pago</th>
                <td className="border border-gray-300 px-2 py-2">{selectedVenta.tipoPago ? `${selectedVenta.tipoPago} (${selectedVenta.estado})` : (selectedVenta.estado ? `(${selectedVenta.estado})` : "")}</td>
                <th className="bg-[#2d8f2f] text-white border border-gray-300 px-2 py-2 whitespace-nowrap w-auto">Total</th>
                <td className="border border-gray-300 px-2 py-2">{`S/.${selectedVenta.totalVenta.toFixed(2)}`}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center text-base">Seleccione una venta para ver los detalles.</p>
        )}
      </div>
    </div>
  );
}