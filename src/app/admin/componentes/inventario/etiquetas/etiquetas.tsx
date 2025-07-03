import React, { useEffect, useState } from "react";
import "./etiquetas.css";
import Image from "next/image";

interface Producto {
  _id: string;
  name: string;
  marca?: string;
  image: string;
  projectDetails?: {
    purchasePrice: number;
    salePrice: number;
    stock: number;
    unidad: string;
  }[];
}

export default function Etiquetas() {
  const [productos, setProductos] = useState<Producto[]>([]);

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
          <h3>{producto.name} {producto.marca}</h3>
          {producto.projectDetails && producto.projectDetails.length > 0 && (
            <div>
              <p>Precio compra: S/ {producto.projectDetails[0].purchasePrice}</p>
              <p>Precio venta: S/ {producto.projectDetails[0].salePrice}</p>
              <p>
                Stock: {Number(producto.projectDetails[0].stock).toFixed(2)}
              </p>
              {/* Puedes mostrar la unidad si lo deseas */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}