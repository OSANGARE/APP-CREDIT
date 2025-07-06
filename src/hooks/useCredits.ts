import { useState, useEffect } from 'react';
import { Credit, CreditStatus, CreateCreditRequest, CreditFilters } from '../types/credit';

// Моковые данные для демонстрации
const mockCredits: Credit[] = [
  {
    id: '1',
    clientName: 'Иванов Иван Иванович',
    phoneNumber: '+7 (999) 123-45-67',
    amount: 500000,
    term: 24,
    rate: 12.5,
    monthlyPayment: 23546.89,
    status: CreditStatus.ACTIVE,
    createdDate: '2024-01-15',
    approvedDate: '2024-01-17',
    description: 'Потребительский кредит на покупку автомобиля'
  },
  {
    id: '2',
    clientName: 'Петрова Анна Сергеевна',
    phoneNumber: '+7 (999) 987-65-43',
    amount: 1200000,
    term: 36,
    rate: 10.8,
    monthlyPayment: 39245.67,
    status: CreditStatus.PENDING,
    createdDate: '2024-12-20',
    description: 'Ипотечный кредит'
  },
  {
    id: '3',
    clientName: 'Сидоров Петр Александрович',
    phoneNumber: '+7 (999) 555-44-33',
    amount: 250000,
    term: 12,
    rate: 15.2,
    monthlyPayment: 22456.78,
    status: CreditStatus.APPROVED,
    createdDate: '2024-12-22',
    approvedDate: '2024-12-23',
    description: 'Краткосрочный потребительский кредит'
  },
  {
    id: '4',
    clientName: 'Козлова Елена Михайловна',
    phoneNumber: '+7 (999) 777-88-99',
    amount: 800000,
    term: 60,
    rate: 9.5,
    monthlyPayment: 16789.12,
    status: CreditStatus.REJECTED,
    createdDate: '2024-12-18',
    description: 'Кредит на образование'
  },
  {
    id: '5',
    clientName: 'Морозов Алексей Викторович',
    phoneNumber: '+7 (999) 111-22-33',
    amount: 150000,
    term: 18,
    rate: 14.0,
    monthlyPayment: 9567.45,
    status: CreditStatus.CLOSED,
    createdDate: '2023-06-10',
    approvedDate: '2023-06-12',
    description: 'Кредит на ремонт квартиры'
  }
];

export const useCredits = () => {
  const [credits, setCredits] = useState<Credit[]>(mockCredits);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<CreditFilters>({});

  const calculateMonthlyPayment = (amount: number, term: number, rate: number): number => {
    const monthlyRate = rate / 100 / 12;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                   (Math.pow(1 + monthlyRate, term) - 1);
    return Math.round(payment * 100) / 100;
  };

  const getFilteredCredits = (): Credit[] => {
    return credits.filter(credit => {
      if (filters.status && filters.status.length > 0 && !filters.status.includes(credit.status)) {
        return false;
      }
      
      if (filters.amountFrom && credit.amount < filters.amountFrom) {
        return false;
      }
      
      if (filters.amountTo && credit.amount > filters.amountTo) {
        return false;
      }
      
      if (filters.termFrom && credit.term < filters.termFrom) {
        return false;
      }
      
      if (filters.termTo && credit.term > filters.termTo) {
        return false;
      }
      
      if (filters.clientName && !credit.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  const getCreditById = (id: string): Credit | undefined => {
    return credits.find(credit => credit.id === id);
  };

  const createCredit = async (creditData: CreateCreditRequest): Promise<Credit> => {
    setLoading(true);
    
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const monthlyPayment = calculateMonthlyPayment(creditData.amount, creditData.term, creditData.rate);
    
    const newCredit: Credit = {
      id: Date.now().toString(),
      ...creditData,
      monthlyPayment,
      status: CreditStatus.PENDING,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setCredits(prev => [newCredit, ...prev]);
    setLoading(false);
    
    return newCredit;
  };

  const updateCreditStatus = async (id: string, status: CreditStatus): Promise<void> => {
    setLoading(true);
    
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCredits(prev => prev.map(credit => 
      credit.id === id 
        ? { 
            ...credit, 
            status,
            approvedDate: status === CreditStatus.APPROVED ? new Date().toISOString().split('T')[0] : credit.approvedDate
          }
        : credit
    ));
    
    setLoading(false);
  };

  const deleteCredit = async (id: string): Promise<void> => {
    setLoading(true);
    
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCredits(prev => prev.filter(credit => credit.id !== id));
    setLoading(false);
  };

  return {
    credits: getFilteredCredits(),
    allCredits: credits,
    loading,
    filters,
    setFilters,
    getCreditById,
    createCredit,
    updateCreditStatus,
    deleteCredit,
    calculateMonthlyPayment
  };
};