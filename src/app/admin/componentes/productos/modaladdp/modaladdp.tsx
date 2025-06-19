import React, { useState, useEffect } from "react";
import "./modaladdp.css";

interface ModalAddPProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string | null;
    onSuccess?: () => void;
}

export default function ModalAddP({ isOpen, onClose, productId, onSuccess }: ModalAddPProps) {
    const [purchasePrice, setPurchasePrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [unidad, setUnidad] = useState("");
    const [stock, setStock] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [unidades, setUnidades] = useState<{ _id: string; name: string }[]>([]);

    useEffect(() => {
        if (!isOpen) return;
        const fetchUnidades = async () => {
            try {
                const res = await fetch("/api/unidades");
                if (res.ok) {
                    const data = await res.json();
                    setUnidades(data);
                }
            } catch {}
        };
        fetchUnidades();
    }, [isOpen]);

    const handleAgregar = async () => {
        if (!productId) return;
        setLoading(true);
        setMensaje(null);
        try {
            const res = await fetch(`/api/products/${productId}/project-details`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    purchasePrice,
                    salePrice,
                    unidad,
                    stock,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setMensaje("Producto agregado a la tienda correctamente.");
                if (onSuccess) onSuccess();
            } else {
                setMensaje(data.message || "Error al agregar el producto.");
            }
        } catch (err) {
            setMensaje("Error de red.");
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modaladdp-overlay">
            <div className="modaladdp-content">
                <h2>Agregar producto a tienda</h2>
                <p>¿Deseas agregar este producto a tu tienda?</p>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        handleAgregar();
                    }}
                >
                    <div>
                        <label>Precio de compra:</label>
                        <input
                            type="string"
                            value={purchasePrice}
                            onChange={e => setPurchasePrice(e.target.value)}
                            required
                            min="0"
                            step="any"
                            placeholder="Ingrese el precio de compra"
                        />
                    </div>
                    <div>
                        <label>Precio de venta:</label>
                        <input
                            type="string"
                            value={salePrice}
                            onChange={e => setSalePrice(e.target.value)}
                            required
                            min="0"
                            step="any"
                            placeholder="Ingrese el precio de venta"
                        />
                    </div>
                    <div>
                        <label htmlFor="unidad-select">Unidad:</label>
                        <select
                            id="unidad-select"
                            value={unidad}
                            onChange={e => setUnidad(e.target.value)}
                            required
                        >
                            <option value="">Seleccione una unidad</option>
                            {unidades.map(u => (
                                <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Stock:</label>
                        <input
                            type="string"
                            value={stock}
                            onChange={e => setStock(e.target.value)}
                            required
                            min="0"
                            step="any"
                            placeholder="Ingrese el stock"
                        />
                    </div>
                    {mensaje && <div className="modaladdp-mensaje">{mensaje}</div>}
                    <div className="modaladdp-actions">
                        <button type="button" onClick={onClose} disabled={loading}>Cancelar</button>
                        <button type="submit" disabled={loading}>
                            {loading ? "Agregando..." : "Agregar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

