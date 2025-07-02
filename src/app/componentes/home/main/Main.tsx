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
  categoryIds?: string[];
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
  const [selectedProduct, setSelectedProduct] = useState<ProductoDetalle | null>(null);
  const [relacionados, setRelacionados] = useState<ProductoDetalle[]>([]);

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

  // Cuando seleccionas un producto, carga sus datos y los relacionados
  useEffect(() => {
    if (!selectedProductId) {
      setSelectedProduct(null);
      setRelacionados([]);
      return;
    }
    fetch(`/api/products/${selectedProductId}`)
      .then(res => res.json())
      .then((producto: ProductoDetalle) => {
        setSelectedProduct(producto);
        // Buscar productos de la misma categoría (solo si hay categoría)
        if (producto.categoryIds && producto.categoryIds.length > 0) {
          fetch(`/api/productsc/${producto.categoryIds[0]}`)
            .then(res => res.json())
            .then((rel: ProductoDetalle[]) => {
              setRelacionados(rel.filter(p => p._id !== producto._id));
            });
        } else {
          setRelacionados([]);
        }
      });
  }, [selectedProductId]);

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto py-4 px-2 sm:py-8 sm:px-4" id="productos">
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 mb-6 sm:mb-10">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-green-800 text-center">
          Productos Destacados
        </h2>
        {/* Categorías dinámicas */}
        <Category onSelect={setSelectedCategory} selectedName={selectedCategory || "Todos"} categorias={categorias} />
        {/* Si hay producto seleccionado, muestra el detalle, si no, muestra la lista */}
        {selectedProduct ? (
          <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
              {/* Imagen a la izquierda */}
              <div className="flex-shrink-0 flex items-center justify-center w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] relative">
                <Image
                  src={selectedProduct.image ? (selectedProduct.image.startsWith("/uploads/") ? selectedProduct.image : `/uploads/${selectedProduct.image}`) : "/placeholder.webp"}
                  alt={selectedProduct.name || "Producto"}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              {/* Datos a la derecha */}
              <div className="flex flex-col items-end text-right flex-1">
                <h2 className="text-2xl font-bold text-green-900">{selectedProduct.name}</h2>
                {selectedProduct.marca && <div className="text-green-700 mt-2">Marca: {selectedProduct.marca}</div>}
                {selectedProduct.description && <div className="text-gray-700 mt-2">{selectedProduct.description}</div>}
                {proyectoId && selectedProduct.projectDetails && (
                  <div className="text-green-800 text-lg font-bold mt-2">
                    Precio: S/ {selectedProduct.projectDetails.find((pd) => String(pd.proyectoId) === String(proyectoId))?.salePrice ?? "-"}
                  </div>
                )}
                <button
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition font-semibold"
                  onClick={() => setSelectedProductId(null)}
                  type="button"
                >
                  Volver
                </button>
              </div>
            </div>
            {/* Productos de la misma categoría */}
            <div className="w-full mt-6">
              <h3 className="text-lg font-bold text-green-800 mb-3">Productos de la misma categoría</h3>
              <div className="flex flex-wrap gap-2">
                {relacionados.length === 0 && (
                  <span className="text-gray-500">No hay productos relacionados.</span>
                )}
                {relacionados.map(prod => (
                  <button
                    key={prod._id}
                    className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2 min-w-[120px] hover:bg-green-100 transition"
                    onClick={() => setSelectedProductId(prod._id)}
                  >
                    <Image src={prod.image ? (prod.image.startsWith("/uploads/") ? prod.image : `/uploads/${prod.image}`) : "/placeholder.webp"} alt={prod.name || "Producto relacionado"} width={32} height={32} />
                    <span className="font-semibold text-green-900">{prod.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ProductList
            categoryId={selectedCategoryId}
            proyectoId={proyectoId}
            onProductClick={setSelectedProductId}
          />
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