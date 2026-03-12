import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { ProfileProvider } from './context/ProfileContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminGuard } from './components/admin/AdminGuard';

import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { MirokiIntroPage } from './pages/MirokiIntroPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { ModulePage } from './pages/ModulePage';
import { RewardPage } from './pages/RewardPage';
import { QRScanPage } from './pages/QRScanPage';
import { DashboardPage } from './pages/DashboardPage';

import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ModuleFormPage } from './pages/admin/ModuleFormPage';
import { FloorPlanEditor } from './pages/admin/FloorPlanEditor';

function App() {
  return (
    <AdminAuthProvider>
      <ProfileProvider>
        <ProgressProvider>
          <BrowserRouter>
            <Routes>
              {/* ── Visiteur ── */}
              <Route path="/" element={<OnboardingPage />} />
              <Route path="/intro" element={<MirokiIntroPage />} />
              <Route path="/accueil" element={<LandingPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/module/:id" element={<ModulePage />} />
              <Route path="/reward" element={<RewardPage />} />
              <Route path="/scan" element={<QRScanPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* ── Admin ── */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/admin/module/:id" element={<AdminGuard><ModuleFormPage /></AdminGuard>} />
              <Route path="/admin/floor-plan" element={<AdminGuard><FloorPlanEditor /></AdminGuard>} />
            </Routes>
          </BrowserRouter>
        </ProgressProvider>
      </ProfileProvider>
    </AdminAuthProvider>
  );
}

export default App;
