"use client";

import { useState } from "react";
import Section from "./section/Section";
import Main from "./main/Main";
import Footer from "../footer/Footer";
import Ofertas from "../ofertas/ofertas";
import ProductDetailOverlay from "./product/product";

interface HomeContentProps {
  onSearchProduct: (id: string) => void;
  onSearchText: (text: string) => void;
  searchText: string;
  resetKey: number;
  selectedSection: string;
  proyectoId?: number | null;
}

export default function HomeContent({ onSearchProduct, onSearchText, searchText, resetKey, selectedSection, proyectoId }: HomeContentProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Permite mostrar el overlay de detalle de producto al seleccionar desde la lista por categoría o desde el buscador
  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    if (onSearchProduct) onSearchProduct(id);
  };

  // Si hay producto seleccionado, muestra el overlay y no el resto del contenido
  if (selectedProductId) {
    return (
      <>
        <ProductDetailOverlay
          productId={selectedProductId}
          onBack={() => setSelectedProductId(null)}
          proyectoId={proyectoId}
        />
        <Footer />
      </>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {selectedSection === "ofertas" ? (
        <Ofertas />
      ) : (
        <>
          <Section
            onSearchProduct={handleProductClick}
            onSearchText={onSearchText}
            searchText={searchText}
            resetKey={resetKey}
            proyectoId={proyectoId}
          />
          <Main
            proyectoId={proyectoId}
            onProductClick={handleProductClick}
          />
        </>
      )}
      <Footer />
    </div>
  );
}