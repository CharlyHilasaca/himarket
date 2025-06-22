import React, { useEffect, useState } from "react";
import './addstock.css';
import Image from "next/image";

interface Producto {
  _id: string;
  name: string;
  marca?: string;
  image: string;
  projectDetails?: {
    proyectoId: string;
    purchasePrice: number;
    salePrice: number;
    stock: number;
    stockmayor?: number;
    unidad: string;
  }[];
}

interface AddStockProps {
  onClose: () => void;
}

export default function AddStock({ onClose }: AddStockProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [stockInputs, setStockInputs] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [proyectoId, setProyectoId] = useState<string>("");

  useEffect(() => {
    // Obtener el proyectoId del usuario autenticado
    const fetchProyectoId = async () => {
      const res = await fetch("/api/userp", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProyectoId(data.proyecto_id || "");
      }
    };
    fetchProyectoId();
    // Obtener productos
    const fetchProductos = async () => {
      const res = await fetch("/api/productsproyecto", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
      }
    };
    fetchProductos();
  }, []);

  const productosFiltrados = productos.filter((p) =>
    p.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.marca && p.marca.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const handleInputChange = (id: string, value: string) => {
    setStockInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleAgregarStock = async (producto: Producto) => {
    setLoading(true);
    setMensaje("");
    const cantidad = stockInputs[producto._id];
    if (!cantidad || isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      setMensaje("Ingrese una cantidad válida para agregar stock.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/products/${producto._id}/updatestock`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockToAdd: Number(cantidad) })
      });
      if (res.ok) {
        setMensaje("Stock actualizado correctamente.");
        // Actualizar el stock en la UI
        setProductos((prev) => prev.map((p) =>
          p._id === producto._id && p.projectDetails && p.projectDetails[0]
            ? {
                ...p,
                projectDetails: [{
                  ...p.projectDetails[0],
                  stock: p.projectDetails[0].stock + Number(cantidad),
                  stockmayor: (p.projectDetails[0].stockmayor || 0) + Number(cantidad)
                }]
              }
            : p
        ));
        setStockInputs((prev) => ({ ...prev, [producto._id]: "" }));
      } else {
        const data = await res.json();
        setMensaje(data.message || "Error al actualizar el stock.");
      }
    } catch {
      setMensaje("Error de red al actualizar el stock.");
    }
    setLoading(false);
  };

  return (
    <div className="addstock-full">
      <header className="addstock-header">
        <h2>Agregar Stock</h2>
        <button className="addstock-close-btn" onClick={onClose}>
          Volver
        </button>
      </header>
      <div className="addstock-body">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="addstock-busqueda-input"
        />
        {mensaje && (
          <div
            className={
              mensaje.includes("correctamente")
                ? "addstock-mensaje addstock-mensaje-exito"
                : "addstock-mensaje addstock-mensaje-error"
            }
          >
            {mensaje}
          </div>
        )}
        <div className="etiquetas-container">
          {productosFiltrados.map((producto) => {
            // Buscar el projectDetail correspondiente al proyectoId
            const projectDetail = producto.projectDetails?.find(
              (pd) => String(pd.unidad) && String(pd.proyectoId) === String(proyectoId)
            ) || producto.projectDetails?.[0]; // fallback para compatibilidad
            return (
              <div key={producto._id} className="etiqueta addstock-etiqueta">
                <div className="addstock-img-container">
                  <Image
                    src={`/uploads/${producto.image}`}
                    alt={producto.name}
                    className="etiqueta-imagen addstock-img"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h3>{producto.name} {producto.marca}</h3>
                {projectDetail && (
                  <div>
                    {/* <p>Precio compra: S/ {projectDetail.purchasePrice}</p> */}
                    <p>Precio venta: S/ {projectDetail.salePrice}</p>
                    <p>Stock: {projectDetail.stock}</p>
                    {/* <p>Stock mayorista: {projectDetail.stockmayor ?? projectDetail.stock}</p> */}
                    <input
                      type="number"
                      min={1}
                      placeholder="Cantidad a agregar"
                      value={stockInputs[producto._id] || ""}
                      onChange={e => handleInputChange(producto._id, e.target.value)}
                      className="addstock-input"
                    />
                    <button
                      onClick={() => handleAgregarStock(producto)}
                      disabled={loading}
                      className="addstock-agregar-btn"
                    >
                      Agregar Stock
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
