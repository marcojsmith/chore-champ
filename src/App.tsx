import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AuthGuard, RoleGuard } from '@/components/shared/AuthGuard';
import { OfflineBanner } from '@/components/shared/OfflineBanner';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { CaregiverLayout } from '@/components/layout/CaregiverLayout';
import { ChildLayout } from '@/components/layout/ChildLayout';

const Landing = lazy(() => import('@/pages/public/Landing'));
const SignIn = lazy(() => import('@/pages/public/SignIn'));
const SignUp = lazy(() => import('@/pages/public/SignUp'));
const JoinHousehold = lazy(() => import('@/pages/public/JoinHousehold'));
const Setup = lazy(() => import('@/pages/caregiver/Setup'));

const CaregiverDashboard = lazy(() => import('@/pages/caregiver/Dashboard'));
const ChoresList = lazy(() => import('@/pages/caregiver/ChoresList'));
const ChoreCreate = lazy(() => import('@/pages/caregiver/ChoreCreate'));
const ChoreEdit = lazy(() => import('@/pages/caregiver/ChoreEdit'));
const ChoreDetail = lazy(() => import('@/pages/caregiver/ChoreDetail'));
const VoiceCreate = lazy(() => import('@/pages/caregiver/VoiceCreate'));
const RewardsList = lazy(() => import('@/pages/caregiver/RewardsList'));
const RewardCreate = lazy(() => import('@/pages/caregiver/RewardCreate'));
const RewardEdit = lazy(() => import('@/pages/caregiver/RewardEdit'));
const RewardDetail = lazy(() => import('@/pages/caregiver/RewardDetail'));
const Approvals = lazy(() => import('@/pages/caregiver/Approvals'));
const Reports = lazy(() => import('@/pages/caregiver/Reports'));
const ChildrenList = lazy(() => import('@/pages/caregiver/ChildrenList'));
const ChildCreate = lazy(() => import('@/pages/caregiver/ChildCreate'));
const ChildDetailPage = lazy(() => import('@/pages/caregiver/ChildDetail'));
const CaregiverNotifications = lazy(() => import('@/pages/caregiver/Notifications'));
const CaregiverSettings = lazy(() => import('@/pages/caregiver/Settings'));

const ChildDashboard = lazy(() => import('@/pages/child/Dashboard'));
const MyChores = lazy(() => import('@/pages/child/MyChores'));
const ChildChoreDetail = lazy(() => import('@/pages/child/ChoreDetail'));
const ChildRewards = lazy(() => import('@/pages/child/Rewards'));
const RewardSuggest = lazy(() => import('@/pages/child/RewardSuggest'));
const ChildRewardDetail = lazy(() => import('@/pages/child/RewardDetail'));
const ChildHistory = lazy(() => import('@/pages/child/History'));
const ChildNotifications = lazy(() => import('@/pages/child/Notifications'));
const ChildSettings = lazy(() => import('@/pages/child/Settings'));

const NotFound = lazy(() => import('./pages/NotFound'));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

const App = () => (
  <TooltipProvider>
    <Toaster />
    <OfflineBanner />
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public */}
        <Route element={<ErrorBoundary><PublicLayout /></ErrorBoundary>}>
          <Route path="/" element={<Landing />} />
          <Route path="/sign-in/*" element={<SignIn />} />
          <Route path="/sign-up/*" element={<SignUp />} />
          <Route path="/join/:token/*" element={<JoinHousehold />} />
        </Route>

        {/* Setup — authenticated but no role yet */}
        <Route path="/setup" element={<AuthGuard><ErrorBoundary><Setup /></ErrorBoundary></AuthGuard>} />

        {/* Caregiver */}
        <Route path="/app" element={<AuthGuard><RoleGuard requiredRole="caregiver" redirectTo="/child/dashboard"><ErrorBoundary><CaregiverLayout /></ErrorBoundary></RoleGuard></AuthGuard>}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<CaregiverDashboard />} />
          <Route path="chores" element={<ChoresList />} />
          <Route path="chores/new" element={<ChoreCreate />} />
          <Route path="chores/voice" element={<VoiceCreate />} />
          <Route path="chores/:id/edit" element={<ChoreEdit />} />
          <Route path="chores/:id" element={<ChoreDetail />} />
          <Route path="rewards" element={<RewardsList />} />
          <Route path="rewards/new" element={<RewardCreate />} />
          <Route path="rewards/:id/edit" element={<RewardEdit />} />
          <Route path="rewards/:id" element={<RewardDetail />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="reports" element={<Reports />} />
          <Route path="children" element={<ChildrenList />} />
          <Route path="children/new" element={<ChildCreate />} />
          <Route path="children/:id" element={<ChildDetailPage />} />
          <Route path="notifications" element={<CaregiverNotifications />} />
          <Route path="settings" element={<CaregiverSettings />} />
        </Route>

        {/* Child */}
        <Route path="/child" element={<AuthGuard><RoleGuard requiredRole="child" redirectTo="/app/dashboard"><ErrorBoundary><ChildLayout /></ErrorBoundary></RoleGuard></AuthGuard>}>
          <Route index element={<Navigate to="/child/dashboard" replace />} />
          <Route path="dashboard" element={<ChildDashboard />} />
          <Route path="chores" element={<MyChores />} />
          <Route path="chores/:id" element={<ChildChoreDetail />} />
          <Route path="rewards" element={<ChildRewards />} />
          <Route path="rewards/suggest" element={<RewardSuggest />} />
          <Route path="rewards/:id" element={<ChildRewardDetail />} />
          <Route path="history" element={<ChildHistory />} />
          <Route path="notifications" element={<ChildNotifications />} />
          <Route path="settings" element={<ChildSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </TooltipProvider>
);

export default App;