import React, { useEffect, useState } from "react";
import "./etiquetas.css";
import Image from "next/image";
import ModalAddP from "../modaladdp/modaladdp";

interface Producto {
  _id: string;
  name: string;
  image: string;
}

export default function Etiquetas() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      const res = await fetch("/api/products", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
      }
    };
    fetchProductos();
  }, []);

  const handleAgregarProducto = (id: string) => {
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
          <button
            className="agregar-boton"
            onClick={() => handleAgregarProducto(producto._id)}
          >
            Agregar a Tienda
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