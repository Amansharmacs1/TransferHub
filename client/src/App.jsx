import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import TransferPage from './pages/TransferPage';
import ClipboardPage from './pages/ClipboardPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<TransferPage />} />
        <Route path="/clipboard" element={<ClipboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
