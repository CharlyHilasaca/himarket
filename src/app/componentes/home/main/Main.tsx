"use client";

import Image from "next/image";
import Category from "./category/category";
import ProductList from "./products/product";
import React, { useState, useEffect } from "react";

interface Categoria {
  _id: string;
  name: string;
}

export default function Main({ proyectoId }: { proyectoId?: number | null }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    let url = "/api/categories";
    if (proyectoId) {
      url = `/api/categories/proyecto/${proyectoId}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch(() => setCategorias([]));
  }, [proyectoId]);

  const selectedCategoryId =
    selectedCategory && selectedCategory !== "Todos"
      ? categorias.find((cat) => cat.name === selectedCategory)?._id || null
      : null;

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4" id="productos">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-green-800 text-center">
          Productos Destacados
        </h2>
        {/* Categorías dinámicas */}
        <Category onSelect={setSelectedCategory} selectedName={selectedCategory || "Todos"} categorias={categorias} />
        <ProductList categoryId={selectedCategoryId} proyectoId={proyectoId} />
      </div>
      {/* Beneficios */}
      <div className="bg-[#f8fafc] rounded-xl shadow flex flex-col md:flex-row justify-between items-center gap-6 p-8 mb-10">
        <div className="flex flex-col items-center flex-1">
          <Image src="/pagoseguro.png" alt="Pago seguro" width={48} height={48} />
          <span className="text-black font-bold text-lg mt-2">Pago Seguro</span>
          <span className="text-black text-center text-sm">Protegemos tus datos</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <Image src="/soporte.png" alt="Soporte" width={48} height={48} />
          <span className="text-black font-bold text-lg mt-2">Soporte 24/7</span>
          <span className="text-black text-center text-sm">Estamos aquí para ayudarte</span>
        </div>
      </div>
      {/* Boletín de suscripción */}
      <div className="bg-green-600 rounded-xl flex flex-col items-center justify-center py-10 px-4 mb-10">
        <h3 className="text-2xl font-bold text-white mb-2 text-center">Suscríbete a nuestro boletín</h3>
        <p className="text-white text-center mb-6">Recibe ofertas exclusivas y novedades directamente en tu correo electrónico</p>
        <form className="w-full max-w-xl flex flex-col sm:flex-row gap-3 items-center justify-center">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="flex-1 px-4 py-2 rounded-l bg-white border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 shadow min-w-[220px]"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-r bg-green-900 text-white font-semibold hover:bg-green-800 transition shadow min-w-[140px]"
          >
            Suscribirse
          </button>
        </form>
      </div>
    </main>
  );
}