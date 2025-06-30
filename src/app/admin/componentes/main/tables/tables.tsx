import React, { useEffect, useState } from "react";
import Image from 'next/image';
import CambiarEstado from "../cambiarestado/cambiarestado";

interface VentaHistorial {
  _id?: string;
  createdAt: string;
  nfac: string;
  totalVenta: number;
  tipoPago?: string;
  estado?: string;
  cliente?: string;
  apellidos?: string;
}

interface ProductoBajoStock {
  _id: string;
  name: string;
  marca?: string;
  image?: string;
  stock: number;
  stockmayor?: number;
}

interface ProductoMasVendido {
  _id: string;
  name: string;
  marca?: string;
  image?: string;
  cantidadVendida: number;
}

export default function Tables() {
  const [historialData, setHistorialData] = useState<VentaHistorial[]>([]);
  const [bajoStock, setBajoStock] = useState<ProductoBajoStock[]>([]);
  const [masVendidos, setMasVendidos] = useState<ProductoMasVendido[]>([]);
  const [bajoStockLoading, setBajoStockLoading] = useState(true);
  const [masVendidosLoading, setMasVendidosLoading] = useState(true);
  const [selectedVentaId, setSelectedVentaId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await fetch('/api/ventas', { credentials: 'include' });
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

  useEffect(() => {
    const fetchBajoStock = async () => {
      setBajoStockLoading(true);
      try {
        const res = await fetch('/api/productos/bajostock', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setBajoStock(data);
        } else {
          setBajoStock([]);
        }
      } catch {
        setBajoStock([]);
      }
      setBajoStockLoading(false);
    };
    fetchBajoStock();
  }, []);

  useEffect(() => {
    const fetchMasVendidos = async () => {
      setMasVendidosLoading(true);
      try {
        const res = await fetch('/api/productos/masvendidos', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setMasVendidos(data);
        } else {
          setMasVendidos([]);
        }
      } catch {
        setMasVendidos([]);
      }
      setMasVendidosLoading(false);
    };
    fetchMasVendidos();
  }, []);

  // Refresca ventas después de actualizar estado
  const refreshVentas = async () => {
    try {
      const res = await fetch('/api/ventas', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setHistorialData(data);
      }
    } catch {
      setHistorialData([]);
    }
    setSelectedVentaId(null);
  };

  return (
    <section className="grid grid-cols-[2fr_1fr] gap-4 p-4">
      {/* Overlay para cambiar estado */}
      {selectedVentaId && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.15)] flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl min-w-[340px] flex flex-col items-center">
            <CambiarEstado
              ventaId={selectedVentaId}
              onEstadoActualizado={refreshVentas}
            />
            <button
              className="mt-6 px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition font-semibold"
              onClick={() => setSelectedVentaId(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Tabla principal: Historial de Ventas */}
      <div className="bg-white p-4 rounded shadow-md h-[500px] col-start-1 col-end-2 row-start-1 row-end-5">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-[#2D8F2F] text-white border border-gray-300 p-2 text-left h-12 align-middle whitespace-nowrap w-auto">Fecha</th>
              <th className="bg-[#2D8F2F] text-white border border-gray-300 p-2 text-left h-12 align-middle w-full max-w-full">Ventas</th>
              <th className="bg-[#2D8F2F] text-white border border-gray-300 p-2 text-left h-12 align-middle whitespace-nowrap w-auto">Total</th>
              <th className="bg-[#2D8F2F] text-white border border-gray-300 p-2 text-left h-12 align-middle whitespace-nowrap w-auto">Método de pago</th>
            </tr>
          </thead>
          <tbody>
            {historialData.map((row, idx) => (
              <tr
                key={row._id || idx}
                className={`${idx % 2 === 1 ? "bg-gray-100" : ""} ${row.estado === "para entrega" ? "cursor-pointer" : "cursor-default"}`}
                onClick={() => {
                  if (row.estado === "para entrega" && row._id) {
                    setSelectedVentaId(row._id);
                  }
                }}
              >
                <td className="border border-gray-300 p-2 text-left h-12 align-middle text-black whitespace-nowrap w-auto">{row ? new Date(row.createdAt).toLocaleDateString() : ""}</td>
                <td className="border border-gray-300 p-2 text-left h-12 align-middle text-black w-full max-w-full overflow-hidden text-ellipsis">
                  <span className="block leading-tight text-sm text-gray-800">{row?.cliente || ''} {row?.apellidos || ''}</span>
                  <span className="block text-xs text-gray-500">{row?.nfac ?? ""}</span>
                </td>
                <td className="border border-gray-300 p-2 text-left h-12 align-middle text-black whitespace-nowrap w-auto">{row ? `S/.${row.totalVenta.toFixed(2)}` : ""}</td>
                <td className="border border-gray-300 p-2 text-left h-12 align-middle text-black whitespace-nowrap w-auto">{row?.tipoPago ? `${row.tipoPago} (${row.estado})` : (row?.estado ? `(${row.estado})` : "")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla secundaria: Productos de Bajo Stock */}
      <div className="flex flex-col min-h-[230px] max-h-[230px] h-[230px] overflow-y-auto col-start-2 col-end-3 row-start-1 row-end-2 mb-4 bg-white p-4 rounded shadow-md">
        <h3 className="mb-4 text-lg text-green-700 font-semibold">Productos de Bajo Stock</h3>
        {bajoStockLoading ? (
          <p>Cargando...</p>
        ) : bajoStock.length === 0 ? (
          <p>No hay productos sin stock</p>
        ) : (
          <ul className="list-none p-0 text-black">
            {bajoStock.map((item) => (
              <li key={item._id} className="flex items-center justify-between my-2 px-2">
                <span>{item.name}{item.marca ? ` (${item.marca})` : ""} - Stock: {item.stock}</span>
                {item.image && (
                  <Image
                    src={`/bajostock.png`}
                    alt={item.name}
                    width={30}
                    height={30}
                    className="ml-4 w-8 h-8 object-contain"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tabla secundaria: Productos Más Vendidos */}
      <div className="flex flex-col min-h-[230px] max-h-[230px] h-[230px] overflow-y-auto col-start-2 col-end-3 row-start-2 row-end-3 bg-white p-4 rounded shadow-md">
        <h3 className="mb-4 text-lg text-green-700 font-semibold">Productos Más Vendidos</h3>
        {masVendidosLoading ? (
          <p>Cargando...</p>
        ) : masVendidos.length === 0 ? (
          <p>No hay productos más vendidos</p>
        ) : (
          <ul className="list-none p-0 text-black">
            {masVendidos.map((item) => (
              <li key={item._id} className="flex items-center justify-between my-2 px-2">
                <span>{item.name}{item.marca ? ` (${item.marca})` : ""} - Vendidos: {item.cantidadVendida.toFixed(2)}</span>
                {item.image && (
                  <Image
                    src={`/masvendido.png`}
                    alt={item.name}
                    width={24}
                    height={24}
                    className="ml-4 w-6 h-6 object-contain"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}