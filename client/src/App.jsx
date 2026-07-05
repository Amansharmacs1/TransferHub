import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
import NetworkStatus from './components/NetworkStatus';
import { Loader2 } from 'lucide-react';

// Lazy load pages for code splitting
const TransferPage = lazy(() => import('./pages/TransferPage'));
const ClipboardPage = lazy(() => import('./pages/ClipboardPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading fallback
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <NetworkStatus />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<TransferPage />} />
            <Route path="/clipboard" element={<ClipboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
