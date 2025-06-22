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

function fillRows<T>(data: T[], min: number, max: number): (T | null)[] {
  const length = Math.max(min, Math.min(data.length, max));
  return Array.from({ length }, (_, i) => data[i] ?? null);
}

export default function Tables() {
  const [historialData, setHistorialData] = useState<VentaHistorial[]>([]);
  const [bajoStock, setBajoStock] = useState<ProductoBajoStock[]>([]);
  const [masVendidos, setMasVendidos] = useState<ProductoMasVendido[]>([]);
  const [bajoStockLoading, setBajoStockLoading] = useState(true);
  const [masVendidosLoading, setMasVendidosLoading] = useState(true);

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

  const historialRows = fillRows(historialData, 8, 8);

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
      <div className="table stock stock-scroll">
        <h3>Productos de Bajo Stock</h3>
        {bajoStockLoading ? (
          <p>Cargando...</p>
        ) : bajoStock.length === 0 ? (
          <p>No hay productos sin stock</p>
        ) : (
          <ul>
            {bajoStock.map((item) => (
              <li key={item._id} className="stock-list-item">
                <span>{item.name}{item.marca ? ` (${item.marca})` : ""} - Stock: {item.stock}</span>
                {item.image && (
                  <Image
                    src={`/bajostock.png`}
                    alt={item.name}
                    width={30}
                    height={30}
                    className="stock-list-img"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tabla secundaria: Productos Más Vendidos */}
      <div className="table vendidos">
        <h3>Productos Más Vendidos</h3>
        {masVendidosLoading ? (
          <p>Cargando...</p>
        ) : masVendidos.length === 0 ? (
          <p>No hay productos más vendidos</p>
        ) : (
          <ul>
            {masVendidos.map((item) => (
              <li key={item._id} className="stock-list-item">
                <span>{item.name}{item.marca ? ` (${item.marca})` : ""} - Vendidos: {item.cantidadVendida}</span>
                {item.image && (
                  <Image
                    src={`/masvendido.png`}
                    alt={item.name}
                    width={24}
                    height={24}
                    className="stock-list-img"
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