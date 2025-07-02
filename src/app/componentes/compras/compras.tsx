"use client";
import React, { useEffect, useState } from "react";

interface ProductoCarrito {
  producto_id: string;
  name: string;
  marca?: string;
  cantidad: number;
  precio: number;
  unidad?: string;
  stock?: number;
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

type ProductoApi = {
  _id: string;
  projectDetails?: { salePrice?: number }[];
};

interface HistorialVenta {
  _id: string;
  createdAt: string;
  nfac: string;
  totalVenta: number;
  estado: string;
  items: { producto: string; precio: number; cantidad: number }[];
  tipoPago?: string;
}

interface ProductoNombreMap {
  [id: string]: string;
}

export default function Compras({ isOpen, onClose }: ComprasProps) {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [editCantidad, setEditCantidad] = useState<{ [id: string]: string }>({});
  const [editPrecio, setEditPrecio] = useState<{ [id: string]: string }>({});
  const [preciosOriginales, setPreciosOriginales] = useState<{ [producto_id: string]: number }>({});
  const [historial, setHistorial] = useState<HistorialVenta[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState(true);
  const [productoNombres, setProductoNombres] = useState<ProductoNombreMap>({});
  const [expandedVentas, setExpandedVentas] = useState<{ [ventaId: string]: boolean }>({});
  const [tab, setTab] = useState<"carrito" | "historial">("carrito");
  const sidebarRef = React.useRef<HTMLDivElement>(null);

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

  // Obtener historial de compras del cliente
  useEffect(() => {
    if (!isOpen) return;
    setLoadingHistorial(true);
    fetch("/api/compras/historial", { credentials: "include" })
      .then(res => res.ok ? res.json() : [])
      .then((data: HistorialVenta[]) => setHistorial(data))
      .catch(() => setHistorial([]))
      .finally(() => setLoadingHistorial(false));
  }, [isOpen]);

  // Obtener nombres de productos para el historial (solo una vez por sesión del modal)
  useEffect(() => {
    if (!isOpen) return;
    // Junta todos los ids de productos del historial
    const ids = new Set<string>();
    historial.forEach(venta => {
      venta.items.forEach(item => ids.add(item.producto));
    });
    if (ids.size === 0) return;
    // Pide todos los productos por id (puedes optimizar con un endpoint batch si tienes muchos)
    Promise.all(Array.from(ids).map(id =>
      fetch(`/api/products/${id}`).then(res => res.ok ? res.json() : null)
    )).then(results => {
      const map: ProductoNombreMap = {};
      results.forEach(prod => {
        if (prod && prod._id) map[prod._id] = prod.name;
      });
      setProductoNombres(map);
    });
  }, [isOpen, historial]);

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

  // Maneja el pago con Checkout Pro
  const handleCheckoutPro = async () => {
    const monto = calcularTotal();
    console.log("[Compras] Intentando iniciar pago con Mercado Pago. Monto:", monto);
    try {
      const res = await fetch("/api/pagos/checkoutpro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monto,
          descripcion: "Pago de carrito"
        }),
      });
      const data = await res.json();
      console.log("[Compras] Respuesta backend /pagos/checkoutpro:", data);
      if (data.sandbox_init_point) {
        window.location.href = data.sandbox_init_point;
      } else {
        alert(data?.mp_response?.message || "No se pudo iniciar el pago con Mercado Pago.");
      }
    } catch (err) {
      console.error("[Compras] Error iniciando el pago con Mercado Pago:", err);
      alert("Error iniciando el pago con Mercado Pago.");
    }
  };

  // Sincroniza el localStorage cuando el carrito se limpia desde otro lugar (ej: pago exitoso)
  useEffect(() => {
    const handleCarritoLimpiado = () => {
      setCarrito(null);
      localStorage.removeItem("carrito");
    };
    window.addEventListener("carrito-limpiado", handleCarritoLimpiado);
    return () => {
      window.removeEventListener("carrito-limpiado", handleCarritoLimpiado);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={sidebarRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white compras-fullscreen"
    >
      <div className="w-full h-full flex flex-col bg-white rounded-none shadow-none border-none max-w-none mx-0 my-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-gray-200 bg-white min-h-[56px] relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-green-800">Carrito e Historial</h2>
          <button
            className="text-2xl text-gray-400 hover:text-red-600 transition"
            onClick={onClose}
            aria-label="Volver"
          >×</button>
        </div>
        {/* Tabs */}
        <div className="flex w-full border-b border-gray-200 bg-white">
          <button
            className={`flex-1 py-2 text-center font-semibold transition ${tab === "carrito" ? "text-green-700 border-b-2 border-green-700 bg-green-50" : "text-gray-500 hover:text-green-700"}`}
            onClick={() => setTab("carrito")}
            type="button"
          >
            Carrito de Compras
          </button>
          <button
            className={`flex-1 py-2 text-center font-semibold transition ${tab === "historial" ? "text-green-700 border-b-2 border-green-700 bg-green-50" : "text-gray-500 hover:text-green-700"}`}
            onClick={() => setTab("historial")}
            type="button"
          >
            Historial de Compras
          </button>
        </div>
        {/* Contenido */}
        <div className="flex-1 flex flex-col px-2 sm:px-8 py-4 sm:py-8 bg-white min-h-0 h-0 overflow-y-auto">
          {tab === "carrito" && (
            <div className="flex flex-col flex-1 min-w-0">
              {/* Carrito de compras */}
              <div className="flex-1 overflow-y-auto max-h-[380px] border rounded bg-white shadow-inner p-2">
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
              {/* Footer fijo del carrito */}
              <div className="flex flex-col border-t border-gray-200 bg-white px-0 py-4 z-10 rounded-b-lg">
                <div className="flex justify-between items-center font-bold text-green-800 text-lg mb-3">
                  <span>Total:</span>
                  <span>
                    S/ {calcularTotal().toFixed(2)}
                  </span>
                </div>
                <button
                  className="w-full bg-green-800 text-white py-2 rounded font-semibold transition hover:bg-green-900"
                  disabled={!carrito || carrito.productos.length === 0}
                  type="button"
                  onClick={handleCheckoutPro}
                >
                  Pagar con Mercado Pago
                </button>
                <button
                  className="w-full mt-2 bg-gray-200 text-green-800 py-2 rounded font-semibold transition hover:bg-gray-300"
                  type="button"
                  onClick={onClose}
                >
                  Volver
                </button>
              </div>
            </div>
          )}
          {tab === "historial" && (
            <div className="flex flex-col flex-1 min-w-0">
              {/* Historial de compras */}
              <div className="flex-1 overflow-y-auto max-h-[380px] border rounded bg-white shadow-inner p-2">
                {loadingHistorial ? (
                  <div className="text-center py-8 text-gray-400">Cargando historial...</div>
                ) : historial.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No tienes compras registradas.</div>
                ) : (
                  <ul className="list-none m-0 p-0 text-black">
                    {historial.map((venta) => {
                      const expanded = expandedVentas[venta._id];
                      const mostrarItems = expanded ? venta.items : venta.items.slice(0, 1);
                      return (
                        <li key={venta._id} className="mb-4 pb-2 border-b border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-green-800">{venta.nfac}</span>
                            <span className="text-xs text-gray-500">{new Date(venta.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="text-sm text-gray-700 mb-1">
                            Estado: <span className="font-semibold">{venta.estado}</span>
                            {venta.tipoPago && (
                              <span className="ml-2 text-gray-500">({venta.tipoPago})</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-700 mb-1">
                            Total: <span className="font-semibold">S/ {venta.totalVenta.toFixed(2)}</span>
                          </div>
                          <ul className="ml-4 text-xs text-gray-600">
                            {mostrarItems.map((item, idx) => (
                              <li key={idx}>
                                {item.cantidad} x {productoNombres[item.producto] || item.producto} - S/ {item.precio}
                              </li>
                            ))}
                          </ul>
                          {venta.items.length > 1 && (
                            <button
                              className="text-green-700 text-xs mt-1 underline hover:text-green-900"
                              onClick={() =>
                                setExpandedVentas(prev => ({
                                  ...prev,
                                  [venta._id]: !expanded
                                }))
                              }
                            >
                              {expanded ? "Ver menos" : `Ver más (${venta.items.length - 1} más)`}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
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