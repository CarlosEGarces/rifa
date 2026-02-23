import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ticket, Info, Home } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
              Rifa
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button
                variant="ghost"
                className={`flex items-center gap-2 ${
                  isActive('/') 
                    ? 'bg-purple-500/20 text-amber-400' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home className="w-4 h-4" />
                Inicio
              </Button>
            </Link>
            <Link to="/">
              <Button
                variant="ghost"
                className={`flex items-center gap-2 ${
                  isActive('/#comprar') 
                    ? 'bg-purple-500/20 text-amber-400' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Ticket className="w-4 h-4" />
                Comprar Tickets
              </Button>
            </Link>
            <Link to="/info">
              <Button
                variant="ghost"
                className={`flex items-center gap-2 ${
                  isActive('/info') 
                    ? 'bg-purple-500/20 text-amber-400' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Info className="w-4 h-4" />
                Información
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-gray-300">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/info">
              <Button variant="ghost" size="icon" className="text-gray-300">
                <Info className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
