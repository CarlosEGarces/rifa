export interface Ticket {
  id: string;
  numero: number;
  nombre: string;
  telefono: string;
  cedula: string;
  numeroReferencia: string;
  confirmado: boolean;
  fechaCompra: string;
  rifaId?: string;
  esPremiado?: boolean;
  etiquetaPremio?: string;
}

export interface TicketPremiado {
  numero: number;
  etiqueta: string;
}

export interface Rifa {
  id: string;
  nombre: string;
  descripcion: string;
  premio: string;
  precioTicket: number;
  totalTickets: number;
  fechaSorteo: string;
  fechaCreacion: string;
  activa: boolean;
  ticketsPremiados?: TicketPremiado[];
}

export interface RifaConfig {
  currentRifaId: string;
}

export interface RifaMetrics {
  totalTickets: number;
  ticketsVendidos: number;
  ticketsDisponibles: number;
  precioTicket: number;
}

export interface CompradorRanking {
  nombre: string;
  cedula: string;
  cantidad: number;
}
