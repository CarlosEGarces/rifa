import type { Ticket, Rifa } from '@/types';

const DB_NAME = 'RifaDB';
const DB_VERSION = 3;
const TICKETS_STORE = 'tickets';
const RIFAS_STORE = 'rifas';
const CONFIG_STORE = 'config';

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'rifa2025'
};

class RifaDatabase {
  private db: IDBDatabase | null = null;
  private currentRifaId: string = 'default';

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.loadCurrentRifa();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Tickets store
        if (!db.objectStoreNames.contains(TICKETS_STORE)) {
          const store = db.createObjectStore(TICKETS_STORE, { keyPath: 'id' });
          store.createIndex('numero', 'numero', { unique: false });
          store.createIndex('cedula', 'cedula', { unique: false });
          store.createIndex('confirmado', 'confirmado', { unique: false });
          store.createIndex('rifaId', 'rifaId', { unique: false });
        }
        
        // Rifas store (historial)
        if (!db.objectStoreNames.contains(RIFAS_STORE)) {
          const rifasStore = db.createObjectStore(RIFAS_STORE, { keyPath: 'id' });
          rifasStore.createIndex('fecha', 'fechaCreacion', { unique: false });
        }
        
        // Config store
        if (!db.objectStoreNames.contains(CONFIG_STORE)) {
          db.createObjectStore(CONFIG_STORE, { keyPath: 'key' });
        }
      };
    });
  }

  // Admin auth
  verifyAdmin(username: string, password: string): boolean {
    return username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password;
  }

  // Current rifa management
  private async loadCurrentRifa(): Promise<void> {
    const config = await this.getConfig('currentRifaId');
    if (config) {
      this.currentRifaId = config;
    } else {
      await this.createDefaultRifa();
    }
  }

  async getCurrentRifaId(): Promise<string> {
    return this.currentRifaId;
  }

  async setCurrentRifa(rifaId: string): Promise<void> {
    this.currentRifaId = rifaId;
    await this.setConfig('currentRifaId', rifaId);
  }

  private async createDefaultRifa(): Promise<void> {
    const defaultRifa: Rifa = {
      id: 'default',
      nombre: 'Rifa 2025',
      descripcion: 'Toyota Corolla 2025 0km',
      premio: '$25,000',
      precioTicket: 10,
      totalTickets: 1000,
      fechaSorteo: '2025-12-31',
      fechaCreacion: new Date().toISOString(),
      activa: true,
    };
    await this.createRifa(defaultRifa);
    await this.setConfig('currentRifaId', 'default');
  }

  // Config methods
  async getConfig(key: string): Promise<any> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG_STORE], 'readonly');
      const store = transaction.objectStore(CONFIG_STORE);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }

  async setConfig(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONFIG_STORE], 'readwrite');
      const store = transaction.objectStore(CONFIG_STORE);
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Rifa methods
  async createRifa(rifa: Rifa): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([RIFAS_STORE], 'readwrite');
      const store = transaction.objectStore(RIFAS_STORE);
      const request = store.add(rifa);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllRifas(): Promise<Rifa[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([RIFAS_STORE], 'readonly');
      const store = transaction.objectStore(RIFAS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as Rifa[]);
      request.onerror = () => reject(request.error);
    });
  }

  async getRifa(id: string): Promise<Rifa | undefined> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([RIFAS_STORE], 'readonly');
      const store = transaction.objectStore(RIFAS_STORE);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result as Rifa | undefined);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteRifa(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    // Delete all tickets for this rifa
    const tickets = await this.getAllTickets(id);
    for (const ticket of tickets) {
      await this.deleteTicket(ticket.id);
    }
    
    // Delete rifa
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([RIFAS_STORE], 'readwrite');
      const store = transaction.objectStore(RIFAS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Ticket methods
  async getAllTickets(rifaId?: string): Promise<Ticket[]> {
    if (!this.db) await this.init();
    const targetRifaId = rifaId || this.currentRifaId;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TICKETS_STORE], 'readonly');
      const store = transaction.objectStore(TICKETS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const tickets = request.result as Ticket[];
        resolve(tickets.filter(t => t.rifaId === targetRifaId));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getTicketByNumero(numero: number, rifaId?: string): Promise<Ticket | undefined> {
    if (!this.db) await this.init();
    const targetRifaId = rifaId || this.currentRifaId;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TICKETS_STORE], 'readonly');
      const store = transaction.objectStore(TICKETS_STORE);
      const index = store.index('numero');
      const request = index.getAll(numero);

      request.onsuccess = () => {
        const tickets = request.result as Ticket[];
        resolve(tickets.find(t => t.rifaId === targetRifaId));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getTicketsByCedula(cedula: string, rifaId?: string): Promise<Ticket[]> {
    if (!this.db) await this.init();
    const targetRifaId = rifaId || this.currentRifaId;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TICKETS_STORE], 'readonly');
      const store = transaction.objectStore(TICKETS_STORE);
      const index = store.index('cedula');
      const request = index.getAll(cedula);

      request.onsuccess = () => {
        const tickets = request.result as Ticket[];
        resolve(tickets.filter(t => t.rifaId === targetRifaId));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async addTicket(ticket: Ticket): Promise<void> {
    if (!this.db) await this.init();
    
    // Ensure ticket has current rifaId
    if (!ticket.rifaId) {
      ticket.rifaId = this.currentRifaId;
    }
    
    // Check if ticket is ganadora
    const rifa = await this.getRifa(ticket.rifaId);
    if (rifa?.ticketsPremiados) {
      const premio = rifa.ticketsPremiados.find(p => p.numero === ticket.numero);
      if (premio) {
        ticket.esPremiado = true;
        ticket.etiquetaPremio = premio.etiqueta;
      }
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TICKETS_STORE], 'readwrite');
      const store = transaction.objectStore(TICKETS_STORE);
      const request = store.add(ticket);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateTicket(ticket: Ticket): Promise<void> {
    if (!this.db) await this.init();
    
    // Check if ticket is ganadora
    const rifa = await this.getRifa(ticket.rifaId || this.currentRifaId);
    if (rifa?.ticketsPremiados) {
      const premio = rifa.ticketsPremiados.find(p => p.numero === ticket.numero);
      if (premio) {
        ticket.esPremiado = true;
        ticket.etiquetaPremio = premio.etiqueta;
      }
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TICKETS_STORE], 'readwrite');
      const store = transaction.objectStore(TICKETS_STORE);
      const request = store.put(ticket);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTicket(id: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TICKETS_STORE], 'readwrite');
      const store = transaction.objectStore(TICKETS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async confirmarTicket(id: string): Promise<void> {
    if (!this.db) await this.init();
    const ticket = await this.getTicketById(id);
    if (ticket) {
      ticket.confirmado = true;
      await this.updateTicket(ticket);
    }
  }

  async getTicketById(id: string): Promise<Ticket | undefined> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TICKETS_STORE], 'readonly');
      const store = transaction.objectStore(TICKETS_STORE);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result as Ticket | undefined);
      request.onerror = () => reject(request.error);
    });
  }

  async isNumeroDisponible(numero: number, rifaId?: string): Promise<boolean> {
    const ticket = await this.getTicketByNumero(numero, rifaId);
    return !ticket;
  }

  async updateRifa(rifa: Rifa): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([RIFAS_STORE], 'readwrite');
      const store = transaction.objectStore(RIFAS_STORE);
      const request = store.put(rifa);

      request.onsuccess = async () => {
        // Update existing tickets to mark them as premiadas
        if (rifa.ticketsPremiados && rifa.ticketsPremiados.length > 0) {
          const tickets = await this.getAllTickets(rifa.id);
          for (const ticket of tickets) {
            const premio = rifa.ticketsPremiados.find(p => p.numero === ticket.numero);
            if (premio) {
              ticket.esPremiado = true;
              ticket.etiquetaPremio = premio.etiqueta;
              await this.updateTicket(ticket);
            }
          }
        }
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getNumerosDisponibles(total: number, rifaId?: string): Promise<number[]> {
    const tickets = await this.getAllTickets(rifaId);
    const vendidos = new Set(tickets.map(t => t.numero));
    const disponibles: number[] = [];
    for (let i = 1; i <= total; i++) {
      if (!vendidos.has(i)) {
        disponibles.push(i);
      }
    }
    return disponibles;
  }

  async getAllNumeros(rifaId?: string): Promise<{ numero: boolean }[]> {
    if (!this.db) await this.init();
    const targetRifaId = rifaId || this.currentRifaId;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TICKETS_STORE], 'readonly');
      const store = transaction.objectStore(TICKETS_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        const tickets = request.result as Ticket[];
        const ticketsRifa = tickets.filter(t => t.rifaId === targetRifaId);
        const vendidos = new Set(ticketsRifa.map(t => t.numero));
        
        resolve(Array.from({ length: 1000 }, (_, i) => ({
          numero: !vendidos.has(i + 1)
        })));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getMetrics(totalTickets: number, rifaId?: string): Promise<{
    totalTickets: number;
    ticketsVendidos: number;
    ticketsDisponibles: number;
    precioTicket: number;
  }> {
    const rifa = await this.getRifa(rifaId || this.currentRifaId);
    const tickets = await this.getAllTickets(rifaId);
    return {
      totalTickets: rifa?.totalTickets || totalTickets,
      ticketsVendidos: tickets.length,
      ticketsDisponibles: (rifa?.totalTickets || totalTickets) - tickets.length,
      precioTicket: rifa?.precioTicket || 10,
    };
  }

  // Get ranking of top buyers
  async getTopBuyers(limit: number = 10, rifaId?: string): Promise<{nombre: string, cedula: string, cantidad: number}[]> {
    const tickets = await this.getAllTickets(rifaId);
    const buyers: Record<string, {nombre: string, cedula: string, cantidad: number}> = {};
    
    for (const ticket of tickets) {
      const key = ticket.cedula;
      if (!buyers[key]) {
        buyers[key] = {
          nombre: ticket.nombre,
          cedula: ticket.cedula,
          cantidad: 0
        };
      }
      buyers[key].cantidad++;
    }
    
    return Object.values(buyers)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, limit);
  }

  // Get tickets premiados - disponibles y comprados
  async getTicketsPremiados(rifaId?: string): Promise<{
    disponibles: { numero: number; etiqueta: string }[];
    comprados: Ticket[];
  }> {
    const targetRifaId = rifaId || this.currentRifaId;
    const rifa = await this.getRifa(targetRifaId);
    
    if (!rifa?.ticketsPremiados || rifa.ticketsPremiados.length === 0) {
      return { disponibles: [], comprados: [] };
    }
    
    const tickets = await this.getAllTickets(targetRifaId);
    const numerosPremiados = new Set(rifa.ticketsPremiados.map(p => p.numero));
    const ticketsComprados = tickets.filter(t => numerosPremiados.has(t.numero));
    
    const numerosComprados = new Set(ticketsComprados.map(t => t.numero));
    const disponibles = rifa.ticketsPremiados
      .filter(p => !numerosComprados.has(p.numero))
      .map(p => ({ numero: p.numero, etiqueta: p.etiqueta }));
    
    return { disponibles, comprados: ticketsComprados };
  }

  // Update rifa tickets premiados
  async updateRifaTicketsPremiados(rifaId: string, ticketsPremiados: { numero: number; etiqueta: string }[]): Promise<void> {
    const rifa = await this.getRifa(rifaId);
    if (rifa) {
      rifa.ticketsPremiados = ticketsPremiados;
      await this.updateRifa(rifa);
    }
  }

  // Delete all data
  async deleteAllData(): Promise<void> {
    if (!this.db) await this.init();
    
    // Delete all tickets
    const tickets = await this.getAllTickets();
    for (const ticket of tickets) {
      await this.deleteTicket(ticket.id);
    }
    
    // Delete all rifas
    const rifas = await this.getAllRifas();
    for (const rifa of rifas) {
      await this.deleteRifa(rifa.id);
    }
    
    // Reset config
    await this.setConfig('currentRifaId', null);
  }
}

export const db = new RifaDatabase();
