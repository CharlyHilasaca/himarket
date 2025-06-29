"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface ProjectDetail {
  proyectoId: string | number;
  salePrice?: number;
  unidad?: string;
}

interface Producto {
  _id: string;
  name: string;
  marca?: string;
  description?: string;
  image: string;
  categoryIds?: string[];
  salePrice?: number; // <-- Añadido para mostrar el precio por proyecto
  projectDetails?: ProjectDetail[];
}

export default function Products({
  initialSearch = "",
  resetKey,
  proyectoId,
  onCarritoChange // nuevo prop opcional
}: {
  initialSearch?: string;
  onProductClick?: (id: string) => void;
  resetKey?: number;
  proyectoId?: number | null;
  onCarritoChange?: (cantidad: number) => void; // nuevo prop
}) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [filtered, setFiltered] = useState<Producto[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 16;

  useEffect(() => {
    let url = "/api/products";
    if (proyectoId) {
      url = `/api/productsp?proyectoId=${proyectoId}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data: Producto[]) => {
        if (proyectoId) {
          setProductos(
            data.map((prod: Producto) => {
              const projectDetail = Array.isArray(prod.projectDetails)
                ? prod.projectDetails.find(
                    (pd) => String(pd.proyectoId) === String(proyectoId)
                  )
                : undefined;
              return {
                ...prod,
                name: prod.marca ? `${prod.name} - ${prod.marca}` : prod.name,
                marca: projectDetail?.salePrice !== undefined ? `S/ ${projectDetail.salePrice}` : undefined,
              };
            })
          );
        } else {
          setProductos(data);
        }
      })
      .catch(() => setProductos([]));
  }, [proyectoId, resetKey]);

  useEffect(() => {
    if (!search) {
      setFiltered(productos);
      return;
    }
    const match = productos.find(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (match) {
      const sameCat = productos.filter(p => p._id !== match._id && p.categoryIds?.some(cid => match.categoryIds?.includes(cid)));
      setFiltered([match, ...sameCat]);
    } else {
      setFiltered([]);
    }
  }, [search, productos]);

  useEffect(() => {
    setSearch(initialSearch || "");
  }, [initialSearch, resetKey]);

  // Paginación
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  useEffect(() => {
    if (page > 0 && page >= totalPages) setPage(0);
  }, [search, totalPages, page]);

  // Elimina carritoCantidad, solo usa onCarritoChange para comunicar el cambio
  // const [carritoCantidad, setCarritoCantidad] = useState(0);

  // Obtener cantidad de productos en el carrito al cargar
  useEffect(() => {
    fetch("/api/carrito", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data.productos)) {
          if (onCarritoChange) {
            onCarritoChange(data.productos.length);
          }
        }
      });
    // Incluye onCarritoChange en dependencias
  }, [onCarritoChange]);

  // Función para agregar producto al carrito
  const handleAgregarCarrito = async (prod: Producto) => {
    // Obtener el carrito actual
    const res = await fetch("/api/carrito", { credentials: "include" });
    let carrito: { productos: {
      producto_id: string;
      name: string;
      marca?: string;
      cantidad: number;
      precio: number;
      unidad?: string;
    }[] } | null = null;
    if (res.ok) {
      carrito = await res.json();
    } else {
      // Si no existe, créalo
      const createRes = await fetch("/api/carrito", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (createRes.ok) {
        const data = await createRes.json();
        carrito = data.carrito;
      }
    }
    if (!carrito) return;

    // Buscar si ya está el producto
    const productos = carrito.productos || [];
    const idx = productos.findIndex((p) => p.producto_id === prod._id);
    if (idx !== -1) {
      productos[idx].cantidad += 1;
    } else {
      productos.push({
        producto_id: prod._id,
        name: prod.name,
        marca: prod.marca,
        cantidad: 1,
        precio: prod.projectDetails?.[0]?.salePrice || prod.salePrice || 0,
        unidad: prod.projectDetails?.[0]?.unidad || "",
      });
    }
    // Actualizar el carrito
    const total = productos.reduce((acc: number, p) => acc + p.precio * p.cantidad, 0);
    const putRes = await fetch("/api/carrito", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos, total }),
    });
    if (putRes.ok) {
      if (onCarritoChange) {
        onCarritoChange(productos.length);
      }
    }
  };

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
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-600 mb-4">No se encontraron productos.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center mb-4 gap-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="catalogo-flecha text-gray-800"
              >
                &#8592;
              </button>
              <span className="text-gray-800">
                Página {page + 1} de {totalPages || 1}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="catalogo-flechac text-gray-800"
              >
                &#8594;
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {paginated.map(prod => (
                <div key={prod._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between items-center h-[auto] min-h-[auto] cursor-pointer">
                  <div className="flex flex-col items-center w-full flex-1">
                    <div className="w-[100px] h-[100px] relative flex items-center justify-center">
                      <Image
                        src={prod.image.startsWith("/uploads/") ? prod.image : `/uploads/${prod.image}`}
                        alt={prod.name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <h3 className="mt-2 font-bold text-green-900 text-center w-full min-h-[32px] flex items-center justify-center">{prod.name}</h3>
                    <span className="text-green-700 text-sm min-h-[20px] flex items-center justify-center w-full">{prod.marca || "\u00A0"}</span>
                  </div>
                  <div className="w-full flex items-end justify-center mt-2 min-h-[40px]">
                    <button
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 w-full max-w-[120px]"
                      onClick={() => handleAgregarCarrito(prod)}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}