import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTickets } from '@/hooks/useTickets';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAgeVerification } from '@/hooks/useAgeVerification';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AgeVerificationDialog } from '@/components/AgeVerificationDialog';
import { AdminLoginDialog } from '@/components/AdminLoginDialog';
import { HomePage } from '@/pages/HomePage';
import { InfoPage } from '@/pages/InfoPage';
import { AdminPage } from '@/pages/AdminPage';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const { 
    tickets,
    rifas,
    currentRifa,
    metrics,
    topBuyers,
    isLoading,
    isNumeroDisponible,
    getTicketByNumero,
    getDisponibilidadTodos,
    comprarMultipleTickets,
    confirmarTicket,
    eliminarTicket,
    getTicketsPendientes,
    getTicketsPremiados,
    createRifa,
    switchRifa,
    deleteRifa,
    updateRifa,
    verifyAdmin,
  } = useTickets();
  
  const { isVerified, showDialog, verifyAge } = useAgeVerification();
  const { 
    isAuthenticated, 
    showLoginDialog, 
    setShowLoginDialog, 
    login, 
    logout 
  } = useAdminAuth(verifyAdmin);

  // Protected Admin Route
  const AdminRoute = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Navigate to="/" replace />
          {setTimeout(() => setShowLoginDialog(true), 100) && null}
        </>
      );
    }
    
    return (
      <AdminPage 
        tickets={tickets}
        rifas={rifas}
        currentRifa={currentRifa}
        topBuyers={topBuyers}
        confirmarTicket={confirmarTicket}
        eliminarTicket={eliminarTicket}
        getTicketByNumero={getTicketByNumero}
        getTicketsPendientes={getTicketsPendientes}
        getTicketsPremiados={getTicketsPremiados}
        createRifa={createRifa}
        switchRifa={switchRifa}
        deleteRifa={deleteRifa}
        updateRifa={updateRifa}
        logout={logout}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-950">
        {/* Age Verification Dialog */}
        <AgeVerificationDialog 
          open={showDialog} 
          onVerify={verifyAge} 
        />

        {/* Admin Login Dialog */}
        <AdminLoginDialog
          open={showLoginDialog}
          onClose={() => setShowLoginDialog(false)}
          onLogin={login}
        />

        {/* Main Content (only show if verified) */}
        {isVerified && (
          <>
            <Navbar />
            <main>
              <Routes>
                <Route 
                  path="/" 
                  element={
                      <HomePage 
                      metrics={metrics}
                      isNumeroDisponible={isNumeroDisponible}
                      getTicketByNumero={getTicketByNumero}
                      getDisponibilidadTodos={getDisponibilidadTodos}
                      comprarMultipleTickets={comprarMultipleTickets}
                    />
                  } 
                />
                <Route path="/info" element={<InfoPage />} />
                <Route path="/admin" element={<AdminRoute />} />
              </Routes>
            </main>
            <Footer />
          </>
        )}
        
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
