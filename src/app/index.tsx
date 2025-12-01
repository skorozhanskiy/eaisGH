'use client';
import React, { useState } from 'react';
import { Card, Select, Typography, Image, Space } from 'antd';
import type { SelectProps } from 'antd';

// const { Option } = Select;
const { Title, Paragraph } = Typography;

// Типы для данных о компьютерах
interface ComputerSpecs {
  name: string;
  image: string;
  description: string;
  specs: string;
  price?: string;
}

interface ComputersData {
  [key: string]: ComputerSpecs;
}

// Тип для ключей компьютеров
type ComputerKey = 'macbook-pro' | 'dell-xps' | 'lenovo-thinkpad' | 'asus-rog';

const ComputerCard: React.FC = () => {
  const [selectedComputer, setSelectedComputer] = useState<ComputerKey>('macbook-pro');

  // Данные о компьютерах с типизацией
  const computersData: ComputersData = {
    'macbook-pro': {
      name: 'MacBook Pro 16"',
      image: 'https://via.placeholder.com/300x200/007ACC/FFFFFF?text=MacBook+Pro',
      description:
        'Мощный ноутбук для профессионалов с процессором M3 Pro, 32 ГБ оперативной памяти и дисплеем Liquid Retina XDR.',
      specs: 'Процессор: Apple M3 Pro • Память: 32 ГБ • SSD: 1 ТБ • Дисплей: 16.2"',
      price: '₽249,990',
    },
    'dell-xps': {
      name: 'Dell XPS 13',
      image: 'https://via.placeholder.com/300x200/008450/FFFFFF?text=Dell+XPS+13',
      description:
        'Ультрабук премиум-класса с безрамочным дисплеем InfinityEdge и процессорами Intel Core 13-го поколения.',
      specs: 'Процессор: Intel Core i7 • Память: 16 ГБ • SSD: 512 ГБ • Дисплей: 13.4"',
      price: '₽149,990',
    },
    'lenovo-thinkpad': {
      name: 'Lenovo ThinkPad X1',
      image: 'https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=ThinkPad+X1',
      description:
        'Надежный бизнес-ноутбук с культовой клавиатурой и военной сертификацией прочности.',
      specs: 'Процессор: Intel Core i5 • Память: 16 ГБ • SSD: 512 ГБ • Дисплей: 14"',
      price: '₽129,990',
    },
    'asus-rog': {
      name: 'ASUS ROG Zephyrus',
      image: 'https://via.placeholder.com/300x200/6A0DAD/FFFFFF?text=ROG+Zephyrus',
      description:
        'Игровой ноутбук с видеокартой NVIDIA RTX 4070 и высокочастотным дисплеем для плавного геймплея.',
      specs: 'Процессор: AMD Ryzen 9 • Видеокарта: RTX 4070 • Память: 32 ГБ • Дисплей: 15.6" 240Гц',
      price: '₽199,990',
    },
  };

  const handleComputerChange: SelectProps<ComputerKey>['onChange'] = (value) => {
    setSelectedComputer(value);
  };

  const currentComputer = computersData[selectedComputer];

  // Опции для Select компонента
  const selectOptions: SelectProps<ComputerKey>['options'] = (
    Object.entries(computersData) as [ComputerKey, ComputerSpecs][]
  ).map(([key, computer]) => ({
    value: key,
    label: computer.name,
  }));

  return (
    <Card
      style={{
        width: 350,
        margin: '20px auto',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '12px',
      }}
      title={
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Title level={4} style={{ margin: 0 }}>
            Выбор компьютера
          </Title>
          <Select<ComputerKey>
            value={selectedComputer}
            onChange={handleComputerChange}
            style={{ width: '100%' }}
            placeholder="Выберите компьютер"
            options={selectOptions}
          />
        </Space>
      }>
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <Image
          src={currentComputer.image}
          alt={currentComputer.name}
          preview={false}
          style={{
            borderRadius: '8px',
            objectFit: 'cover',
            width: '100%',
          }}
        />

        <div>
          <Space orientation="vertical" size="small" style={{ width: '100%' }}>
            <Title level={5} style={{ margin: 0 }}>
              {currentComputer.name}
            </Title>
            {currentComputer.price && (
              <Paragraph
                strong
                style={{
                  margin: 0,
                  color: '#52c41a',
                  fontSize: '16px',
                }}>
                {currentComputer.price}
              </Paragraph>
            )}
          </Space>

          <Paragraph style={{ margin: '12px 0', color: '#666' }}>
            {currentComputer.description}
          </Paragraph>

          <Paragraph
            style={{
              margin: 0,
              fontSize: '12px',
              color: '#1890ff',
              backgroundColor: '#f0f8ff',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #e6f7ff',
            }}>
            {currentComputer.specs}
          </Paragraph>
        </div>
      </Space>
    </Card>
  );
};

export default ComputerCard;
