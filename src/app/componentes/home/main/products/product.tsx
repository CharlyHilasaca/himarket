"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Producto {
  _id: string;
  name: string;
  marca?: string;
  description?: string;
  image: string;
}

export default function ProductList({ categoryId }: { categoryId?: string | null }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 8;

  useEffect(() => {
    setStartIdx(0); // Reinicia la paginación al cambiar de categoría
    let url = "/api/products";
    if (categoryId) {
      url = `/api/productsc/${categoryId}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch(() => setProductos([]));
  }, [categoryId]);

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(0, prev - visibleCount));
  };
  const handleNext = () => {
    setStartIdx((prev) =>
      prev + visibleCount < productos.length ? prev + visibleCount : prev
    );
  };

  const visibleProductos = productos.slice(startIdx, startIdx + visibleCount);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrev}
          disabled={startIdx === 0}
          className="p-2 rounded-full bg-gray-200 text-green-800 hover:bg-green-100 disabled:opacity-50"
          aria-label="Anterior"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={handleNext}
          disabled={startIdx + visibleCount >= productos.length}
          className="p-2 rounded-full bg-gray-200 text-green-800 hover:bg-green-100 disabled:opacity-50"
          aria-label="Siguiente"
        >
          <FaChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {visibleProductos.map((prod) => (
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
    </div>
  );
}
