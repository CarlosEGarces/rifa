import type { Ticket, Rifa } from '@/types';

export function generateTicketsPDF(tickets: Ticket[], rifa: Rifa | null): string {
  const fecha = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const ticketsRows = tickets.map(t => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">#${t.numero.toString().padStart(4, '0')}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${t.nombre}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${t.cedula}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${t.telefono}</td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; ${t.confirmado ? 'background: #22c55e; color: white;' : 'background: #f59e0b; color: white;'}">
          ${t.confirmado ? 'Confirmado' : 'Pendiente'}
        </span>
      </td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Base de Datos - ${rifa?.nombre || 'Rifa'}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 1.5cm;
    }
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #7c3aed;
    }
    .header h1 {
      color: #7c3aed;
      margin: 0 0 10px 0;
      font-size: 24px;
    }
    .header p {
      margin: 5px 0;
      color: #666;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .stat-item {
      text-align: center;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #7c3aed;
    }
    .stat-label {
      font-size: 12px;
      color: #666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 12px;
    }
    th {
      background: #7c3aed;
      color: white;
      padding: 12px 10px;
      text-align: left;
      font-weight: bold;
    }
    th:first-child, td:first-child {
      text-align: center;
    }
    tr:nth-child(even) {
      background: #f9fafb;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 10px;
      color: #999;
      border-top: 1px solid #eee;
      padding-top: 15px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${rifa?.nombre || 'Rifa'}</h1>
    <p><strong>Premio:</strong> ${rifa?.premio || 'Toyota Corolla 2025'}</p>
    <p><strong>Fecha del Sorteo:</strong> ${rifa?.fechaSorteo ? new Date(rifa.fechaSorteo).toLocaleDateString('es-ES') : '31/12/2025'}</p>
    <p><strong>Reporte generado:</strong> ${fecha}</p>
  </div>

  <div class="stats">
    <div class="stat-item">
      <div class="stat-value">${tickets.length}</div>
      <div class="stat-label">Total Tickets</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${tickets.filter(t => t.confirmado).length}</div>
      <div class="stat-label">Confirmados</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${tickets.filter(t => !t.confirmado).length}</div>
      <div class="stat-label">Pendientes</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">$${tickets.length * (rifa?.precioTicket || 10)}</div>
      <div class="stat-label">Recaudación</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Número</th>
        <th>Nombre</th>
        <th>Cédula</th>
        <th>Teléfono</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      ${ticketsRows}
    </tbody>
  </table>

  <div class="footer">
    <p>Rifa - Sistema de Gestión de Tickets</p>
    <p>Este documento es confidencial y solo para uso administrativo.</p>
  </div>
</body>
</html>
  `;

  return html;
}

export function generateComprobantePDF(ticket: Ticket, rifa: Rifa | null): string {
  const fecha = new Date(ticket.fechaCompra).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Comprobante - Ticket #${ticket.numero}</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .ticket {
      border: 3px solid #7c3aed;
      border-radius: 15px;
      padding: 30px;
      max-width: 500px;
      margin: 0 auto;
      background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
    }
    .header {
      text-align: center;
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 2px dashed #7c3aed;
    }
    .header h1 {
      color: #7c3aed;
      margin: 0 0 10px 0;
      font-size: 22px;
    }
    .header h2 {
      color: #333;
      margin: 0;
      font-size: 16px;
    }
    .numero-ticket {
      text-align: center;
      margin: 25px 0;
      padding: 20px;
      background: white;
      border-radius: 10px;
      border: 2px solid #7c3aed;
    }
    .numero-ticket .label {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    .numero-ticket .numero {
      font-size: 48px;
      font-weight: bold;
      color: #7c3aed;
    }
    .info-section {
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: bold;
      color: #666;
    }
    .info-value {
      color: #333;
    }
    .estado {
      text-align: center;
      margin: 20px 0;
      padding: 15px;
      border-radius: 8px;
      font-weight: bold;
    }
    .estado.pendiente {
      background: #fef3c7;
      color: #92400e;
    }
    .estado.confirmado {
      background: #d1fae5;
      color: #065f46;
    }
    .footer {
      margin-top: 25px;
      text-align: center;
      font-size: 12px;
      color: #666;
      padding-top: 20px;
      border-top: 2px dashed #7c3aed;
    }
    .qr-placeholder {
      width: 100px;
      height: 100px;
      margin: 15px auto;
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #999;
    }
    .importante {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin-top: 20px;
      border-radius: 0 8px 8px 0;
    }
    .importante h4 {
      margin: 0 0 10px 0;
      color: #92400e;
    }
    .importante p {
      margin: 5px 0;
      font-size: 12px;
      color: #78350f;
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <h1>${rifa?.nombre || 'Rifa'}</h1>
      <h2>${rifa?.descripcion || 'Toyota Corolla 2025 0km'}</h2>
    </div>

    <div class="numero-ticket">
      <div class="label">NÚMERO DE TICKET</div>
      <div class="numero">#${ticket.numero.toString().padStart(4, '0')}</div>
    </div>

    <div class="estado ${ticket.confirmado ? 'confirmado' : 'pendiente'}">
      ${ticket.confirmado ? '✓ PAGO CONFIRMADO' : '⏳ PENDIENTE DE CONFIRMACIÓN'}
    </div>

    <div class="info-section">
      <div class="info-row">
        <span class="info-label">Comprador:</span>
        <span class="info-value">${ticket.nombre}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Cédula:</span>
        <span class="info-value">${ticket.cedula}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Teléfono:</span>
        <span class="info-value">${ticket.telefono}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Referencia:</span>
        <span class="info-value">${ticket.numeroReferencia}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Fecha:</span>
        <span class="info-value">${fecha}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Precio:</span>
        <span class="info-value">$${rifa?.precioTicket || 10}</span>
      </div>
    </div>

    <div class="qr-placeholder">
      [QR]<br>
      ${ticket.id.slice(0, 8)}
    </div>

    <div class="importante">
      <h4>⚠️ Importante</h4>
      <p>• Conserve este comprobante</p>
      <p>• El sorteo será el ${rifa?.fechaSorteo ? new Date(rifa.fechaSorteo).toLocaleDateString('es-ES') : '31/12/2025'}</p>
      <p>• Los ganadores serán contactados</p>
    </div>

    <div class="footer">
      <p><strong>¡Mucha suerte!</strong></p>
      <p>Este ticket es personal e intransferible</p>
      <p>Rifa © 2025</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

export async function downloadPDF(html: string, _filename: string): Promise<void> {
  // Create a blob from the HTML
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Open in new window for printing/saving as PDF
  const printWindow = window.open(url, '_blank');
  
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
