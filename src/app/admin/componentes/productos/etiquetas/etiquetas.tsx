import React, { useEffect, useState } from "react";
import "./etiquetas.css";
import Image from "next/image";
import ModalAddP from "../modaladdp/modaladdp";

interface ProductoResumen {
  _id: string;
  name: string;
  marca?: string;
  image: string;
  estado: string; // "Producto en tienda" o "Agregar a Tienda"
}

export default function Etiquetas() {
  const [productos, setProductos] = useState<ProductoResumen[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      const res = await fetch("/api/productsresumen", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
      }
    };
    fetchProductos();
  }, []);

  const handleAgregarProducto = (id: string, estado: string) => {
    if (estado === "Producto en tienda") return;
    setSelectedProductId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProductId(null);
  };

  return (
    <div className="etiquetas-container">
      {productos.map((producto) => (
        <div key={producto._id} className="etiqueta">
          <Image
            src={`/uploads/${producto.image}`}
            alt={producto.name}
            className="etiqueta-imagen"
            width={200}
            height={200}
          />
          <h3>{producto.name}</h3>
          {producto.marca && <p className="etiqueta-marca">{producto.marca}</p>}
          <button
            className={`agregar-boton${producto.estado === "Producto en tienda" ? " en-tienda" : ""}`}
            onClick={() => handleAgregarProducto(producto._id, producto.estado)}
            disabled={producto.estado === "Producto en tienda"}
          >
            {producto.estado}
          </button>
        </div>
      ))}
      <ModalAddP
        isOpen={modalOpen}
        onClose={handleCloseModal}
        productId={selectedProductId}
        onSuccess={handleCloseModal}
      />
    </div>
  );
}