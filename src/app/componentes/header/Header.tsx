import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";

// Función auxiliar para obtener la cantidad de productos únicos en el carrito
async function getCantidadProductosUnicos(): Promise<number> {
  try {
    const res = await fetch("/api/carrito", { credentials: "include" });
    if (!res.ok) return 0;
    const data = await res.json();
    if (!data.productos) return 0;
    return Array.isArray(data.productos) ? data.productos.length : 0;
  } catch {
    return 0;
  }
}

const navOptions = [
  { label: "Inicio", value: "home" },
  { label: "Productos", value: "productos" },
  { label: "Ofertas", value: "ofertas" },
  { label: "Nuevos Lanzamientos", value: "nuevos" },
  { label: "Más vendidos", value: "masvendidos" },
  { label: "Contacto", value: "contacto" },
];

export default function Header({
  selected,
  onSelect,
  onLogin,
  onRegister,
  user,
  onLogout,
  proyectoNombre,
  onCarritoClick,
  carritoCantidad // este prop sigue funcionando como trigger de actualización
}: {
  selected: string;
  onSelect: (value: string) => void;
  onLogin?: () => void;
  onRegister?: () => void;
  user?: { username?: string, email?: string } | null;
  onLogout?: () => void;
  proyectoNombre?: string | null;
  onCarritoClick?: () => void;
  carritoCantidad?: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [cantidadUnicos, setCantidadUnicos] = useState<number>(0);

  // Cargar cantidad de productos únicos en el carrito al montar y cuando cambia carritoCantidad
  useEffect(() => {
    let mounted = true;
    getCantidadProductosUnicos().then((cant) => {
      if (mounted) setCantidadUnicos(cant);
    });
    return () => { mounted = false; };
  }, [carritoCantidad]);

  // Cierra el menú si se hace clic fuera
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-green-700 text-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Image src="/logo2.png" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold">
            {proyectoNombre ? proyectoNombre : "HiMarket"}
          </span>
        </div>
        <nav className="flex items-center gap-4 ml-6">
          {navOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={`px-3 py-1 rounded font-semibold transition ${selected === opt.value ? "bg-white text-green-700" : "hover:underline"}`}
            >
              {opt.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex gap-4 items-center min-w-[160px] justify-end">
        {user ? (
          <>
            <button
              type="button"
              onClick={onCarritoClick}
              className="focus:outline-none relative"
              title="Ver carrito de compras"
            >
              <FaShoppingCart className="text-2xl text-white" />
              {cantidadUnicos > 0 && (
                <span className="carrito-badge">
                  {cantidadUnicos}
                </span>
              )}
            </button>
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen((v) => !v)} className="ml-2 flex items-center text-white font-semibold truncate max-w-[120px] focus:outline-none">
                <span>
                  {user.username
                    ? user.username
                    : (user.email ? user.email.split("@")[0] : "")}
                </span>
                <FaChevronDown className="ml-1 text-xs" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-green-800 rounded shadow-lg z-50">
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 hover:bg-green-100">Cerrar sesión</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button type="button" onClick={onLogin} className="bg-white text-green-700 px-4 py-1 rounded font-semibold hover:bg-green-100 transition">Iniciar sesión</button>
            <button type="button" onClick={onRegister} className="bg-yellow-400 text-green-900 px-4 py-1 rounded font-semibold hover:bg-yellow-300 transition">Registrarse</button>
          </>
        )}
      </div>
    </header>
  );
}
