import Image from "next/image";
import React, { useState, useEffect } from "react";

interface Producto {
  _id: string;
  name: string;
  marca?: string;
  image: string;
}

interface SectionProps {
  onSearchProduct: (id: string) => void;
  onSearchText: (text: string) => void;
  searchText: string;
  resetKey: number;
  proyectoId?: number | null; // <-- nuevo prop
}

export default function Section({ onSearchProduct, onSearchText, searchText, resetKey, proyectoId }: SectionProps) {
  const [input, setInput] = useState(searchText || "");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [suggestions, setSuggestions] = useState<Producto[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    let url = "/api/products";
    if (proyectoId) {
      url = `/api/productsp?proyectoId=${proyectoId}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(setProductos);
  }, [proyectoId]);

  useEffect(() => {
    setInput(""); // Limpiar el input si cambia la sección desde el header o resetKey
  }, [searchText, resetKey]);

  useEffect(() => {
    if (input.length > 0) {
      // Ordenar por mejor coincidencia: primero los que empiezan igual, luego los que contienen
      const inputLower = input.toLowerCase();
      const startsWith = productos.filter(
        p =>
          p.name.toLowerCase().startsWith(inputLower) ||
          (p.marca && p.marca.toLowerCase().startsWith(inputLower))
      );
      const contains = productos.filter(
        p =>
          !(
            p.name.toLowerCase().startsWith(inputLower) ||
            (p.marca && p.marca.toLowerCase().startsWith(inputLower))
          ) &&
          (p.name.toLowerCase().includes(inputLower) ||
            (p.marca && p.marca.toLowerCase().includes(inputLower)))
      );
      const filtered = [...startsWith, ...contains];
      setSuggestions(filtered.slice(0, 5));
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [input, productos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchText(input);
    setInput(""); // Limpiar el input después de buscar
  };

  const handleSelect = (prod: Producto) => {
    setInput(""); // Limpiar el input después de seleccionar
    setShowDropdown(false);
    onSearchProduct(prod._id);
  };

  return (
    <section className="w-full relative flex items-center justify-center min-h-[280px] sm:min-h-[380px] text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="/abarrotes.webp"
          alt="Fondo abarrotes"
          fill
          className="object-cover w-full h-full pointer-events-none select-none"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-white/15 backdrop-blur z-10 flex flex-col items-center justify-center px-2 py-6 sm:px-4 sm:py-12">
        <h1 className="text-xl sm:text-3xl font-bold mb-2 text-white-900 drop-shadow-lg text-center">
          ¡Bienvenido a tu tienda de bodeguera favorita!
        </h1>
        <p className="text-base sm:text-lg text-white-800 mb-4 sm:mb-6 drop-shadow text-center">
          Encuentra productos frescos, ofertas y la mejor atención para tu hogar.
        </p>
        <form className="w-full max-w-md mx-auto flex items-center gap-2 relative" onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Buscar productos..."
            className="flex-1 px-3 py-2 sm:px-4 rounded-l bg-white/90 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 shadow text-sm sm:text-base"
            onFocus={() => input && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />
          <button
            type="submit"
            className="px-3 py-2 sm:px-4 rounded-r bg-green-700 text-white font-semibold hover:bg-green-800 transition shadow text-sm sm:text-base"
          >
            Buscar
          </button>
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-green-200 rounded shadow z-20 mt-1 max-h-60 overflow-y-auto">
              {suggestions.map(prod => (
                <div
                  key={prod._id}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-green-100"
                  onMouseDown={() => handleSelect(prod)}
                >
                  <Image src={prod.image.startsWith("/uploads/") ? prod.image : `/uploads/${prod.image}`} alt={prod.name} width={32} height={32} />
                  <span className="font-semibold text-green-900">{prod.name}</span>
                  {prod.marca && <span className="text-green-700 text-xs ml-2">{prod.marca}</span>}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
