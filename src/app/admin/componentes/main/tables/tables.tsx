import React, { useEffect, useState } from "react";
import './tables.css';
import Image from 'next/image';

interface VentaHistorial {
  createdAt: string;
  nfac: string;
  totalVenta: number;
  tipoPago?: string;
  estado?: string;
}

const bajoStock = [
  "Producto-01",
  "Producto-02",
  "Producto-03",
  "Producto-04",
  "Producto-05",
];

const masVendidos = [
  "Producto-01",
  "Producto-02",
  "Producto-03",
  "Producto-04",
  "Producto-05",
];

function fillRows<T>(data: T[], min: number, max: number): (T | null)[] {
  const length = Math.max(min, Math.min(data.length, max));
  return Array.from({ length }, (_, i) => data[i] ?? null);
}

export default function Tables() {
  const [historialData, setHistorialData] = useState<VentaHistorial[]>([]);

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

  const historialRows = fillRows(historialData, 8, 8);
  const bajoStockRows = fillRows(bajoStock, 5, 5);
  const masVendidosRows = fillRows(masVendidos, 5, 5);

  return (
    <section className="tables">
      {/* Tabla principal: Historial de Ventas */}
      <div className="table historial">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nº de venta</th>
              <th>Total</th>
              <th>Método de pago</th>
            </tr>
          </thead>
          <tbody>
            {historialRows.map((row, idx) => (
              <tr key={idx}>
                <td>{row ? new Date(row.createdAt).toLocaleDateString() : ""}</td>
                <td>{row?.nfac ?? ""}</td>
                <td>{row ? `S/.${row.totalVenta.toFixed(2)}` : ""}</td>
                <td>{row?.tipoPago ? `${row.tipoPago} (${row.estado})` : (row?.estado ? `(${row.estado})` : "")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla secundaria: Productos de Bajo Stock */}
      <div className="table stock">
        <h3>Productos de Bajo Stock</h3>
        <ul>
          {bajoStockRows.map((item, idx) => (
          <li key={idx} className="stock-list-item">
            {item ?? ""}
            <Image 
              src="/bajostock.png"
              alt={item ?? "Producto"}
              width={30} height={30}
              className="stock-list-img"
            />
          </li>
          ))}
        </ul>
      </div>

      {/* Tabla secundaria: Productos Más Vendidos */}
      <div className="table vendidos">
        <h3>Productos Más Vendidos</h3>
        <ul>
          {masVendidosRows.map((item, idx) => (
            <li key={idx} className="stock-list-item">{item ?? ""}
            <Image 
              src="/masvendido.png"
              alt={item ?? "Producto"}
              width={24} height={24}
              className="stock-list-img"
            /></li>
          ))}
        </ul>
      </div>
    </section>
  );
}