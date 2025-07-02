"use client";

import Image from "next/image";
import Category from "./category/category";
import ProductList from "./products/product";
import React, { useState, useEffect } from "react";

// Define una interfaz para el producto
interface ProductoDetalle {
  _id: string;
  name: string;
  marca?: string;
  description?: string;
  image?: string;
  projectDetails?: {
    proyectoId: string | number;
    salePrice?: number;
  }[];
}

interface Categoria {
  _id: string;
  name: string;
}

export default function Main({ proyectoId }: { proyectoId?: number | null }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

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
    <main className="flex-1 w-full max-w-6xl mx-auto py-4 px-2 sm:py-8 sm:px-4" id="productos">
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 mb-6 sm:mb-10">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-800 text-center">
          Productos Destacados
        </h2>
        {/* Categorías dinámicas */}
        <Category onSelect={setSelectedCategory} selectedName={selectedCategory || "Todos"} categorias={categorias} />
        <ProductList
          categoryId={selectedCategoryId}
          proyectoId={proyectoId}
          onProductClick={setSelectedProductId}
        />
        {/* Overlay de detalle de producto */}
        {selectedProductId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full relative p-6">
              <button
                className="absolute top-4 right-4 text-green-700 font-bold text-xl"
                onClick={() => setSelectedProductId(null)}
                aria-label="Cerrar"
                type="button"
              >×</button>
              {/* Aquí puedes reutilizar tu componente de detalle de producto si lo tienes */}
              {/* O mostrar los datos básicos del producto */}
              <ProductDetail productId={selectedProductId} proyectoId={proyectoId} />
            </div>
          </div>
        )}
      </div>
      {/* Beneficios */}
      <div className="bg-[#f8fafc] rounded-xl shadow flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 p-4 sm:p-8 mb-6 sm:mb-10">
        <div className="flex flex-col items-center flex-1">
          <Image src="/pagoseguro.webp" alt="Pago seguro" width={40} height={40} className="sm:w-12 sm:h-12" />
          <span className="text-black font-bold text-base sm:text-lg mt-2">Pago Seguro</span>
          <span className="text-black text-center text-xs sm:text-sm">Protegemos tus datos</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <Image src="/soporte.webp" alt="Soporte" width={40} height={40} className="sm:w-12 sm:h-12" />
          <span className="text-black font-bold text-base sm:text-lg mt-2">Soporte 24/7</span>
          <span className="text-black text-center text-xs sm:text-sm">Estamos aquí para ayudarte</span>
        </div>
      </div>
      {/* Boletín de suscripción */}
      <div className="bg-green-600 rounded-xl flex flex-col items-center justify-center py-6 px-2 sm:py-10 sm:px-4 mb-6 sm:mb-10">
        <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 text-center">Suscríbete a nuestro boletín</h3>
        <p className="text-white text-center mb-4 sm:mb-6 text-sm sm:text-base">Recibe ofertas exclusivas y novedades directamente en tu correo electrónico</p>
        <form className="w-full max-w-xl flex flex-col sm:flex-row gap-3 items-center justify-center">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="flex-1 px-3 py-2 rounded-l bg-white border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 shadow min-w-[140px] sm:min-w-[220px] text-sm sm:text-base"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-r bg-green-900 text-white font-semibold hover:bg-green-800 transition shadow min-w-[100px] sm:min-w-[140px] text-sm sm:text-base"
          >
            Suscribirse
          </button>
        </form>
      </div>
    </main>
  );
}

// Componente de detalle de producto (puedes moverlo a su propio archivo si lo prefieres)
function ProductDetail({ productId, proyectoId }: { productId: string, proyectoId?: number | null }) {
  const [producto, setProducto] = useState<ProductoDetalle | null>(null);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(setProducto);
  }, [productId]);

  if (!producto) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-[120px] h-[120px] relative">
        <Image
          src={producto.image ? (producto.image.startsWith("/uploads/") ? producto.image : `/uploads/${producto.image}`) : "/placeholder.webp"}
          alt={producto.name || "Producto"}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <h2 className="text-2xl font-bold text-green-900">{producto.name}</h2>
      {producto.marca && <div className="text-green-700">Marca: {producto.marca}</div>}
      {producto.description && <div className="text-gray-700">{producto.description}</div>}
      {/* Puedes agregar más detalles aquí */}
      {proyectoId && producto.projectDetails && (
        <div className="text-green-800 text-lg font-bold mt-2">
          Precio: S/ {producto.projectDetails.find((pd) => String(pd.proyectoId) === String(proyectoId))?.salePrice ?? "-"}
        </div>
      )}
    </div>
  );
}