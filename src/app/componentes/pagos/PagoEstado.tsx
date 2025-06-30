"use client";
import React, { useEffect } from "react";
import type { JSX } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "../header/Header";
import Footer from "../footer/Footer";

const estados: Record<string, {
  color: string;
  titulo: string;
  mensaje: string;
  icon: JSX.Element;
  bg: string;
}> = {
  "/pago-exitoso": {
    color: "text-green-700",
    titulo: "¡Pago exitoso!",
    mensaje: "Tu pago fue procesado correctamente. Gracias por tu compra.",
    icon: (
      <svg className="w-20 h-20 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none"/>
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5"/>
      </svg>
    ),
    bg: "bg-green-50"
  },
  "/pago-fallido": {
    color: "text-red-600",
    titulo: "Pago fallido",
    mensaje: "Ocurrió un error al procesar tu pago. Intenta nuevamente o usa otro método.",
    icon: (
      <svg className="w-20 h-20 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none"/>
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6"/>
      </svg>
    ),
    bg: "bg-red-50"
  },
  "/pago-pendiente": {
    color: "text-yellow-600",
    titulo: "Pago pendiente",
    mensaje: "Tu pago está pendiente de confirmación. Te avisaremos cuando se acredite.",
    icon: (
      <svg className="w-20 h-20 text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none"/>
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2"/>
      </svg>
    ),
    bg: "bg-yellow-50"
  }
};

export default function PagoEstado() {
  const pathname = usePathname();
  const router = useRouter();
  const estado = estados[pathname];

  useEffect(() => {
    if (estado) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 5000); // 5 segundos
      return () => clearTimeout(timer);
    }
  }, [estado, router]);

  if (!estado) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        selected="home"
        onSelect={() => router.push("/")}
        carritoCantidad={0}
      />
      <main className={`flex flex-1 flex-col items-center justify-center ${estado.bg}`}>
        <div className="bg-white rounded-xl shadow-lg px-10 py-12 flex flex-col items-center max-w-lg w-full mt-10 mb-10">
          {estado.icon}
          <h2 className={`text-3xl font-bold mb-2 ${estado.color}`}>{estado.titulo}</h2>
          <p className="text-lg text-gray-700 mb-8 text-center">{estado.mensaje}</p>
          <button
            className="bg-green-700 text-white px-8 py-3 rounded font-semibold hover:bg-green-800 transition text-lg"
            onClick={() => router.push("/")}
          >
            Volver al inicio
          </button>
          <span className="text-xs text-gray-400 mt-4">Serás redirigido automáticamente en unos segundos...</span>
        </div>
      </main>
      <Footer />
    </div>
  );
}