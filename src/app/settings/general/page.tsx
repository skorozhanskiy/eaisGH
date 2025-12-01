'use client';
import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Divider,
  Row,
  Col,
  Typography,
  Space,
  message,
  Layout,
  theme,
  Select,
  DatePicker,
  Switch,
} from 'antd';
import {
  SaveOutlined,
  UserOutlined,
  CameraOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface UserProfile {
  // Основная информация
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;

  // Дополнительная информация
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  website?: string;
  bio?: string;

  // Адрес
  country?: string;
  city?: string;
  address?: string;
  zipCode?: string;

  // Настройки профиля
  isPublic: boolean;
  emailNotifications: boolean;
  twoFactorAuth: boolean;
}

const UserProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<UploadFile | null>(null);
  const { token } = theme.useToken();

  // Начальные данные пользователя
  const initialUserData: UserProfile = {
    firstName: 'Иван',
    lastName: 'Иванов',
    username: 'ivanov',
    email: 'ivan.ivanov@example.com',
    phone: '+7 (999) 123-45-67',
    birthDate: '1990-01-15',
    gender: 'male',
    website: 'https://ivanov.com',
    bio: 'Full-stack разработчик с опытом работы в веб-разработке более 5 лет.',
    country: 'RU',
    city: 'Москва',
    address: 'ул. Примерная, д. 123, кв. 45',
    zipCode: '123456',
    isPublic: true,
    emailNotifications: true,
    twoFactorAuth: false,
  };

  const handleSave = async (values: UserProfile) => {
    setLoading(true);
    try {
      // Здесь будет логика сохранения данных пользователя
      console.log('Сохранение данных пользователя:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Имитация API call
      message.success('Данные успешно сохранены');
    } catch (error) {
      message.error('Ошибка при сохранении данных');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'done') {
      setAvatarFile(info.file);
      message.success('Аватар успешно загружен');
    }
  };

  const beforeAvatarUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Можно загружать только JPG/PNG файлы!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Изображение должно быть меньше 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <Layout style={{ padding: '24px', background: token.colorBgContainer }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={2}>Профиль пользователя</Title>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            ...initialUserData,
            birthDate: initialUserData.birthDate ? dayjs(initialUserData.birthDate) : undefined,
          }}
          onFinish={handleSave}
          scrollToFirstError>
          {/* Аватар и основная информация */}
          <Card title="Основная информация" style={{ marginBottom: 24 }}>
            <Row gutter={[24, 16]} align="middle">
              <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                  }}>
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    src={avatarFile?.url}
                    style={{ border: `3px solid ${token.colorBorder}` }}
                  />
                  <Upload
                    name="avatar"
                    listType="picture"
                    showUploadList={false}
                    beforeUpload={beforeAvatarUpload}
                    onChange={handleAvatarChange}
                    customRequest={({ onSuccess }) => {
                      setTimeout(() => onSuccess?.('ok'), 0);
                    }}>
                    <Button icon={<CameraOutlined />}>Сменить аватар</Button>
                  </Upload>
                  <Text type="secondary">JPG, PNG до 2MB</Text>
                </div>
              </Col>

              <Col xs={24} md={16}>
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="firstName"
                      label="Имя"
                      rules={[
                        { required: true, message: 'Пожалуйста, введите имя' },
                        { min: 2, message: 'Имя должно содержать минимум 2 символа' },
                      ]}>
                      <Input prefix={<UserOutlined />} placeholder="Введите ваше имя" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="lastName"
                      label="Фамилия"
                      rules={[
                        { required: true, message: 'Пожалуйста, введите фамилию' },
                        { min: 2, message: 'Фамилия должна содержать минимум 2 символа' },
                      ]}>
                      <Input prefix={<UserOutlined />} placeholder="Введите вашу фамилию" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="username"
                  label="Имя пользователя"
                  rules={[
                    { required: true, message: 'Пожалуйста, введите имя пользователя' },
                    { min: 3, message: 'Имя пользователя должно содержать минимум 3 символа' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Только буквы, цифры и подчеркивания' },
                  ]}>
                  <Input placeholder="Введите имя пользователя" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Контактная информация */}
          <Card title="Контактная информация" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Пожалуйста, введите email' },
                    { type: 'email', message: 'Введите корректный email' },
                  ]}>
                  <Input prefix={<MailOutlined />} placeholder="example@domain.com" type="email" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Телефон"
                  rules={[{ required: true, message: 'Пожалуйста, введите телефон' }]}>
                  <Input prefix={<PhoneOutlined />} placeholder="+7 (999) 123-45-67" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="website" label="Веб-сайт">
              <Input prefix={<GlobalOutlined />} placeholder="https://example.com" />
            </Form.Item>
          </Card>

          {/* Личная информация */}
          <Card title="Личная информация" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item name="birthDate" label="Дата рождения">
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="Выберите дату"
                    format="DD.MM.YYYY"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="gender" label="Пол">
                  <Select placeholder="Выберите пол">
                    <Option value="male">Мужской</Option>
                    <Option value="female">Женский</Option>
                    <Option value="other">Другой</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="bio" label="О себе">
              <TextArea rows={4} placeholder="Расскажите о себе..." maxLength={500} showCount />
            </Form.Item>
          </Card>

          {/* Адрес */}
          <Card title="Адрес" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item name="country" label="Страна">
                  <Select placeholder="Выберите страну">
                    <Option value="RU">Россия</Option>
                    <Option value="KZ">Казахстан</Option>
                    <Option value="BY">Беларусь</Option>
                    <Option value="UA">Украина</Option>
                    <Option value="US">США</Option>
                    <Option value="DE">Германия</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="city" label="Город">
                  <Input placeholder="Введите город" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="address" label="Адрес">
              <Input prefix={<EnvironmentOutlined />} placeholder="Введите полный адрес" />
            </Form.Item>

            <Form.Item name="zipCode" label="Почтовый индекс">
              <Input placeholder="Введите почтовый индекс" />
            </Form.Item>
          </Card>

          {/* Настройки профиля */}
          <Card title="Настройки профиля" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 0]}>
              <Col xs={24} md={8}>
                <Form.Item name="isPublic" valuePropName="checked" label="Публичный профиль">
                  <Switch />
                </Form.Item>
                <Text type="secondary">Ваш профиль будет виден другим пользователям</Text>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="emailNotifications"
                  valuePropName="checked"
                  label="Email уведомления">
                  <Switch />
                </Form.Item>
                <Text type="secondary">Получать уведомления на email</Text>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="twoFactorAuth"
                  valuePropName="checked"
                  label="Двухфакторная аутентификация">
                  <Switch />
                </Form.Item>
                <Text type="secondary">Дополнительная защита аккаунта</Text>
              </Col>
            </Row>
          </Card>

          <Divider />

          {/* Кнопки действий */}
          <div style={{ textAlign: 'center' }}>
            <Space size="large">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large">
                Сохранить изменения
              </Button>

              <Button onClick={() => form.resetFields()} size="large">
                Отменить изменения
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
