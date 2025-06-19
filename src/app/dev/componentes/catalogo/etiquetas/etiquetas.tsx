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
    <div className="etiqueta">
      
      <Image src={`/uploads/${image}`} alt={name} width={60} height={60} />
      
      <div className="etiqueta-info">
      <h4>{name}</h4>
      <p><b>Marca:</b> {marca}</p>
      <p>{description}</p>
      </div>
    </div>
  );
}