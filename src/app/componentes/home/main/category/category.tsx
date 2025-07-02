"use client";
import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Categoria {
  _id: string;
  name: string;
}

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
  const [visibleCount, setVisibleCount] = React.useState(1);
  const touchStartX = useRef<number | null>(null);

  React.useEffect(() => {
    function updateVisibleCount() {
      if (window.innerWidth >= 1024) setVisibleCount(5);
      else if (window.innerWidth >= 640) setVisibleCount(4);
      else setVisibleCount(1);
      setStartIdx(0);
    }
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const allCategorias = [{ _id: "all", name: "Todos" }, ...categorias];

  const handlePrev = () => {
    setAnimDirection("left");
    setTimeout(() => {
      setStartIdx((prev) => Math.max(0, prev - 1));
      setAnimDirection(null);
    }, 180);
  };
  const handleNext = () => {
    setAnimDirection("right");
    setTimeout(() => {
      setStartIdx((prev) =>
        prev + visibleCount < allCategorias.length ? prev + 1 : prev
      );
      setAnimDirection(null);
    }, 180);
  };

  // Swipe para móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40 && startIdx > 0) handlePrev();
    else if (delta < -40 && startIdx + visibleCount < allCategorias.length) handleNext();
    touchStartX.current = null;
  };

  const visibleCategorias = allCategorias.slice(startIdx, startIdx + visibleCount);

  // Animación de desplazamiento con Tailwind
  const animClass =
    animDirection === "left"
      ? "transition-transform duration-200 -translate-x-16 opacity-60"
      : animDirection === "right"
      ? "transition-transform duration-200 translate-x-16 opacity-60"
      : "transition-transform duration-200 translate-x-0 opacity-100";

  return (
    <div
      className={`
        flex items-center justify-center mb-4 w-full
        ${visibleCount === 1 ? "max-w-xs mx-auto" : "max-w-2xl mx-auto"}
      `}
    >
      {/* Contenedor de flecha izquierda */}
      <div className="flex-shrink-0 flex items-center justify-center min-w-[48px]">
        <button
          onClick={handlePrev}
          className={`
            p-2 rounded-full bg-gray-200 text-green-800 hover:bg-green-100 disabled:opacity-50
            transition-all duration-200
            flex-shrink-0
          `}
          aria-label="Anterior"
          disabled={startIdx === 0}
        >
          <FaChevronLeft />
        </button>
      </div>
      {/* Contenedor de categorías, ocupa el espacio restante */}
      <div
        className={`
          flex-1 flex gap-2 overflow-hidden
          transition-all duration-200
          ${visibleCount === 1 ? "w-[110px]" : "w-full max-w-[420px] sm:max-w-[600px]"}
        `}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex gap-2 w-full ${animClass} ${visibleCount === 1 ? "justify-center min-w-[110px]" : "justify-start"}`}
        >
          {visibleCategorias.map((cat) => (
            <button
              key={cat._id}
              className={`
                px-3 py-2 rounded-full font-semibold shadow transition-colors duration-200
                text-xs sm:text-sm leading-tight
                ${selectedName === cat.name
                  ? "bg-green-700 text-white hover:bg-green-800"
                  : "bg-gray-200 text-green-800 hover:bg-green-100"}
                flex-shrink-0
                break-words whitespace-normal text-center
                max-w-[140px] min-w-[90px] min-h-[2.2em] max-h-[2.8em]
              `}
              onClick={() => onSelect && onSelect(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      {/* Contenedor de flecha derecha */}
      <div className="flex-shrink-0 flex items-center justify-center min-w-[48px]">
        <button
          onClick={handleNext}
          className={`
            p-2 rounded-full bg-gray-200 text-green-800 hover:bg-green-100 disabled:opacity-50
            transition-all duration-200
            flex-shrink-0
          `}
          aria-label="Siguiente"
          disabled={startIdx + visibleCount >= allCategorias.length}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}