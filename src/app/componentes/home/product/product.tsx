"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "../../footer/Footer";

interface ProjectDetail {
  proyectoId: string | number;
  salePrice?: number;
  // Puedes agregar más campos si los necesitas
}

interface Producto {
  _id: string;
  name: string;
  marca?: string;
  description?: string;
  image?: string;
  categoryIds?: string[];
  projectDetails?: ProjectDetail[];
}

interface ProductDetailOverlayProps {
  productId: string;
  onBack: () => void;
  user?: { username?: string; email?: string } | null;
  proyectoId?: number | null;
}

export default function ProductDetailOverlay({
  productId,
  onBack,
  user,
  proyectoId
}: ProductDetailOverlayProps) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>(productId);

  useEffect(() => {
    setSelectedProductId(productId);
  }, [productId]);

  useEffect(() => {
    fetch(`/api/products/${selectedProductId}`)
      .then(res => res.json())
      .then(data => {
        setProducto(data);
        if (data && data.categoryIds && data.categoryIds.length > 0) {
          fetch(`/api/productsc/${data.categoryIds[0]}`)
            .then(res => res.json())
            .then((productosRelacionados: Producto[]) => {
              // Filtra productos relacionados por proyectoId
              const relacionadosFiltrados = proyectoId
                ? productosRelacionados.filter(
                    (prod) =>
                      Array.isArray(prod.projectDetails) &&
                      prod.projectDetails.some(
                        (pd: ProjectDetail) => String(pd.proyectoId) === String(proyectoId)
                      )
                  )
                : productosRelacionados;
              setRelacionados(relacionadosFiltrados);
            });
        }
      });
  }, [selectedProductId, proyectoId]);

  // Obtener el precio si hay sesión y proyectoId
  let salePrice: string | null = null;
  if (
    user &&
    proyectoId &&
    producto &&
    Array.isArray(producto.projectDetails)
  ) {
    const detail = producto.projectDetails.find(
      (pd: ProjectDetail) => String(pd.proyectoId) === String(proyectoId)
    );
    if (detail && detail.salePrice !== undefined) {
      salePrice = `S/ ${detail.salePrice}`;
    }
  }

  return (
    <>
      <div className="w-full flex-1 flex justify-center items-start bg-transparent">
        <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg mt-8 mb-8 relative min-h-[400px]">
          <button onClick={onBack} className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 rounded z-10">Volver</button>
          {/* Lado izquierdo: Producto principal */}
          <div className="w-full md:w-1/2 p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200 min-h-[400px] max-h-[600px]">
            {producto ? (
              <>
                <div className="w-[160px] h-[160px] relative flex items-center justify-center">
                  <Image
                    src={producto.image ? (producto.image.startsWith("/uploads/") ? producto.image : `/uploads/${producto.image}`) : "/placeholder.webp"}
                    alt={producto.name || "Producto"}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-green-900">{producto.name}</h2>
                {producto.marca && <div className="text-green-700 mt-2">Marca: {producto.marca}</div>}
                {producto.description && <div className="text-gray-700 mt-2">{producto.description}</div>}
                {user && proyectoId && salePrice && (
                  <>
                    <div className="text-green-800 mt-4 text-xl font-bold">Precio: {salePrice}</div>
                    <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition font-semibold">
                      Agregar al carrito
                    </button>
                  </>
                )}
                {!user && (
                  <div className="text-red-500 mt-4 text-sm">Inicia sesión para ver el precio</div>
                )}
              </>
            ) : <div>Cargando...</div>}
          </div>
          {/* Lado derecho: Productos relacionados */}
          <div className="w-full md:w-1/2 p-8 flex flex-col gap-3 min-h-[400px] max-h-[600px] overflow-y-auto">
            <h3 className="text-lg font-bold text-green-800 mb-2">Productos de la misma categoría</h3>
            <div className="flex flex-row flex-wrap gap-2 md:flex-col">
              {relacionados.filter(p => p._id !== selectedProductId).map(prod => (
                <button
                  key={prod._id}
                  className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2 min-w-[140px] hover:bg-green-100 transition"
                  onClick={() => setSelectedProductId(prod._id)}
                >
                  <Image src={prod.image ? (prod.image.startsWith("/uploads/") ? prod.image : `/uploads/${prod.image}`) : "/placeholder.webp"} alt={prod.name || "Producto relacionado"} width={32} height={32} />
                  <span className="font-semibold text-green-900">{prod.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
