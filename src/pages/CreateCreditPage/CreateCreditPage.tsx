import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Form, 
  Input, 
  InputNumber, 
  Button, 
  Space, 
  Typography, 
  Row, 
  Col,
  Statistic,
  Divider,
  message
} from 'antd';
import { ArrowLeftOutlined, CalculatorOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { useCredits } from '../../hooks/useCredits';
import { CreateCreditRequest } from '../../types/credit';
import { formatCurrency } from '../../utils/formatters';
import styled from 'styled-components';

const { Title, Text } = Typography;
const { TextArea } = Input;

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

const CalculatorCard = styled(Card)`
  background: #f6f9ff;
  border: 1px solid #d6e4ff;
  
  .ant-card-head-title {
    color: #1890ff;
    font-weight: 600;
  }
`;

const CreateCreditPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const { createCredit, calculateMonthlyPayment, loading } = useCredits();
  const [calculatedPayment, setCalculatedPayment] = useState<number>(0);
  const [formValues, setFormValues] = useState<Partial<CreateCreditRequest>>({});

  const handleValuesChange = (changedValues: any, allValues: CreateCreditRequest) => {
    setFormValues(allValues);
    
    if (allValues.amount && allValues.term && allValues.rate) {
      const payment = calculateMonthlyPayment(allValues.amount, allValues.term, allValues.rate);
      setCalculatedPayment(payment);
    } else {
      setCalculatedPayment(0);
    }
  };

  const handleSubmit = async (values: CreateCreditRequest) => {
    try {
      const newCredit = await createCredit(values);
      message.success('Кредит успешно создан');
      navigate(`/credits/${newCredit.id}`);
    } catch (error) {
      message.error('Ошибка при создании кредита');
    }
  };

  const calculateTotalPayment = () => {
    return calculatedPayment * (formValues.term || 0);
  };

  const calculateOverpayment = () => {
    return calculateTotalPayment() - (formValues.amount || 0);
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
            <span>Создание нового кредита</span>
          </div>
        }
      >
        <Row gutter={24}>
          <Col span={14}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onValuesChange={handleValuesChange}
              requiredMark={false}
            >
              <Title level={4}>Информация о клиенте</Title>
              
              <Form.Item
                label="ФИО клиента"
                name="clientName"
                rules={[
                  { required: true, message: 'Введите ФИО клиента' },
                  { min: 3, message: 'ФИО должно содержать не менее 3 символов' }
                ]}
              >
                <Input 
                  placeholder="Иванов Иван Иванович"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Номер телефона"
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Введите номер телефона' },
                  { 
                    pattern: /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
                    message: 'Введите корректный номер телефона'
                  }
                ]}
              >
                <Input 
                  placeholder="+7 (999) 123-45-67"
                  size="large"
                />
              </Form.Item>

              <Divider />

              <Title level={4}>Параметры кредита</Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Сумма кредита"
                    name="amount"
                    rules={[
                      { required: true, message: 'Введите сумму кредита' },
                      { 
                        type: 'number', 
                        min: 50000, 
                        max: 5000000, 
                        message: 'Сумма должна быть от 50 000 до 5 000 000 руб.' 
                      }
                    ]}
                  >
                    <InputNumber
                      placeholder="500000"
                      size="large"
                      style={{ width: '100%' }}
                      formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : ''}
                      parser={(value) => value?.replace(/\s/g, '') as any}
                      addonAfter="₽"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Срок кредита"
                    name="term"
                    rules={[
                      { required: true, message: 'Введите срок кредита' },
                      { 
                        type: 'number', 
                        min: 6, 
                        max: 360, 
                        message: 'Срок должен быть от 6 до 360 месяцев' 
                      }
                    ]}
                  >
                    <InputNumber
                      placeholder="24"
                      size="large"
                      style={{ width: '100%' }}
                      addonAfter="мес."
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Процентная ставка"
                name="rate"
                rules={[
                  { required: true, message: 'Введите процентную ставку' },
                  { 
                    type: 'number', 
                    min: 1, 
                    max: 50, 
                    message: 'Ставка должна быть от 1% до 50%' 
                  }
                ]}
              >
                <InputNumber
                  placeholder="12.5"
                  size="large"
                  style={{ width: '100%' }}
                  step={0.1}
                  precision={1}
                  addonAfter="%"
                />
              </Form.Item>

              <Form.Item
                label="Описание (необязательно)"
                name="description"
              >
                <TextArea
                  placeholder="Цель кредита, дополнительная информация..."
                  rows={3}
                  maxLength={500}
                  showCount
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    size="large"
                  >
                    Создать кредит
                  </Button>
                  <Button 
                    size="large"
                    onClick={() => navigate('/credits')}
                  >
                    Отмена
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Col>

          <Col span={10}>
            <CalculatorCard 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalculatorOutlined />
                  Расчет платежей
                </div>
              }
            >
              {calculatedPayment > 0 ? (
                <div>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Statistic
                        title="Ежемесячный платеж"
                        value={calculatedPayment}
                        formatter={(value) => formatCurrency(Number(value))}
                        valueStyle={{ 
                          color: '#1890ff', 
                          fontSize: '24px', 
                          fontWeight: 'bold' 
                        }}
                      />
                    </Col>
                  </Row>

                  <Divider />

                  <Row gutter={16}>
                    <Col span={24}>
                      <Statistic
                        title="Общая сумма выплат"
                        value={calculateTotalPayment()}
                        formatter={(value) => formatCurrency(Number(value))}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                  </Row>

                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={24}>
                      <Statistic
                        title="Переплата по кредиту"
                        value={calculateOverpayment()}
                        formatter={(value) => formatCurrency(Number(value))}
                        valueStyle={{ color: '#f5222d' }}
                      />
                    </Col>
                  </Row>

                  <Divider />

                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <Text type="secondary">
                      * Расчет производится по формуле аннуитетных платежей
                    </Text>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <CalculatorOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                  <div style={{ marginTop: 16, color: '#999' }}>
                    Заполните все поля для расчета платежей
                  </div>
                </div>
              )}
            </CalculatorCard>
          </Col>
        </Row>
      </StyledCard>
    </div>
  );
};

export default CreateCreditPage;