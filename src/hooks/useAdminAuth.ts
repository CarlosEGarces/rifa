import { useState, useEffect, useCallback } from 'react';

const AUTH_KEY = 'admin_authenticated';
const AUTH_EXPIRY = 'admin_auth_expiry';
const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 horas

export function useAdminAuth(verifyCredentials: (username: string, password: string) => boolean) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem(AUTH_KEY);
    const expiry = localStorage.getItem(AUTH_EXPIRY);
    
    if (auth === 'true' && expiry) {
      const expiryTime = parseInt(expiry);
      if (Date.now() < expiryTime) {
        setIsAuthenticated(true);
      } else {
        // Expired
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(AUTH_EXPIRY);
      }
    }
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (verifyCredentials(username, password)) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(AUTH_EXPIRY, (Date.now() + AUTH_DURATION).toString());
      return true;
    }
    return false;
  }, [verifyCredentials]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_EXPIRY);
  }, []);

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return false;
    }
    return true;
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    showLoginDialog,
    setShowLoginDialog,
    login,
    logout,
    requireAuth,
  };
}
