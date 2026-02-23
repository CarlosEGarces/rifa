import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Ticket, 
  Search, 
  ShoppingCart, 
  Check, 
  X, 
  CreditCard,
  User,
  Phone,
  Hash,
  RefreshCw,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Grid3X3
} from 'lucide-react';
import type { Ticket as TicketType } from '@/types';

interface ComprarTicketSectionProps {
  metrics: {
    totalTickets: number;
    ticketsVendidos: number;
    ticketsDisponibles: number;
    precioTicket: number;
  };
  isNumeroDisponible: (numero: number) => Promise<boolean>;
  getTicketByNumero: (numero: number) => Promise<TicketType | undefined>;
  getDisponibilidadTodos: () => Promise<{ numero: boolean }[]>;
  comprarMultipleTickets: (
    numeros: number[],
    datos: { nombre: string; telefono: string; cedula: string; numeroReferencia: string }
  ) => Promise<TicketType[]>;
}

export function ComprarTicketSection({ 
  metrics, 
  isNumeroDisponible,
  getTicketByNumero,
  getDisponibilidadTodos,
  comprarMultipleTickets
}: ComprarTicketSectionProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [cantidad, setCantidad] = useState(1);
  const [searchNumero, setSearchNumero] = useState('');
  const [manualNumero, setManualNumero] = useState('');
  const [searchResult, setSearchResult] = useState<TicketType | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [ticketsComprados, setTicketsComprados] = useState<TicketType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const PAGE_SIZE = 100;
  const [disponibles, setDisponibles] = useState<number[]>([]);
  const [showGrid, setShowGrid] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(metrics.totalTickets / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, metrics.totalTickets);
  
  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    cedula: '',
    numeroReferencia: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Cargar números disponibles (optimizado - una sola llamada)
  useEffect(() => {
    const loadDisponibles = async () => {
      const disponibilidad = await getDisponibilidadTodos();
      const start = (currentPage - 1) * PAGE_SIZE + 1;
      const end = Math.min(currentPage * PAGE_SIZE, metrics.totalTickets);
      
      const nums: number[] = [];
      for (let i = start; i <= end; i++) {
        if (disponibilidad[i - 1]?.numero) {
          nums.push(i);
        }
      }
      setDisponibles(nums);
    };
    loadDisponibles();
  }, [metrics.totalTickets, getDisponibilidadTodos, currentPage]);

  // Buscar ticket
  const handleSearchTicket = async () => {
    const numero = parseInt(searchNumero);
    if (isNaN(numero) || numero < 1 || numero > metrics.totalTickets) {
      setFormErrors({ search: 'Número inválido' });
      return;
    }

    setIsSearching(true);
    setSearchResult(null);
    setFormErrors({});

    const ticket = await getTicketByNumero(numero);
    setSearchResult(ticket || null);
    setIsSearching(false);
  };

  // Agregar número manual
  const handleAddManual = async () => {
    const numero = parseInt(manualNumero);
    if (isNaN(numero) || numero < 1 || numero > metrics.totalTickets) {
      setFormErrors({ manual: 'Número inválido' });
      return;
    }

    const disponible = await isNumeroDisponible(numero);
    if (!disponible) {
      setFormErrors({ manual: 'Este número ya está vendido' });
      return;
    }

    if (selectedNumbers.includes(numero)) {
      setFormErrors({ manual: 'Este número ya está seleccionado' });
      return;
    }

    if (selectedNumbers.length >= 10) {
      setFormErrors({ manual: 'Máximo 10 tickets' });
      return;
    }

    setSelectedNumbers([...selectedNumbers, numero]);
    setManualNumero('');
    setFormErrors({});
  };

  // Generar números aleatorios (optimizado)
  const generateRandomNumbers = async () => {
    if (cantidad < 1 || cantidad > 10) {
      setFormErrors({ cantidad: 'Máximo 10 tickets por compra' });
      return;
    }

    const disponibilidad = await getDisponibilidadTodos();
    const disponiblesNums: number[] = [];
    
    for (let i = 1; i <= metrics.totalTickets; i++) {
      if (disponibilidad[i - 1]?.numero && !selectedNumbers.includes(i)) {
        disponiblesNums.push(i);
      }
    }
    
    if (disponiblesNums.length === 0) {
      setFormErrors({ random: 'No hay números disponibles' });
      return;
    }
    
    if (disponiblesNums.length < cantidad) {
      setFormErrors({ random: `Solo hay ${disponiblesNums.length} números disponibles` });
      return;
    }
    
    const randomNums: number[] = [];
    const tempDisponibles = [...disponiblesNums];
    
    for (let i = 0; i < cantidad; i++) {
      const randomIndex = Math.floor(Math.random() * tempDisponibles.length);
      randomNums.push(tempDisponibles[randomIndex]);
      tempDisponibles.splice(randomIndex, 1);
    }
    
    setSelectedNumbers([...selectedNumbers, ...randomNums].slice(0, 10));
    setFormErrors({});
  };

  const removeNumero = (numero: number) => {
    setSelectedNumbers(selectedNumbers.filter(n => n !== numero));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.telefono.trim()) {
      errors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10,11}$/.test(formData.telefono.replace(/\D/g, ''))) {
      errors.telefono = 'Teléfono inválido (10-11 dígitos)';
    }
    
    if (!formData.cedula.trim()) {
      errors.cedula = 'La cédula es requerida';
    } else if (!/^\d{6,8}$/.test(formData.cedula.replace(/\D/g, ''))) {
      errors.cedula = 'Cédula inválida (6-8 dígitos)';
    }
    
    if (!formData.numeroReferencia.trim()) {
      errors.numeroReferencia = 'El número de referencia es requerido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleComprar = async () => {
    if (selectedNumbers.length === 0) {
      setFormErrors({ general: 'Selecciona al menos un número' });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    const tickets = await comprarMultipleTickets(selectedNumbers, {
      nombre: formData.nombre,
      telefono: formData.telefono,
      cedula: formData.cedula,
      numeroReferencia: formData.numeroReferencia,
    });
    
    setTicketsComprados(tickets);
    setCompraExitosa(true);
    setShowConfirmDialog(false);
    
    // Reset form
    setSelectedNumbers([]);
    setFormData({
      nombre: '',
      telefono: '',
      cedula: '',
      numeroReferencia: '',
    });
    setCantidad(1);
  };

  const totalPagar = selectedNumbers.length * metrics.precioTicket;

  return (
    <section id="comprar" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-4 py-2 mb-4">
            <Ticket className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Compra tu Ticket</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Selecciona tus Números de la Suerte
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Busca números disponibles, selecciona manualmente o genera aleatorios. Cada ticket tiene las mismas oportunidades de ganar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selector de Números */}
          <div className="lg:col-span-2 space-y-6">
            {/* Búsqueda de Ticket */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-amber-400" />
                  Buscar Número de Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder={`Ingresa un número del 1 al ${metrics.totalTickets}`}
                      value={searchNumero}
                      onChange={(e) => setSearchNumero(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchTicket()}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      min={1}
                      max={metrics.totalTickets}
                    />
                  </div>
                  <Button
                    onClick={handleSearchTicket}
                    disabled={isSearching}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>

                {/* Resultado de búsqueda */}
                {searchResult && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <X className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-semibold">Número No Disponible</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300">
                        <span className="text-gray-500">Comprador:</span> {searchResult.nombre}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-500">Cédula:</span> {searchResult.cedula}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-500">Teléfono:</span> {searchResult.telefono}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-500">Estado:</span>{' '}
                        <Badge className={searchResult.confirmado ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>
                          {searchResult.confirmado ? 'Confirmado' : 'Pendiente'}
                        </Badge>
                      </p>
                    </div>
                  </div>
                )}

                {searchResult === null && searchNumero && !isSearching && (
                  <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">¡Este número está disponible!</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selección Manual */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-400" />
                  Seleccionar Número Manual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Ingresa número a agregar"
                      value={manualNumero}
                      onChange={(e) => setManualNumero(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddManual()}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      min={1}
                      max={metrics.totalTickets}
                    />
                  </div>
                  <Button
                    onClick={handleAddManual}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>
                {formErrors.manual && (
                  <p className="text-red-400 text-sm mt-2">{formErrors.manual}</p>
                )}

                {/* Grid de números disponibles */}
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowGrid(!showGrid)}
                    className="w-full border-white/20 text-gray-300 hover:bg-white/10"
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    {showGrid ? 'Ocultar' : 'Ver'} Números Disponibles ({start}-{end})
                  </Button>
                  
                  {showGrid && (
                    <>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="border-white/20 text-gray-300 hover:bg-white/10"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Anterior
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="border-white/20 text-gray-300 hover:bg-white/10"
                          >
                            Siguiente
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                        <div className="text-sm text-gray-400">
                          Página {currentPage} / {totalPages} — Mostrando {start}-{end} de {metrics.totalTickets}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-10 gap-1 max-h-60 overflow-y-auto p-2 bg-white/5 rounded-lg">
                        {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((num) => {
                          const isSelected = selectedNumbers.includes(num);
                          const isDisponible = disponibles.includes(num);
                          
                          return (
                            <button
                              key={num}
                              onClick={() => {
                                if (isSelected) {
                                  removeNumero(num);
                                } else if (isDisponible && selectedNumbers.length < 10) {
                                  setSelectedNumbers([...selectedNumbers, num]);
                                }
                              }}
                              disabled={!isDisponible && !isSelected}
                              className={`
                                w-8 h-8 text-xs font-bold rounded transition-all
                                ${isSelected 
                                  ? 'bg-amber-500 text-white' 
                                  : isDisponible 
                                    ? 'bg-green-500/30 text-green-400 hover:bg-green-500/50' 
                                    : 'bg-red-500/20 text-red-400/50 cursor-not-allowed'
                                }
                              `}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Generador de Números */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-purple-400" />
                  Generar Números Aleatorios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-gray-400">Cantidad:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-white font-bold text-xl w-8 text-center">{cantidad}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCantidad(Math.min(10, cantidad + 1))}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={generateRandomNumbers}
                  variant="outline"
                  className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generar {cantidad} Número{cantidad > 1 ? 's' : ''} Aleatorio{cantidad > 1 ? 's' : ''}
                </Button>
                
                {formErrors.random && (
                  <p className="text-red-400 text-sm mt-2">{formErrors.random}</p>
                )}
              </CardContent>
            </Card>

            {/* Carrito */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-green-400" />
                  Tus Números Seleccionados
                  <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-400">
                    {selectedNumbers.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedNumbers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No has seleccionado ningún número</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedNumbers.map((numero) => (
                        <div
                          key={numero}
                          className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-lg px-3 py-2"
                        >
                          <span className="text-amber-400 font-bold">#{numero.toString().padStart(4, '0')}</span>
                          <button
                            onClick={() => removeNumero(numero)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total a pagar:</span>
                        <span className="text-2xl font-bold text-green-400">${totalPagar}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Formulario de Datos */}
          <div>
            <Card className="bg-white/5 border-white/10 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Tus Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre Completo
                  </Label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Tu nombre"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 mt-1"
                  />
                  {formErrors.nombre && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.nombre}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </Label>
                  <Input
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="04121234567"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 mt-1"
                  />
                  {formErrors.telefono && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.telefono}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Cédula
                  </Label>
                  <Input
                    value={formData.cedula}
                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                    placeholder="12345678"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 mt-1"
                  />
                  {formErrors.cedula && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.cedula}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-300 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Número de Referencia de Pago
                  </Label>
                  <Input
                    value={formData.numeroReferencia}
                    onChange={(e) => setFormData({ ...formData, numeroReferencia: e.target.value })}
                    placeholder="Referencia de tu pago"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 mt-1"
                  />
                  {formErrors.numeroReferencia && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.numeroReferencia}</p>
                  )}
                </div>

                {formErrors.general && (
                  <p className="text-red-400 text-sm text-center">{formErrors.general}</p>
                )}

                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={selectedNumbers.length === 0}
                  className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 text-slate-900 font-bold py-6"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceder al Pago
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Al comprar, aceptas los términos y condiciones de la rifa
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog de Confirmación */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirmar Compra</DialogTitle>
            <DialogDescription className="text-gray-400">
              Revisa los detalles de tu compra antes de confirmar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Números seleccionados:</p>
              <div className="flex flex-wrap gap-2">
                {selectedNumbers.map((numero) => (
                  <Badge key={numero} variant="secondary" className="bg-amber-500/20 text-amber-400">
                    #{numero.toString().padStart(4, '0')}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Nombre:</span>
                <span className="text-white">{formData.nombre}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Teléfono:</span>
                <span className="text-white">{formData.telefono}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Cédula:</span>
                <span className="text-white">{formData.cedula}</span>
              </div>
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total a pagar:</span>
                  <span className="text-2xl font-bold text-green-400">${totalPagar}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleComprar}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmar Compra
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Éxito */}
      <Dialog open={compraExitosa} onOpenChange={setCompraExitosa}>
        <DialogContent className="bg-slate-900 border-green-500/30 text-white max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <DialogTitle className="text-2xl text-green-400">¡Compra Exitosa!</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tus tickets han sido registrados correctamente
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white/5 rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
            <p className="text-gray-400 text-sm">Tus números de ticket:</p>
            <div className="flex flex-wrap gap-2">
              {ticketsComprados.map((ticket) => (
                <Badge key={ticket.id} className="bg-amber-500/20 text-amber-400 text-lg px-3 py-1">
                  #{ticket.numero.toString().padStart(4, '0')}
                </Badge>
              ))}
            </div>
            <div className="border-t border-white/10 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Nombre:</span>
                <span className="text-white">{ticketsComprados[0]?.nombre}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Referencia:</span>
                <span className="text-white">{ticketsComprados[0]?.numeroReferencia}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estado:</span>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                  Pendiente de confirmación
                </Badge>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setCompraExitosa(false)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold"
          >
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
