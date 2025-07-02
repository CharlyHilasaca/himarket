import React, { useEffect, useState } from "react";
import './actions.css';
import Image from 'next/image';

interface ActionsProps {
  onVentaClick: () => void;
  onAddStockClick: () => void;
}

export default function Actions({ onVentaClick, onAddStockClick }: ActionsProps) {
  const [ganancias, setGanancias] = useState<number>(0);

  useEffect(() => {
    const fetchGanancias = async () => {
      try {
        const res = await fetch('/api/ganancias/total', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setGanancias(data.total || 0);
        }
      } catch {
        setGanancias(0);
      }
    };
    fetchGanancias();
  }, []);

  return (
    <section className="actions-section">
      <button className="action-button venta" onClick={onVentaClick}>
        <Image  src="/ventat.webp" alt="Ventas" width={50} height={50} className="sidebar-icon" />
        Hacer Venta
      </button>
      <button className="action-button stock" onClick={onAddStockClick}>
        <Image  src="/productot.webp" alt="Agregar Stock" width={50} height={50} className="sidebar-icon" />
        Agregar Stock
      </button>
      <button className="action-button ganancias">
        <Image  src="/gananciat.webp" alt="Ganancias" width={50} height={50} className="sidebar-icon" />
        Ventas S/.{ganancias.toFixed(2)}
      </button>
    </section>
  );
}