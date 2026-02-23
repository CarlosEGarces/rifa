import { Button } from '@/components/ui/button';
import { Ticket, Gift, Sparkles, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onComprarClick: () => void;
}

export function HeroSection({ onComprarClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-car.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-amber-300 text-sm font-medium">¡Nueva Rifa Disponible!</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
            Gana un Auto
          </span>
          <br />
          <span className="text-white">0km 2025</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Participa en nuestra rifa y tienes la oportunidad de ganar un 
          <span className="text-amber-400 font-semibold"> Toyota Corolla 2025 </span>
          completamente nuevo. ¡No pierdas esta oportunidad única!
        </p>

        {/* Prize Value */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
            <p className="text-gray-400 text-sm mb-1">Valor del Premio</p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-400">$25,000</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
            <p className="text-gray-400 text-sm mb-1">Precio del Ticket</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">$10</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
            <p className="text-gray-400 text-sm mb-1">Fecha del Sorteo</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-400">31 Dic</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={onComprarClick}
            size="lg"
            className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 text-slate-900 font-bold text-lg px-8 py-6 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105"
          >
            <Ticket className="w-5 h-5 mr-2" />
            Comprar Ticket Ahora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
            onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Gift className="w-5 h-5 mr-2" />
            Cómo Funciona
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>100% Seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Sorteo en Vivo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Garantía de Premio</span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
    </section>
  );
}
