import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainContent } from '@/components/layout/MainContent';

export default function Home() {
  return (
    <ProtectedRoute>
      <MainContent />
    </ProtectedRoute>
  );
}
