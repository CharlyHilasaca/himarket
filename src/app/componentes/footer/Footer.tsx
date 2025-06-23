export default function Footer() {
  return (
    <footer className="w-full bg-green-900 text-white pt-10 pb-4 px-4 mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-6 border-b border-green-800">
        {/* Tienda */}
        <div>
          <h3 className="text-lg font-bold mb-2">GreenMarket</h3>
          <div className="w-10 h-1 bg-yellow-500 mb-3" />
          <p className="mb-4 text-sm">Tu tienda de confianza para productos naturales y ecológicos.</p>
          <div className="flex gap-4 mt-2">
            <a href="#" aria-label="Facebook"><img src="/icon-facebook.svg" alt="Facebook" width={32} height={32} /></a>
            <a href="#" aria-label="Instagram"><img src="/icon-instagram.svg" alt="Instagram" width={32} height={32} /></a>
            <a href="#" aria-label="Twitter"><img src="/icon-twitter.svg" alt="Twitter" width={32} height={32} /></a>
            <a href="#" aria-label="Pinterest"><img src="/icon-pinterest.svg" alt="Pinterest" width={32} height={32} /></a>
          </div>
        </div>
        {/* Comprar */}
        <div>
          <h3 className="text-lg font-bold mb-2">Comprar</h3>
          <div className="w-10 h-1 bg-yellow-500 mb-3" />
          <ul className="space-y-2 text-sm">
            <li><a href="#productos" className="hover:underline">Productos</a></li>
            <li><a href="#ofertas" className="hover:underline">Ofertas</a></li>
            <li><a href="#nuevos" className="hover:underline">Nuevos lanzamientos</a></li>
            <li><a href="#masvendidos" className="hover:underline">Más vendidos</a></li>
          </ul>
        </div>
        {/* Información */}
        <div>
          <h3 className="text-lg font-bold mb-2">Información</h3>
          <div className="w-10 h-1 bg-yellow-500 mb-3" />
          <ul className="space-y-2 text-sm">
            <li><a href="#nosotros" className="hover:underline">Sobre nosotros</a></li>
            <li><a href="#blog" className="hover:underline">Blog</a></li>
            <li><a href="#terminos" className="hover:underline">Términos y condiciones</a></li>
            <li><a href="#privacidad" className="hover:underline">Política de privacidad</a></li>
          </ul>
        </div>
        {/* Contacto */}
        <div>
          <h3 className="text-lg font-bold mb-2">Contacto</h3>
          <div className="w-10 h-1 bg-yellow-500 mb-3" />
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><img src="/icon-location.svg" alt="Dirección" width={18} height={18} /> Calle Principal 123, Ciudad</li>
            <li className="flex items-center gap-2"><img src="/icon-phone.svg" alt="Teléfono" width={18} height={18} /> +1 234 567 890</li>
            <li className="flex items-center gap-2"><img src="/icon-mail.svg" alt="Email" width={18} height={18} /> info@himarket.com</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-sm text-green-200 mt-4">
        © {new Date().getFullYear()} HiMarket. Todos los derechos reservados.
      </div>
    </footer>
  );
}
