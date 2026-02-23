import { Ticket, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                Rifa
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Tu mejor oportunidad de ganar premios increíbles. Rifas transparentes, seguras y confiables.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-purple-500/30 hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-purple-500/30 hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-purple-500/30 hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+58 412-1234567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>info@rifa.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Caracas, Venezuela</span>
              </li>
            </ul>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 text-sm hover:text-amber-400 transition-colors">Inicio</a>
              </li>
              <li>
                <a href="/#comprar" className="text-gray-400 text-sm hover:text-amber-400 transition-colors">Comprar Tickets</a>
              </li>
              <li>
                <a href="/info" className="text-gray-400 text-sm hover:text-amber-400 transition-colors">Información de la Rifa</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-amber-400 transition-colors">Términos y Condiciones</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-amber-400 transition-colors">Política de Privacidad</a>
              </li>
            </ul>
          </div>

          {/* Espacio para Publicidad/Patrocinadores */}
          <div>
            <h3 className="text-white font-semibold mb-4">Patrocinadores</h3>
            <div className="bg-white/5 border border-dashed border-white/20 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm mb-2">Espacio disponible</p>
              <p className="text-gray-400 text-xs">Contactanos para patrocinar</p>
            </div>
            <div className="mt-4 bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 rounded-lg p-3">
              <p className="text-amber-300 text-xs font-medium text-center">
                🎉 Próximo Sorteo: 31 de Diciembre 2025
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2025 Rifa. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Juega responsablemente</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full" />
              <span>18+ Solo para mayores de edad</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
