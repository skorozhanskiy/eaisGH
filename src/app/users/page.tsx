'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

import {
  Table,
  Card,
  Typography,
  Tag,
  Space,
  Button,
  message,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  type TableColumnsType,
  type TablePaginationConfig,
} from 'antd';
import {
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Option } = Select;

// Типы для данных
interface UserNode {
  id: string;
  key: string;
  region: string;
  district: string;
  nodeName: string;
  technicalSolution: string;
  status: 'active' | 'inactive' | 'warning' | 'error';
  regionCode: string;
}

// Тип для данных с сервера (может не иметь key)
interface ServerUserNode {
  id: string;
  region: string;
  district: string;
  nodeName: string;
  technicalSolution: string;
  status: 'active' | 'inactive' | 'warning' | 'error';
  regionCode: string;
  key?: string;
}

// Тип для создания новой записи (без id и key)
interface CreateUserNode {
  region: string;
  district: string;
  nodeName: string;
  technicalSolution: string;
  status: 'active' | 'inactive' | 'warning' | 'error';
  regionCode: string;
}

// Список всех округов для фильтра
const districts = [
  'Центральный',
  'Северо-Западный',
  'Южный',
  'Приволжский',
  'Уральский',
  'Сибирский',
  'Дальневосточный',
  'Северо-Кавказский',
];

const Users: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UserNode[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserNode[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<UserNode | null>(null);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `Показано ${range[0]}-${range[1]} из ${total} записей`,
    pageSizeOptions: ['20', '50', '100'],
  });
  const [form] = Form.useForm();

  // Базовый URL API
  const API_URL = 'https://8a1ec2c94f1a6c63.mokky.dev/eaisUsers';

  // Функция для загрузки данных (GET)
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ServerUserNode[]>(API_URL);
      const data = response.data;

      // Убедимся, что у всех элементов есть ключ и id
      const usersWithKey: UserNode[] = data.map((item: ServerUserNode) => ({
        ...item,
        id: item.id || item.key || `${item.regionCode}-${item.nodeName}`,
        key: item.key || item.id || `${item.regionCode}-${item.nodeName}`,
      }));

      setUsers(usersWithKey);
      setFilteredUsers(usersWithKey);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  // Функция для создания данных на сервере (POST)
  const createUserOnServer = async (userData: CreateUserNode): Promise<boolean> => {
    try {
      await axios.post(API_URL, userData);
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  // Функция для обновления данных на сервере (PATCH)
  const updateUserOnServer = async (userData: UserNode): Promise<boolean> => {
    try {
      // Для Mokky.dev API используем PATCH запрос с полным URL включая ID
      if (userData.id) {
        await axios.patch(`${API_URL}/${userData.id}`, userData);
        return true;
      } else {
        throw new Error('ID записи не найден');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Функция для удаления данных на сервере (DELETE)
  const deleteUserOnServer = async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // Функция для выгрузки данных в Excel
  const handleExportToExcel = () => {
    try {
      // Подготавливаем данные для экспорта
      const dataForExport = filteredUsers.map((user) => ({
        'Код региона': user.regionCode,
        Регион: user.region,
        Округ: user.district,
        'Имя узла': user.nodeName,
        'Техническое решение': user.technicalSolution,
        Статус:
          user.status === 'active'
            ? 'Активен'
            : user.status === 'inactive'
            ? 'Неактивен'
            : user.status === 'warning'
            ? 'Предупреждение'
            : 'Ошибка',
      }));

      // Создаем новую книгу Excel
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataForExport);

      // Добавляем лист в книгу
      XLSX.utils.book_append_sheet(wb, ws, 'Пользователи и узлы');

      // Генерируем файл и скачиваем
      XLSX.writeFile(wb, `пользователи_и_узлы_${new Date().toISOString().split('T')[0]}.xlsx`);

      message.success('Данные успешно выгружены в Excel');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      message.error('Ошибка при выгрузке данных в Excel');
    }
  };

  // Фильтрация данных по округам
  useEffect(() => {
    if (selectedDistricts.length === 0) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => selectedDistricts.includes(user.district));
      setFilteredUsers(filtered);
    }
  }, [selectedDistricts, users]);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Обработчик изменения пагинации
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      ...newPagination,
      showTotal: (total, range) => `Показано ${range[0]}-${range[1]} из ${total} записей`,
      pageSizeOptions: ['20', '50', '100'],
    });
  };

  // Обработчик изменения фильтра по округам
  const handleDistrictFilter = (districts: string[]) => {
    setSelectedDistricts(districts);
  };

  // Функция открытия модального окна для создания
  const handleCreate = () => {
    setModalMode('create');
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Функция открытия модального окна для редактирования
  const handleEdit = (record: UserNode) => {
    setModalMode('edit');
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Функция сохранения изменений (для создания и редактирования)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaveLoading(true);

      if (modalMode === 'create') {
        // Создание новой записи
        await createUserOnServer(values);
        message.success('Запись успешно создана на сервере');
      } else {
        // Редактирование существующей записи
        if (!editingRecord) {
          message.error('Не выбрана запись для редактирования');
          return;
        }

        const updatedUser = {
          ...editingRecord,
          ...values,
        };

        await updateUserOnServer(updatedUser);
        message.success('Данные успешно обновлены на сервере');
      }

      // Закрываем модальное окно и обновляем данные
      setIsModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
      await loadData(); // Перезагружаем данные с сервера
    } catch (error: unknown) {
      console.error('Error saving data:', error);

      // Проверяем, является ли ошибка экземпляром Error
      if (error instanceof Error) {
        message.error(`Ошибка при сохранении данных: ${error.message}`);
      } else {
        message.error('Неизвестная ошибка при сохранении данных');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // Функция удаления записи
  const handleDelete = async (record: UserNode) => {
    try {
      await deleteUserOnServer(record.id);
      message.success('Запись успешно удалена');
      await loadData(); // Перезагружаем данные с сервера
    } catch (error: unknown) {
      console.error('Error deleting data:', error);
      if (error instanceof Error) {
        message.error(`Ошибка при удалении данных: ${error.message}`);
      } else {
        message.error('Неизвестная ошибка при удалении данных');
      }
    }
  };

  // Функция отмены редактирования/создания
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // Конфигурация колонок таблицы с правильными типами
  const columns: TableColumnsType<UserNode> = [
    {
      title: 'Код региона',
      dataIndex: 'regionCode',
      key: 'regionCode',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.regionCode.localeCompare(b.regionCode),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Регион',
      dataIndex: 'region',
      key: 'region',
      sorter: (a, b) => a.region.localeCompare(b.region),
      width: 200,
    },
    {
      title: 'Округ',
      dataIndex: 'district',
      key: 'district',
      sorter: (a, b) => a.district.localeCompare(b.district),
      filters: districts.map((district) => ({
        text: district,
        value: district,
      })),
      onFilter: (value, record) => record.district === value,
      filterMultiple: true,
      width: 150,
    },
    {
      title: 'Имя узла',
      dataIndex: 'nodeName',
      key: 'nodeName',
      sorter: (a, b) => a.nodeName.localeCompare(b.nodeName),
      width: 150,
    },
    {
      title: 'Техническое решение регионального навигатора',
      dataIndex: 'technicalSolution',
      key: 'technicalSolution',
      sorter: (a, b) => a.technicalSolution.localeCompare(b.technicalSolution),
      width: 250,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserNode['status']) => {
        const statusConfig = {
          active: { color: 'green', text: 'Активен' },
          inactive: { color: 'default', text: 'Неактивен' },
          warning: { color: 'orange', text: 'Предупреждение' },
          error: { color: 'red', text: 'Ошибка' },
        };

        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: 'Активен', value: 'active' },
        { text: 'Неактивен', value: 'inactive' },
        { text: 'Предупреждение', value: 'warning' },
        { text: 'Ошибка', value: 'error' },
      ],
      onFilter: (value, record) => record.status === value,
      width: 120,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}>
            Редактировать
          </Button>
          <Popconfirm
            title="Удаление записи"
            description="Вы уверены, что хотите удалить эту запись?"
            onConfirm={() => handleDelete(record)}
            okText="Да"
            cancelText="Нет">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Общая информация */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={2}>Пользователи и узлы</Title>
        <Paragraph>
          На этой странице отображается информация о региональных узлах системы. Вы можете
          просматривать статус подключения, технические характеристики и управлять настройками
          узлов.
        </Paragraph>
        <Paragraph>
          Всего зарегистрировано узлов: <strong>{users.length}</strong>
          {selectedDistricts.length > 0 && (
            <>
              {' '}
              (отфильтровано: <strong>{filteredUsers.length}</strong>)
            </>
          )}
        </Paragraph>

        {/* Фильтр по округам */}
        <div style={{ marginTop: 16 }}>
          <Paragraph strong>Фильтр по округам:</Paragraph>
          <Select
            mode="multiple"
            placeholder="Выберите округа"
            value={selectedDistricts}
            onChange={handleDistrictFilter}
            style={{ width: '100%', maxWidth: 400 }}
            allowClear>
            {districts.map((district) => (
              <Option key={district} value={district}>
                {district}
              </Option>
            ))}
          </Select>
          {selectedDistricts.length > 0 && (
            <Button type="link" onClick={() => setSelectedDistricts([])} style={{ marginLeft: 8 }}>
              Сбросить фильтр
            </Button>
          )}
        </div>
      </Card>

      {/* Таблица с данными */}
      <Card
        title="Список узлов"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportToExcel}
              disabled={filteredUsers.length === 0}>
              Выгрузить в Excel
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              Создать
            </Button>
            <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
              Обновить
            </Button>
          </Space>
        }>
        <Spin spinning={loading}>
          <Table<UserNode>
            columns={columns}
            dataSource={filteredUsers}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
            rowKey="key"
          />
        </Spin>
      </Card>

      {/* Модальное окно для создания/редактирования */}
      <Modal
        title={
          modalMode === 'create'
            ? 'Создание нового узла'
            : `Редактирование узла ${editingRecord?.nodeName || ''}`
        }
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText={modalMode === 'create' ? 'Создать' : 'Сохранить'}
        cancelText="Отмена"
        confirmLoading={saveLoading}>
        <Form form={form} layout="vertical" name="userForm">
          <Form.Item
            name="regionCode"
            label="Код региона"
            rules={[{ required: true, message: 'Пожалуйста, введите код региона' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="region"
            label="Регион"
            rules={[{ required: true, message: 'Пожалуйста, введите регион' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="district"
            label="Округ"
            rules={[{ required: true, message: 'Пожалуйста, выберите округ' }]}>
            <Select>
              {districts.map((district) => (
                <Option key={district} value={district}>
                  {district}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nodeName"
            label="Имя узла"
            rules={[{ required: true, message: 'Пожалуйста, введите имя узла' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="technicalSolution"
            label="Техническое решение"
            rules={[{ required: true, message: 'Пожалуйста, введите техническое решение' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Статус"
            rules={[{ required: true, message: 'Пожалуйста, выберите статус' }]}>
            <Select>
              <Option value="active">Активен</Option>
              <Option value="inactive">Неактивен</Option>
              <Option value="warning">Предупреждение</Option>
              <Option value="error">Ошибка</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
