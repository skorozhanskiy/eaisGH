'use client';
import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Divider,
  Alert,
  Typography,
  Row,
  Col,
  message,
  Modal,
} from 'antd';
import {
  LockOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  BellOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Password } = Input;

interface LoginFormData {
  currentLogin: string;
  newLogin: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  emailNotifications: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

const UserSecurityPage: React.FC = () => {
  const [loginForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loginLoading, setLoginLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    emailNotifications: true,
    loginAlerts: true,
    sessionTimeout: 30,
  });

  const onLoginFinish = async (values: LoginFormData) => {
    setLoginLoading(true);

    try {
      // Имитация API запроса для изменения логина
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Здесь будет логика обновления логина
      console.log('Новые данные логина:', values);

      message.success('Логин успешно изменен!');
      loginForm.resetFields();
    } catch (error) {
      message.error('Ошибка при изменении логина');
    } finally {
      setLoginLoading(false);
    }
  };

  const onPasswordFinish = async (values: PasswordFormData) => {
    setPasswordLoading(true);

    try {
      // Имитация API запроса для изменения пароля
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (values.newPassword !== values.confirmPassword) {
        message.error('Пароли не совпадают');
        return;
      }

      // Здесь будет логика обновления пароля
      console.log('Новые данные пароля:', values);

      message.success('Пароль успешно изменен!');
      passwordForm.resetFields();
    } catch (error) {
      message.error('Ошибка при изменении пароля');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleTwoFactorAuth = (checked: boolean) => {
    setSecuritySettings((prev) => ({ ...prev, twoFactorAuth: checked }));
    message.info(
      checked ? 'Двухфакторная аутентификация включена' : 'Двухфакторная аутентификация отключена',
    );
  };

  const handleEmailNotifications = (checked: boolean) => {
    setSecuritySettings((prev) => ({ ...prev, emailNotifications: checked }));
    message.info(checked ? 'Email уведомления включены' : 'Email уведомления отключены');
  };

  const handleLoginAlerts = (checked: boolean) => {
    setSecuritySettings((prev) => ({ ...prev, loginAlerts: checked }));
    message.info(checked ? 'Оповещения о входе включены' : 'Оповещения о входе отключены');
  };

  const showSessionModal = () => {
    Modal.info({
      title: 'Настройки времени сессии',
      content: (
        <div>
          <Text>Текущее время сессии: {securitySettings.sessionTimeout} минут</Text>
          <div style={{ marginTop: 16 }}>
            <Button
              onClick={() => {
                setSecuritySettings((prev) => ({ ...prev, sessionTimeout: 15 }));
                message.success('Время сессии изменено на 15 минут');
              }}
              type={securitySettings.sessionTimeout === 15 ? 'primary' : 'default'}>
              15 мин
            </Button>
            <Button
              onClick={() => {
                setSecuritySettings((prev) => ({ ...prev, sessionTimeout: 30 }));
                message.success('Время сессии изменено на 30 минут');
              }}
              type={securitySettings.sessionTimeout === 30 ? 'primary' : 'default'}
              style={{ marginLeft: 8 }}>
              30 мин
            </Button>
            <Button
              onClick={() => {
                setSecuritySettings((prev) => ({ ...prev, sessionTimeout: 60 }));
                message.success('Время сессии изменено на 60 минут');
              }}
              type={securitySettings.sessionTimeout === 60 ? 'primary' : 'default'}
              style={{ marginLeft: 8 }}>
              60 мин
            </Button>
          </div>
        </div>
      ),
      onOk() {},
    });
  };

  const showRecentActivity = () => {
    Modal.info({
      title: 'Последняя активность',
      width: 600,
      content: (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Text strong>Текущая сессия:</Text>
            <br />
            <Text type="secondary">Устройство: Chrome, Windows • IP: 192.168.1.1</Text>
            <br />
            <Text type="secondary">Время: {new Date().toLocaleString()}</Text>
          </div>
          <Divider />
          <div>
            <Text strong>Предыдущие сессии:</Text>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Chrome, macOS • 2 дня назад</Text>
            </div>
            <div>
              <Text type="secondary">Safari, iPhone • 1 неделю назад</Text>
            </div>
          </div>
        </div>
      ),
    });
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>
        <SecurityScanOutlined /> Безопасность аккаунта
      </Title>

      <Alert
        title="Рекомендации по безопасности"
        description="Используйте сложные пароли, включайте двухфакторную аутентификацию и регулярно обновляйте свои учетные данные."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          {/* Форма изменения логина */}
          <Card
            title={
              <span>
                <UserOutlined /> Изменение логина
              </span>
            }
            style={{ marginBottom: 24 }}>
            <Form form={loginForm} layout="vertical" onFinish={onLoginFinish} autoComplete="off">
              <Form.Item
                label="Текущий логин"
                name="currentLogin"
                rules={[{ required: true, message: 'Пожалуйста, введите текущий логин' }]}>
                <Input prefix={<UserOutlined />} placeholder="Введите текущий логин" />
              </Form.Item>

              <Form.Item
                label="Новый логин"
                name="newLogin"
                rules={[
                  { required: true, message: 'Пожалуйста, введите новый логин' },
                  { min: 3, message: 'Логин должен содержать минимум 3 символа' },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: 'Логин может содержать только буквы, цифры и подчеркивания',
                  },
                ]}>
                <Input prefix={<UserOutlined />} placeholder="Введите новый логин" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loginLoading} block size="large">
                  Сохранить логин
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* Форма изменения пароля */}
          <Card
            title={
              <span>
                <LockOutlined /> Изменение пароля
              </span>
            }>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={onPasswordFinish}
              autoComplete="off">
              <Form.Item
                label="Текущий пароль"
                name="currentPassword"
                rules={[{ required: true, message: 'Пожалуйста, введите текущий пароль' }]}>
                <Password prefix={<LockOutlined />} placeholder="Введите текущий пароль" />
              </Form.Item>

              <Form.Item
                label="Новый пароль"
                name="newPassword"
                rules={[
                  { required: true, message: 'Пожалуйста, введите новый пароль' },
                  { min: 8, message: 'Пароль должен содержать минимум 8 символов' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Пароль должен содержать буквы в верхнем и нижнем регистре и цифры',
                  },
                ]}>
                <Password prefix={<LockOutlined />} placeholder="Введите новый пароль" />
              </Form.Item>

              <Form.Item
                label="Подтвердите пароль"
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Пожалуйста, подтвердите пароль' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Пароли не совпадают'));
                    },
                  }),
                ]}>
                <Password prefix={<LockOutlined />} placeholder="Подтвердите новый пароль" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={passwordLoading}
                  block
                  size="large">
                  Сохранить пароль
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={
              <span>
                <SafetyCertificateOutlined /> Дополнительные настройки
              </span>
            }
            style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Двухфакторная аутентификация</Text>
                  <br />
                  <Text type="secondary">Повышенная безопасность входа</Text>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  disabled
                  onChange={handleTwoFactorAuth}
                />
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Email уведомления</Text>
                  <br />
                  <Text type="secondary">Уведомления о безопасности</Text>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  disabled
                  onChange={handleEmailNotifications}
                />
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Оповещения о входе</Text>
                  <br />
                  <Text type="secondary">Уведомлять о новых входах</Text>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  disabled
                  onChange={handleLoginAlerts}
                />
              </div>
            </div>
          </Card>

          <Card
            title={
              <span>
                <BellOutlined /> Действия
              </span>
            }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              <Button type="default" block onClick={showRecentActivity} disabled>
                Посмотреть историю входов
              </Button>

              <Button type="default" block onClick={showSessionModal} disabled>
                Настроить время сессии
              </Button>

              <Button
                type="dashed"
                danger
                block
                disabled
                onClick={() => {
                  Modal.confirm({
                    title: 'Выйти со всех устройств?',
                    content: 'Это действие завершит все активные сессии кроме текущей.',
                    okText: 'Да, выйти',
                    cancelText: 'Отмена',
                    onOk() {
                      message.success('Все сессии завершены');
                    },
                  });
                }}>
                Завершить все сессии
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Рекомендации по безопасности" style={{ marginTop: 24 }} type="inner">
        <ul style={{ color: 'rgba(0, 0, 0, 0.65)', lineHeight: 1.8 }}>
          <li>Используйте уникальный пароль для этого аккаунта</li>
          <li>Включайте двухфакторную аутентификацию для дополнительной защиты</li>
          <li>Регулярно обновляйте пароль (рекомендуется каждые 3 месяца)</li>
          <li>Не используйте один и тот же пароль на разных сайтах</li>
          <li>Проверяйте историю входов на наличие подозрительной активности</li>
          <li>Используйте менеджер паролей для генерации и хранения сложных паролей</li>
          <li>Избегайте использования личной информации в логине и пароле</li>
        </ul>
      </Card>
    </div>
  );
};

export default UserSecurityPage;
