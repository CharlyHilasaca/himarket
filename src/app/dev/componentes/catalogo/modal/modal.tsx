import React, { useRef, useState, useEffect } from "react";
import "./modal.css";

interface Categoria {
  _id: string;
  name: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export default function Modal({ isOpen, onClose, onProductAdded }: ModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [imageName, setImageName] = useState<string>("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetch("/api/categories", { credentials: "include" })
        .then(res => res.json())
        .then(data => setCategorias(data))
        .catch(() => setCategorias([]));
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setImageName(data.imageName); // Guarda el nombre único generado por el backend
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const formData = new window.FormData(form);
    // Si necesitas subir la imagen aquí, descomenta y ajusta el siguiente bloque
    // const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
    // const uploadData = await uploadRes.json();
    // setImageName(uploadData.imageName); // Guarda el nombre único

    const body = {
      name: formData.get("name"),
      marca: formData.get("marca"),
      description: formData.get("description"),
      categoryName: selectedCategoria,
      image: imageName, // Aquí va el identificador único
    };

    const productRes = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (productRes.ok) {
      onProductAdded();
      onClose();
    } else {
      alert("Error al agregar producto");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-content">
          <h3>Agregar Producto</h3>
          <form ref={formRef} onSubmit={handleSubmit}>
            <input name="name" placeholder="Nombre" required />
            <input name="marca" placeholder="Marca"/>
            <input name="description" placeholder="Descripción"/>
            <label htmlFor="categoryName-select">Categoría</label>
            <select
              id="categoryName-select"
              name="categoryName"
              required
              value={selectedCategoria}
              onChange={e => setSelectedCategoria(e.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              placeholder="Selecciona una imagen"
            />
            <button type="submit">Agregar</button>
          </form>
        </div>
      </div>
    </>
  );
}