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
  proyectoId
}: {
  categoryId?: string | null;
  proyectoId?: number | null;
}) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [startIdx, setStartIdx] = useState(0);
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
          const stockmayor = typeof prod.stockmayor === "number" ? prod.stockmayor : (
            Array.isArray(prod.projectDetails)
              ? prod.projectDetails[0]?.stockmayor
              : undefined
          );
          let alerta = null;
          if (
            proyectoId &&
            typeof proyectoId === "number" &&
            typeof stock === "number" &&
            typeof stockmayor === "number"
          ) {
            if (stock === 0) {
              alerta = <span className="text-red-600 font-bold text-xs mt-1">Sin stock</span>;
            } else if (stockmayor > 0 && stock < stockmayor * 0.15) {
              alerta = <span className="text-yellow-600 font-bold text-xs mt-1">Bajo stock</span>;
            }
          }
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
                {alerta}
              </div>
              <div className="w-full flex items-end justify-center mt-2 min-h-[40px]">
                <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 w-full max-w-[120px]">Agregar</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
