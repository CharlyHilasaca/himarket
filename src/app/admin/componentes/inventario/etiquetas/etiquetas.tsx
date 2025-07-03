import React, { useEffect, useState } from "react";
import "./etiquetas.css";
import Image from "next/image";

interface ProjectDetail {
  proyectoId: string | number;
  purchasePrice?: number;
  salePrice?: number;
  stock?: number;
  unidad?: string;
}

interface Producto {
  _id: string;
  name: string;
  marca?: string;
  image: string;
  projectDetails?: ProjectDetail[];
}

interface EtiquetasProps {
  proyectoId: string | number;
}

export default function Etiquetas({ proyectoId }: EtiquetasProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalProducto, setModalProducto] = useState<Producto | null>(null);
  const [modalDetail, setModalDetail] = useState<ProjectDetail | null>(null);
  const [editValues, setEditValues] = useState<{ purchasePrice: string; salePrice: string; stock: string }>({
    purchasePrice: "",
    salePrice: "",
    stock: "",
  });
  const [saving, setSaving] = useState(false);

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

  // Al hacer click en una etiqueta, abre el modal con los datos actuales
  const handleEtiquetaClick = (producto: Producto) => {
    const detail = producto.projectDetails?.find(
      (pd) => String(pd.proyectoId) === String(proyectoId)
    );
    setModalProducto(producto);
    setModalDetail(detail || null);
    setEditValues({
      purchasePrice: detail?.purchasePrice?.toString() || "",
      salePrice: detail?.salePrice?.toString() || "",
      stock: detail?.stock !== undefined ? Number(detail.stock).toFixed(2) : "",
    });
  };

  // Actualiza el producto en MongoDB por proyectoId
  const handleGuardar = async () => {
    if (!modalProducto || !modalDetail) return;
    setSaving(true);
    try {
      await fetch(`/api/products/${modalProducto._id}/project-details`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchasePrice: Number(editValues.purchasePrice),
          salePrice: Number(editValues.salePrice),
          stock: Number(editValues.stock),
          unidad: modalDetail.unidad,
        }),
      });
      setModalProducto(null);
      setModalDetail(null);
    } catch {
      alert("Error al actualizar el producto.");
    }
    setSaving(false);
  };

  return (
    <div className="etiquetas-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {productos.map((producto) => (
        <div
          key={producto._id}
          className="etiqueta cursor-pointer bg-white rounded shadow p-4 flex flex-col items-center"
          onClick={() => handleEtiquetaClick(producto)}
        >
          <Image
            src={`/uploads/${producto.image}`}
            alt={producto.name}
            className="etiqueta-imagen"
            width={200}
            height={200}
          />
          <h3 className="text-black">{producto.name} {producto.marca}</h3>
          {producto.projectDetails && producto.projectDetails.length > 0 && (
            <div className="text-black">
              <p>Precio compra: S/ {producto.projectDetails[0].purchasePrice}</p>
              <p>Precio venta: S/ {producto.projectDetails[0].salePrice}</p>
              <p>
                Stock: {Number(producto.projectDetails[0].stock).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Modal de edición */}
      {modalProducto && modalDetail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModalProducto(null)}>
          <div
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-green-700 font-bold text-xl"
              onClick={() => setModalProducto(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-green-800">Editar Producto</h2>
            <div className="mb-4 text-black">
              <span className="font-semibold">Producto:</span> {modalProducto.name}
              {modalProducto.marca && <span className="ml-2">({modalProducto.marca})</span>}
            </div>
            <div className="flex flex-col gap-3 text-black">
              <label>
                <span className="font-semibold">Precio de compra:</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editValues.purchasePrice}
                  onChange={e => setEditValues(v => ({ ...v, purchasePrice: e.target.value }))}
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-black"
                />
              </label>
              <label>
                <span className="font-semibold">Precio de venta:</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editValues.salePrice}
                  onChange={e => setEditValues(v => ({ ...v, salePrice: e.target.value }))}
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-black"
                />
              </label>
              <label>
                <span className="font-semibold">Stock:</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editValues.stock}
                  onChange={e => setEditValues(v => ({ ...v, stock: e.target.value }))}
                  className="border border-gray-300 rounded px-2 py-1 w-full mt-1 text-black"
                />
              </label>
            </div>
            <button
              className="mt-6 w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition"
              onClick={handleGuardar}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}