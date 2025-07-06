import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  Input, 
  Select, 
  Row, 
  Col,
  Modal,
  message,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Credit, CreditStatus, CreditFilters } from '../../types/credit';
import { useCredits } from '../../hooks/useCredits';
import { formatCurrency, formatPhoneNumber } from '../../utils/formatters';
import { getStatusColor, getStatusText } from '../../utils/creditUtils';
import styled from 'styled-components';

const { Title } = Typography;
const { Option } = Select;

const StyledCard = styled(Card)`
  .ant-card-head {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border-bottom: none;
    
    .ant-card-head-title {
      color: white;
      font-weight: 600;
    }
  }
`;

const FilterCard = styled(Card)`
  margin-bottom: 24px;
  
  .ant-card-body {
    padding: 16px;
  }
`;

const StatCard = styled(Card)`
  text-align: center;
  
  .stat-number {
    font-size: 24px;
    font-weight: bold;
    color: #1890ff;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #666;
  }
`;

const CreditsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    credits, 
    allCredits, 
    loading, 
    filters, 
    setFilters, 
    updateCreditStatus, 
    deleteCredit 
  } = useCredits();
  
  const [showFilters, setShowFilters] = useState(false);

  const handleViewCredit = (id: string) => {
    navigate(`/credits/${id}`);
  };

  const handleCreateCredit = () => {
    navigate('/credits/new');
  };

  const handleStatusChange = async (id: string, status: CreditStatus) => {
    try {
      await updateCreditStatus(id, status);
      message.success('Статус кредита успешно изменен');
    } catch (error) {
      message.error('Ошибка при изменении статуса кредита');
    }
  };

  const handleDeleteCredit = async (id: string) => {
    try {
      await deleteCredit(id);
      message.success('Кредит успешно удален');
    } catch (error) {
      message.error('Ошибка при удалении кредита');
    }
  };

  const handleFilterChange = (key: keyof CreditFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  // Статистика
  const stats = {
    total: allCredits.length,
    pending: allCredits.filter(c => c.status === CreditStatus.PENDING).length,
    approved: allCredits.filter(c => c.status === CreditStatus.APPROVED).length,
    active: allCredits.filter(c => c.status === CreditStatus.ACTIVE).length,
    totalAmount: allCredits.reduce((sum, c) => sum + c.amount, 0)
  };

  const columns = [
    {
      title: 'Клиент',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (text: string, record: Credit) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {formatPhoneNumber(record.phoneNumber)}
          </div>
        </div>
      ),
    },
    {
      title: 'Сумма кредита',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ fontWeight: 500 }}>{formatCurrency(amount)}</span>
      ),
      sorter: (a: Credit, b: Credit) => a.amount - b.amount,
    },
    {
      title: 'Срок',
      dataIndex: 'term',
      key: 'term',
      render: (term: number) => `${term} мес.`,
      sorter: (a: Credit, b: Credit) => a.term - b.term,
    },
    {
      title: 'Ставка',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => `${rate}%`,
      sorter: (a: Credit, b: Credit) => a.rate - b.rate,
    },
    {
      title: 'Ежемесячный платеж',
      dataIndex: 'monthlyPayment',
      key: 'monthlyPayment',
      render: (payment: number) => formatCurrency(payment),
      sorter: (a: Credit, b: Credit) => a.monthlyPayment - b.monthlyPayment,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: CreditStatus, record: Credit) => (
        <Select
          value={status}
          style={{ width: 120 }}
          size="small"
          onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
          disabled={loading}
        >
          {Object.values(CreditStatus).map(s => (
            <Option key={s} value={s}>
              <Tag color={getStatusColor(s)}>{getStatusText(s)}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
      sorter: (a: Credit, b: Credit) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record: Credit) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewCredit(record.id)}
            title="Просмотр"
          />
          <Popconfirm
            title="Удалить кредит?"
            description="Это действие нельзя отменить"
            onConfirm={() => handleDeleteCredit(record.id)}
            okText="Удалить"
            cancelText="Отмена"
            okType="danger"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Удалить"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Статистика */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <StatCard>
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Всего кредитов</div>
          </StatCard>
        </Col>
        <Col span={4}>
          <StatCard>
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">На рассмотрении</div>
          </StatCard>
        </Col>
        <Col span={4}>
          <StatCard>
            <div className="stat-number">{stats.approved}</div>
            <div className="stat-label">Одобрено</div>
          </StatCard>
        </Col>
        <Col span={4}>
          <StatCard>
            <div className="stat-number">{stats.active}</div>
            <div className="stat-label">Активных</div>
          </StatCard>
        </Col>
        <Col span={8}>
          <StatCard>
            <div className="stat-number">{formatCurrency(stats.totalAmount)}</div>
            <div className="stat-label">Общая сумма кредитов</div>
          </StatCard>
        </Col>
      </Row>

      {/* Фильтры */}
      {showFilters && (
        <FilterCard>
          <Row gutter={16}>
            <Col span={6}>
              <Input
                placeholder="Поиск по имени клиента"
                prefix={<SearchOutlined />}
                value={filters.clientName}
                onChange={(e) => handleFilterChange('clientName', e.target.value)}
                allowClear
              />
            </Col>
            <Col span={6}>
              <Select
                mode="multiple"
                placeholder="Статус"
                style={{ width: '100%' }}
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                allowClear
              >
                {Object.values(CreditStatus).map(status => (
                  <Option key={status} value={status}>
                    {getStatusText(status)}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Input
                placeholder="Сумма от"
                type="number"
                value={filters.amountFrom}
                onChange={(e) => handleFilterChange('amountFrom', e.target.value ? Number(e.target.value) : undefined)}
              />
            </Col>
            <Col span={4}>
              <Input
                placeholder="Сумма до"
                type="number"
                value={filters.amountTo}
                onChange={(e) => handleFilterChange('amountTo', e.target.value ? Number(e.target.value) : undefined)}
              />
            </Col>
            <Col span={4}>
              <Button onClick={clearFilters}>
                Очистить фильтры
              </Button>
            </Col>
          </Row>
        </FilterCard>
      )}

      {/* Основная таблица */}
      <StyledCard
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Управление кредитами</span>
            <Tag color="blue">{credits.length}</Tag>
          </div>
        }
        extra={
          <Space>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? 'primary' : 'default'}
            >
              Фильтры
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateCredit}
            >
              Создать кредит
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={credits}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} из ${total} записей`,
          }}
          scroll={{ x: 1200 }}
        />
      </StyledCard>
    </div>
  );
};

export default CreditsPage;