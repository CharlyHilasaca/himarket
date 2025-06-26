"use client";
import React, { useEffect, useState, useRef } from "react";

interface Proyecto {
  proyecto_id: number;
  nombre: string;
  distrito: string;
  provincia: string;
  departamento: string;
}

export default function ProyectoModal({
  email,
  onClose,
  onSuccess,
}: {
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [search, setSearch] = useState("");
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Buscar proyectos según el texto ingresado
  useEffect(() => {
    if (search.length === 0) {
      setProyectos([]);
      return;
    }
    setLoading(true);
    fetch(`/api/proyectos/search?search=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => setProyectos(data))
      .catch(() => setProyectos([]))
      .finally(() => setLoading(false));
  }, [search]);

  // Cierra el dropdown si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleSelectProyecto = (proy: Proyecto) => {
    setSelectedProyecto(proy);
    setSearch(
      `${proy.nombre} - ${proy.distrito}, ${proy.provincia}, ${proy.departamento}`
    );
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSelectedProyecto(null);
    setShowDropdown(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProyecto) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/clientes/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ proyecto_f: selectedProyecto.proyecto_id }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el proyecto");
      onSuccess();
      onClose();
    } catch {
      // Manejar error si es necesario
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-700 font-bold text-xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
          Selecciona tu tienda/proyecto
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Correo</label>
            <input
              type="text"
              value={email}
              disabled
              title="Correo electrónico"
              placeholder="Correo electrónico"
              className="w-full px-4 py-2 rounded border border-green-300 bg-gray-100 text-gray-700"
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700 text-sm mb-1">
              Buscar y seleccionar tienda/proyecto
            </label>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
              placeholder="Buscar por nombre, distrito, provincia o departamento"
              className="w-full px-4 py-2 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
              autoComplete="off"
            />
            {showDropdown && search && (
              <div className="absolute left-0 right-0 bg-white border border-green-200 rounded shadow z-30 mt-1 max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="px-4 py-2 text-gray-500">Cargando...</div>
                ) : proyectos.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500">Sin resultados</div>
                ) : (
                  proyectos.map((p) => (
                    <div
                      key={p.proyecto_id}
                      className="px-4 py-2 cursor-pointer hover:bg-green-100 text-black"
                      onMouseDown={() => handleSelectProyecto(p)}
                    >
                      {p.nombre} - {p.distrito}, {p.provincia}, {p.departamento}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition"
            disabled={submitting || !selectedProyecto}
          >
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
}
