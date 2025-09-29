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
    accountName: string;
    debitBalance?: number;
    creditBalance?: number;
    balance: string; 
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

// types.ts - Add these types to your existing types file
export interface ContributionCreateRequest {
  memberId: number;
  projectId: number;
  amount: string | number;
  currencyCode: string;
  paymentMethodId: number;
  referenceNumber?: string;
  notes?: string;
  paymentDate: string; // ISO string format
}

export interface ContributionResponse {
  id: number;
  receiptNumber: string;
  memberId: number;
  projectId: number;
  amount: string;
  currencyCode: string;
  paymentMethodId: number;
  referenceNumber?: string;
  paymentDate: string;
  processedBy: number;
  notes?: string;
  status: string;
  isRecurring: boolean;
  recurringPlanId?: number;
  createdAt: string;
  updatedAt: string;
  member: {
    memberNumber: string;
    firstName: string;
    lastName: string;
  };
  project: {
    name: string;
  };
  processor: {
    username: string;
  };
  currency: {
    code: string;
    symbol: string;
  };
  paymentMethod: {
    name: string;
  };
}

export interface ContributionApiResponse {
  message: string;
  contribution: ContributionResponse;
}
