import React, { useEffect, useState } from "react";
import Etiqueta from "./etiquetas/etiquetas";
import Modal from "./modal/modal";
import "./catalogo.css";

interface Producto {
  _id: string;
  name: string;
  marca: string;
  description: string;
  image: string;
}

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProductos = async () => {
    const res = await fetch("/api/products", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setProductos(data);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div>
      <button className="agregar-producto-btn" onClick={() => setModalOpen(true)}>
        Agregar Producto
      </button>
      <div className="catalogo-lista">
        {productos.map((prod) => (
          <Etiqueta key={prod._id} {...prod} />
        ))}
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onProductAdded={fetchProductos}
      />
    </div>
  );
}