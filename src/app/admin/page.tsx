"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './page.css';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          router.push("/admin/panel");
        }
      } catch (error) {
        console.error("No hay sesión activa:", error);
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");

      toast.success("Inicio de sesión exitoso", { autoClose: 3000 });
      router.push("/admin/panel");
        } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "Error al iniciar sesión", { autoClose: 3000 });
      } else {
        toast.error("Error al iniciar sesión", { autoClose: 3000 });
      }
    }
  };

  return (
    <div id="root">
      <div className="card">
        <h1 className="welcome-text">Iniciar sesión</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="submit-button">
            Ingresar
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}