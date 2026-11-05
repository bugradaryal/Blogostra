import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsent } from '@/context/useConsent';
import { loadAnalytics, trackPageView } from '@/lib/analytics';

const RouteTracker = () => {
  const { pathname, search } = useLocation();
  const { consent } = useConsent();

  useEffect(() => {
    if (consent !== 'granted') return;
    loadAnalytics();
    const timer = setTimeout(() => trackPageView(pathname + search), 150);
    return () => clearTimeout(timer);
  }, [consent, pathname, search]);

  return null;
};

export default RouteTracker;
