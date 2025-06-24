"use client";

import Section from "./section/Section";
import Main from "./main/Main";
import Footer from "../footer/Footer";

interface HomeContentProps {
  onSearchProduct: (id: string) => void;
  onSearchText: (text: string) => void;
  searchText: string;
  resetKey: number;
}

export default function HomeContent({ onSearchProduct, onSearchText, searchText, resetKey }: HomeContentProps) {
  return (
    <>
      <Section onSearchProduct={onSearchProduct} onSearchText={onSearchText} searchText={searchText} resetKey={resetKey} />
      <Main />
      <Footer />
    </>
  );
}
