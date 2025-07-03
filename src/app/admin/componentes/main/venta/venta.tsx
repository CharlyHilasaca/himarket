import React, { useState, useEffect } from "react";
import "./venta.css";
import ModalVenta from "./modalventa/modalventa";

interface Cliente {
  nombres: string;
  apellidos: string;
  email: string;
}

interface Producto {
  _id: string;
  name: string;
  marca?: string;
  image: string;
  projectDetails?: {
    salePrice: number;
    stock: number;
    unidad: string;
  }[];
}

interface ProductoVenta {
  _id: string;
  name: string;
  marca?: string;
  salePrice: number;
  unidad: string;
  stock: number;
  cantidad: number;
}

interface Unidad {
  _id: string;
  name: string;
  abbreviation: string;
  description?: string;
}

interface VentaProps {
  onClose: () => void;
}

export default function Venta({ onClose }: VentaProps) {
  // Cliente
  const [dni, setDni] = useState("");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [clienteLoading, setClienteLoading] = useState(false);
  const [clienteError, setClienteError] = useState<string | null>(null);

  // Productos
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [showOptions, setShowOptions] = useState(false);

  // Carrito de venta
  const [carrito, setCarrito] = useState<ProductoVenta[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [modalVentaOpen, setModalVentaOpen] = useState(false);
  const [proyectoid, setProyectoid] = useState<string>("");

  // Estados adicionales para manejar el valor string de los inputs
  const [precioEditableStr, setPrecioEditableStr] = useState("");
  const [cantidadEditableStr, setCantidadEditableStr] = useState("");

  // Buscar cliente por DNI
  const handleBuscarCliente = async () => {
    setCliente(null);
    setClienteError(null);
    if (!dni) return;
    setClienteLoading(true);
    try {
      const res = await fetch(`/api/clientes/dni/${dni}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCliente(data);
      } else {
        setClienteError("Cliente no encontrado.");
      }
    } catch {
      setClienteError("Error al buscar cliente.");
    }
    setClienteLoading(false);
  };

  // Obtener productos del inventario del proyecto
  useEffect(() => {
    const fetchProductos = async () => {
      const res = await fetch("/api/productsproyecto", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
      }
    };
    fetchProductos();
  }, []);

  // Obtener unidades al cargar el componente
  useEffect(() => {
    const fetchUnidades = async () => {
      const res = await fetch("/api/unidades");
      if (res.ok) {
        const data = await res.json();
        setUnidades(data);
      }
    };
    fetchUnidades();
  }, []);

  // Obtener proyectoid al cargar
  useEffect(() => {
    const fetchProyectoId = async () => {
      const res = await fetch("/api/userp", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProyectoid(data.proyecto_id || "");
      }
    };
    fetchProyectoId();
  }, []);

  // Efecto para actualizar los campos editables cuando cambia el producto seleccionado
  useEffect(() => {
    if (productoSeleccionado && productoSeleccionado.projectDetails && productoSeleccionado.projectDetails.length > 0) {
      setPrecioEditableStr(productoSeleccionado.projectDetails[0].salePrice.toString().replace(".", ","));
      setCantidadEditableStr("1");
    } else {
      setPrecioEditableStr("");
      setCantidadEditableStr("");
    }
  }, [productoSeleccionado]);

  // Filtrar productos por nombre
  const productosFiltrados = productos.filter((p) =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Seleccionar producto desde la lista de coincidencias
  const handleSelectProducto = (prod: Producto) => {
    setProductoSeleccionado(prod);
    setBusqueda(prod.name);
    setShowOptions(false);
    setCantidad(1);
  };

  // Función para obtener el nombre de la unidad por su id
  const getUnidadName = (unidadId: string) => {
    const unidad = unidades.find(u => u._id === unidadId);
    return unidad ? unidad.name : unidadId;
  };

  // Función para manejar cambios en el precio editable (string)
  const handlePrecioEditableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!productoSeleccionado || !productoSeleccionado.projectDetails || productoSeleccionado.projectDetails.length === 0) return;
    const detalle = productoSeleccionado.projectDetails[0];
    const unidadNombre = getUnidadName(detalle.unidad).toLowerCase();
    let value = e.target.value;
    // Solo permitir números y una coma
    value = value.replace(/[^0-9,]/g, "");
    const partes = value.split(",");
    if (partes.length > 2) return; // Solo una coma permitida
    setPrecioEditableStr(value);
    if (value === "") {
      setPrecioEditableStr("");
      if (unidadNombre === "kilogramo" || unidadNombre === "litro") {
        setCantidadEditableStr("");
      }
      return;
    }
    // Convertir la coma a punto para parsear
    const nuevoPrecio = parseFloat(value.replace(",", "."));
    if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
      setPrecioEditableStr("");
      if (unidadNombre === "kilogramo" || unidadNombre === "litro") {
        setCantidadEditableStr("");
      }
      return;
    }
    setPrecioEditableStr(Number(nuevoPrecio.toFixed(1)).toString().replace(".", ","));
    if (unidadNombre === "kilogramo" || unidadNombre === "litro") {
      // cantidad = precio modificado / precio base
      const nuevaCantidad = nuevoPrecio / detalle.salePrice;
      setCantidadEditableStr(nuevaCantidad.toFixed(1).replace(".", ","));
    }
  };

  // Función para manejar cambios en la cantidad editable (string)
  const handleCantidadEditableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!productoSeleccionado || !productoSeleccionado.projectDetails || productoSeleccionado.projectDetails.length === 0) return;
    const detalle = productoSeleccionado.projectDetails[0];
    const unidadNombre = getUnidadName(detalle.unidad).toLowerCase();
    let value = e.target.value;
    // Solo permitir números y una coma
    value = value.replace(/[^0-9,]/g, "");
    const partes = value.split(",");
    if (partes.length > 2) return; // Solo una coma permitida
    setCantidadEditableStr(value);
    if (value === "") {
      setCantidadEditableStr("");
      if (unidadNombre === "kilogramo" || unidadNombre === "litro") {
        setPrecioEditableStr("");
      }
      return;
    }
    // Convertir la coma a punto para parsear
    const nuevaCantidad = parseFloat(value.replace(",", "."));
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      setCantidadEditableStr("");
      if (unidadNombre === "kilogramo" || unidadNombre === "litro") {
        setPrecioEditableStr("");
      }
      return;
    }
    setCantidadEditableStr(Number(nuevaCantidad.toFixed(1)).toString().replace(".", ","));
    if (unidadNombre === "kilogramo" || unidadNombre === "litro") {
      // precio = cantidad * precio base
      const nuevoPrecio = nuevaCantidad * detalle.salePrice;
      setPrecioEditableStr(nuevoPrecio.toFixed(1).replace(".", ","));
    }
  };

  // Agregar producto al carrito
  const handleAgregarProducto = () => {
    if (!productoSeleccionado || !productoSeleccionado.projectDetails || productoSeleccionado.projectDetails.length === 0) return;
    const detalle = productoSeleccionado.projectDetails[0];
    const unidadNombre = getUnidadName(detalle.unidad).toLowerCase();
    let cantidadFinal = cantidad;
    let precioFinal = detalle.salePrice;
    if (unidadNombre === "kilogramo" || unidadNombre === "litro") {
      // Tomar los valores directamente de los strings para evitar problemas de actualización asíncrona
      const cantidadStr = cantidadEditableStr.replace(',', '.');
      const precioStr = precioEditableStr.replace(',', '.');
      const cantidadNum = parseFloat(cantidadStr);
      const precioNum = parseFloat(precioStr);
      // Permitir cantidades decimales mayores a 0.1
      if (isNaN(cantidadNum) || isNaN(precioNum) || cantidadNum < 0.1 || cantidadNum > detalle.stock) return;
      cantidadFinal = Number(cantidadNum.toFixed(1));
      precioFinal = Number(precioNum.toFixed(1));
    } else {
      if (cantidad < 1 || cantidad > detalle.stock) return;
    }
    // Si ya está en el carrito, suma la cantidad
    setCarrito((prev) => {
      const idx = prev.findIndex((item) => item._id === productoSeleccionado._id);
      if (idx !== -1) {
        const nuevo = [...prev];
        if (nuevo[idx].cantidad + cantidadFinal > detalle.stock) return prev;
        nuevo[idx].cantidad += cantidadFinal;
        return nuevo;
      }
      return [
        ...prev,
        {
          _id: productoSeleccionado._id,
          name: productoSeleccionado.name,
          marca: productoSeleccionado.marca,
          salePrice: precioFinal,
          unidad: detalle.unidad,
          stock: detalle.stock,
          cantidad: cantidadFinal,
        },
      ];
    });
    setProductoSeleccionado(null);
    setBusqueda("");
    setCantidad(1);
    setPrecioEditableStr("");
    setCantidadEditableStr("");
  };

  // Calcular total
  const totalVenta = carrito.reduce((acc, prod) => {
    const unidadNombre = getUnidadName(prod.unidad).toLowerCase();
    if (unidadNombre === "kilogramo" || unidadNombre === "litro") {
      return acc + prod.salePrice;
    }
    return acc + prod.salePrice * prod.cantidad;
  }, 0);

  // Eliminar producto del carrito
  const handleEliminarProducto = (id: string) => {
    setCarrito((prev) => prev.filter((item) => item._id !== id));
  };

  // Abrir modal al pagar
  const handlePagar = () => {
    setModalVentaOpen(true);
  };

  // Generar venta
  const handleGenerarVenta = async ({
    estado,
    tipoPago,
    // nfac, // Elimina este parámetro
  }: {
    estado: "pendiente" | "pagado";
    tipoPago: "efectivo" | "yape";
    // nfac: string; // Elimina este parámetro
  }) => {
    if (!proyectoid) return;
    if (estado === "pendiente" && !cliente) {
      alert("Debe seleccionar un cliente para guardar la venta como pendiente.");
      return;
    }
    const ventaBody = {
      email: cliente?.email,
      dni: dni ? Number(dni) : undefined,
      items: carrito.map((prod) => ({
        producto: prod._id,
        precio: prod.salePrice,
        cantidad: prod.cantidad,
      })),
      totalVenta,
      estado,
      tipoPago,
      // nfac, // Elimina esta línea
    };
    console.log("Venta body a enviar:", ventaBody);

    try {
      const res = await fetch("/api/ventas", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ventaBody),
      });
      if (res.ok) {
        setModalVentaOpen(false);
        setCarrito([]);
        alert("Venta generada correctamente");
      } else {
        alert("Error al generar la venta");
      }
    } catch (err) {
      console.error("Error en fetch venta:", err);
      alert("Error al generar la venta");
    }
  };

  return (
    <div className="venta-full">
      <header className="venta-header">
        <h2>Realizar Venta</h2>
        <button className="venta-close-btn" onClick={onClose}>
          Volver
        </button>
      </header>
      <div className="venta-body venta-body-flex">
        {/* Contenedor izquierdo */}
        <div className="venta-left">
          {/* Buscar cliente */}
          <div className="venta-cliente">
            <h4>Buscar Cliente por DNI</h4>
            <div className="venta-cliente-form">
              <input
                type="text"
                placeholder="DNI"
                value={dni}
                onChange={(e) => {
                  // Solo permite hasta 8 dígitos numéricos
                  const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                  setDni(val);
                }}
                maxLength={8}
                inputMode="numeric"
                pattern="\d{8}"
              />
              <button type="button" onClick={handleBuscarCliente} disabled={clienteLoading || dni.length !== 8}>
                Buscar
              </button>
            </div>
            {clienteLoading && <p>Buscando...</p>}
            {cliente && (
              <div className="venta-cliente-info">
                <p><b>Nombres:</b> {cliente.nombres}</p>
                <p><b>Apellidos:</b> {cliente.apellidos}</p>
                <p><b>Email:</b> {cliente.email}</p>
              </div>
            )}
            {clienteError && <p className="venta-error">{clienteError}</p>}
          </div>
          {/* Buscar y seleccionar producto */}
          <div className="venta-producto">
            <h4>Agregar Producto</h4>
            <div className="venta-autocomplete">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={e => {
                  setBusqueda(e.target.value);
                  setShowOptions(true);
                  setProductoSeleccionado(null);
                }}
                onFocus={() => setShowOptions(true)}
                autoComplete="off"
              />
              {showOptions && busqueda && productosFiltrados.length > 0 && (
                <ul className="venta-autocomplete-list">
                  {productosFiltrados.map(prod => (
                    <li
                      key={prod._id}
                      onClick={() => handleSelectProducto(prod)}
                      className="venta-autocomplete-item"
                    >
                      {prod.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {productoSeleccionado && productoSeleccionado.projectDetails && productoSeleccionado.projectDetails.length > 0 && (
              <div className="venta-producto-info">
                <p><b>Nombre:</b> {productoSeleccionado.name}</p>
                <p><b>Marca:</b> {productoSeleccionado.marca}</p>
                <p><b>Precio venta:</b> S/ {(() => {
                  const detalle = productoSeleccionado.projectDetails![0];
                  const unidadNombre = getUnidadName(detalle.unidad).toLowerCase();
                  if (unidadNombre === "kilogramo" || unidadNombre === "litro") {
                    return (
                      <input
                        type="text"
                        inputMode="decimal"
                        min={0.1}
                        value={precioEditableStr}
                        onChange={handlePrecioEditableChange}
                        className="venta-input-precio"
                        placeholder="Precio"
                        title="Precio de venta"
                      />
                    );
                  }
                  return detalle.salePrice;
                })()}</p>
                <p><b>Unidad:</b> {getUnidadName(productoSeleccionado.projectDetails[0].unidad)}</p>
                <p><b>Stock:</b> {productoSeleccionado.projectDetails[0].stock}</p>
                <div className="venta-cantidad">
                  <label>Cantidad:</label>
                  {(() => {
                    const detalle = productoSeleccionado.projectDetails![0];
                    const unidadNombre = getUnidadName(detalle.unidad).toLowerCase();
                    if (unidadNombre === "kilogramo" || unidadNombre === "litro") {
                      return (
                        <input
                          type="text"
                          inputMode="decimal"
                          min={0.1}
                          max={detalle.stock}
                          value={cantidadEditableStr}
                          onChange={handleCantidadEditableChange}
                          placeholder="Cantidad"
                          className="venta-input-cantidad"
                        />
                      );
                    }
                    return (
                      <input
                        type="number"
                        min={1}
                        max={detalle.stock}
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                        placeholder="Cantidad"
                      />
                    );
                  })()}
                  <button type="button" onClick={handleAgregarProducto}>
                    Agregar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Contenedor derecho */}
        <div className="venta-right">
          <h4>Productos en Venta</h4>
          <div className="venta-lista-productos">
            {carrito.length === 0 && <p>No hay productos agregados.</p>}
            {carrito.map((prod) => {
              const unidadNombre = getUnidadName(prod.unidad).toLowerCase();
              return (
                <div key={prod._id} className="venta-item">
                  <span>
                    {prod.name} {prod.marca && `(${prod.marca})`} - {prod.cantidad.toString().replace('.', ',')} x S/ {prod.salePrice.toString().replace('.', ',')} [{getUnidadName(prod.unidad)}]
                    {unidadNombre === "kilogramo" || unidadNombre === "litro"
                      ? ""
                      : ` = S/ ${(prod.salePrice * prod.cantidad).toFixed(2).replace('.', ',')}`}
                  </span>
                  <button className="venta-eliminar-btn" onClick={() => handleEliminarProducto(prod._id)}>Quitar</button>
                </div>
              );
            })}
          </div>
          <div className="venta-total">
            <b>Total: S/ {totalVenta.toFixed(2).replace('.', ',')}</b>
          </div>
          <button className="venta-pagar-btn" disabled={carrito.length === 0} onClick={handlePagar}>
            Pagar
          </button>
        </div>
      </div>
      <ModalVenta
        isOpen={modalVentaOpen}
        onClose={() => setModalVentaOpen(false)}
        cliente={cliente ? { ...cliente, dni } : null}
        total={Number(totalVenta.toFixed(2))}
        proyectoid={proyectoid}
        carrito={carrito}
        onVenta={handleGenerarVenta}
      />
    </div>
  );
}