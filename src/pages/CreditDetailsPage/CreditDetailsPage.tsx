import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Space, 
  Typography, 
  Descriptions, 
  Tag, 
  Row, 
  Col,
  Statistic,
  Divider,
  Timeline,
  message
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useCredits } from '../../hooks/useCredits';
import { formatCurrency, formatPhoneNumber } from '../../utils/formatters';
import { getStatusColor, getStatusText } from '../../utils/creditUtils';
import { CreditStatus } from '../../types/credit';
import styled from 'styled-components';

const { Title, Text } = Typography;

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

const InfoCard = styled(Card)`
  height: 100%;
  
  .ant-card-head-title {
    font-size: 16px;
    font-weight: 600;
  }
`;

const TimelineCard = styled(Card)`
  .ant-timeline {
    margin-top: 16px;
  }
`;

const CreditDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCreditById, updateCreditStatus, loading } = useCredits();

  if (!id) {
    navigate('/credits');
    return null;
  }

  const credit = getCreditById(id);

  if (!credit) {
    message.error('Кредит не найден');
    navigate('/credits');
    return null;
  }

  const handleStatusChange = async (newStatus: CreditStatus) => {
    try {
      await updateCreditStatus(credit.id, newStatus);
      message.success('Статус кредита успешно изменен');
    } catch (error) {
      message.error('Ошибка при изменении статуса кредита');
    }
  };

  const calculateTotalPayment = () => {
    return credit.monthlyPayment * credit.term;
  };

  const calculateOverpayment = () => {
    return calculateTotalPayment() - credit.amount;
  };

  const getTimelineItems = () => {
    const items = [
      {
        color: 'blue',
        dot: <ClockCircleOutlined />,
        children: (
          <div>
            <Text strong>Заявка создана</Text>
            <br />
            <Text type="secondary">{new Date(credit.createdDate).toLocaleDateString('ru-RU')}</Text>
          </div>
        ),
      },
    ];

    if (credit.status === CreditStatus.APPROVED || credit.status === CreditStatus.ACTIVE) {
      items.push({
        color: 'green',
        dot: <CheckCircleOutlined />,
        children: (
          <div>
            <Text strong>Кредит одобрен</Text>
            <br />
            <Text type="secondary">
              {credit.approvedDate ? new Date(credit.approvedDate).toLocaleDateString('ru-RU') : 'Дата не указана'}
            </Text>
          </div>
        ),
      });
    }

    if (credit.status === CreditStatus.ACTIVE) {
      items.push({
        color: 'orange',
        dot: <DollarOutlined />,
        children: (
          <div>
            <Text strong>Кредит активирован</Text>
            <br />
            <Text type="secondary">Начались выплаты</Text>
          </div>
        ),
      });
    }

    if (credit.status === CreditStatus.REJECTED) {
      items.push({
        color: 'red',
        dot: <CloseCircleOutlined />,
        children: (
          <div>
            <Text strong>Заявка отклонена</Text>
            <br />
            <Text type="secondary">Не соответствует требованиям</Text>
          </div>
        ),
      });
    }

    if (credit.status === CreditStatus.CLOSED) {
      items.push({
        color: 'gray',
        dot: <CheckCircleOutlined />,
        children: (
          <div>
            <Text strong>Кредит закрыт</Text>
            <br />
            <Text type="secondary">Полностью погашен</Text>
          </div>
        ),
      });
    }

    return items;
  };

  return (
    <div>
      <StyledCard
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/credits')}
              style={{ color: 'white' }}
            />
            <span>Детали кредита #{credit.id}</span>
            <Tag color={getStatusColor(credit.status)}>
              {getStatusText(credit.status)}
            </Tag>
          </div>
        }
        extra={
          <Space>
            {credit.status === CreditStatus.PENDING && (
              <>
                <Button
                  type="primary"
                  ghost
                  onClick={() => handleStatusChange(CreditStatus.APPROVED)}
                  loading={loading}
                >
                  Одобрить
                </Button>
                <Button
                  danger
                  ghost
                  onClick={() => handleStatusChange(CreditStatus.REJECTED)}
                  loading={loading}
                >
                  Отклонить
                </Button>
              </>
            )}
            {credit.status === CreditStatus.APPROVED && (
              <Button
                type="primary"
                ghost
                onClick={() => handleStatusChange(CreditStatus.ACTIVE)}
                loading={loading}
              >
                Активировать
              </Button>
            )}
            {credit.status === CreditStatus.ACTIVE && (
              <Button
                ghost
                onClick={() => handleStatusChange(CreditStatus.CLOSED)}
                loading={loading}
              >
                Закрыть кредит
              </Button>
            )}
          </Space>
        }
      >
        <Row gutter={24}>
          <Col span={16}>
            <InfoCard title="Информация о клиенте" style={{ marginBottom: 24 }}>
              <Descriptions column={2}>
                <Descriptions.Item label="ФИО" span={2}>
                  <Text strong>{credit.clientName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Телефон">
                  <Text copyable>{formatPhoneNumber(credit.phoneNumber)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Дата заявки">
                  {new Date(credit.createdDate).toLocaleDateString('ru-RU')}
                </Descriptions.Item>
                {credit.description && (
                  <Descriptions.Item label="Описание" span={2}>
                    {credit.description}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </InfoCard>

            <InfoCard title="Условия кредита">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Сумма кредита"
                    value={credit.amount}
                    formatter={(value) => formatCurrency(Number(value))}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Срок кредита"
                    value={credit.term}
                    suffix="мес."
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Процентная ставка"
                    value={credit.rate}
                    suffix="%"
                    precision={1}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Col>
              </Row>

              <Divider />

              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Ежемесячный платеж"
                    value={credit.monthlyPayment}
                    formatter={(value) => formatCurrency(Number(value))}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Общая сумма выплат"
                    value={calculateTotalPayment()}
                    formatter={(value) => formatCurrency(Number(value))}
                    valueStyle={{ color: '#13c2c2' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Переплата"
                    value={calculateOverpayment()}
                    formatter={(value) => formatCurrency(Number(value))}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Col>
              </Row>
            </InfoCard>
          </Col>

          <Col span={8}>
            <TimelineCard title="История изменений">
              <Timeline items={getTimelineItems()} />
            </TimelineCard>
          </Col>
        </Row>
      </StyledCard>
    </div>
  );
};

export default CreditDetailsPage;