import React from "react";
import "./etiquetas.css";
import Image from "next/image";

interface Producto {
  id: number;
  nombre: string;
  precio: string;
  stock: number;
  imagen: string;
}

const productos: Producto[] = [
  { id: 1, nombre: "Producto 1", precio: "$10", stock: 20, imagen: "producto.png" },
  { id: 2, nombre: "Producto 2", precio: "$15", stock: 15, imagen: "producto.png" },
  { id: 3, nombre: "Producto 3", precio: "$20", stock: 10, imagen: "producto.png" },
  { id: 4, nombre: "Producto 4", precio: "$25", stock: 5, imagen: "producto.png" },
  { id: 5, nombre: "Producto 5", precio: "$30", stock: 8, imagen: "producto.png" },
  { id: 6, nombre: "Producto 6", precio: "$35", stock: 12, imagen: "producto.png" },
  { id: 7, nombre: "Producto 7", precio: "$35", stock: 12, imagen: "producto.png" },
  { id: 8, nombre: "Producto 8", precio: "$35", stock: 12, imagen: "producto.png" },
  { id: 9, nombre: "Producto 9", precio: "$35", stock: 12, imagen: "producto.png" },
  { id: 10, nombre: "Producto 10", precio: "$35", stock: 12, imagen: "producto.png" },
  { id: 11, nombre: "Producto 11", precio: "$35", stock: 12, imagen: "producto.png" },
  { id: 12, nombre: "Producto 12", precio: "$35", stock: 12, imagen: "producto.png" },
  { id: 13, nombre: "Producto 13", precio: "$35", stock: 12, imagen: "producto.png" },
  { id: 14, nombre: "Producto 14", precio: "$35", stock: 12, imagen: "producto.png" },
  { id: 15, nombre: "Producto 15", precio: "$35", stock: 12, imagen: "producto.png" },
  { id: 16, nombre: "Producto 16", precio: "$35", stock: 12, imagen: "producto.png" },
  { id: 17, nombre: "Producto 17", precio: "$35", stock: 12, imagen: "producto.png" },
  { id: 18, nombre: "Producto 18", precio: "$35", stock: 12, imagen: "producto.png" },
];

export default function Etiquetas() {
  return (
    <div className="etiquetas-container">
      {productos.map((producto) => (
        <div key={producto.id} className="etiqueta">
          <Image
            src={`/${producto.imagen}`}
            alt={producto.nombre}
            className="etiqueta-imagen"
            width={200}
            height={200}
          />

          <h3>{producto.nombre}</h3>
          <p>Precio: {producto.precio}</p>
          <p>Stock: {producto.stock}</p>
        </div>
      ))}
    </div>
  );
}