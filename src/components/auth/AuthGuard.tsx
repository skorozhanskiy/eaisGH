'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Spin } from 'antd';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/') {
      // Перенаправляем только если не на главной странице
      router.push('/');
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 16,
        }}>
        <Spin size="large" />
        {/* <Text type="secondary">Проверка авторизации...</Text> */}
      </div>
    );
  }

  // Всегда рендерим детей, защита через перенаправление
  return <>{children}</>;
};
