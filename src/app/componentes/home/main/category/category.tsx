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

  const allCategorias = [{ _id: "all", name: "Todos" }, ...categorias];

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(0, prev - 1));
  };
  const handleNext = () => {
    setStartIdx((prev) =>
      prev + visibleCount < allCategorias.length ? prev + 1 : prev
    );
  };

  const visibleCategorias = allCategorias.slice(startIdx, startIdx + visibleCount);

  return (
    <div className="flex items-center justify-center gap-2 mb-8 w-full">
      <button
        onClick={handlePrev}
        className="p-2 rounded-full bg-gray-200 text-green-800 hover:bg-green-100 disabled:opacity-50 flex-fixed"
        aria-label="Anterior"
        disabled={startIdx === 0}
      >
        <FaChevronLeft />
      </button>
      <div className="flex gap-2 overflow-hidden w-full max-w-[95vw] sm:max-w-[600px]">
        {visibleCategorias.map((cat, i) => (
          <button
            key={cat._id + '-' + i}
            className={`flex-fixed px-5 py-2 rounded-full font-semibold shadow transition-colors duration-200 ${selectedName === cat.name ? "bg-green-700 text-white hover:bg-green-800" : "bg-gray-200 text-green-800 hover:bg-green-100"}`}
            onClick={() => onSelect && onSelect(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <button
        onClick={handleNext}
        className="p-2 rounded-full bg-gray-200 text-green-800 hover:bg-green-100 disabled:opacity-50 flex-fixed"
        aria-label="Siguiente"
        disabled={startIdx + visibleCount >= allCategorias.length}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}