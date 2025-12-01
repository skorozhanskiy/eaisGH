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
  Modal,
} from 'antd';
import {
  SaveOutlined,
  UserOutlined,
  CameraOutlined,
  ContactsOutlined,
  HomeOutlined,
  LockOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  isPublic: boolean;
  emailNotifications: boolean;
  twoFactorAuth: boolean;
}

// Компоненты для модальных окон (упрощенные версии)
const ContactInfoModal: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => (
  <Modal
    title="Контактная информация"
    open={visible}
    onCancel={onClose}
    footer={[
      <Button key="cancel" onClick={onClose}>
        Закрыть
      </Button>,
      <Button key="save" type="primary">
        Сохранить
      </Button>,
    ]}
    width={600}>
    <p>Здесь будет форма контактной информации...</p>
  </Modal>
);

const AddressModal: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => (
  <Modal
    title="Адрес"
    open={visible}
    onCancel={onClose}
    footer={[
      <Button key="cancel" onClick={onClose}>
        Закрыть
      </Button>,
      <Button key="save" type="primary">
        Сохранить
      </Button>,
    ]}
    width={600}>
    <p>Здесь будет форма адреса...</p>
  </Modal>
);

const SecurityModal: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => (
  <Modal
    title="Безопасность"
    open={visible}
    onCancel={onClose}
    footer={[
      <Button key="cancel" onClick={onClose}>
        Закрыть
      </Button>,
      <Button key="save" type="primary">
        Сохранить
      </Button>,
    ]}
    width={600}>
    <p>Здесь будет форма смены пароля...</p>
  </Modal>
);

const UserProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<UploadFile | null>(null);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const { token } = theme.useToken();

  const initialUserData: UserProfile = {
    firstName: 'Иван',
    lastName: 'Иванов',
    username: 'ivanov',
    birthDate: '1990-01-15',
    gender: 'male',
    bio: 'Full-stack разработчик с опытом работы в веб-разработке более 5 лет.',
    isPublic: true,
    emailNotifications: true,
    twoFactorAuth: false,
  };

  const handleSave = async (values: UserProfile) => {
    setLoading(true);
    try {
      console.log('Сохранение данных пользователя:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
    <>
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
                      {
                        pattern: /^[a-zA-Z0-9_]+$/,
                        message: 'Только буквы, цифры и подчеркивания',
                      },
                    ]}>
                    <Input placeholder="Введите имя пользователя" />
                  </Form.Item>
                </Col>
              </Row>
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

            {/* Быстрый доступ к другим настройкам */}
            <Card title="Дополнительные настройки" style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Card
                    size="small"
                    hoverable
                    onClick={() => setContactModalVisible(true)}
                    style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <ContactsOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                    <div>Контактная информация</div>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card
                    size="small"
                    hoverable
                    onClick={() => setAddressModalVisible(true)}
                    style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <HomeOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                    <div>Адрес</div>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card
                    size="small"
                    hoverable
                    onClick={() => setSecurityModalVisible(true)}
                    style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <LockOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                    <div>Безопасность</div>
                  </Card>
                </Col>
              </Row>
            </Card>

            <Divider />

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

      {/* Модальные окна */}
      <ContactInfoModal
        visible={contactModalVisible}
        onClose={() => setContactModalVisible(false)}
      />
      <AddressModal visible={addressModalVisible} onClose={() => setAddressModalVisible(false)} />
      <SecurityModal
        visible={securityModalVisible}
        onClose={() => setSecurityModalVisible(false)}
      />
    </>
  );
};

export default UserProfilePage;
