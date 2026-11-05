import { createContext } from 'react';

export type Consent = 'granted' | 'denied' | null;

export interface ConsentContextValue {
  consent: Consent;
  setConsent: (value: Exclude<Consent, null>) => void;
  reset: () => void;
}

export const ConsentContext = createContext<ConsentContextValue | null>(null);
