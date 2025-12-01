'use client';

import React from 'react';
import { Layout, Button, Dropdown, Space, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { Nav } from '@/components/shared';
const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader>
      {/* <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>ЕАИС ДО</div> */}

      {isAuthenticated && (
        <div
          style={{
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
          }}>
          <Nav />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" style={{ display: 'flex', alignItems: 'center' }}>
              <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <span>Администратор</span>
              </Space>
            </Button>
          </Dropdown>
        </div>
      )}
    </AntHeader>
  );
};
