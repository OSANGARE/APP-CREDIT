export interface Credit {
  id: string;
  clientName: string;
  phoneNumber: string;
  amount: number;
  term: number; // срок в месяцах
  rate: number; // процентная ставка
  monthlyPayment: number;
  status: CreditStatus;
  createdDate: string;
  approvedDate?: string;
  description?: string;
}

export enum CreditStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  CLOSED = 'closed'
}

export interface CreateCreditRequest {
  clientName: string;
  phoneNumber: string;
  amount: number;
  term: number;
  rate: number;
  description?: string;
}

export interface CreditFilters {
  status?: CreditStatus[];
  amountFrom?: number;
  amountTo?: number;
  termFrom?: number;
  termTo?: number;
  clientName?: string;
}