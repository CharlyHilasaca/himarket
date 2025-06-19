import React from "react";
import './loading.css';

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  );
}