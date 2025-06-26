"use client";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Categoria {
  _id: string;
  name: string;
}

const visibleCount = 5;

export default function Category({
  onSelect,
  selectedName,
  categorias = []
}: {
  onSelect?: (name: string) => void;
  selectedName?: string;
  categorias?: Categoria[];
}) {
  const [startIdx, setStartIdx] = React.useState(0);
  const [animDirection, setAnimDirection] = React.useState<"left" | "right" | null>(null);

  const allCategorias = [{ _id: "all", name: "Todos" }, ...categorias];

  const handlePrev = () => {
    setAnimDirection("left");
    setTimeout(() => {
      setStartIdx((prev) => (prev - 1 + allCategorias.length) % allCategorias.length);
      setAnimDirection(null);
    }, 200);
  };
  const handleNext = () => {
    setAnimDirection("right");
    setTimeout(() => {
      setStartIdx((prev) => (prev + 1) % allCategorias.length);
      setAnimDirection(null);
    }, 200);
  };

  const visibleCategorias = [];
  for (let i = 0; i < visibleCount; i++) {
    visibleCategorias.push(allCategorias[(startIdx + i) % allCategorias.length]);
  }

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <button
        onClick={handlePrev}
        className="p-2 rounded-full bg-gray-200 text-green-800 hover:bg-green-100 disabled:opacity-50"
        aria-label="Anterior"
      >
        <FaChevronLeft />
      </button>
      <div className={`flex gap-2 transition-transform duration-200 ${animDirection === "left" ? "-translate-x-8 opacity-60" : animDirection === "right" ? "translate-x-8 opacity-60" : "translate-x-0 opacity-100"}`}>
        {visibleCategorias.map((cat, i) => (
          <button
            key={cat._id + '-' + i}
            className={`px-5 py-2 rounded-full font-semibold shadow transition-colors duration-200 ${selectedName === cat.name ? "bg-green-700 text-white hover:bg-green-800" : "bg-gray-200 text-green-800 hover:bg-green-100"}`}
            onClick={() => onSelect && onSelect(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <button
        onClick={handleNext}
        className="p-2 rounded-full bg-gray-200 text-green-800 hover:bg-green-100 disabled:opacity-50"
        aria-label="Siguiente"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}