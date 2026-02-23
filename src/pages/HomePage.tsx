import { useRef } from 'react';
import { HeroSection } from '@/sections/HeroSection';
import { MetricsSection } from '@/sections/MetricsSection';
import { ComprarTicketSection } from '@/sections/ComprarTicketSection';
import { ComoFuncionaSection } from '@/sections/ComoFuncionaSection';
import type { Ticket } from '@/types';

interface HomePageProps {
  metrics: {
    totalTickets: number;
    ticketsVendidos: number;
    ticketsDisponibles: number;
    precioTicket: number;
  };
  isNumeroDisponible: (numero: number) => Promise<boolean>;
  getTicketByNumero: (numero: number) => Promise<Ticket | undefined>;
  getDisponibilidadTodos: () => Promise<{ numero: boolean }[]>;
  comprarMultipleTickets: (
    numeros: number[],
    datos: { nombre: string; telefono: string; cedula: string; numeroReferencia: string }
  ) => Promise<Ticket[]>;
}

export function HomePage({ 
  metrics, 
  isNumeroDisponible, 
  getTicketByNumero,
  getDisponibilidadTodos,
  comprarMultipleTickets 
}: HomePageProps) {
  const comprarSectionRef = useRef<HTMLDivElement>(null);

  const scrollToComprar = () => {
    comprarSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <HeroSection onComprarClick={scrollToComprar} />
      <MetricsSection metrics={metrics} />
      <div ref={comprarSectionRef}>
        <ComprarTicketSection 
          metrics={metrics}
          isNumeroDisponible={isNumeroDisponible}
          getTicketByNumero={getTicketByNumero}
          getDisponibilidadTodos={getDisponibilidadTodos}
          comprarMultipleTickets={comprarMultipleTickets}
        />
      </div>
      <ComoFuncionaSection />
    </div>
  );
}
