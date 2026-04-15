import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AuthGuard, RoleGuard } from '@/components/shared/AuthGuard';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { CaregiverLayout } from '@/components/layout/CaregiverLayout';
import { ChildLayout } from '@/components/layout/ChildLayout';

import Landing from '@/pages/public/Landing';
import SignIn from '@/pages/public/SignIn';
import SignUp from '@/pages/public/SignUp';

import CaregiverDashboard from '@/pages/caregiver/Dashboard';
import ChoresList from '@/pages/caregiver/ChoresList';
import ChoreCreate from '@/pages/caregiver/ChoreCreate';
import ChoreDetail from '@/pages/caregiver/ChoreDetail';
import RewardsList from '@/pages/caregiver/RewardsList';
import RewardCreate from '@/pages/caregiver/RewardCreate';
import RewardDetail from '@/pages/caregiver/RewardDetail';
import Approvals from '@/pages/caregiver/Approvals';
import Reports from '@/pages/caregiver/Reports';
import ChildrenList from '@/pages/caregiver/ChildrenList';
import ChildCreate from '@/pages/caregiver/ChildCreate';
import ChildDetailPage from '@/pages/caregiver/ChildDetail';
import CaregiverNotifications from '@/pages/caregiver/Notifications';
import CaregiverSettings from '@/pages/caregiver/Settings';

import ChildDashboard from '@/pages/child/Dashboard';
import MyChores from '@/pages/child/MyChores';
import ChildChoreDetail from '@/pages/child/ChoreDetail';
import ChildRewards from '@/pages/child/Rewards';
import ChildRewardDetail from '@/pages/child/RewardDetail';
import ChildHistory from '@/pages/child/History';
import ChildNotifications from '@/pages/child/Notifications';
import ChildSettings from '@/pages/child/Settings';

import NotFound from './pages/NotFound';

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Routes>
      {/* Public */}
      <Route element={<ErrorBoundary><PublicLayout /></ErrorBoundary>}>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Route>

      {/* Caregiver */}
      <Route path="/app" element={<AuthGuard><RoleGuard requiredRole="caregiver" redirectTo="/child/dashboard"><ErrorBoundary><CaregiverLayout /></ErrorBoundary></RoleGuard></AuthGuard>}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<CaregiverDashboard />} />
        <Route path="chores" element={<ChoresList />} />
        <Route path="chores/new" element={<ChoreCreate />} />
        <Route path="chores/:id" element={<ChoreDetail />} />
        <Route path="rewards" element={<RewardsList />} />
        <Route path="rewards/new" element={<RewardCreate />} />
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
        <Route path="rewards/:id" element={<ChildRewardDetail />} />
        <Route path="history" element={<ChildHistory />} />
        <Route path="notifications" element={<ChildNotifications />} />
        <Route path="settings" element={<ChildSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
