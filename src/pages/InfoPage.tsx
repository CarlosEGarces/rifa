import { 
  Gift, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Trophy,
  Car,
  Star,
  Clock,
  AlertTriangle,
  FileText,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const premios = [
  {
    lugar: '1er Premio',
    descripcion: 'Toyota Corolla 2025 0km',
    valor: '$25,000',
    icon: Car,
    color: 'from-yellow-400 to-amber-500',
  },
  {
    lugar: '2do Premio',
    descripcion: 'Viaje todo incluido a Cancún',
    valor: '$5,000',
    icon: Star,
    color: 'from-gray-300 to-gray-400',
  },
  {
    lugar: '3er Premio',
    descripcion: 'iPhone 15 Pro Max',
    valor: '$1,200',
    icon: Gift,
    color: 'from-amber-600 to-amber-700',
  },
];

const preguntasFrecuentes = [
  {
    pregunta: '¿Cómo se realiza el sorteo?',
    respuesta: 'El sorteo se realiza en vivo a través de nuestras redes sociales utilizando un sistema de balotas electrónico certificado y transparente.',
  },
  {
    pregunta: '¿Cuándo se realiza el sorteo?',
    respuesta: 'El sorteo está programado para el 31 de diciembre de 2025 a las 8:00 PM hora de Venezuela.',
  },
  {
    pregunta: '¿Cómo sé si gané?',
    respuesta: 'Los ganadores serán contactados directamente por nuestro equipo y anunciados en vivo durante el sorteo y en nuestras redes sociales.',
  },
  {
    pregunta: '¿Puedo comprar más de un ticket?',
    respuesta: 'Sí, puedes comprar hasta 10 tickets en una sola transacción. Cada ticket es una oportunidad adicional de ganar.',
  },
  {
    pregunta: '¿Qué pasa si no se venden todos los tickets?',
    respuesta: 'El sorteo se realizará independientemente de la cantidad de tickets vendidos. Garantizamos todos los premios.',
  },
];

const terminos = [
  'Debes ser mayor de 18 años para participar.',
  'Cada ticket tiene un valor de $10.',
  'Los tickets son personales e intransferibles.',
  'El pago debe ser confirmado para activar el ticket.',
  'Los ganadores tienen 30 días para reclamar su premio.',
  'La rifa se realizará el 31 de diciembre de 2025.',
  'Los premios no son canjeables por dinero en efectivo.',
  'En caso de disputa, la decisión de los organizadores es final.',
];

export function InfoPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-2 mb-6">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">Información Importante</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Todo sobre la{' '}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
              Rifa
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Conoce todos los detalles sobre nuestra rifa, los premios, las reglas y cómo participar. 
            Tu oportunidad de ganar está a un click de distancia.
          </p>
        </div>
      </section>

      {/* Premios */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 rounded-full px-4 py-2 mb-4">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Premios Increíbles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Premios a Ganar
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Estos son los fabulosos premios que podrías ganar participando en nuestra rifa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {premios.map((premio, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 overflow-hidden group hover:border-white/20 transition-all"
              >
                <div className={`h-2 bg-gradient-to-r ${premio.color}`} />
                <CardContent className="p-6 text-center">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${premio.color} rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                    <premio.icon className="w-10 h-10 text-white" />
                  </div>
                  <Badge className={`mb-3 bg-gradient-to-r ${premio.color} text-white border-0`}>
                    {premio.lugar}
                  </Badge>
                  <h3 className="text-xl font-bold text-white mb-2">{premio.descripcion}</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                    {premio.valor}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detalles de la Rifa */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info Cards */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Detalles de la Rifa</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Fecha del Sorteo</p>
                      <p className="text-white font-semibold">31 Diciembre 2025</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Hora del Sorteo</p>
                      <p className="text-white font-semibold">8:00 PM (VEN)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total de Tickets</p>
                      <p className="text-white font-semibold">1,000 tickets</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Gift className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Precio del Ticket</p>
                      <p className="text-white font-semibold">$10 USD</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Advertencia */}
              <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-semibold mb-1">Advertencia</p>
                  <p className="text-red-300/80 text-sm">
                    La participación en rifas y juegos de azar puede generar adicción. 
                    Juega responsablemente y solo si eres mayor de edad.
                  </p>
                </div>
              </div>
            </div>

            {/* Términos y Condiciones */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Términos y Condiciones</h2>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    Reglas de Participación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {terminos.map((termino, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{termino}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 rounded-full px-4 py-2 mb-4">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-400">
              Encuentra respuestas a las preguntas más comunes sobre nuestra rifa.
            </p>
          </div>

          <div className="space-y-4">
            {preguntasFrecuentes.map((faq, index) => (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    {faq.pregunta}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 pl-11">{faq.respuesta}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-900/50 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Listo para Participar?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            No pierdas esta oportunidad única de ganar increíbles premios. 
            Compra tu ticket ahora y sé parte de la rifa más emocionante del año.
          </p>
          <a
            href="/#comprar"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 text-slate-900 font-bold text-lg rounded-xl shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
          >
            <Gift className="w-5 h-5" />
            Comprar mi Ticket Ahora
          </a>
        </div>
      </section>
    </div>
  );
}

// Fix missing import

