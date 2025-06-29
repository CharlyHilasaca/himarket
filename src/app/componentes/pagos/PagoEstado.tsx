"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const estados: Record<string, { color: string; titulo: string; mensaje: string }> = {
  "/pago-exitoso": {
    color: "text-green-700",
    titulo: "¡Pago exitoso!",
    mensaje: "Tu pago fue procesado correctamente. Gracias por tu compra."
  },
  "/pago-fallido": {
    color: "text-red-600",
    titulo: "Pago fallido",
    mensaje: "Ocurrió un error al procesar tu pago. Intenta nuevamente o usa otro método."
  },
  "/pago-pendiente": {
    color: "text-yellow-600",
    titulo: "Pago pendiente",
    mensaje: "Tu pago está pendiente de confirmación. Te avisaremos cuando se acredite."
  }
};

export default function PagoEstado() {
  const pathname = usePathname();
  const router = useRouter();
  const estado = estados[pathname];

  useEffect(() => {
    // Opcional: redirigir al home después de unos segundos
    if (estado) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [estado, router]);

  if (!estado) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className={`text-3xl font-bold mb-4 ${estado.color}`}>{estado.titulo}</h2>
      <p className="text-lg text-gray-700 mb-8">{estado.mensaje}</p>
      <button
        className="bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800 transition"
        onClick={() => router.push("/")}
      >
        Volver al inicio
      </button>
    </div>
  );
}
