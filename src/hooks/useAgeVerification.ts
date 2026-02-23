import { useState, useEffect } from 'react';

const STORAGE_KEY = 'age_verified';

export function useAgeVerification() {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEY);
    if (verified === 'true') {
      setIsVerified(true);
    } else {
      setShowDialog(true);
    }
  }, []);

  const verifyAge = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVerified(true);
    setShowDialog(false);
  };

  const resetVerification = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsVerified(false);
    setShowDialog(true);
  };

  return {
    isVerified,
    showDialog,
    verifyAge,
    resetVerification,
  };
}
