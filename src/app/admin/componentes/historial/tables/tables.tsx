import React, { useState } from "react";
import "./tables.css";

const historialData = [
    { id: 1, fecha: "2024-06-01", venta: "Venta-01", total: "$150", metodo: "Efectivo" },
    { id: 2, fecha: "2024-06-02", venta: "Venta-02", total: "$100", metodo: "Tarjeta" },
    { id: 3, fecha: "2024-06-03", venta: "Venta-03", total: "$50", metodo: "Transferencia" },
    { id: 4, fecha: "2024-06-04", venta: "Venta-04", total: "$500", metodo: "Efectivo" }, // Nueva venta con 10 productos
];

// Ahora cada producto tiene nombre y precio
const ventaDetalles: {
    [key: number]: {
        cliente: string;
        email?: string;
        celular?: string;
        productos: { nombre: string; precio: string }[];
        total: string;
        fecha: string;
        metodo: string;
    }
} = {
    1: { cliente: "Juan Pérez", email: "juan@mail.com", celular: "123456789", productos: [{ nombre: "Producto-01", precio: "$100" }, { nombre: "Producto-02", precio: "$50" }], total: "$150", fecha: "2024-06-01", metodo: "Efectivo" },
    2: { cliente: "María López", email: "maria@mail.com", celular: "987654321", productos: [{ nombre: "Producto-03", precio: "$100" }], total: "$100", fecha: "2024-06-02", metodo: "Tarjeta" },
    3: { cliente: "Carlos Gómez", email: "carlos@mail.com", celular: "555555555", productos: [{ nombre: "Producto-04", precio: "$30" }, { nombre: "Producto-05", precio: "$20" }], total: "$50", fecha: "2024-06-03", metodo: "Transferencia" },
    4: {
        cliente: "Ana Torres",
        email: "ana@mail.com",
        celular: "111222333",
        productos: [
            { nombre: "Producto-01", precio: "$50" },
            { nombre: "Producto-02", precio: "$40" },
            { nombre: "Producto-03", precio: "$30" },
            { nombre: "Producto-04", precio: "$60" },
            { nombre: "Producto-05", precio: "$20" },
            { nombre: "Producto-06", precio: "$40" },
            { nombre: "Producto-07", precio: "$60" },
            { nombre: "Producto-08", precio: "$50" },
            { nombre: "Producto-09", precio: "$70" },
            { nombre: "Producto-10", precio: "$80" },
        ],
        total: "$500",
        fecha: "2024-06-04",
        metodo: "Efectivo"
    },
};

const ROWS = 10;

export default function Tables() {
    const [selectedVenta, setSelectedVenta] = useState<number | null>(null);

    const handleRowClick = (id: number) => {
        setSelectedVenta(id);
    };

    const rows = Array.from({ length: ROWS }, (_, i) => historialData[i] || null);

    return (
        <div className="tables-container">
            {/* Tabla de historial de ventas */}
            <div className="table historial">
                <h3>Historial de Ventas</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Venta</th>
                            <th>Total</th>
                            <th>Método de Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((venta, idx) => (
                            <tr
                                key={venta ? venta.id : `empty-${idx}`}
                                onClick={venta ? () => handleRowClick(venta.id) : undefined}
                                className={`${venta ? "clickable-row" : "default-row"} ${selectedVenta === venta?.id ? "selected" : ""}`}
                            >
                                <td>{venta ? venta.fecha : ""}</td>
                                <td>{venta ? venta.venta : ""}</td>
                                <td>{venta ? venta.total : ""}</td>
                                <td>{venta ? venta.metodo : ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tabla de detalles de la venta (tipo boleta) */}
            <div className="table detalles">
                <h3>Detalles de la Venta</h3>
                {selectedVenta ? (
                    <table>
                        <tbody>
                            <tr>
                                <th>Nombre</th>
                                <td>{ventaDetalles[selectedVenta].cliente}</td>
                                <th>Email</th>
                                <td>{ventaDetalles[selectedVenta].email || "-"}</td>
                            </tr>
                            <tr>
                                <th>Celular</th>
                                <td>{ventaDetalles[selectedVenta].celular || "-"}</td>
                                <th>Fecha</th>
                                <td>{ventaDetalles[selectedVenta].fecha}</td>
                            </tr>
                            <tr>
                                <th colSpan={4}>Productos</th>
                            </tr>
                            <tr>
                                <td colSpan={4} className="no-padding">
                                    <div className="scrollable">
                                        <table className="full-width">
                                            <tbody>
                                                {ventaDetalles[selectedVenta].productos.map((producto, idx) => (
                                                    <tr key={idx}>
                                                        <td colSpan={2}>{producto.nombre}</td>
                                                        <td colSpan={2}>{producto.precio}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>Total</th>
                                <td>{ventaDetalles[selectedVenta].total}</td>
                                <th>Método de Pago</th>
                                <td>{ventaDetalles[selectedVenta].metodo}</td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <p>Seleccione una venta para ver los detalles.</p>
                )}
            </div>


        </div>
    );
}