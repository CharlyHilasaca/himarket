"use client";
import React, { useEffect, useState, useRef } from "react";

interface ProductoCarrito {
  producto_id: string;
  name: string;
  marca?: string;
  cantidad: number;
  precio: number;
  unidad?: string;
  stock?: number; // Agregado para manejar el stock
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

interface Unidad {
  _id: string;
  name: string;
  abbreviation: string;
  description?: string;
}

// Define un tipo para los productos de la API
type ProductoApi = {
  _id: string;
  projectDetails?: { salePrice?: number }[];
  // Puedes agregar más campos si los necesitas
};

export default function Compras({ isOpen, onClose }: ComprasProps) {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [editCantidad, setEditCantidad] = useState<{ [id: string]: string }>({});
  const [editPrecio, setEditPrecio] = useState<{ [id: string]: string }>({});
  const [preciosOriginales, setPreciosOriginales] = useState<{ [producto_id: string]: number }>({});
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

  // Obtener unidades al montar el componente
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/unidades")
      .then(res => res.json())
      .then((data: Unidad[]) => setUnidades(data))
      .catch(() => setUnidades([]));
  }, [isOpen]);

  // Obtener precios originales de productos del proyecto activo
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/productsp", { credentials: "include" })
      .then(res => res.ok ? res.json() : [])
      .then((data: ProductoApi[]) => {
        // data: array de productos con _id y projectDetails
        const precios: { [producto_id: string]: number } = {};
        data.forEach((prod) => {
          const id = typeof prod._id === "string" ? prod._id : String(prod._id);
          if (
            id &&
            Array.isArray(prod.projectDetails) &&
            prod.projectDetails[0]?.salePrice !== undefined
          ) {
            precios[id] = prod.projectDetails[0].salePrice as number;
          }
        });
        setPreciosOriginales(precios);
      })
      .catch(() => setPreciosOriginales({}));
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

  // Validar si la unidad es decimal (Kg o Lt)
  const esUnidadDecimal = (unidadId?: string) => {
    const unidadObj = unidades.find(u => u._id === unidadId);
    if (!unidadObj) return false;
    const abrev = unidadObj.abbreviation.toLowerCase();
    return abrev === "kg" || abrev === "lt";
  };

  // Cambiar cantidad desde input (permite números y punto, y no bloquea el punto inicial)
  const handleCantidadInput = (
    producto: ProductoCarrito,
    value: string,
    stock: number,
    _precioUnit: number,
    isDecimal: boolean
  ) => {
    let val = value.replace(/[^0-9.]/g, "");
    const parts = val.split(".");
    if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
    if (val === "") {
      setEditCantidad(prev => ({ ...prev, [producto.producto_id]: "" }));
      if (isDecimal) setEditPrecio(prev => ({ ...prev, [producto.producto_id]: "" }));
      return;
    }
    if (val === ".") {
      setEditCantidad(prev => ({ ...prev, [producto.producto_id]: val }));
      if (isDecimal) setEditPrecio(prev => ({ ...prev, [producto.producto_id]: "" }));
      return;
    }
    let cantidad = isDecimal ? parseFloat(val) : parseInt(val, 10);
    if (isNaN(cantidad)) return;
    if (isDecimal) {
      if (cantidad < 0.1) cantidad = 0.1;
      if (cantidad > stock) cantidad = stock;
      cantidad = Math.round(cantidad * 100) / 100;
      setEditCantidad(prev => ({ ...prev, [producto.producto_id]: val }));
      // Usar precio original del producto para el cálculo
      const precioOriginal = preciosOriginales[producto.producto_id] ?? _precioUnit;
      setEditPrecio(prev => ({
        ...prev,
        [producto.producto_id]: (cantidad * precioOriginal).toFixed(2)
      }));
      // Actualizar el carrito en cada cambio
      actualizarCarrito(
        carrito!.productos.map(p =>
          p.producto_id === producto.producto_id
            ? { ...p, cantidad, precio: cantidad * precioOriginal, marca: p.marca }
            : p
        )
      );
    } else {
      if (cantidad < 1) cantidad = 1;
      if (cantidad > stock) cantidad = stock;
      cantidad = Math.floor(cantidad);
      setEditCantidad(prev => ({ ...prev, [producto.producto_id]: cantidad.toString() }));
      // Actualizar el carrito en cada cambio
      actualizarCarrito(
        carrito!.productos.map(p =>
          p.producto_id === producto.producto_id
            ? { ...p, cantidad, marca: p.marca }
            : p
        )
      );
    }
  };

  // Cambiar precio desde input (permite números y punto, y no bloquea el punto inicial)
  const handlePrecioInput = (
    producto: ProductoCarrito,
    value: string,
    _precioUnit: number,
    stock: number
  ) => {
    let val = value.replace(/[^0-9.]/g, "");
    const parts = val.split(".");
    if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
    if (val === "") {
      setEditPrecio(prev => ({ ...prev, [producto.producto_id]: "" }));
      setEditCantidad(prev => ({ ...prev, [producto.producto_id]: "" }));
      return;
    }
    if (val === ".") {
      setEditPrecio(prev => ({ ...prev, [producto.producto_id]: val }));
      setEditCantidad(prev => ({ ...prev, [producto.producto_id]: "" }));
      return;
    }
    const precio = parseFloat(val);
    if (isNaN(precio) || precio <= 0) return;
    // Usar precio original del producto para el cálculo
    const precioOriginal = preciosOriginales[producto.producto_id] ?? _precioUnit;
    let cantidad = precio / precioOriginal;
    if (cantidad < 0.1) cantidad = 0.1;
    if (cantidad > stock) cantidad = stock;
    cantidad = Math.round(cantidad * 100) / 100;
    setEditPrecio(prev => ({ ...prev, [producto.producto_id]: val }));
    setEditCantidad(prev => ({ ...prev, [producto.producto_id]: cantidad.toString() }));
    // Actualizar el carrito en cada cambio
    actualizarCarrito(
      carrito!.productos.map(p =>
        p.producto_id === producto.producto_id
          ? { ...p, cantidad, precio, marca: p.marca }
          : p
      )
    );
  };

  // Calcular el total correctamente: para Kg/Lt suma el precio, para otros suma precio * cantidad
  const calcularTotal = () => {
    if (!carrito) return 0;
    return carrito.productos.reduce((acc, prod) => {
      const unidadObj = unidades.find(u => u._id === prod.unidad);
      const abrev = unidadObj ? unidadObj.abbreviation.toLowerCase() : "";
      if (abrev === "kg" || abrev === "lt") {
        return acc + prod.precio;
      }
      return acc + prod.precio * prod.cantidad;
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[1200] flex items-start justify-end bg-black/0 ">
      <div
        ref={sidebarRef}
        className={`relative h-screen w-full max-w-[410px] bg-white shadow-2xl flex flex-col transition-transform duration-300 z-[1300] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header fijo */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200 bg-white min-h-[72px] relative z-10">
          <h2 className="text-xl font-bold text-green-800">Carrito de Compras</h2>
          <button
            className="absolute top-4 right-5 text-3xl text-gray-600 bg-none border-none cursor-pointer hover:text-red-600"
            onClick={onClose}
            aria-label="Cerrar"
            type="button"
          >
            ×
          </button>
        </div>
        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Cargando...</div>
          ) : error ? (
            <div className="text-center py-8 text-gray-400">{error}</div>
          ) : carrito && carrito.productos.length > 0 ? (
            <ul className="list-none m-0 mb-4 p-0 border-b border-gray-200 text-black">
              {carrito.productos.map((prod) => {
                let unidadAbrev = "";
                const stock = typeof prod.stock === "number" ? prod.stock : 999999;
                if (prod.unidad && unidades.length > 0) {
                  const unidadObj = unidades.find(u => u._id === prod.unidad);
                  if (unidadObj) unidadAbrev = unidadObj.abbreviation;
                }
                const isDecimal = esUnidadDecimal(prod.unidad);
                const precioUnit = preciosOriginales[prod.producto_id] ?? prod.precio;

                return (
                  <li key={prod.producto_id} className="flex items-start justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <div>
                        <span className="font-semibold">{prod.name}</span>
                        {prod.marca && <span className="ml-2 text-gray-500 text-xs"></span>}
                      </div>
                      <div className="text-xs text-gray-700">
                        Precio Producto: S/ {precioUnit?.toFixed(2)} {unidadAbrev}
                      </div>
                      <div className="text-xs text-gray-700">
                        Subtotal Producto: S/ {
                          isDecimal
                            ? prod.precio.toFixed(2)
                            : (precioUnit * prod.cantidad).toFixed(2)
                        } {unidadAbrev}
                      </div>
                      <div className="mt-1 flex flex-col gap-1">
                        {isDecimal ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              inputMode="decimal"
                              min={0.1}
                              step={0.1}
                              max={stock}
                              value={editPrecio[prod.producto_id] !== undefined ? editPrecio[prod.producto_id] : (prod.cantidad * precioUnit).toString()}
                              onChange={e => handlePrecioInput(prod, e.target.value, precioUnit, stock)}
                              className="border border-gray-300 rounded px-2 py-1 w-16 text-right text-sm mx-1"
                              placeholder="Precio"
                              title="Precio total"
                              autoComplete="off"
                            />
                            <span>x</span>
                            <input
                              type="text"
                              inputMode="decimal"
                              min={0.1}
                              step={0.1}
                              max={stock}
                              value={editCantidad[prod.producto_id] !== undefined ? editCantidad[prod.producto_id] : prod.cantidad.toString()}
                              onChange={e => handleCantidadInput(prod, e.target.value, stock, precioUnit, true)}
                              className="border border-gray-300 rounded px-2 py-1 w-16 text-right text-sm mx-1"
                              placeholder="Cantidad"
                              title="Cantidad en decimales"
                              autoComplete="off"
                            />
                            {unidadAbrev && <span>{unidadAbrev}</span>}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              step={1}
                              max={stock}
                              value={editCantidad[prod.producto_id] !== undefined ? editCantidad[prod.producto_id] : prod.cantidad}
                              onChange={e => handleCantidadInput(prod, e.target.value, stock, precioUnit, false)}
                              className="border border-gray-300 rounded px-2 py-1 w-16 text-right text-sm mx-1"
                              placeholder="Cantidad"
                              title="Cantidad"
                              autoComplete="off"
                            />
                            {unidadAbrev && <span>{unidadAbrev}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Botones a la derecha, en horizontal */}
                    <div className="flex flex-row items-center gap-2 ml-4">
                      <button
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-green-100 transition disabled:opacity-50"
                        onClick={() => handleDisminuir(prod.producto_id)}
                        disabled={actualizando || prod.cantidad <= (isDecimal ? 0.1 : 1)}
                        type="button"
                      >-</button>
                      <span>{prod.cantidad}</span>
                      <button
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-green-100 transition disabled:opacity-50"
                        onClick={() => handleAumentar(prod.producto_id)}
                        disabled={actualizando}
                        type="button"
                      >+</button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                        onClick={() => handleEliminar(prod.producto_id)}
                        disabled={actualizando}
                        type="button"
                      >X</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-400">Tu carrito está vacío.</div>
          )}
        </div>
        {/* Footer fijo */}
        <div className="flex flex-col border-t border-gray-200 bg-white px-6 py-4 z-10">
          <div className="flex justify-between items-center font-bold text-green-800 text-lg mb-3">
            <span>Total:</span>
            <span>
              S/ {calcularTotal().toFixed(2)}
            </span>
          </div>
          <button
            className="w-full bg-green-800 text-white py-2 rounded font-semibold cursor-not-allowed opacity-80"
            disabled
            type="button"
          >
            Proceder al pago (próximamente)
          </button>
        </div>
      </div>
    </div>
  );
}

// Exporta función auxiliar para obtener cantidad total del carrito
export async function getCantidadCarrito(): Promise<number> {
  try {
    const res = await fetch("/api/carrito", { credentials: "include" });
    if (!res.ok) return 0;
    const data = await res.json();
    if (!data.productos) return 0;
    return data.productos.reduce((acc: number, p: ProductoCarrito) => acc + (p.cantidad || 0), 0);
  } catch {
    return 0;
  }
}