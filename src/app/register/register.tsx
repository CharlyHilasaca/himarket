"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function RegisterOverlay({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/clientes/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error de registro");
      onSuccess();
    } catch {
      setError("Error al registrarse. Verifica tus datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-green-700 font-bold text-xl">×</button>
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Registrarse</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-gray-500 text-sm">Correo electrónico
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ingresa tu correo" className="px-4 py-2 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black placeholder:text-gray-400 w-full mt-1" required />
          </label>
          <label className="text-gray-500 text-sm">Contraseña
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Ingresa tu contraseña" className="px-4 py-2 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black placeholder:text-gray-400 w-full mt-1" required />
          </label>
          <label className="text-gray-500 text-sm">Confirmar contraseña
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repite tu contraseña" className="px-4 py-2 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-black placeholder:text-gray-400 w-full mt-1" required />
          </label>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button type="submit" className="bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition" disabled={loading}>{loading ? "Registrando..." : "Registrarse"}</button>
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <button type="button" onClick={() => window.location.href = '/api/auth/google'} className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2 rounded hover:bg-gray-100 transition">
            <Image src="/google.png" alt="Google" className="w-5 h-5" height={60} width={60}/>
            Registrarse con Google
          </button>
        </div>
      </div>
    </div>
  );
}
