import { useState } from "react";
import Script from "next/script";

declare global {
    interface Window {
        MercadoPago?: any;
    }
}

export default function YapeForm({ onToken }: { onToken: (token: string) => void }) {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [sdkReady, setSdkReady] = useState(false);

    const handleYape = async (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof window === "undefined" || !sdkReady || !window.MercadoPago) {
            alert("El SDK de Mercado Pago aún no está listo. Intenta de nuevo en unos segundos.");
            return;
        }
        setLoading(true);
        console.log("[YapeForm] Enviando datos:", { phone, otp });
        // @ts-ignore
        const mp = new window.MercadoPago("TEST-30f87e9d-c841-4179-a988-f5af45a79703");
        const yape = mp.yape({ otp, phoneNumber: phone });
        try {
            const yapeToken = await yape.create();
            console.log("[YapeForm] Token generado:", yapeToken);
            onToken(yapeToken.id); // <-- SOLO el id, no el objeto completo
        } catch (err) {
            console.error("[YapeForm] Error generando token Yape:", err);
            alert("Error generando token Yape");
        }
        setLoading(false);
    };

    return (
        <>
            <Script
                src="https://sdk.mercadopago.com/js/v2"
                strategy="afterInteractive"
                onLoad={() => setSdkReady(true)}
            />
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[2100]">
                <form
                    onSubmit={handleYape}
                    className="flex flex-col gap-4 w-full max-w-sm bg-white rounded-lg shadow-lg p-8 yape-form-bg"
                >
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-green-800" htmlFor="yape-phone">Celular</label>
                        <input
                            id="yape-phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            placeholder="Ingresa tu número de celular"
                            title="Celular"
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="tel"
                            disabled={loading}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-green-800" htmlFor="yape-otp">OTP</label>
                        <input
                            id="yape-otp"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            required
                            title="OTP"
                            placeholder="Ingresa el código OTP"
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            autoComplete="one-time-code"
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !sdkReady}
                        className={`w-full py-2 rounded font-semibold text-white transition ${loading || !sdkReady
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-700 hover:bg-green-800"
                            }`}
                    >
                        {loading ? "Procesando..." : !sdkReady ? "Cargando Mercado Pago..." : "Pagar con Yape"}
                    </button>
                </form>
            </div>
        </>
    );
}
