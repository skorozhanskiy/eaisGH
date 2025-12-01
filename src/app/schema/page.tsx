'use client';
import React from 'react';
import { Card, Row, Col, Typography, Steps, Descriptions, Tag, Divider } from 'antd';
import {
  ArrowRightOutlined,
  DatabaseOutlined,
  CloudSyncOutlined,
  UserOutlined,
  TeamOutlined,
  FormOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface DataFlowStep {
  title: string;
  description: string;
  direction: 'forward' | 'backward';
  systems: string[];
  dataContent: string;
}

const Schema: React.FC = () => {
  const forwardFlowSteps: DataFlowStep[] = [
    {
      title: 'Передача данных о программах',
      description:
        'Региональные навигаторы передают информацию о программах дополнительного образования',
      direction: 'forward',
      systems: ['Региональные навигаторы', 'ЕАИС ДО'],
      dataContent:
        'Данные о программах: названия, описания, расписание, доступные места, требования',
    },
    {
      title: 'Валидация и обработка',
      description: 'ЕАИС ДО проверяет и систематизирует полученные данные',
      direction: 'forward',
      systems: ['ЕАИС ДО'],
      dataContent: 'Проверка корректности данных, формирование единого каталога',
    },
    {
      title: 'Публикация в ЕПГУ',
      description: 'Данные передаются на Единый портал государственных услуг',
      direction: 'forward',
      systems: ['ЕАИС ДО', 'ЕПГУ'],
      dataContent: 'Каталог программ для отображения пользователям',
    },
    {
      title: 'Доступ для пользователей',
      description: 'Программы отображаются в разделе дополнительного образования на ЕПГУ',
      direction: 'forward',
      systems: ['ЕПГУ', 'Пользователи'],
      dataContent: 'Интерфейс просмотра и записи на программы',
    },
  ];

  const backwardFlowSteps: DataFlowStep[] = [
    {
      title: 'Запись на программу',
      description: 'Пользователь выбирает и записывается на программу через ЕПГУ',
      direction: 'backward',
      systems: ['Пользователи', 'ЕПГУ'],
      dataContent: 'Заявка на запись, данные пользователя, выбранная программа',
    },
    {
      title: 'Передача заявки',
      description: 'ЕПГУ направляет информацию о записи в ЕАИС ДО',
      direction: 'backward',
      systems: ['ЕПГУ', 'ЕАИС ДО'],
      dataContent: 'Подтвержденная заявка, статус записи',
    },
    {
      title: 'Обработка заявки',
      description: 'ЕАИС ДО регистрирует заявку и обновляет информацию о доступных местах',
      direction: 'backward',
      systems: ['ЕАИС ДО'],
      dataContent: 'Обновление статистики, подтверждение записи',
    },
    {
      title: 'Уведомление навигатора',
      description: 'Информация о новой записи передается в региональный навигатор',
      direction: 'backward',
      systems: ['ЕАИС ДО', 'Региональные навигаторы'],
      dataContent: 'Данные о записавшемся пользователе, информация о программе',
    },
  ];

  const forwardStepsItems = forwardFlowSteps.map((step) => ({
    title: step.title,
    content: (
      <div>
        <Paragraph>{step.description}</Paragraph>
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="Направление">
            <Tag color="green" icon={<ArrowRightOutlined />}>
              Прямой поток
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Участвующие системы">
            {step.systems.join(' → ')}
          </Descriptions.Item>
          <Descriptions.Item label="Передаваемые данные">
            <Text type="secondary">{step.dataContent}</Text>
          </Descriptions.Item>
        </Descriptions>
      </div>
    ),
    icon: <ArrowRightOutlined style={{ color: '#52c41a' }} />,
  }));

  const backwardStepsItems = backwardFlowSteps.map((step) => ({
    title: step.title,
    content: (
      <div>
        <Paragraph>{step.description}</Paragraph>
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="Направление">
            <Tag color="red" icon={<ArrowRightOutlined style={{ transform: 'rotate(180deg)' }} />}>
              Обратный поток
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Участвующие системы">
            {step.systems.join(' → ')}
          </Descriptions.Item>
          <Descriptions.Item label="Передаваемые данные">
            <Text type="secondary">{step.dataContent}</Text>
          </Descriptions.Item>
        </Descriptions>
      </div>
    ),
    icon: <ArrowRightOutlined style={{ color: '#ff4d4f', transform: 'rotate(180deg)' }} />,
  }));

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={1} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Схема взаимодействия региональных навигаторов с ЕАИС ДО и ЕПГУ
      </Title>

      <Paragraph style={{ textAlign: 'center', fontSize: '16px', marginBottom: '40px' }}>
        Визуализация процесса обмена данными о программах дополнительного образования и записи
        пользователей
      </Paragraph>

      {/* Основная схема */}
      <Card
        style={{
          marginBottom: '32px',
          transition: 'all 0.3s ease-in-out',
        }}
        styles={{
          body: {
            transition: 'all 0.3s ease-in-out',
          },
        }}
        hoverable>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '32px' }}>
          Прямой поток: передача данных о программах
        </Title>
        <Row gutter={[32, 32]} align="middle">
          {/* Региональные навигаторы */}
          <Col span={5}>
            <Card
              title={
                <span>
                  <TeamOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                  Региональные навигаторы
                </span>
              }
              variant="borderless"
              style={{
                textAlign: 'center',
                background: '#e6f7ff',
                transition: 'all 0.3s ease-in-out',
                transform: 'translateY(0)',
              }}
              styles={{
                body: {
                  transition: 'all 0.3s ease-in-out',
                },
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(24, 144, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <p>Формирование данных о программах дополнительного образования</p>
              <Tag color="blue" icon={<FormOutlined />}>
                Источник данных
              </Tag>
              <Divider />
              <Text type="secondary">Передает: информацию о программах</Text>
            </Card>
          </Col>

          {/* Стрелка вперед */}
          <Col span={1} style={{ textAlign: 'center' }}>
            <ArrowRightOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
          </Col>

          {/* ЕАИС ДО */}
          <Col span={5}>
            <Card
              title={
                <span>
                  <DatabaseOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />
                  ЕАИС ДО
                </span>
              }
              variant="borderless"
              style={{
                textAlign: 'center',
                background: '#fff7e6',
                transition: 'all 0.3s ease-in-out',
                transform: 'translateY(0)',
              }}
              styles={{
                body: {
                  transition: 'all 0.3s ease-in-out',
                },
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(250, 140, 22, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <p>Единая автоматизированная информационная система дополнительного образования</p>
              <Tag color="orange" icon={<DatabaseOutlined />}>
                Обработка и валидация
              </Tag>
              <Divider />
              <Text type="secondary">Обрабатывает и передает данные</Text>
            </Card>
          </Col>

          {/* Стрелка вперед */}
          <Col span={1} style={{ textAlign: 'center' }}>
            <ArrowRightOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
          </Col>

          {/* ЕПГУ */}
          <Col span={5}>
            <Card
              title={
                <span>
                  <CloudSyncOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
                  ЕПГУ
                </span>
              }
              variant="borderless"
              style={{
                textAlign: 'center',
                background: '#f9f0ff',
                transition: 'all 0.3s ease-in-out',
                transform: 'translateY(0)',
              }}
              styles={{
                body: {
                  transition: 'all 0.3s ease-in-out',
                },
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(114, 46, 209, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <p>Единый портал государственных услуг</p>
              <Tag color="purple" icon={<EyeOutlined />}>
                Публикация
              </Tag>
              <Divider />
              <Text type="secondary">Отображает программы пользователям</Text>
            </Card>
          </Col>

          {/* Стрелка вперед */}
          <Col span={1} style={{ textAlign: 'center' }}>
            <ArrowRightOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
          </Col>

          {/* Пользователи */}
          <Col span={5}>
            <Card
              title={
                <span>
                  <UserOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                  Пользователи
                </span>
              }
              variant="borderless"
              style={{
                textAlign: 'center',
                background: '#f6ffed',
                transition: 'all 0.3s ease-in-out',
                transform: 'translateY(0)',
              }}
              styles={{
                body: {
                  transition: 'all 0.3s ease-in-out',
                },
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(82, 196, 26, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <p>Граждане, выбирающие программы дополнительного образования</p>
              <Tag color="green" icon={<UserOutlined />}>
                Потребители
              </Tag>
              <Divider />
              <Text type="secondary">Просматривают и записываются на программы</Text>
            </Card>
          </Col>
        </Row>

        {/* Обратный поток */}
        <Divider />
        <Title level={3} style={{ textAlign: 'center', marginBottom: '32px', color: '#ff4d4f' }}>
          Обратный поток: обработка записей пользователей
        </Title>
        <Row gutter={[32, 32]} align="middle">
          <Col span={5} style={{ textAlign: 'center' }}>
            <Card
              size="small"
              variant="borderless"
              style={{
                background: '#f6ffed',
                transition: 'all 0.3s ease-in-out',
                transform: 'translateY(0)',
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(82, 196, 26, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <UserOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
              <div>
                <strong>Пользователи</strong>
              </div>
              <Text type="secondary">Записываются на программы</Text>
            </Card>
          </Col>

          <Col span={1} style={{ textAlign: 'center' }}>
            <ArrowRightOutlined
              style={{ fontSize: '24px', color: '#ff4d4f', transform: 'rotate(180deg)' }}
            />
          </Col>

          <Col span={5} style={{ textAlign: 'center' }}>
            <Card
              size="small"
              variant="borderless"
              style={{
                background: '#f9f0ff',
                transition: 'all 0.3s ease-in-out',
                transform: 'translateY(0)',
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(114, 46, 209, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <CloudSyncOutlined style={{ color: '#722ed1', fontSize: '20px' }} />
              <div>
                <strong>ЕПГУ</strong>
              </div>
              <Text type="secondary">Принимает заявки</Text>
            </Card>
          </Col>

          <Col span={1} style={{ textAlign: 'center' }}>
            <ArrowRightOutlined
              style={{ fontSize: '24px', color: '#ff4d4f', transform: 'rotate(180deg)' }}
            />
          </Col>

          <Col span={5} style={{ textAlign: 'center' }}>
            <Card
              size="small"
              variant="borderless"
              style={{
                background: '#fff7e6',
                transition: 'all 0.3s ease-in-out',
                transform: 'translateY(0)',
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(250, 140, 22, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <DatabaseOutlined style={{ color: '#fa8c16', fontSize: '20px' }} />
              <div>
                <strong>ЕАИС ДО</strong>
              </div>
              <Text type="secondary">Обрабатывает записи</Text>
            </Card>
          </Col>

          <Col span={1} style={{ textAlign: 'center' }}>
            <ArrowRightOutlined
              style={{ fontSize: '24px', color: '#ff4d4f', transform: 'rotate(180deg)' }}
            />
          </Col>

          <Col span={5} style={{ textAlign: 'center' }}>
            <Card
              size="small"
              variant="borderless"
              style={{
                background: '#e6f7ff',
                transition: 'all 0.3s ease-in-out',
                transform: 'translateY(0)',
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <TeamOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
              <div>
                <strong>Региональные навигаторы</strong>
              </div>
              <Text type="secondary">Получают уведомления о записях</Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Детализация прямого потока */}
      <Card
        title="📤 Детализация прямого потока: передача данных о программах"
        style={{
          marginBottom: '24px',
          transition: 'all 0.3s ease-in-out',
        }}
        hoverable
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
        <Steps orientation="vertical" current={-1} items={forwardStepsItems} />
      </Card>

      {/* Детализация обратного потока */}
      <Card
        title="📥 Детализация обратного потока: обработка записей пользователей"
        style={{
          transition: 'all 0.3s ease-in-out',
        }}
        hoverable
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
        <Steps orientation="vertical" current={-1} items={backwardStepsItems} />
      </Card>

      {/* Легенда и описание */}
      <Card
        title="📋 Легенда и описание системы"
        style={{
          marginTop: '24px',
          transition: 'all 0.3s ease-in-out',
        }}
        hoverable
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Descriptions title="Роли систем" column={1} bordered size="small">
              <Descriptions.Item label="Региональные навигаторы">
                <Tag color="blue">Поставщик данных</Tag> - формируют и обновляют информацию о
                программах дополнительного образования в регионе
              </Descriptions.Item>
              <Descriptions.Item label="ЕАИС ДО">
                <Tag color="orange">Центр обработки</Tag> - проверяет, систематизирует данные и
                управляет процессом записи
              </Descriptions.Item>
              <Descriptions.Item label="ЕПГУ">
                <Tag color="purple">Публичная платформа</Tag> - предоставляет интерфейс для
                пользователей и принимает заявки
              </Descriptions.Item>
              <Descriptions.Item label="Пользователи">
                <Tag color="green">Конечные потребители</Tag> - выбирают и записываются на программы
                через портал
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions title="Типы данных" column={1} bordered size="small">
              <Descriptions.Item label="Прямой поток">
                <Tag color="green">Данные о программах</Tag>
                <div>• Информация о программах дополнительного образования</div>
                <div>• Расписание и доступные места</div>
                <div>• Описания и требования</div>
              </Descriptions.Item>
              <Descriptions.Item label="Обратный поток">
                <Tag color="red">Данные о записях</Tag>
                <div>• Заявки на запись пользователей</div>
                <div>• Подтверждения и статусы</div>
                <div>• Статистика записей</div>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Schema;
