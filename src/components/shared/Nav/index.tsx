'use client';
import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Выносим конфигурацию в константу вне компонента
const MENU_CONFIG = [
  { key: '1', path: '/', label: 'Главная', icon: HomeOutlined },
  { key: '2', path: '/users', label: 'Пользователи', icon: UserOutlined },
  { key: '3', path: '/schema', label: 'Схема', icon: NodeIndexOutlined },
  {
    key: 'sub1',
    path: null,
    label: 'Настройки',
    icon: SettingOutlined,
    children: [
      { key: '4', path: '/settings/general', label: 'Общие настройки' },
      { key: '5', path: '/settings/security', label: 'Безопасность' },
      { key: '6', path: '/settings/notifications', label: 'Уведомления' },
      { key: '7', path: '/settings/users', label: 'Профиль пользователя' },
    ],
  },
  { key: '8', path: '/about', label: 'О нас', icon: InfoCircleOutlined },
];

export const Nav: React.FC = () => {
  const pathname = usePathname();

  // Функция для определения выбранных ключей
  const getSelectedKeys = () => {
    for (const item of MENU_CONFIG) {
      if (item.path === pathname) {
        return [item.key];
      }

      if (item.children) {
        for (const child of item.children) {
          if (child.path === pathname) {
            return [child.key];
          }
        }
      }
    }

    return ['1'];
  };

  // Создаем menuItems
  const menuItems: MenuProps['items'] = MENU_CONFIG.map((item) => {
    const IconComponent = item.icon;

    if (item.children) {
      return {
        key: item.key,
        label: item.label,
        icon: <IconComponent />,
        children: item.children.map((child) => ({
          key: child.key,
          label: <Link href={child.path}>{child.label}</Link>,
        })),
      };
    }

    return {
      key: item.key,
      label: <Link href={item.path!}>{item.label}</Link>,
      icon: <IconComponent />,
    };
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#fff',
        minHeight: '64px',
      }}>
      <Menu
        mode="horizontal"
        selectedKeys={getSelectedKeys()}
        items={menuItems}
        style={{
          flex: 1,
          borderBottom: 'none',
          minWidth: 0,
          background: 'transparent',
        }}
        disabledOverflow={true}
      />
    </div>
  );
};
