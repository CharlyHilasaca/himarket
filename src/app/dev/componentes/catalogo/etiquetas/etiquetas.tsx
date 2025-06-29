import React from "react";
import "./etiquetas.css";
import Image from "next/image";

interface EtiquetaProps {
  name: string;
  marca: string;
  description: string;
  image: string;
}

export default function Etiqueta({ name, marca, description, image }: EtiquetaProps) {
  return (
    <div className="etiqueta flex flex-col items-center justify-between w-[220px] h-[260px] bg-white rounded-lg shadow p-4 mx-auto">
      <div className="w-[100px] h-[100px] relative flex items-center justify-center mb-2">
        <Image
          src={`/uploads/${image}`}
          alt={name}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="flex flex-col items-center justify-between flex-1 w-full">
        <h4 className="font-bold text-green-900 text-center w-full mb-1">{name}</h4>
        <p className="text-green-700 text-sm text-center w-full mb-1"> {marca}</p>
        <p
          className="text-gray-700 text-xs text-center w-full truncate etiqueta-description"
          title={description}
        >
          {description}
        </p>
      </div>
    </div>
  );
}