import React from "react";
import Image from "next/image";
import './tablas.css';

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

interface TablasProps {
  proyectos: Proyecto[];
  onEdit: (proyecto: Proyecto) => void;
}

export default function Tablas({ proyectos, onEdit }: TablasProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Distrito
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Provincia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Departamento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Creación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Última Actualización
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {proyectos.map((proyecto) => (
            <tr key={proyecto.proyecto_id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{proyecto.nombre}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{proyecto.descripcion}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {proyecto.imagenes
                  ? (
                    <Image
                      src={proyecto.imagenes.startsWith("/")
                        ? proyecto.imagenes
                        : `/${proyecto.imagenes}.webp`}
                      alt={proyecto.nombre}
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover rounded-lg"
                      style={{ width: 64, height: "auto" }}
                    />
                  )
                  : (
                    <span className="text-gray-500">Sin imagen</span>
                  )
                }
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{proyecto.distrito}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{proyecto.provincia}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{proyecto.departamento}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(proyecto.fecha_creacion).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(proyecto.updated_at).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(proyecto)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}