import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/db';
import type { Ticket, Rifa, RifaMetrics, CompradorRanking, TicketPremiado } from '@/types';

const TOTAL_TICKETS = 1000;

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [currentRifa, setCurrentRifa] = useState<Rifa | null>(null);
  const [metrics, setMetrics] = useState<RifaMetrics>({
    totalTickets: TOTAL_TICKETS,
    ticketsVendidos: 0,
    ticketsDisponibles: TOTAL_TICKETS,
    precioTicket: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [topBuyers, setTopBuyers] = useState<CompradorRanking[]>([]);

  // Cargar datos al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        await db.init();
        await refreshData();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const refreshData = async () => {
    const [allTickets, allRifas, rifa, currentMetrics, buyers] = await Promise.all([
      db.getAllTickets(),
      db.getAllRifas(),
      db.getRifa(await db.getCurrentRifaId()),
      db.getMetrics(TOTAL_TICKETS),
      db.getTopBuyers(10)
    ]);
    
    setTickets(allTickets);
    setRifas(allRifas);
    setCurrentRifa(rifa || null);
    setMetrics(currentMetrics);
    setTopBuyers(buyers);
  };

  const comprarTicket = useCallback(async (ticketData: Omit<Ticket, 'id' | 'fechaCompra' | 'confirmado' | 'rifaId'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: crypto.randomUUID(),
      fechaCompra: new Date().toISOString(),
      confirmado: false,
      rifaId: await db.getCurrentRifaId(),
    };
    
    await db.addTicket(newTicket);
    await refreshData();
    
    return newTicket;
  }, []);

  const comprarMultipleTickets = useCallback(async (
    numeros: number[],
    datos: { nombre: string; telefono: string; cedula: string; numeroReferencia: string }
  ) => {
    const comprados: Ticket[] = [];
    const rifaId = await db.getCurrentRifaId();
    
    for (const numero of numeros) {
      const newTicket: Ticket = {
        id: crypto.randomUUID(),
        numero,
        nombre: datos.nombre,
        telefono: datos.telefono,
        cedula: datos.cedula,
        numeroReferencia: datos.numeroReferencia,
        fechaCompra: new Date().toISOString(),
        confirmado: false,
        rifaId,
      };
      await db.addTicket(newTicket);
      comprados.push(newTicket);
    }
    
    await refreshData();
    return comprados;
  }, []);

  const confirmarTicket = useCallback(async (ticketId: string) => {
    await db.confirmarTicket(ticketId);
    await refreshData();
  }, []);

  const eliminarTicket = useCallback(async (ticketId: string) => {
    await db.deleteTicket(ticketId);
    await refreshData();
  }, []);

  const getTicketByNumero = useCallback(async (numero: number) => {
    return await db.getTicketByNumero(numero);
  }, []);

  const getTicketsByCedula = useCallback(async (cedula: string) => {
    return await db.getTicketsByCedula(cedula);
  }, []);

  const isNumeroDisponible = useCallback(async (numero: number) => {
    return await db.isNumeroDisponible(numero);
  }, []);

  const getNumerosDisponibles = useCallback(async () => {
    const rifa = await db.getRifa(await db.getCurrentRifaId());
    return await db.getNumerosDisponibles(rifa?.totalTickets || TOTAL_TICKETS);
  }, []);

  const getDisponibilidadTodos = useCallback(async (): Promise<{ numero: boolean }[]> => {
    return await db.getAllNumeros();
  }, []);

  const getTicketsPendientes = useCallback(async () => {
    const allTickets = await db.getAllTickets();
    return allTickets.filter(t => !t.confirmado);
  }, []);

  const getTicketsPremiados = useCallback(async (): Promise<{ disponibles: TicketPremiado[]; comprados: Ticket[] }> => {
    return await db.getTicketsPremiados();
  }, []);

  // Rifa management
  const createRifa = useCallback(async (rifaData: Omit<Rifa, 'id' | 'fechaCreacion'>) => {
    const newRifa: Rifa = {
      ...rifaData,
      id: crypto.randomUUID(),
      fechaCreacion: new Date().toISOString(),
    };
    await db.createRifa(newRifa);
    await db.setCurrentRifa(newRifa.id);
    await refreshData();
    return newRifa;
  }, []);

  const switchRifa = useCallback(async (rifaId: string) => {
    await db.setCurrentRifa(rifaId);
    await refreshData();
  }, []);

  const deleteRifa = useCallback(async (rifaId: string) => {
    await db.deleteRifa(rifaId);
    await refreshData();
  }, []);

  const updateRifa = useCallback(async (rifaId: string, updates: Partial<Rifa>) => {
    const rifa = await db.getRifa(rifaId);
    if (rifa) {
      const updatedRifa = { ...rifa, ...updates };
      await db.updateRifa(updatedRifa);
      await refreshData();
    }
  }, []);

  const deleteAllData = useCallback(async () => {
    await db.deleteAllData();
    await refreshData();
  }, []);

  // Admin auth
  const verifyAdmin = useCallback((username: string, password: string) => {
    return db.verifyAdmin(username, password);
  }, []);

  return {
    tickets,
    rifas,
    currentRifa,
    metrics,
    topBuyers,
    isLoading,
    comprarTicket,
    comprarMultipleTickets,
    confirmarTicket,
    eliminarTicket,
    getTicketByNumero,
    getTicketsByCedula,
    isNumeroDisponible,
    getNumerosDisponibles,
    getDisponibilidadTodos,
    getTicketsPendientes,
    getTicketsPremiados,
    createRifa,
    switchRifa,
    deleteRifa,
    updateRifa,
    deleteAllData,
    verifyAdmin,
    refreshData,
  };
}
