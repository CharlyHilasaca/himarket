import React, { useEffect, useState } from "react";
import './modaledit.css';

interface ProyectoData {
  nombre: string;
  descripcion: string;
  imagen_p: File | null;
  distrito: string;
  provincia: string;
  departamento: string;
}

interface ModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proyecto: ProyectoData) => void;
  proyectoSeleccionado?: ProyectoData | null;
}

export default function ModalEdit({ isOpen, onClose, onSubmit, proyectoSeleccionado }: ModalEditProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen_p, setImagenP] = useState<File | null>(null);
  const [distrito, setDistrito] = useState("");
  const [provincia, setProvincia] = useState("");
  const [departamento, setDepartamento] = useState("");

  useEffect(() => {
    if (proyectoSeleccionado) {
      setNombre(proyectoSeleccionado.nombre || "");
      setDescripcion(proyectoSeleccionado.descripcion || "");
      setDistrito(proyectoSeleccionado.distrito || "");
      setProvincia(proyectoSeleccionado.provincia || "");
      setDepartamento(proyectoSeleccionado.departamento || "");
      setImagenP(null); // No cargamos la imagen anterior
    } else {
      setNombre("");
      setDescripcion("");
      setDistrito("");
      setProvincia("");
      setDepartamento("");
      setImagenP(null);
    }
  }, [proyectoSeleccionado, isOpen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nombre, descripcion, imagen_p, distrito, provincia, departamento });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagenP(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-custom">
      <div className="modal-content-custom">
        <h2>{proyectoSeleccionado ? 'Editar Proyecto' : 'Agregar Proyecto'}</h2>
        <form onSubmit={handleFormSubmit}>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Nombre del proyecto"
          />
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            placeholder="Descripción del proyecto"
          />
          <label>Distrito</label>
          <input
            type="text"
            value={distrito}
            onChange={(e) => setDistrito(e.target.value)}
            required
            placeholder="Distrito"
          />
          <label>Provincia</label>
          <input
            type="text"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            required
            placeholder="Provincia"
          />
          <label>Departamento</label>
          <input
            type="text"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            required
            placeholder="Departamento"
          />
          <label>Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            placeholder="Selecciona una imagen"
          />
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="btn-cancelar">Cancelar</button>
            <button type="submit" className="btn-guardar">{proyectoSeleccionado ? 'Actualizar' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
