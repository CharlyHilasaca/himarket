import React, { useEffect, useState } from "react";
import Etiqueta from "./etiquetas/etiquetas";
import Modal from "./modal/modal";
import "./catalogo.css";

interface Producto {
  _id: string;
  name: string;
  marca: string;
  description: string;
  image: string;
}

function EtiquetaAgregar({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="etiqueta flex flex-col items-center justify-center w-[220px] h-[260px] bg-white rounded-lg shadow p-4 mx-auto cursor-pointer border-2 border-dashed border-green-400 hover:bg-green-50 transition"
      onClick={onClick}
      title="Agregar producto"
    >
      <div className="w-[100px] h-[100px] flex items-center justify-center mb-2 text-green-600 text-5xl">
        +
      </div>
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <span className="font-bold text-green-700 text-center w-full">
          Agregar producto
        </span>
      </div>
    </div>
  );
}

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const pageSize = 16;
  const isFirstPage = page === 0;

  const fetchProductos = async () => {
    const res = await fetch("/api/products", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setProductos(data);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Función para quitar tildes y pasar a minúsculas
  function normalizeText(text: string) {
    return (text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  // Filtrado por nombre o marca, ignorando tildes
  const normalizedSearch = normalizeText(search);
  const filtered = productos.filter(
    (prod) =>
      normalizeText(prod.name).includes(normalizedSearch) ||
      normalizeText(prod.marca).includes(normalizedSearch)
  );

  // Si es la primera página, muestra 15 productos + etiqueta agregar. Si no, muestra 16 productos.
  let paginated: Producto[] = [];
  if (isFirstPage) {
    paginated = filtered.slice(0, pageSize - 1);
  } else {
    paginated = filtered.slice((page * pageSize) - 1, (page + 1) * pageSize - 1);
  }

  // Calcula el total de páginas correctamente
  const totalPages = Math.ceil((filtered.length + 1) / pageSize);

  // Reinicia la página si el filtro cambia y la página actual ya no es válida
  useEffect(() => {
    if (page > 0 && page >= totalPages) setPage(0);
  }, [search, totalPages, page]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          className="w-full max-w-md px-4 py-2 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 shadow"
          placeholder="Buscar por nombre o marca..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-600 mb-4">No se encontraron productos.</p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={() => setModalOpen(true)}
          >
            Agregar producto
          </button>
        </div>
      ) : (
        <>
          <div className="catalogo-paginacion flex items-center justify-center mb-4 gap-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="catalogo-flecha"
            >
              &#8592;
            </button>
            <span className="text-gray-800">
              Página {page + 1} de {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="catalogo-flecha"
            >
              &#8594;
            </button>
          </div>
          <div className="catalogo-lista grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {isFirstPage && <EtiquetaAgregar onClick={() => setModalOpen(true)} />}
            {paginated.map((prod) => (
              <Etiqueta key={prod._id} {...prod} />
            ))}
          </div>
        </>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onProductAdded={fetchProductos}
      />
    </div>
  );
}