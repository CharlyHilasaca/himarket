"use client";
import React, { useEffect, useState, useRef } from "react";
import "./compras.css"; // Cambia a un archivo CSS normal

interface ProductoCarrito {
  producto_id: string;
  name: string;
  marca?: string;
  cantidad: number;
  precio: number;
  unidad?: string;
}

interface Carrito {
  _id: string;
  cliente_id: string;
  proyecto_id: string;
  productos: ProductoCarrito[];
  total: number;
  estado: string;
}

interface ComprasProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Compras({ isOpen, onClose }: ComprasProps) {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Obtener o crear el carrito al abrir el modal
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    fetch("/api/carrito", { credentials: "include" })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setCarrito(data);
        } else {
          // Si no existe, intenta crearlo
          const createRes = await fetch("/api/carrito", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
          });
          if (createRes.ok) {
            const data = await createRes.json();
            setCarrito(data.carrito);
          } else {
            setError("No se pudo obtener o crear el carrito");
          }
        }
      })
      .catch(() => setError("Error al obtener el carrito"))
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Cerrar al hacer click fuera del sidebar
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Actualizar el carrito en el backend
  const actualizarCarrito = async (productos: ProductoCarrito[]) => {
    if (!carrito) return;
    setActualizando(true);
    const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const res = await fetch("/api/carrito", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos, total }),
    });
    if (res.ok) {
      const data = await res.json();
      setCarrito(data.carrito);
    }
    setActualizando(false);
  };

  // Aumentar cantidad
  const handleAumentar = (producto_id: string) => {
    if (!carrito) return;
    const productos = carrito.productos.map(p =>
      p.producto_id === producto_id ? { ...p, cantidad: p.cantidad + 1 } : p
    );
    actualizarCarrito(productos);
  };

  // Disminuir cantidad
  const handleDisminuir = (producto_id: string) => {
    if (!carrito) return;
    const productos = carrito.productos
      .map(p =>
        p.producto_id === producto_id
          ? { ...p, cantidad: Math.max(1, p.cantidad - 1) }
          : p
      );
    actualizarCarrito(productos);
  };

  // Eliminar producto
  const handleEliminar = (producto_id: string) => {
    if (!carrito) return;
    const productos = carrito.productos.filter(p => p.producto_id !== producto_id);
    actualizarCarrito(productos);
  };

  if (!isOpen) return null;

  return (
    <div className="compras-overlay">
      {/* El overlay ya no usa style inline */}
      {/* <div className="compras-overlay-bg" /> */}
      <div
        ref={sidebarRef}
        className={`compras-sidebar${isOpen ? " open" : ""}`}
      >
        <div className="compras-header">
          <h2 className="compras-title">Carrito de Compras</h2>
          <button
            className="compras-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="compras-content">
          {loading ? (
            <div className="compras-loading">Cargando...</div>
          ) : error ? (
            <div className="compras-error">{error}</div>
          ) : carrito && carrito.productos.length > 0 ? (
            <>
              <ul className="compras-list">
                {carrito.productos.map((prod) => (
                  <li key={prod.producto_id} className="compras-item">
                    <div>
                      <span className="font-semibold">{prod.name}</span>
                      {prod.marca && <span className="ml-2 text-gray-500 text-xs">({prod.marca})</span>}
                      <span className="ml-2 text-gray-700 text-xs">
                        {prod.precio.toFixed(2)} x {prod.cantidad}
                        {prod.unidad && <> {prod.unidad}</>}
                      </span>
                    </div>
                    <div className="compras-actions">
                      <button
                        className="compras-btn"
                        onClick={() => handleDisminuir(prod.producto_id)}
                        disabled={actualizando || prod.cantidad <= 1}
                      >-</button>
                      <span>{prod.cantidad}</span>
                      <button
                        className="compras-btn"
                        onClick={() => handleAumentar(prod.producto_id)}
                        disabled={actualizando}
                      >+</button>
                      <button
                        className="compras-btn eliminar"
                        onClick={() => handleEliminar(prod.producto_id)}
                        disabled={actualizando}
                      >Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="compras-total">
                <span>Total:</span>
                <span>S/ {carrito.total.toFixed(2)}</span>
              </div>
              <button className="compras-pagar-btn" disabled>
                Proceder al pago (próximamente)
              </button>
            </>
          ) : (
            <div className="compras-vacio">Tu carrito está vacío.</div>
          )}
        </div>
      </div>
    </div>
  );
}