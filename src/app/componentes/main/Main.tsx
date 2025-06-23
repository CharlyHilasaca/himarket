import Image from "next/image";

export default function Main() {
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4" id="productos">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-green-800 text-center">
          Productos Destacados
        </h2>
        {/* Categorías */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button className="px-5 py-2 rounded-full bg-green-700 text-white font-semibold shadow hover:bg-green-800 transition">Todos</button>
          <button className="px-5 py-2 rounded-full bg-gray-200 text-green-800 font-semibold shadow hover:bg-green-100 transition">Alimentos</button>
          <button className="px-5 py-2 rounded-full bg-gray-200 text-green-800 font-semibold shadow hover:bg-green-100 transition">Bebidas</button>
          <button className="px-5 py-2 rounded-full bg-gray-200 text-green-800 font-semibold shadow hover:bg-green-100 transition">Limpieza</button>
          <button className="px-5 py-2 rounded-full bg-gray-200 text-green-800 font-semibold shadow hover:bg-green-100 transition">Hogar</button>
          <button className="px-5 py-2 rounded-full bg-gray-200 text-green-800 font-semibold shadow hover:bg-green-100 transition">Orgánico</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Ejemplo de productos destacados */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <Image src="/arroz.png" alt="Arroz" width={80} height={80} />
            <h3 className="mt-2 font-bold text-green-900">Arroz Extra 1kg</h3>
            <span className="text-green-700 font-semibold">S/ 4.50</span>
            <button className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Agregar</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <Image src="/azucar.png" alt="Azúcar" width={80} height={80} />
            <h3 className="mt-2 font-bold text-green-900">Azúcar Rubia 1kg</h3>
            <span className="text-green-700 font-semibold">S/ 4.20</span>
            <button className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Agregar</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <Image src="/aceite.png" alt="Aceite" width={80} height={80} />
            <h3 className="mt-2 font-bold text-green-900">Aceite Vegetal 1L</h3>
            <span className="text-green-700 font-semibold">S/ 8.90</span>
            <button className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Agregar</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <Image src="/aceite.png" alt="Aceite" width={80} height={80} />
            <h3 className="mt-2 font-bold text-green-900">Aceite Vegetal 1L</h3>
            <span className="text-green-700 font-semibold">S/ 8.90</span>
            <button className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Agregar</button>
          </div>
        </div>
      </div>
      {/* Beneficios */}
      <div className="bg-[#f8fafc] rounded-xl shadow flex flex-col md:flex-row justify-between items-center gap-6 p-8 mb-10">
        <div className="flex flex-col items-center flex-1">
          <Image src="/icon-truck.svg" alt="Envío rápido" width={48} height={48} />
          <span className="font-bold text-lg mt-2">Envío Rápido</span>
          <span className="text-gray-700 text-center text-sm">Recibe tus productos en 24-48 horas</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <Image src="/icon-return.svg" alt="Devoluciones" width={48} height={48} />
          <span className="font-bold text-lg mt-2">Devoluciones Fáciles</span>
          <span className="text-gray-700 text-center text-sm">30 días para cambiar de opinión</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <Image src="/icon-lock.svg" alt="Pago seguro" width={48} height={48} />
          <span className="font-bold text-lg mt-2">Pago Seguro</span>
          <span className="text-gray-700 text-center text-sm">Protegemos tus datos</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <Image src="/icon-support.svg" alt="Soporte" width={48} height={48} />
          <span className="font-bold text-lg mt-2">Soporte 24/7</span>
          <span className="text-gray-700 text-center text-sm">Estamos aquí para ayudarte</span>
        </div>
      </div>
      {/* Boletín de suscripción */}
      <div className="bg-green-600 rounded-xl flex flex-col items-center justify-center py-10 px-4 mb-10">
        <h3 className="text-2xl font-bold text-white mb-2 text-center">Suscríbete a nuestro boletín</h3>
        <p className="text-white text-center mb-6">Recibe ofertas exclusivas y novedades directamente en tu correo electrónico</p>
        <form className="w-full max-w-xl flex flex-col sm:flex-row gap-3 items-center justify-center">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="flex-1 px-4 py-2 rounded-l bg-white border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 shadow min-w-[220px]"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-r bg-green-900 text-white font-semibold hover:bg-green-800 transition shadow min-w-[140px]"
          >
            Suscribirse
          </button>
        </form>
      </div>
    </main>
  );
}
