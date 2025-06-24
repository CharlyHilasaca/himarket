"use client";
import React, { useState, useEffect } from "react";
import Header from "./componentes/header/Header";
import HomeContent from "./componentes/home/home";
import Products from "./componentes/products/products";
import ProductDetailOverlay from "./componentes/home/product/product";
import LoginOverlay from "./login/login";
import RegisterOverlay from "./register/register";

export default function Home() {
  const [selected, setSelected] = useState("home");
  const [searchText, setSearchText] = useState("");
  const [showProductDetail, setShowProductDetail] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

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
      if (!res.ok) return setUser(null);
      const data = await res.json();
      console.log(data.customer)
      setUser({ username: data.customer?.username || data.customer?.username || data.customer?.email || "Usuario" });
    } catch {
      setUser(null);
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
    content = <ProductDetailOverlay productId={showProductDetail} onBack={() => setShowProductDetail(null)} />;
  } else if (selected === "home") {
    content = <HomeContent
      onSearchProduct={(id) => setShowProductDetail(id)}
      onSearchText={(text) => {
        setSearchText(text);
        setSelected("productos");
        setResetKey(k => k + 1);
      }}
      searchText={searchText}
      resetKey={resetKey}
    />;
  } else if (selected === "productos") {
    content = <Products initialSearch={searchText} onProductClick={id => setShowProductDetail(id)} resetKey={resetKey} />;
  } else {
    content = (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          {selected === "ofertas" && "Ofertas"}
          {selected === "nuevos" && "Nuevos Lanzamientos"}
          {selected === "masvendidos" && "Más vendidos"}
          {selected === "contacto" && "Contacto"}
        </h2>
        <p className="text-gray-600">Contenido próximamente...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans">
      <Header
        selected={selected}
        onSelect={handleSelect}
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
        user={user}
        onLogout={handleLogout}
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
      {content}
    </div>
  );
}
