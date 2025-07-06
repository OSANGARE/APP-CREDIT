import { CreditStatus } from '../types/credit';

export const getStatusColor = (status: CreditStatus): string => {
  switch (status) {
    case CreditStatus.PENDING:
      return 'orange';
    case CreditStatus.APPROVED:
      return 'blue';
    case CreditStatus.ACTIVE:
      return 'green';
    case CreditStatus.REJECTED:
      return 'red';
    case CreditStatus.CLOSED:
      return 'default';
    default:
      return 'default';
  }
};

export const getStatusText = (status: CreditStatus): string => {
  switch (status) {
    case CreditStatus.PENDING:
      return 'На рассмотрении';
    case CreditStatus.APPROVED:
      return 'Одобрен';
    case CreditStatus.ACTIVE:
      return 'Активный';
    case CreditStatus.REJECTED:
      return 'Отклонен';
    case CreditStatus.CLOSED:
      return 'Закрыт';
    default:
      return status;
  }
};