"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ProjectDetail {
  proyectoId: string | number;
  salePrice?: number;
  stock?: number;
  stockmayor?: number;
  unidad?: string; // id de la unidad
}

interface Unidad {
  _id: string;
  name: string;
  abbreviation: string;
  description?: string;
}

interface Producto {
  _id: string;
  name: string;
  marca?: string;
  description?: string;
  image: string;
  salePrice?: number;
  projectDetails?: ProjectDetail[];
  stock?: number;        // <-- Añadido
  stockmayor?: number;   // <-- Añadido
}

export default function ProductList({
  categoryId,
  proyectoId,
  onCarritoChange // nuevo prop
}: {
  categoryId?: string | null;
  proyectoId?: number | null;
  onCarritoChange?: (cantidad: number) => void; // nuevo prop
}) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [startIdx, setStartIdx] = useState(0);
  const [agregando, setAgregando] = useState<string | null>(null);
  const visibleCount = 8;

  useEffect(() => {
    setStartIdx(0); // Reinicia la paginación al cambiar de categoría o proyecto
    let url = "/api/products";
    if (proyectoId && categoryId) {
      url = `/api/productsp?proyectoId=${proyectoId}&categoryId=${categoryId}`;
    } else if (proyectoId) {
      url = `/api/productsp?proyectoId=${proyectoId}`;
    } else if (categoryId) {
      url = `/api/productsc/${categoryId}`;
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
                stock: projectDetail?.stock,
                stockmayor: projectDetail?.stockmayor,
              };
            })
          );
        } else {
          setProductos(data);
        }
      })
      .catch(() => setProductos([]));
  }, [categoryId, proyectoId]);

  useEffect(() => {
    fetch("/api/unidades")
      .then(res => res.json())
      .then((data: Unidad[]) => setUnidades(data))
      .catch(() => setUnidades([]));
  }, []);

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(0, prev - visibleCount));
  };
  const handleNext = () => {
    setStartIdx((prev) =>
      prev + visibleCount < productos.length ? prev + visibleCount : prev
    );
  };

  const handleAgregar = async (prod: Producto) => {
    // Validar stock antes de intentar agregar
    const stock =
      typeof prod.stock === "number"
        ? prod.stock
        : Array.isArray(prod.projectDetails)
        ? prod.projectDetails[0]?.stock
        : undefined;
    if (typeof stock !== "number" || stock <= 0) {
      setAgregando(null);
      return;
    }
    setAgregando(prod._id);
    // Construir el producto para el carrito
    const productoCarrito = {
      producto_id: prod._id,
      name: prod.name,
      marca: prod.marca,
      cantidad: 1,
      precio: prod.projectDetails?.[0]?.salePrice ?? prod.salePrice ?? 0,
      unidad: prod.projectDetails?.[0]?.unidad
    };
    // Obtener el carrito actual
    let carrito;
    try {
      const res = await fetch("/api/carrito", { credentials: "include" });
      if (res.ok) {
        carrito = await res.json();
      } else {
        // Si no existe, crearlo
        const crear = await fetch("/api/carrito", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        carrito = await crear.json();
        carrito = carrito.carrito;
      }
    } catch {
      setAgregando(null);
      return;
    }
    // Verificar si ya está el producto
    const productos = Array.isArray(carrito.productos) ? [...carrito.productos] : [];
    interface CarritoProducto {
      producto_id: string;
      name: string;
      marca?: string;
      cantidad: number;
      precio: number;
      unidad?: string;
    }

    const idx = productos.findIndex((p: CarritoProducto) => p.producto_id === prod._id);
    if (idx >= 0) {
      productos[idx].cantidad += 1;
    } else {
      productos.push(productoCarrito);
    }
    const total = productos.reduce((acc: number, p: CarritoProducto) => acc + p.precio * p.cantidad, 0);
    // Actualizar el carrito
    await fetch("/api/carrito", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos, total })
    });
    setAgregando(null);
    if (onCarritoChange) onCarritoChange(productos.reduce((acc: number, p: CarritoProducto) => acc + p.cantidad, 0));
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
        {visibleProductos.map((prod) => {
          // Obtener stock y stockmayor
          const stock = typeof prod.stock === "number" ? prod.stock : (
            Array.isArray(prod.projectDetails)
              ? prod.projectDetails[0]?.stock
              : undefined
          );
          let unidadAbrev = "";
            let unidadId: string | undefined = undefined;
          if (typeof prod.stock === "number" || (Array.isArray(prod.projectDetails) && prod.projectDetails[0])) {
            unidadId = prod.projectDetails?.[0]?.unidad;
            if (unidadId && unidades.length > 0) {
              const unidadObj = unidades.find(u => u._id === unidadId);
              if (unidadObj) unidadAbrev = unidadObj.abbreviation;
            }
          }
          return (
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
                {proyectoId && typeof proyectoId === "number" && (
                  <span className="text-gray-700 text-xs mt-1">
                    Stock: {typeof stock === "number"
                      ? (Math.floor(stock * 100) / 100).toFixed(2)
                      : "-"}
                    {unidadAbrev && <> {unidadAbrev}</>}
                  </span>
                )}
              </div>
              <div className="w-full flex items-end justify-center mt-2 min-h-[40px]">
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 w-full max-w-[120px] flex items-center justify-center"
                  onClick={() => handleAgregar(prod)}
                  disabled={agregando === prod._id || typeof stock !== "number" || stock <= 0}
                >
                  {typeof stock !== "number" || stock <= 0
                    ? "Sin stock"
                    : agregando === prod._id
                    ? "Agregando..."
                    : "Agregar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
