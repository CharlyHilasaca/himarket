import Image from "next/image";

export default function Section() {
  return (
    <section className="w-full relative flex items-center justify-center min-h-[380px]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/abarrotes.png"
          alt="Fondo abarrotes"
          fill
          className="object-cover w-full h-full pointer-events-none select-none"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-3xl font-bold mb-2 text-green-900 drop-shadow-lg text-center">
          ¡Bienvenido a tu tienda de abarrotes favorita!
        </h1>
        <p className="text-lg text-green-800 mb-6 drop-shadow text-center">
          Encuentra productos frescos, ofertas y la mejor atención para tu hogar.
        </p>
        <form className="w-full max-w-md mx-auto flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="flex-1 px-4 py-2 rounded-l bg-white/90 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 shadow"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-r bg-green-700 text-white font-semibold hover:bg-green-800 transition shadow"
          >
            Buscar
          </button>
        </form>
      </div>
    </section>
  );
}
