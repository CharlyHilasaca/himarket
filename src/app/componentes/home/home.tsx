"use client";

import Section from "./section/Section";
import Main from "./main/Main";
import Footer from "../footer/Footer";
import Ofertas from "../ofertas/ofertas";

interface HomeContentProps {
  onSearchProduct: (id: string) => void;
  onSearchText: (text: string) => void;
  searchText: string;
  resetKey: number;
  selectedSection: string;
  proyectoId?: number | null;
}

export default function HomeContent({ onSearchProduct, onSearchText, searchText, resetKey, selectedSection, proyectoId }: HomeContentProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {selectedSection === "ofertas" ? (
        <Ofertas />
      ) : (
        <>
          <Section
            onSearchProduct={onSearchProduct}
            onSearchText={onSearchText}
            searchText={searchText}
            resetKey={resetKey}
            proyectoId={proyectoId}
          />
          <Main proyectoId={proyectoId} />
        </>
      )}
      <Footer />
    </div>
  );
}