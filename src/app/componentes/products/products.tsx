"use client";
import React, { useEffect, useState } from "react";
import Footer from "../footer/Footer";
import Image from "next/image";

interface Producto {
  _id: string;
  name: string;
  marca?: string;
  description?: string;
  image: string;
  categoryIds?: string[];
}

export default function Products({ initialSearch = "", resetKey }: { initialSearch?: string, onProductClick?: (id: string) => void, resetKey?: number }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [filtered, setFiltered] = useState<Producto[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch(() => setProductos([]));
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(productos);
      return;
    }
    const match = productos.find(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (match) {
      // Primero el producto que coincide, luego los de su categoría (sin repetir)
      const sameCat = productos.filter(p => p._id !== match._id && p.categoryIds?.some(cid => match.categoryIds?.includes(cid)));
      setFiltered([match, ...sameCat]);
    } else {
      setFiltered([]);
    }
  }, [search, productos]);

  useEffect(() => {
    setSearch(initialSearch || ""); // Limpiar el input si cambia la sección o el valor inicial
  }, [initialSearch, resetKey]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans">
      <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            value={search}
            onChange={handleInput}
            placeholder="Buscar productos..."
            className="w-full max-w-xl px-4 py-2 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 shadow"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map(prod => (
            <div key={prod._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between items-center h-[auto] min-h-[auto] cursor-pointer">
              <div className="flex flex-col items-center w-full flex-1">
                <Image src={prod.image.startsWith("/uploads/") ? prod.image : `/uploads/${prod.image}`} alt={prod.name} width={80} height={80} />
                <h3 className="mt-2 font-bold text-green-900 text-center w-full min-h-[32px] flex items-center justify-center">{prod.name}</h3>
                <span className="text-green-700 text-sm min-h-[20px] flex items-center justify-center w-full">{prod.marca || "\u00A0"}</span>
              </div>
              <div className="w-full flex items-end justify-center mt-2 min-h-[40px]">
                <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 w-full max-w-[120px]">Agregar</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
