import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ConsentContext, type Consent } from './ConsentContext';

const STORAGE_KEY = 'cookie_consent';

const readConsent = (): Consent => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
};

const ConsentProvider = ({ children }: { children: ReactNode }) => {
  const [consent, setState] = useState<Consent>(readConsent);

  const setConsent = useCallback((value: 'granted' | 'denied') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* depolama kapalı */
    }
    setState(value);
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* depolama kapalı */
    }
    setState(null);
  }, []);

  const value = useMemo(() => ({ consent, setConsent, reset }), [consent, setConsent, reset]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};

export default ConsentProvider;
