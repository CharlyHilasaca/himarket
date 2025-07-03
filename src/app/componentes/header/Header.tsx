import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { FaShoppingCart, FaChevronDown, FaBars, FaUser } from "react-icons/fa";

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

interface ClienteData {
  nombres?: string;
  apellidos?: string;
  dni?: string;
}

function ClienteInfoModal({
  user,
  onClose,
}: {
  user: { username?: string; email?: string } | null;
  onClose: () => void;
}) {
  const [cliente, setCliente] = useState<ClienteData | null>(null);
  const [dniInput, setDniInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dniError, setDniError] = useState<string | null>(null);

  // Cargar datos del cliente al abrir el modal
  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    fetch("/api/clientes/customerData", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => setCliente(data?.customer || null))
      .finally(() => setLoading(false));
  }, [user]);

  // Buscar y asociar DNI
  const handleBuscarDni = async () => {
    setDniError(null);
    if (!dniInput || dniInput.length !== 8) {
      setDniError("Ingrese un DNI válido de 8 dígitos.");
      return;
    }
    setLoading(true);
    try {
      // Buscar en la tabla clientes
      const res = await fetch(`/api/clientes/dni/${dniInput}`);
      const data: ClienteData & { message?: string } = await res.json();
      if (res.ok && data.nombres && data.apellidos) {
        setCliente((prev) => ({
          ...prev,
          nombres: data.nombres,
          apellidos: data.apellidos,
          dni: dniInput,
        }));
        await fetch("/api/clientes/update", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombres: data.nombres,
            apellidos: data.apellidos,
            dni: dniInput,
          }),
        });
      } else {
        setDniError(data.message || "No se encontró el DNI.");
      }
    } catch {
      setDniError("Error al buscar el DNI.");
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md h-full shadow-lg p-6 flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-green-700 font-bold text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-green-800 mb-4">Datos del Cliente</h2>
        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : (
          <div className="flex flex-col gap-3 text-green-900">
            <div>
              <span className="font-semibold">Nombres:</span>{" "}
              {cliente?.nombres || <span className="text-gray-400">No registrado</span>}
            </div>
            <div>
              <span className="font-semibold">Apellidos:</span>{" "}
              {cliente?.apellidos || <span className="text-gray-400">No registrado</span>}
            </div>
            <div>
              <span className="font-semibold">Username:</span>{" "}
              {user.username || <span className="text-gray-400">No registrado</span>}
            </div>
            <div>
              <span className="font-semibold">Email:</span>{" "}
              {user.email || <span className="text-gray-400">No registrado</span>}
            </div>
            <div>
              <span className="font-semibold">DNI:</span>{" "}
              {cliente?.dni ? (
                <span>{cliente.dni}</span>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <input
                    type="text"
                    value={dniInput}
                    onChange={e => setDniInput(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    placeholder="Ingrese DNI"
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                  <button
                    className="bg-green-700 text-white px-4 py-1 rounded hover:bg-green-800 transition font-semibold"
                    onClick={handleBuscarDni}
                    disabled={loading || dniInput.length !== 8}
                  >
                    Buscar y asociar DNI
                  </button>
                  {dniError && <span className="text-red-600 text-sm">{dniError}</span>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [navOpen, setNavOpen] = useState(false);
  const [showClienteInfo, setShowClienteInfo] = useState(false);

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
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-green-700 text-white shadow-md border-b border-green-800">
      {/* Fila superior */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 md:py-4">
        <div className="flex items-center justify-between md:justify-start gap-2">
          <div className="flex items-center gap-2">
            <Image src="/logo2.webp" alt="Logo" width={36} height={36} />
            <span className="text-lg md:text-xl font-bold whitespace-nowrap">
              {proyectoNombre ? proyectoNombre : "HiMarket"}
            </span>
          </div>
          {/* Botón menú/login en móvil */}
          <div className="flex md:hidden gap-2">
            {user ? (
              <button
                type="button"
                onClick={() => setNavOpen((v) => !v)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                aria-label="Menú"
              >
                <FaBars className="text-xl" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onLogin}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                aria-label="Iniciar sesión"
              >
                <FaUser className="text-xl" />
              </button>
            )}
          </div>
        </div>
        {/* Menú usuario/carrito en desktop */}
        <div className="hidden md:flex gap-4 items-center min-w-[160px] justify-end">
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
                  <span className="carrito-badge">{cantidadUnicos}</span>
                )}
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="ml-2 flex items-center text-white font-semibold truncate focus:outline-none header-user-btn"
                >
                  <span className="truncate max-w-[160px] inline-block align-middle"
                    title={user.username ? user.username : (user.email ? user.email.split("@")[0] : "")}
                  >
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
      </div>
      {/* Fila navegación */}
      <nav className="w-full border-t border-green-800 bg-green-700">
        <div className="relative w-full">
          <div className="flex gap-2 md:gap-4 px-2 py-2 md:justify-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-green-800 scrollbar-track-green-700">
            {navOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onSelect(opt.value);
                  setNavOpen(false);
                }}
                className={`px-3 py-1 rounded font-semibold transition whitespace-nowrap ${selected === opt.value ? "bg-white text-green-700" : "hover:underline"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      {/* Menú lateral móvil */}
      {user && navOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex md:hidden" onClick={() => setNavOpen(false)}>
          <div className="bg-white text-green-900 w-64 h-full shadow-lg flex flex-col p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-6">
              <FaUser className="text-xl" />
              <button
                className="font-semibold underline hover:text-green-700"
                onClick={() => setShowClienteInfo(true)}
                title="Ver datos del cliente"
              >
                {user.username || user.email?.split("@")[0]}
              </button>
            </div>
            <button
              className="flex items-center gap-2 mb-4 px-3 py-2 rounded bg-green-700 text-white font-semibold"
              onClick={onCarritoClick}
            >
              <FaShoppingCart /> Carrito {cantidadUnicos > 0 && <span className="ml-1">{cantidadUnicos}</span>}
            </button>
            <button
              className="w-full text-left px-3 py-2 rounded hover:bg-green-100"
              onClick={onLogout}
            >
              Cerrar sesión
            </button>
          </div>
          {/* Modal lateral para datos del cliente */}
          {showClienteInfo && (
            <ClienteInfoModal
              user={user}
              onClose={() => setShowClienteInfo(false)}
            />
          )}
        </div>
      )}
    </header>
  );
}