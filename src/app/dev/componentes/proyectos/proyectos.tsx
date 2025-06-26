import * as React from "react";
import { useEffect, useState } from "react";
import './proyectos.css';
import Tablas from "./tablas/tablas";
import Modal from "./modal/modal";
import ModalEdit from "./modaledit/modaledit";

interface Proyecto {
  proyecto_id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  fecha_creacion: string;
  updated_at: string;
  imagenes: string; // <-- Solo string
}

interface ProyectoData {
  nombre: string;
  descripcion: string;
  imagen_p: File | null;
  distrito: string;
  provincia: string;
  departamento: string;
}

export default function Proyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProyectos = async () => {
    try {
      const response = await fetch("/api/proyectos", {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      setProyectos(data);
    } catch (error) {
      console.error('Error detallado:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar los proyectos');
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  const handleOpenAddModal = () => {
    setIsModalOpen(true);
    setProyectoSeleccionado(null);
  };

  const handleEdit = (proyecto: Proyecto) => {
    setProyectoSeleccionado(proyecto);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setProyectoSeleccionado(null);
  };

  const handleSubmit = async (proyectoData: ProyectoData) => {
    setError(null);
    setSuccess(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', proyectoData.nombre);
      formDataToSend.append('descripcion', proyectoData.descripcion);
      formDataToSend.append('distrito', proyectoData.distrito);
      formDataToSend.append('provincia', proyectoData.provincia);
      formDataToSend.append('departamento', proyectoData.departamento);
      if (proyectoData.imagen_p) {
        formDataToSend.append('imagen_p', proyectoData.imagen_p);
      }
      const url = isEditModalOpen && proyectoSeleccionado
        ? `/api/proyectos/${proyectoSeleccionado.proyecto_id}`
        : '/api/proyectos';
      const response = await fetch(url, {
        method: isEditModalOpen ? 'PUT' : 'POST',
        credentials: "include",
        body: formDataToSend
      });
      if (!response.ok) {
        throw new Error('Error al guardar el proyecto');
      }
      setSuccess(isEditModalOpen ? 'Proyecto actualizado correctamente' : 'Proyecto agregado correctamente');
      setIsModalOpen(false);
      setIsEditModalOpen(false);
      fetchProyectos();
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
      setError('Error al guardar el proyecto');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Proyectos</h1>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          title="Agregar Proyecto"
        >
          Agregar Proyecto
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <Tablas proyectos={proyectos} onEdit={handleEdit} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      <ModalEdit
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        proyectoSeleccionado={proyectoSeleccionado as ProyectoData | null}
      />
    </div>
  );
}