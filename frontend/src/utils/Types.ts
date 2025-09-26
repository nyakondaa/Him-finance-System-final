// types/transactions.ts

export interface Transaction {
  id: number;
  receiptNumber: string;
  revenueHeadCode: string;
  amount: string; // Prisma Decimal serialized as string in JSON
  branchCode: string;
  transactionDate: string; // ISO string
  createdAt: string;
  currencyCode: string;
  memberId: number;
  notes?: string;
  paymentMethodId: number;
  referenceNumber?: string;
  status: string;
  updatedAt: string;
  userId: number;

  
  branch?: { code: string; name: string };
  currency?: { code: string; name: string };
  member?: { id: number; firstName: string; lastName: string };
  paymentMethod?: { id: number; name: string };
  revenueHead?: { code: string; name: string };
  user?: { id: number; username: string };
}

export  interface Member {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    ageCategory: string;
    branchCode: string;
    branch: {
      name: string;
    };
    dateOfBirth: string; // or Date if you parse it
    email: string;
    isActive: boolean;
    joinedDate: string; // or Date
    memberNumber: string;
    phoneNumber: string;
    createdAt: string; // or Date
    updatedAt: string; // or Date
    _count: {
      contributions: number;
      memberProjects: number;
      generalTransactions: number;
    };
  }

  export interface Account {    
    accountNumber: string;
    accountType: string;
    balance: string; // Prisma Decimal serialized as string in JSON    
    transactions: Transaction[];
  }

 export interface Expenditure {
  id: number;
  voucherNumber: string;
  expenditureHeadCode: string;
  description: string;
  amount: number;
  totalAmount: number;
  currencyCode: string;
  paymentMethodId: number;
  branchCode: string;
  expenseDate: string;
  isRecurring: boolean;
  approvalStatus: string;
  taxAmount?: number;
}
