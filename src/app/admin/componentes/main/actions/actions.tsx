import React from "react";
import './actions.css';
import Image from 'next/image';

export default function Actions() {
  return (
    <section className="actions-section">
      <button className="action-button venta">
        <Image  src="/ventat.png" alt="Ventas" width={50} height={50} className="sidebar-icon" />
        Hacer Venta
      </button>
      <button className="action-button stock">
        <Image  src="/productot.png" alt="Agregar Stock" width={50} height={50} className="sidebar-icon" />
        Agregar Stock
      </button>
      <button className="action-button ganancias">
        <Image  src="/gananciat.png" alt="Ganancias" width={50} height={50} className="sidebar-icon" />
        Ganancias S/.80.00
      </button>
    </section>
  );
}