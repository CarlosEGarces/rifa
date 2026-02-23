import { 
  Search, 
  ShoppingCart, 
  CreditCard, 
  Ticket, 
  Trophy, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Elige tu Número',
    description: 'Busca tu número de la suerte entre los disponibles o genera números aleatorios.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: ShoppingCart,
    title: 'Agrega al Carrito',
    description: 'Selecciona todos los números que deseas comprar. Puedes comprar hasta 10 tickets.',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: CreditCard,
    title: 'Realiza el Pago',
    description: 'Completa tu información y realiza el pago. Guarda tu número de referencia.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: CheckCircle2,
    title: 'Confirma tu Compra',
    description: 'Tu ticket quedará pendiente de confirmación. Te contactaremos para verificar.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Ticket,
    title: 'Recibe tu Ticket',
    description: 'Una vez confirmado el pago, tu ticket quedará activo para el sorteo.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Trophy,
    title: '¡Gana el Premio!',
    description: 'Participa en el sorteo en vivo y podrías ser el ganador del gran premio.',
    color: 'from-yellow-500 to-amber-500',
  },
];

export function ComoFuncionaSection() {
  return (
    <section id="como-funciona" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 rounded-full px-4 py-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Proceso Simple</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Comprar tu ticket es muy fácil. Sigue estos simples pasos y estarás participando por el gran premio.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:border-white/20 transition-all hover:-translate-y-1"
            >
              {/* Step Number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-800 border border-white/20 rounded-full flex items-center justify-center text-sm font-bold text-gray-400">
                {index + 1}
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>

              {/* Arrow (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-16 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                ¿Tienes alguna duda?
              </h3>
              <p className="text-gray-400">
                Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta.
              </p>
            </div>
            <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg transition-colors">
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
