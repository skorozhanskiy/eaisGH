'use client';

import React from 'react';
import { Layout, Card, Typography, Space } from 'antd';
import { UserOutlined, BookOutlined, TeamOutlined, ScheduleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export const MainContent: React.FC = () => {
  return (
    <Layout style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
      <Content>
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2}>Добро пожаловать в ЕАИС ДО</Title>
            <Paragraph>
              Единая автоматизированная информационная система дополнительного образования
            </Paragraph>
          </div>

          <Space wrap size="middle">
            <Card style={{ width: 300 }} hoverable actions={[<UserOutlined key="users" />]}>
              <Card.Meta title="Пользователи" description="Управление пользователями системы" />
            </Card>

            <Card style={{ width: 300 }} hoverable actions={[<BookOutlined key="courses" />]}>
              <Card.Meta title="Курсы" description="Каталог образовательных курсов" />
            </Card>

            <Card style={{ width: 300 }} hoverable actions={[<TeamOutlined key="groups" />]}>
              <Card.Meta title="Группы" description="Управление учебными группами" />
            </Card>

            <Card style={{ width: 300 }} hoverable actions={[<ScheduleOutlined key="schedule" />]}>
              <Card.Meta title="Расписание" description="Планирование занятий" />
            </Card>
          </Space>
        </Space>
      </Content>
    </Layout>
  );
};
