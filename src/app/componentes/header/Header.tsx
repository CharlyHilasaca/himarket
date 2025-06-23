import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-green-700 text-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Image src="/logo2.png" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold">HiMarket</span>
        </div>
        <nav className="flex items-center gap-4 ml-6">
          <a href="#productos" className="hover:underline">Productos</a>
          <a href="#ofertas" className="hover:underline">Ofertas</a>
          <a href="#contacto" className="hover:underline">Contacto</a>
        </nav>
      </div>
      <div className="flex gap-3">
        <a href="/login" className="bg-white text-green-700 px-4 py-1 rounded font-semibold hover:bg-green-100 transition">Iniciar sesión</a>
        <a href="/register" className="bg-yellow-400 text-green-900 px-4 py-1 rounded font-semibold hover:bg-yellow-300 transition">Registrarse</a>
      </div>
    </header>
  );
}
