import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  UserCheck, 
  Trash2,
  RefreshCw,
  Shield,
  AlertTriangle,
  Download,
  FileText,
  Plus,
  History,
  Trophy,
  LogOut,
  Users
} from 'lucide-react';
import { generateTicketsPDF, generateComprobantePDF, downloadPDF } from '@/lib/pdfExport';
import type { Ticket, Rifa, CompradorRanking, TicketPremiado } from '@/types';

interface AdminPageProps {
  tickets: Ticket[];
  rifas: Rifa[];
  currentRifa: Rifa | null;
  topBuyers: CompradorRanking[];
  confirmarTicket: (ticketId: string) => Promise<void>;
  eliminarTicket: (ticketId: string) => Promise<void>;
  getTicketByNumero: (numero: number) => Promise<Ticket | undefined>;
  getTicketsPendientes: () => Promise<Ticket[]>;
  createRifa: (rifaData: Omit<Rifa, 'id' | 'fechaCreacion'>) => Promise<Rifa>;
  switchRifa: (rifaId: string) => Promise<void>;
  deleteRifa: (rifaId: string) => Promise<void>;
  logout: () => void;
  getTicketsPremiados: () => Promise<{ disponibles: TicketPremiado[]; comprados: Ticket[] }>;
  updateRifa: (rifaId: string, updates: Partial<Rifa>) => Promise<void>;
}

export function AdminPage({ 
  tickets, 
  rifas,
  currentRifa,
  topBuyers,
  confirmarTicket, 
  eliminarTicket,
  getTicketByNumero,
  getTicketsPendientes,
  createRifa,
  switchRifa,
  deleteRifa,
  logout,
  getTicketsPremiados,
  updateRifa,
}: AdminPageProps) {
  const [searchNumero, setSearchNumero] = useState('');
  const [searchResult, setSearchResult] = useState<Ticket | null>(null);
  const [ticketsPendientes, setTicketsPendientes] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showNewRifaDialog, setShowNewRifaDialog] = useState(false);
  const [showComprobanteDialog, setShowComprobanteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newRifaData, setNewRifaData] = useState({
    nombre: '',
    descripcion: '',
    premio: '',
    precioTicket: 10,
    totalTickets: 1000,
    fechaSorteo: '',
  });
  const [cantidadPremios, setCantidadPremios] = useState(1);
  const [metodoSeleccionPremios, setMetodoSeleccionPremios] = useState<'aleatorio' | 'manual'>('aleatorio');
  const [numerosPremiosManual, setNumerosPremiosManual] = useState('');
  const [etiquetasPremios, setEtiquetasPremios] = useState<string[]>(['1er Premio']);
  const [ticketsPremiadosData, setTicketsPremiadosData] = useState<{ disponibles: TicketPremiado[]; comprados: Ticket[] }>({ disponibles: [], comprados: [] });
  const [selectedPremioDetalle, setSelectedPremioDetalle] = useState<TicketPremiado | Ticket | null>(null);
  const [showEditarPremioDialog, setShowEditarPremioDialog] = useState(false);
  const [editandoPremio, setEditandoPremio] = useState<{ numero: number; etiqueta: string } | null>(null);
  const [showAgregarPremioDialog, setShowAgregarPremioDialog] = useState(false);
  const [nuevoPremioNumero, setNuevoPremioNumero] = useState('');
  const [nuevoPremioEtiqueta, setNuevoPremioEtiqueta] = useState('');

  // Cargar tickets pendientes
  const loadPendientes = async () => {
    const pendientes = await getTicketsPendientes();
    setTicketsPendientes(pendientes);
  };

  // Cargar tickets premiados
  const loadPremiados = async () => {
    const data = await getTicketsPremiados();
    setTicketsPremiadosData(data);
  };

  useEffect(() => {
    loadPendientes();
  }, [tickets]);

  useEffect(() => {
    loadPremiados();
  }, [currentRifa, tickets]);

  const handleSearch = async () => {
    const numero = parseInt(searchNumero);
    if (isNaN(numero)) return;
    
    const ticket = await getTicketByNumero(numero);
    setSearchResult(ticket || null);
  };

  const handleConfirmar = async () => {
    if (!selectedTicket) return;
    
    setIsLoading(true);
    await confirmarTicket(selectedTicket.id);
    setMessage('Ticket confirmado exitosamente');
    setShowConfirmDialog(false);
    setSelectedTicket(null);
    await loadPendientes();
    setIsLoading(false);
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEliminar = async () => {
    if (!selectedTicket) return;
    
    setIsLoading(true);
    await eliminarTicket(selectedTicket.id);
    setMessage('Ticket eliminado exitosamente');
    setShowDeleteDialog(false);
    setSelectedTicket(null);
    await loadPendientes();
    setIsLoading(false);
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleExportPDF = () => {
    const html = generateTicketsPDF(tickets, currentRifa);
    downloadPDF(html, `rifa-${currentRifa?.nombre || 'tickets'}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleGenerateComprobante = (ticket: Ticket) => {
    const html = generateComprobantePDF(ticket, currentRifa);
    downloadPDF(html, `comprobante-ticket-${ticket.numero}.pdf`);
    setShowComprobanteDialog(false);
  };

  const handleCreateRifa = async () => {
    if (!newRifaData.nombre || !newRifaData.descripcion || !newRifaData.fechaSorteo) {
      setMessage('Completa todos los campos obligatorios');
      return;
    }

    let ticketsPremiados: TicketPremiado[] = [];
    
    if (cantidadPremios > 0) {
      if (metodoSeleccionPremios === 'aleatorio') {
        const numeros: number[] = [];
        while (numeros.length < cantidadPremios) {
          const num = Math.floor(Math.random() * newRifaData.totalTickets) + 1;
          if (!numeros.includes(num)) {
            numeros.push(num);
          }
        }
        ticketsPremiados = numeros.map((num, idx) => ({
          numero: num,
          etiqueta: etiquetasPremios[idx] || `Premio ${idx + 1}`
        }));
      } else {
        const numerosIngresados = numerosPremiosManual
          .split(',')
          .map(n => parseInt(n.trim()))
          .filter(n => !isNaN(n) && n >= 1 && n <= newRifaData.totalTickets);
        
        const unicos = [...new Set(numerosIngresados)];
        ticketsPremiados = unicos.map((num, idx) => ({
          numero: num,
          etiqueta: etiquetasPremios[idx] || `Premio ${idx + 1}`
        }));
      }
    }

    setIsLoading(true);
    await createRifa({
      ...newRifaData,
      activa: true,
      ticketsPremiados,
    });
    setMessage('Nueva rifa creada exitosamente');
    setShowNewRifaDialog(false);
    setNewRifaData({
      nombre: '',
      descripcion: '',
      premio: '',
      precioTicket: 10,
      totalTickets: 1000,
      fechaSorteo: '',
    });
    setCantidadPremios(1);
    setMetodoSeleccionPremios('aleatorio');
    setNumerosPremiosManual('');
    setEtiquetasPremios(['1er Premio']);
    setIsLoading(false);
    
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 rounded-full px-4 py-2 mb-4">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Panel de Administración</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Gestión de Tickets
            </h1>
            <p className="text-gray-400 mt-2">
              {currentRifa?.nombre || 'Rifa'} - {currentRifa?.descripcion || ''}
            </p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Mensaje */}
        {message && (
          <div className={`mb-6 rounded-lg p-4 flex items-center gap-2 ${
            message.includes('error') || message.includes('incorrectas')
              ? 'bg-red-500/20 border border-red-500/40 text-red-400'
              : 'bg-green-500/20 border border-green-500/40 text-green-400'
          }`}>
            <CheckCircle2 className="w-5 h-5" />
            {message}
          </div>
        )}

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={handleExportPDF}
            className="bg-blue-500 hover:bg-blue-600 text-white h-auto py-4"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar a PDF
          </Button>
          <Button
            onClick={() => setShowNewRifaDialog(true)}
            className="bg-green-500 hover:bg-green-600 text-white h-auto py-4"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Rifa
          </Button>
          <Button
            variant="outline"
            className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20 h-auto py-4"
          >
            <History className="w-5 h-5 mr-2" />
            {rifas.length} Rifas
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="tickets" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Search className="w-4 h-4 mr-2" />
              Buscar Tickets
            </TabsTrigger>
            <TabsTrigger value="pendientes" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              <UserCheck className="w-4 h-4 mr-2" />
              Pendientes ({ticketsPendientes.length})
            </TabsTrigger>
            <TabsTrigger value="ranking" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <Trophy className="w-4 h-4 mr-2" />
              Top Compradores
            </TabsTrigger>
            <TabsTrigger value="premios" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              <Trophy className="w-4 h-4 mr-2" />
              Premios ({currentRifa?.ticketsPremiados?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="rifas" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              <History className="w-4 h-4 mr-2" />
              Historial
            </TabsTrigger>
          </TabsList>

          {/* Tab Buscar Tickets */}
          <TabsContent value="tickets">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-amber-400" />
                  Buscar Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Input
                    type="number"
                    placeholder="Número de ticket"
                    value={searchNumero}
                    onChange={(e) => setSearchNumero(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                {searchResult && (
                  <div className="bg-white/5 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-amber-400">
                        #{searchResult.numero.toString().padStart(4, '0')}
                      </span>
                      <Badge className={searchResult.confirmado ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>
                        {searchResult.confirmado ? 'Confirmado' : 'Pendiente'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Nombre</p>
                        <p className="text-white">{searchResult.nombre}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cédula</p>
                        <p className="text-white">{searchResult.cedula}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Teléfono</p>
                        <p className="text-white">{searchResult.telefono}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Referencia</p>
                        <p className="text-white">{searchResult.numeroReferencia}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fecha</p>
                        <p className="text-white">{new Date(searchResult.fechaCompra).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      {!searchResult.confirmado && (
                        <Button
                          onClick={() => {
                            setSelectedTicket(searchResult);
                            setShowConfirmDialog(true);
                          }}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Confirmar
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          setSelectedTicket(searchResult);
                          setShowComprobanteDialog(true);
                        }}
                        variant="outline"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Comprobante
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedTicket(searchResult);
                          setShowDeleteDialog(true);
                        }}
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {searchResult === null && searchNumero && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">No se encontró el ticket #{searchNumero}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Pendientes */}
          <TabsContent value="pendientes">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-400" />
                  Tickets Pendientes de Confirmación
                  <Badge className="ml-2 bg-amber-500/20 text-amber-400">
                    {ticketsPendientes.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {ticketsPendientes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No hay tickets pendientes</p>
                    </div>
                  ) : (
                    ticketsPendientes.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-white/5 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400 font-bold text-lg">
                              #{ticket.numero.toString().padStart(4, '0')}
                            </span>
                            <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                              Pendiente
                            </Badge>
                          </div>
                          <p className="text-gray-400">{ticket.nombre}</p>
                          <p className="text-gray-500 text-sm">{ticket.cedula} | Ref: {ticket.numeroReferencia}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowConfirmDialog(true);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowComprobanteDialog(true);
                            }}
                            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowDeleteDialog(true);
                            }}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Ranking */}
          <TabsContent value="ranking">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Top Compradores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topBuyers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No hay compradores registrados</p>
                    </div>
                  ) : (
                    topBuyers.map((buyer, index) => (
                      <div
                        key={buyer.cedula}
                        className="bg-white/5 rounded-lg p-4 flex items-center gap-4 hover:bg-white/10 transition-colors"
                      >
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-bold
                          ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                            index === 1 ? 'bg-gray-400/20 text-gray-400' :
                            index === 2 ? 'bg-amber-600/20 text-amber-600' :
                            'bg-white/10 text-gray-400'}
                        `}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold">{buyer.nombre}</p>
                          <p className="text-gray-500 text-sm">{buyer.cedula}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-amber-400">{buyer.cantidad}</p>
                          <p className="text-gray-500 text-sm">tickets</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Premios */}
          <TabsContent value="premios">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-green-400" />
                    Tickets Premiados
                    <Badge className="ml-2 bg-green-500/20 text-green-400">
                      {currentRifa?.ticketsPremiados?.length || 0}
                    </Badge>
                  </CardTitle>
                  <Button
                    onClick={() => {
                      setNuevoPremioNumero('');
                      setNuevoPremioEtiqueta('');
                      setShowAgregarPremioDialog(true);
                    }}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar Premio
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tickets Premiados Disponibles */}
                  <div>
                    <h3 className="text-gray-400 font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline" className="border-green-500/50 text-green-400">
                        Disponibles
                      </Badge>
                      <span className="text-sm">({ticketsPremiadosData.disponibles.length})</span>
                    </h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {ticketsPremiadosData.disponibles.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          <Trophy className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p>No hay premios disponibles</p>
                        </div>
                      ) : (
                        ticketsPremiadosData.disponibles.map((premio) => (
                          <div
                            key={premio.numero}
                            className="bg-white/5 rounded-lg p-3 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
                            onClick={() => {
                              setEditandoPremio({ numero: premio.numero, etiqueta: premio.etiqueta });
                              setShowEditarPremioDialog(true);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-green-400 font-bold text-lg">
                                #{premio.numero.toString().padStart(4, '0')}
                              </span>
                              <Badge className="bg-green-500/20 text-green-400 text-xs">
                                Disponible
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-white text-sm">{premio.etiqueta}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Tickets Premiados Comprados */}
                  <div>
                    <h3 className="text-gray-400 font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                        Comprados
                      </Badge>
                      <span className="text-sm">({ticketsPremiadosData.comprados.length})</span>
                    </h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {ticketsPremiadosData.comprados.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          <Trophy className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p>No hay premios comprados</p>
                        </div>
                      ) : (
                        ticketsPremiadosData.comprados.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="bg-white/5 rounded-lg p-3 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
                            onClick={() => setSelectedPremioDetalle(ticket)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-purple-400 font-bold text-lg">
                                #{ticket.numero.toString().padStart(4, '0')}
                              </span>
                              <Badge className={ticket.confirmado ? 'bg-green-500/20 text-green-400 text-xs' : 'bg-amber-500/20 text-amber-400 text-xs'}>
                                {ticket.confirmado ? 'Confirmado' : 'Pendiente'}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-white text-sm">{ticket.etiquetaPremio || 'Premio'}</p>
                              <p className="text-gray-500 text-xs">{ticket.nombre}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Historial */}
          <TabsContent value="rifas">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" />
                  Historial de Rifas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rifas.map((rifa) => (
                    <div
                      key={rifa.id}
                      className={`bg-white/5 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors ${
                        rifa.id === currentRifa?.id ? 'border border-purple-500/50' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold">{rifa.nombre}</p>
                          {rifa.id === currentRifa?.id && (
                            <Badge className="bg-purple-500/20 text-purple-400">Activa</Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{rifa.descripcion}</p>
                        <p className="text-gray-500 text-sm">
                          Premio: {rifa.premio} | Sorteo: {new Date(rifa.fechaSorteo).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {rifa.id !== currentRifa?.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => switchRifa(rifa.id)}
                            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                          >
                            Activar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteRifa(rifa.id)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Estadísticas Rápidas */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-gray-400 text-sm">Total Tickets</p>
              <p className="text-2xl font-bold text-white">{tickets.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-gray-400 text-sm">Confirmados</p>
              <p className="text-2xl font-bold text-green-400">
                {tickets.filter(t => t.confirmado).length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-gray-400 text-sm">Pendientes</p>
              <p className="text-2xl font-bold text-amber-400">
                {tickets.filter(t => !t.confirmado).length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-gray-400 text-sm">Recaudación</p>
              <p className="text-2xl font-bold text-purple-400">
                ${tickets.length * (currentRifa?.precioTicket || 10)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog Confirmar */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-slate-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Confirmar Ticket
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              ¿Estás seguro de confirmar este ticket?
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <p className="text-2xl font-bold text-amber-400">
                #{selectedTicket.numero.toString().padStart(4, '0')}
              </p>
              <p className="text-gray-300">{selectedTicket.nombre}</p>
              <p className="text-gray-400 text-sm">{selectedTicket.cedula}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmar}
              disabled={isLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirmar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Eliminar */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-slate-900 border-red-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Eliminar Ticket
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              ¿Estás seguro de eliminar este ticket? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-2">
              <p className="text-2xl font-bold text-amber-400">
                #{selectedTicket.numero.toString().padStart(4, '0')}
              </p>
              <p className="text-gray-300">{selectedTicket.nombre}</p>
              <p className="text-gray-400 text-sm">{selectedTicket.cedula}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEliminar}
              disabled={isLoading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Eliminar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Comprobante */}
      <Dialog open={showComprobanteDialog} onOpenChange={setShowComprobanteDialog}>
        <DialogContent className="bg-slate-900 border-blue-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-400">
              <FileText className="w-5 h-5" />
              Generar Comprobante
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Genera un comprobante PDF para este ticket
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <p className="text-2xl font-bold text-amber-400">
                #{selectedTicket.numero.toString().padStart(4, '0')}
              </p>
              <p className="text-gray-300">{selectedTicket.nombre}</p>
              <p className="text-gray-400 text-sm">{selectedTicket.cedula}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowComprobanteDialog(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => selectedTicket && handleGenerateComprobante(selectedTicket)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Detalle Premio */}
      <Dialog open={!!selectedPremioDetalle} onOpenChange={() => setSelectedPremioDetalle(null)}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <Trophy className="w-5 h-5" />
              Detalle del Premio
            </DialogTitle>
          </DialogHeader>
          
          {selectedPremioDetalle && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-4xl font-bold text-amber-400">
                  #{selectedPremioDetalle.numero.toString().padStart(4, '0')}
                </p>
                <Badge className="mt-2 bg-purple-500/20 text-purple-400">
                  {('nombre' in selectedPremioDetalle) ? (selectedPremioDetalle as Ticket).etiquetaPremio || 'Premio' : (selectedPremioDetalle as TicketPremiado).etiqueta}
                </Badge>
              </div>
              
              {'nombre' in selectedPremioDetalle ? (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Comprador</p>
                      <p className="text-white">{(selectedPremioDetalle as Ticket).nombre}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Cédula</p>
                      <p className="text-white">{(selectedPremioDetalle as Ticket).cedula}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Teléfono</p>
                      <p className="text-white">{(selectedPremioDetalle as Ticket).telefono}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Estado</p>
                      <Badge className={(selectedPremioDetalle as Ticket).confirmado ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>
                        {(selectedPremioDetalle as Ticket).confirmado ? 'Confirmado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => {
                        setSelectedTicket(selectedPremioDetalle as Ticket);
                        setShowComprobanteDialog(true);
                      }}
                      variant="outline"
                      className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Comprobante
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  <p>Este ticket aún no ha sido comprado</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedPremioDetalle(null)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Nueva Rifa */}
      <Dialog open={showNewRifaDialog} onOpenChange={setShowNewRifaDialog}>
        <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <Plus className="w-5 h-5" />
              Nueva Rifa
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Crea una nueva rifa con diferentes premios
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-2">
            <div>
              <Label className="text-gray-300">Nombre de la Rifa</Label>
              <Input
                value={newRifaData.nombre}
                onChange={(e) => setNewRifaData({ ...newRifaData, nombre: e.target.value })}
                placeholder="Ej: Rifa de Navidad 2025"
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Descripción</Label>
              <Input
                value={newRifaData.descripcion}
                onChange={(e) => setNewRifaData({ ...newRifaData, descripcion: e.target.value })}
                placeholder="Ej: Toyota Corolla 2025"
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Premio</Label>
              <Input
                value={newRifaData.premio}
                onChange={(e) => setNewRifaData({ ...newRifaData, premio: e.target.value })}
                placeholder="Ej: $25,000"
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Precio Ticket</Label>
                <Input
                  type="number"
                  value={newRifaData.precioTicket}
                  onChange={(e) => setNewRifaData({ ...newRifaData, precioTicket: parseInt(e.target.value) })}
                  className="bg-white/10 border-white/20 text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Total Tickets</Label>
                <Input
                  type="number"
                  value={newRifaData.totalTickets}
                  onChange={(e) => setNewRifaData({ ...newRifaData, totalTickets: parseInt(e.target.value) })}
                  className="bg-white/10 border-white/20 text-white mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-300">Fecha del Sorteo</Label>
              <Input
                type="date"
                value={newRifaData.fechaSorteo}
                onChange={(e) => setNewRifaData({ ...newRifaData, fechaSorteo: e.target.value })}
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>
            
            <div className="border-t border-white/10 pt-4 mt-4">
              <Label className="text-gray-300 text-lg font-semibold">Tickets Premiados</Label>
              <p className="text-gray-500 text-sm mb-3">Configura los números ganadores de esta rifa</p>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-400">Cantidad de premios</Label>
                  <Input
                    type="number"
                    min={0}
                    max={newRifaData.totalTickets}
                    value={cantidadPremios}
                    onChange={(e) => {
                      const num = parseInt(e.target.value) || 0;
                      setCantidadPremios(num);
                      const newEtiquetas = [...etiquetasPremios];
                      while (newEtiquetas.length < num) {
                        newEtiquetas.push(`${newEtiquetas.length + 1}er Premio`);
                      }
                      setEtiquetasPremios(newEtiquetas);
                    }}
                    className="bg-white/10 border-white/20 text-white mt-1"
                  />
                </div>
                
                {cantidadPremios > 0 && (
                  <>
                    <div>
                      <Label className="text-gray-400">Método de selección</Label>
                      <div className="flex gap-2 mt-1">
                        <Button
                          type="button"
                          variant={metodoSeleccionPremios === 'aleatorio' ? 'default' : 'outline'}
                          onClick={() => setMetodoSeleccionPremios('aleatorio')}
                          className={metodoSeleccionPremios === 'aleatorio' ? 'bg-purple-500' : 'border-white/20'}
                        >
                          Aleatorio
                        </Button>
                        <Button
                          type="button"
                          variant={metodoSeleccionPremios === 'manual' ? 'default' : 'outline'}
                          onClick={() => setMetodoSeleccionPremios('manual')}
                          className={metodoSeleccionPremios === 'manual' ? 'bg-purple-500' : 'border-white/20'}
                        >
                          Manual
                        </Button>
                      </div>
                    </div>
                    
                    {metodoSeleccionPremios === 'manual' && (
                      <div>
                        <Label className="text-gray-400">Números ganadores (separados por coma)</Label>
                        <Input
                          value={numerosPremiosManual}
                          onChange={(e) => setNumerosPremiosManual(e.target.value)}
                          placeholder="Ej: 15, 42, 100, 250"
                          className="bg-white/10 border-white/20 text-white mt-1"
                        />
                      </div>
                    )}
                    
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                      <p className="text-amber-400 text-sm">
                        Las etiquetas de los premios se podrán configurar después en la pestaña "Premios"
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowNewRifaDialog(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateRifa}
              disabled={isLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Crear Rifa'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Premio */}
      <Dialog open={showEditarPremioDialog} onOpenChange={setShowEditarPremioDialog}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">
              <Trophy className="w-5 h-5" />
              Editar Premio
            </DialogTitle>
          </DialogHeader>
          
          {editandoPremio && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-amber-400">
                  #{editandoPremio.numero.toString().padStart(4, '0')}
                </p>
              </div>
              <div>
                <Label className="text-gray-300">Etiqueta del Premio</Label>
                <Input
                  value={editandoPremio.etiqueta}
                  onChange={(e) => setEditandoPremio({ ...editandoPremio, etiqueta: e.target.value })}
                  placeholder="Ej: 1er Premio"
                  className="bg-white/10 border-white/20 text-white mt-1"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowEditarPremioDialog(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                if (editandoPremio && currentRifa) {
                  const ticketsPremiados = currentRifa.ticketsPremiados || [];
                  const actualizados = ticketsPremiados.map(p => 
                    p.numero === editandoPremio.numero 
                      ? { ...p, etiqueta: editandoPremio.etiqueta }
                      : p
                  );
                  await updateRifa(currentRifa.id, { ticketsPremiados: actualizados });
                  await loadPremiados();
                  setShowEditarPremioDialog(false);
                }
              }}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
            >
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Agregar Premio */}
      <Dialog open={showAgregarPremioDialog} onOpenChange={setShowAgregarPremioDialog}>
        <DialogContent className="bg-slate-900 border-green-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <Plus className="w-5 h-5" />
              Agregar Premio
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Número del Ticket</Label>
              <Input
                type="number"
                min={1}
                max={currentRifa?.totalTickets || 1000}
                value={nuevoPremioNumero}
                onChange={(e) => setNuevoPremioNumero(e.target.value)}
                placeholder="Ej: 150"
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Etiqueta del Premio</Label>
              <Input
                value={nuevoPremioEtiqueta}
                onChange={(e) => setNuevoPremioEtiqueta(e.target.value)}
                placeholder="Ej: 3er Premio"
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAgregarPremioDialog(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                const numero = parseInt(nuevoPremioNumero);
                if (!isNaN(numero) && nuevoPremioEtiqueta && currentRifa) {
                  const ticketsPremiados = currentRifa.ticketsPremiados || [];
                  
                  if (ticketsPremiados.some(p => p.numero === numero)) {
                    setMessage('Ya existe un premio con este número');
                    return;
                  }
                  
                  await updateRifa(currentRifa.id, { 
                    ticketsPremiados: [...ticketsPremiados, { numero, etiqueta: nuevoPremioEtiqueta }]
                  });
                  await loadPremiados();
                  setShowAgregarPremioDialog(false);
                  setMessage('Premio agregado exitosamente');
                  setTimeout(() => setMessage(''), 3000);
                }
              }}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              Agregar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
