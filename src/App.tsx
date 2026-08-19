import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { WalletProvider } from '@/context/WalletContext';
import AuthPage from '@/pages/AuthPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/AdminLayout';
import PublicLayout from '@/components/PublicLayout';
import Dashboard from '@/pages/Dashboard';
import BuyTokens from '@/pages/BuyTokens';
import SellTokens from '@/pages/SellTokens';
import NetworkPage from '@/pages/NetworkPage';
import TransactionsPage from '@/pages/TransactionsPage';
import MyTokensPage from '@/pages/member/MyTokensPage';
import InvestmentHistoryPage from '@/pages/member/InvestmentHistoryPage';
import IncomeSectionPage, { IncomeBreakdownPage } from '@/pages/member/IncomeSectionPage';
import LevelPlanPage from '@/pages/member/LevelPlanPage';
import RewardIncomePage from '@/pages/member/RewardIncomePage';
import ReferralLinkPage from '@/pages/member/ReferralLinkPage';
import MyProfilePage from '@/pages/member/MyProfilePage';
import ChangePasswordPage from '@/pages/member/ChangePasswordPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminMlmControl from '@/pages/admin/AdminMlmControl';
import AdminBlockchain from '@/pages/admin/AdminBlockchain';
import AdminUsers from '@/pages/AdminUsers';
import AdminPayout from '@/pages/admin/AdminPayout';
import AdminPayoutHistory from '@/pages/admin/AdminPayoutHistory';
import AdminTradeHistory from '@/pages/admin/AdminTradeHistory';
import AdminBusinessReport from '@/pages/admin/AdminBusinessReport';
import HomePage from '@/pages/public/HomePage';
import AboutPage from '@/pages/public/AboutPage';
import PlansPage from '@/pages/public/PlansPage';
import CompensationPage from '@/pages/public/CompensationPage';
import FAQPage from '@/pages/public/FAQPage';
import ContactPage from '@/pages/public/ContactPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return <LoadingScreen />;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AdminAuthRoute({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return <LoadingScreen />;
  if (admin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0e17] flex flex-col items-center justify-center gap-4">
      <img src="/xit-token-logo.png" alt="XIT Token" className="w-16 h-16 object-contain animate-pulse" />
      <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
}

function PublicPage({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

function LoginRedirect() {
  const [searchParams] = useSearchParams();
  const query = searchParams.toString();
  return <Navigate to={query ? `/?${query}` : '/'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute><AuthPage /></AuthRoute>} />
      <Route path="/login" element={<LoginRedirect />} />
      <Route path="/home" element={<PublicPage><HomePage /></PublicPage>} />
      <Route path="/about" element={<PublicPage><AboutPage /></PublicPage>} />
      <Route path="/plans" element={<PublicPage><PlansPage /></PublicPage>} />
      <Route path="/compensation" element={<PublicPage><CompensationPage /></PublicPage>} />
      <Route path="/faq" element={<PublicPage><FAQPage /></PublicPage>} />
      <Route path="/contact" element={<PublicPage><ContactPage /></PublicPage>} />

      <Route path="/admin/login" element={<AdminAuthRoute><AdminLoginPage /></AdminAuthRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/tokens" element={<ProtectedRoute><MyTokensPage /></ProtectedRoute>} />
      <Route path="/buy" element={<ProtectedRoute><BuyTokens /></ProtectedRoute>} />
      <Route path="/invest" element={<Navigate to="/buy" replace />} />
      <Route path="/investments" element={<ProtectedRoute><InvestmentHistoryPage /></ProtectedRoute>} />
      <Route path="/income/daily" element={<ProtectedRoute><IncomeSectionPage title="Daily ROI Income" subtitle="ROI earned from your investments" filter="roi" /></ProtectedRoute>} />
      <Route path="/income/breakdown" element={<ProtectedRoute><IncomeBreakdownPage /></ProtectedRoute>} />
      <Route path="/income/referral" element={<ProtectedRoute><IncomeSectionPage title="Referral Income" subtitle="Direct sponsor bonus from downline purchases" filter="referral_bonus" /></ProtectedRoute>} />
      <Route path="/income/level" element={<ProtectedRoute><LevelPlanPage /></ProtectedRoute>} />
      <Route path="/income/reward" element={<ProtectedRoute><RewardIncomePage /></ProtectedRoute>} />
      <Route path="/sell" element={<ProtectedRoute><SellTokens /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      <Route path="/network" element={<ProtectedRoute><NetworkPage /></ProtectedRoute>} />
      <Route path="/referral" element={<ProtectedRoute><ReferralLinkPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

      <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path="/admin/payout" element={<AdminProtectedRoute><AdminPayout /></AdminProtectedRoute>} />
      <Route path="/admin/payout-history" element={<AdminProtectedRoute><AdminPayoutHistory /></AdminProtectedRoute>} />
      <Route path="/admin/trades" element={<AdminProtectedRoute><AdminTradeHistory /></AdminProtectedRoute>} />
      <Route path="/admin/reports" element={<AdminProtectedRoute><AdminBusinessReport /></AdminProtectedRoute>} />
      <Route path="/admin/mlm" element={<AdminProtectedRoute><AdminMlmControl /></AdminProtectedRoute>} />
      <Route path="/admin/blockchain" element={<AdminProtectedRoute><AdminBlockchain /></AdminProtectedRoute>} />
      <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <WalletProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </WalletProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
