import Header from "./componentes/header/Header";
import Section from "./componentes/section/Section";
import Main from "./componentes/main/Main";
import Footer from "./componentes/footer/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans">
      <Header />
      <Section />
      <Main />
      <Footer />
    </div>
  );
}
