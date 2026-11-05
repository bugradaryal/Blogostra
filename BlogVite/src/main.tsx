import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/literata';
import './styles/index.css';
import './i18n';
import App from './App';
import AuthProvider from './auth/AuthProvider';
import ConsentProvider from './context/ConsentProvider';
import ThemeProvider from './context/ThemeProvider';
import { queryClient } from './lib/queryClient';

document.querySelectorAll('[data-static-seo]').forEach((element) => element.remove());

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider>
        <ConsentProvider>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ConsentProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>,
);
