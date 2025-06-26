"use client";
import React, { useState, useEffect } from "react";
import Header from "./componentes/header/Header";
import HomeContent from "./componentes/home/home";
import Products from "./componentes/products/products";
import ProductDetailOverlay from "./componentes/home/product/product";
import LoginOverlay from "./login/login";
import RegisterOverlay from "./register/register";
import MasVendidos from "./componentes/masvendidos/MasVendidos";
import Nuevos from "./componentes/nuevos/Nuevos";
import Contacto from "./componentes/contacto/Contacto";
import Footer from "./componentes/footer/Footer";
import ProyectoModal from "./form/form";

export default function Home() {
  const [selected, setSelected] = useState("home");
  const [searchText, setSearchText] = useState("");
  const [showProductDetail, setShowProductDetail] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [showProyectoModal, setShowProyectoModal] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [proyecto, setProyecto] = useState<any>(null);

  // Cada vez que se cambia de sección, incrementa resetKey
  const handleSelect = (value: string) => {
    setSelected(value);
    setResetKey(k => k + 1);
    setSearchText("");
  };

  // Función para obtener datos del usuario autenticado
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/clientes/customerData", { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        setCustomerData(null);
        setShowProyectoModal(false);
        setProyecto(null);
        return;
      }
      const data = await res.json();
      setUser({
        username: data.customer?.username || data.customer?.email?.split("@")[0] || "Usuario",
        email: data.customer?.email || ""
      });
      setCustomerData(data.customer);
      setProyecto(data.proyecto || null);
      // Mostrar modal si proyecto_f está vacío o null
      if (!data.customer?.proyecto_f) {
        setShowProyectoModal(true);
      } else {
        setShowProyectoModal(false);
      }
    } catch {
      setUser(null);
      setCustomerData(null);
      setShowProyectoModal(false);
      setProyecto(null);
    }
  };

  // Llama a fetchUser después de login/register exitoso
  const handleLoginSuccess = () => {
    setShowLogin(false);
    fetchUser();
  };
  const handleRegisterSuccess = () => {
    setShowRegister(false);
    fetchUser();
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await fetch("/api/clientes/logout", { method: "POST", credentials: "include" });
    } catch {}
    setUser(null);
    setShowLogin(false);
    setShowRegister(false);
  };

  // Llama a fetchUser al cargar la app para validar sesión activa
  useEffect(() => {
    fetchUser();
  }, []);

  let content = null;
  if (showProductDetail) {
    content = (
      <ProductDetailOverlay
        productId={showProductDetail}
        onBack={() => setShowProductDetail(null)}
        user={user}
        proyectoId={proyecto?.proyecto_id || null}
      />
    );
  } else if (selected === "home" || selected === "ofertas") {
    content = <HomeContent
      onSearchProduct={(id) => setShowProductDetail(id)}
      onSearchText={(text) => {
        setSearchText(text);
        setSelected("productos");
        setResetKey(k => k + 1);
      }}
      searchText={searchText}
      resetKey={resetKey}
      selectedSection={selected}
      proyectoId={proyecto?.proyecto_id || null}
    />;
  } else if (selected === "productos") {
    content = (
      <>
        <Products
          initialSearch={searchText}
          onProductClick={id => setShowProductDetail(id)}
          resetKey={resetKey}
          proyectoId={proyecto?.proyecto_id || null}
        />
        <Footer />
      </>
    );
  } else if (selected === "nuevos") {
    content = (
      <>
        <Nuevos />
        <Footer />
      </>
    );
  } else if (selected === "masvendidos") {
    content = (
      <>
        <MasVendidos />
        <Footer />
      </>
    );
  } else if (selected === "contacto") {
    content = (
      <>
        <Contacto />
        <Footer />
      </>
    );
  } else {
    content = (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          {selected}
        </h2>
        <p className="text-gray-600">Contenido próximamente...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans pt-[72px]">
      <Header
        selected={selected}
        onSelect={handleSelect}
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
        user={user}
        onLogout={handleLogout}
        proyectoNombre={proyecto?.nombre || null}
      />
      {showLogin && (
        <LoginOverlay
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
      {showRegister && (
        <RegisterOverlay
          onClose={() => setShowRegister(false)}
          onSuccess={handleRegisterSuccess}
        />
      )}
      {showProyectoModal && user && (
        <ProyectoModal
          email={user.email}
          onClose={() => setShowProyectoModal(false)}
          onSuccess={fetchUser}
        />
      )}
      <div className="flex-1 flex flex-col min-h-0">
        {content}
      </div>
    </div>
  );
}
