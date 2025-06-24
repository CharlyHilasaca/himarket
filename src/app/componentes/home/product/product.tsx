"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Producto {
  _id: string;
  name: string;
  marca?: string;
  description?: string;
  image?: string;
  categoryIds?: string[];
}

interface ProductDetailOverlayProps {
  productId: string;
  onBack: () => void;
}

export default function ProductDetailOverlay({ productId, onBack }: ProductDetailOverlayProps) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProducto(data);
        if (data && data.categoryIds && data.categoryIds.length > 0) {
          fetch(`/api/productsc/${data.categoryIds[0]}`)
            .then(res => res.json())
            .then(setRelacionados);
        }
      });
  }, [productId]);

  return (
    <div className="w-full flex-1 flex justify-center items-start bg-transparent">
      <div className="w-full max-w-5xl flex bg-white rounded-xl shadow-lg mt-8 mb-8 relative min-h-[400px]">
        <button onClick={onBack} className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 rounded z-10">Volver</button>
        {/* Lado izquierdo */}
        <div className="flex-1 p-8 flex flex-col items-center border-r border-gray-200 min-h-[400px] max-h-[600px]">
          {producto ? (
            <>
              <Image
                src={producto.image ? (producto.image.startsWith("/uploads/") ? producto.image : `/uploads/${producto.image}`) : "/placeholder.png"}
                alt={producto.name || "Producto"}
                width={120}
                height={120}
              />
              <h2 className="mt-4 text-2xl font-bold text-green-900">{producto.name}</h2>
              {producto.marca && <div className="text-green-700 mt-2">Marca: {producto.marca}</div>}
              {producto.description && <div className="text-gray-700 mt-2">{producto.description}</div>}
            </>
          ) : <div>Cargando...</div>}
        </div>
        {/* Lado derecho */}
        <div className="flex-1 p-8 flex flex-col gap-3 min-h-[400px] max-h-[600px] overflow-y-auto">
          <h3 className="text-lg font-bold text-green-800 mb-2">Productos de la misma categoría</h3>
          <div className="flex flex-col gap-2">
            {relacionados.filter(p => p._id !== productId).map(prod => (
              <div key={prod._id} className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2 min-w-[180px]">
                <Image src={prod.image ? (prod.image.startsWith("/uploads/") ? prod.image : `/uploads/${prod.image}`) : "/placeholder.png"} alt={prod.name || "Producto relacionado"} width={32} height={32} />
                <span className="font-semibold text-green-900">{prod.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
