import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Eye, 
  Download,
  Filter,
  ChevronDown,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Hash,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  BarChart3,
  Target,
  FileText,
  Calendar,
  Building,
  DollarSign,
  MoreVertical // Added MoreVertical for table actions
} from "lucide-react";
// Assuming this path is correct for your project
import useAccountsData from "@/hooks";

// --- Types ---
interface TransactionDetail {
  id: string;
  time: string; // ISO string for sorting/filtering
  customer: string;
  method: string;
  amount: string; // Formatted string
  type: 'income' | 'expense';
  status: 'success' | 'pending' | 'failed';
  transactionHash?: string;
  branch?: string;
  revenueHead?: string;
  notes?: string;
  originalAmount?: number; // Raw number for sorting/analytics
  currency?: string;
  branchCode?: string; // For filtering
  revenueHeadCode?: string; // For filtering
  memberId?: string | number;
}

interface AnalyticsData {
  revenueHeadTotals: { [key: string]: number };
  branchTotals: { [key: string]: number };
  memberTotals: { [key: string]: number };
}

type TransactionType = 'all' | 'income' | 'expense';
type StatusType = 'all' | 'success' | 'pending' | 'failed';
type DateRange = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

// --- Constants ---
const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'income', label: 'Credit (Revenue)' },
  { value: 'expense', label: 'Debit (Expenditure)' }
];

const STATUS_TYPES: { value: StatusType; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'success', label: 'Completed' },
  { value: 'pending', label: 'Pending Approval' },
  { value: 'failed', label: 'Failed/Cancelled' }
];

const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: '7 Days' },
  { value: 'month', label: '30 Days' },
  { value: 'quarter', label: '90 Days' },
  { value: 'year', label: '1 Year' },
  { value: 'custom', label: 'Custom Range' }
];

const ITEMS_PER_PAGE = [25, 50, 100];

// --- Helper Functions ---
const formatCurrency = (amount: number, currency: string = "USD"): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const getDateRange = (range: DateRange): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();
  
  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'quarter':
      start.setMonth(start.getMonth() - 3);
      start.setHours(0, 0, 0, 0);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      start.setFullYear(2000); // Default to all time
      start.setHours(0, 0, 0, 0);
  }
  
  return { start, end };
};

const truncateHash = (hash: string, length: number = 8): string => {
  if (!hash) return 'N/A';
  if (hash.length <= length) return hash;
  return `${hash.substring(0, length)}...`;
};

// --- Subcomponents ---

const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  variant?: "default" | "success" | "destructive" | "info";
}> = ({ title, value, subtitle, trend, icon, variant = "default" }) => {
  const variantStyles = {
    default: "text-slate-900",
    info: "text-blue-600",
    success: "text-emerald-600",
    destructive: "text-rose-600"
  };
  
  const iconBg = {
    default: "bg-slate-100",
    info: "bg-blue-100",
    success: "bg-emerald-100",
    destructive: "bg-rose-100"
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-slate-600 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-lg ${iconBg[variant]}`}>
          {React.cloneElement(icon as React.ReactElement, { className: `w-5 h-5 ${variantStyles[variant]}` })}
        </div>
      </div>
      <p className="text-3xl font-extrabold text-slate-900 mb-1">{value}</p>
      <div className="flex items-center space-x-2 text-sm">
        <p className="text-slate-500">{subtitle}</p>
        {trend && (
          <div className={`flex items-center space-x-1 font-medium ${
            trend.value >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {trend.value >= 0 ? 
              <TrendingUp className="w-4 h-4" /> : 
              <TrendingDown className="w-4 h-4" />
            }
            <span>{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: 'success' | 'pending' | 'failed' }> = ({ status }) => {
  const statusConfig = {
    success: { 
      label: 'Completed', 
      icon: CheckCircle, 
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    },
    pending: { 
      label: 'Pending', 
      icon: Clock, 
      className: 'bg-amber-50 text-amber-700 border-amber-200' 
    },
    failed: { 
      label: 'Failed', 
      icon: XCircle, 
      className: 'bg-rose-50 text-rose-700 border-rose-200' 
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md border text-xs font-medium ${config.className}`}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-slate-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
      <p className="text-slate-600 text-lg font-medium">Loading transactions...</p>
      <p className="text-slate-400 text-sm mt-1">Preparing your financial records</p>
    </div>
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-10 h-10 text-rose-600" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Unable to Load Transactions</h3>
      <p className="text-slate-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all duration-200 font-medium"
      >
        Try Again
      </button>
    </div>
  </div>
);

const TransactionRow: React.FC<{
  transaction: TransactionDetail;
  onViewDetails: (transaction: TransactionDetail) => void;
  isSelected: boolean;
}> = ({ transaction, onViewDetails, isSelected }) => {
  const isPositive = transaction.type === 'income';
  
  return (
    <tr 
      className={`border-b border-slate-200 hover:bg-slate-100 transition-colors duration-150 cursor-pointer ${isSelected ? 'bg-blue-50/70 border-blue-200' : 'bg-white'}`}
      onClick={() => onViewDetails(transaction)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isPositive ? 'bg-emerald-100' : 'bg-rose-100'
          }`}>
            {isPositive ? 
              <ArrowUpRight className="w-4 h-4 text-emerald-600" /> : 
              <ArrowDownLeft className="w-4 h-4 text-rose-600" />
            }
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">{formatDateTime(transaction.time).split(',')[0]}</div>
            <div className="text-xs text-slate-500 capitalize">{formatDateTime(transaction.time).split(',')[1]?.trim()}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-900">{transaction.customer}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-slate-700">{transaction.revenueHead || transaction.branch || 'General'}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-mono text-slate-600">{truncateHash(transaction.transactionHash || '')}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-semibold ${
          isPositive ? 'text-emerald-600' : 'text-rose-600'
        }`}>
          {transaction.amount}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={transaction.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <MoreVertical className="w-4 h-4 text-slate-400 hover:text-slate-800" />
      </td>
    </tr>
  );
};

const DetailItem: React.FC<{ label: string; value: string; icon: React.ElementType; isMono?: boolean }> = ({ label, value, icon: Icon, isMono }) => (
  <div className="flex items-start space-x-3">
    <Icon className="w-5 h-5 text-slate-400 mt-1" />
    <div className="flex-1">
      <label className="text-xs font-medium text-slate-500 uppercase">{label}</label>
      <p className={`text-slate-900 ${isMono ? 'font-mono' : 'font-medium'} break-words`}>{value}</p>
    </div>
  </div>
);

const TransactionDetails: React.FC<{ transaction: TransactionDetail | null }> = ({ transaction }) => {
  if (!transaction) return null; 

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 h-full shadow-md sticky top-4"> {/* Added sticky top-4 for better viewing */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h3 className="text-lg font-semibold text-slate-900">Transaction Summary</h3>
        <StatusBadge status={transaction.status} />
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-slate-900">Amount</span>
            <span className={`text-3xl font-extrabold ${
              transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {transaction.amount}
            </span>
          </div>
          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
            transaction.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            <span className="capitalize">{transaction.type}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 text-sm">
          <DetailItem label="Date & Time" value={formatDateTime(transaction.time)} icon={Calendar} />
          <DetailItem label="Customer/Payer" value={transaction.customer} icon={User} />
          <DetailItem label="Payment Method" value={transaction.method} icon={CreditCard} />
          <DetailItem label="Transaction ID" value={transaction.transactionHash || 'N/A'} icon={Hash} isMono />
          <DetailItem label="Revenue Head" value={transaction.revenueHead || 'General Fund'} icon={Target} />
          <DetailItem label="Branch" value={transaction.branch || 'Head Office'} icon={Building} />
        </div>
        
        {transaction.notes && (
          <div className="pt-4 border-t border-slate-200">
            <label className="text-sm font-medium text-slate-600">Notes/Description</label>
            <p className="mt-1 text-sm text-slate-700">{transaction.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---
export default function TransactionsPage() {
  const [activeType, setActiveType] = useState<TransactionType>('all');
  const [activeStatus, setActiveStatus] = useState<StatusType>('all');
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedRevenueHead, setSelectedRevenueHead] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'customer'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    revenueHeadTotals: {},
    branchTotals: {},
    memberTotals: {}
  });

  // NOTE: Assuming useAccountsData is safely returning [] for lists (or using || [] below)
  const {
    transactions,
    expenditures,
    members,
    branches,
    revenueHeads,
    loading,
    error,
    refetch
  } = useAccountsData();

  // --- ANALYTICS ---
  useEffect(() => {
    if (loading) return;

    const revenueHeadTotals: { [key: string]: number } = {};
    const branchTotals: { [key: string]: number } = {};
    const memberTotals: { [key: string]: number } = {};

    (transactions || []).forEach((tx: any) => {
      const revenueHead = tx.revenueHead?.name || tx.revenueHeadName || 'General Revenue';
      const branch = tx.branch?.name || tx.branchName || 'Unknown Branch';
      const member = tx.payerName || 'Organization/Member';
      const amount = parseFloat(tx.amount || '0');

      revenueHeadTotals[revenueHead] = (revenueHeadTotals[revenueHead] || 0) + amount;
      branchTotals[branch] = (branchTotals[branch] || 0) + amount;
      memberTotals[member] = (memberTotals[member] || 0) + amount;
    });

    setAnalytics({
      revenueHeadTotals,
      branchTotals,
      memberTotals,
    });
  }, [transactions, loading]);

  const stats = useMemo(() => {
    const { start } = getDateRange(dateRange);
    
    const relevantTransactions = (transactions || []).filter((tx: any) => 
      new Date(tx.transactionDate || tx.createdAt) >= start
    );
    const relevantExpenditures = (expenditures || []).filter((exp: any) => 
      new Date(exp.expenseDate || exp.createdAt) >= start
    );

    const totalIncome = relevantTransactions.reduce((sum: number, tx: any) => sum + parseFloat(tx.amount || '0'), 0);
    const totalExpenses = relevantExpenditures.reduce((sum: number, exp: any) => sum + (exp.amount || exp.totalAmount || 0), 0);
    const netBalance = totalIncome - totalExpenses;
    
    const successfulTransactions = relevantTransactions.filter((tx: any) => tx.status === 'completed').length + 
                                 relevantExpenditures.filter((exp: any) => exp.approvalStatus === 'approved').length;
    
    const averageTransaction = relevantTransactions.length > 0 ? totalIncome / relevantTransactions.length : 0;

    const topRevenueHead = Object.entries(analytics.revenueHeadTotals)
      .sort(([,a], [,b]) => b - a)[0] || ['None', 0];

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      successfulTransactions,
      averageTransaction,
      totalTransactions: relevantTransactions.length + relevantExpenditures.length,
      topRevenueHead: {
        name: topRevenueHead[0],
        amount: topRevenueHead[1]
      }
    };
  }, [transactions, expenditures, dateRange, analytics]);

  // --- TRANSACTION DETAIL MAPPING (Customer Name Priority Fixed) ---
  const transactionDetails = useMemo((): TransactionDetail[] => {
    // 1. Build Member Map
    const memberMap = new Map<string, string>();
    (members || []).forEach(member => {
        if (member.id) {
            const fullName = `${member.firstName} ${member.lastName}`;
            memberMap.set(String(member.id), fullName);
        }
    });

    const incomeTransactions = (transactions || []).map((tx: any) => {
      const amount = parseFloat(tx.amount || '0');
      const memberIdKey = tx.memberId ? String(tx.memberId) : undefined;
      
      let customerName = 'General Payer';

      // 1. PRIORITIZE RAW PAYER NAME (Fix for "tina mwale")
      if (tx.payerName) {
          customerName = tx.payerName;
      }
      // 2. Fallback to mapped member ID
      else if (memberIdKey && memberMap.has(memberIdKey)) {
          customerName = memberMap.get(memberIdKey) as string;
      } 
      // 3. Fallback to nested member object
      else if (tx.member?.firstName && tx.member?.lastName) {
          customerName = `${tx.member.firstName} ${tx.member.lastName}`;
      }

      return {
        id: tx.id?.toString() || `tx-${Math.random()}`,
        time: tx.transactionDate || tx.createdAt || new Date().toISOString(),
        customer: customerName, 
        method: tx.paymentMethod?.name || tx.paymentMethodName || 'General Payment',
        amount: `+ ${formatCurrency(amount, tx.currency || 'USD')}`,
        type: 'income' as const,
        status: (tx.status === 'completed' || tx.status === 'success' ? 'success' : 'pending') as 'success' | 'pending' | 'failed',
        transactionHash: tx.rrn || tx.receiptNumber || `TXN-${tx.id}`,
        branch: tx.branch?.name || tx.branchName,
        revenueHead: tx.revenueHead?.name || tx.revenueHeadName,
        notes: tx.notes,
        originalAmount: amount,
        currency: tx.currency || 'USD',
        branchCode: tx.branchCode || tx.branch?.code,
        revenueHeadCode: tx.revenueHeadCode || tx.revenueHead?.code,
        memberId: tx.memberId
      };
    });

    const expenseTransactions = (expenditures || []).map((exp: any) => {
      const amount = exp.amount || exp.totalAmount || 0;
      
      return {
        id: `exp-${exp.id}`,
        time: exp.expenseDate || exp.createdAt || new Date().toISOString(),
        customer: 'Organization/Vendor',
        method: 'Bank Transfer',
        amount: `- ${formatCurrency(amount, exp.currencyCode || 'USD')}`,
        type: 'expense' as const,
        status: (exp.approvalStatus === 'approved' ? 'success' : 'pending') as 'success' | 'pending' | 'failed',
        transactionHash: exp.voucherNumber || `VOUCHER-${exp.id}`,
        branch: exp.branchName || 'Head Office',
        revenueHead: exp.expenditureHead?.name || exp.expenditureHeadName || 'General Expense',
        notes: exp.description,
        originalAmount: amount,
        currency: exp.currencyCode || 'USD',
        branchCode: exp.branchCode,
        revenueHeadCode: exp.expenditureHeadCode
      };
    });

    return [...incomeTransactions, ...expenseTransactions];
  }, [transactions, expenditures, members]);

  // --- FILTER AND SORT LOGIC (All Filters Integrated) ---
  const filteredTransactions = useMemo(() => {
    let filtered = transactionDetails;

    // 1. Filter by DATE RANGE
    if (dateRange !== 'custom') {
      const { start } = getDateRange(dateRange);
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.time);
        return txDate >= start;
      });
    }

    // 2. Filter by TYPE, STATUS
    if (activeType !== 'all') {
      filtered = filtered.filter(tx => tx.type === activeType);
    }

    if (activeStatus !== 'all') {
      filtered = filtered.filter(tx => tx.status === activeStatus);
    }

    // 3. Filter by BRANCH (using Code for lookup)
    if (selectedBranch !== 'all') {
      filtered = filtered.filter(tx => tx.branchCode === selectedBranch);
    }

    // 4. Filter by REVENUE HEAD (using Name for lookup)
    if (selectedRevenueHead !== 'all') {
      filtered = filtered.filter(tx => 
        tx.revenueHead === selectedRevenueHead
      );
    }

    // 5. Filter by SEARCH TERM
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.customer.toLowerCase().includes(term) ||
        tx.transactionHash?.toLowerCase().includes(term) ||
        tx.method.toLowerCase().includes(term) ||
        tx.branch?.toLowerCase().includes(term) ||
        tx.revenueHead?.toLowerCase().includes(term)
      );
    }

    // 6. Sort transactions
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.time).getTime();
          bValue = new Date(b.time).getTime();
          break;
        case 'amount':
          aValue = a.originalAmount || 0;
          bValue = b.originalAmount || 0;
          break;
        case 'customer':
          aValue = a.customer.toLowerCase();
          bValue = b.customer.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [transactionDetails, activeType, activeStatus, dateRange, searchTerm, sortBy, sortOrder, selectedBranch, selectedRevenueHead]);

  // Pagination
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleSort = (column: 'date' | 'amount' | 'customer') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleViewDetails = (transaction: TransactionDetail) => {
    setSelectedTransaction(prev => prev?.id === transaction.id ? null : transaction);
  };
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeType, activeStatus, dateRange, searchTerm, selectedBranch, selectedRevenueHead]);


  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  // Dynamic Grid Layout based on whether a transaction is selected
  const gridLayout = selectedTransaction ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1';
  const tableSpan = selectedTransaction ? 'lg:col-span-2' : 'lg:col-span-full';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Financial Ledger Overview</h1>
              <p className="text-slate-600 mt-1">Real-time comprehensive view of all system transactions.</p>
            </div>
            <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium flex items-center space-x-2 shadow-lg shadow-blue-200/50">
              <FileText className="w-4 h-4" />
              <span>Generate Export Report</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalIncome)}
            subtitle={`Gross income in ${DATE_RANGES.find(r => r.value === dateRange)?.label}`}
            trend={{ value: 12.5, label: "+12.5% YoY" }} 
            icon={<DollarSign />}
            variant="success"
          />
          <StatCard
            title="Total Expenditure"
            value={formatCurrency(stats.totalExpenses)}
            subtitle={`Total expenses in ${DATE_RANGES.find(r => r.value === dateRange)?.label}`}
            trend={{ value: 8.2, label: "+8.2% YoY" }}
            icon={<TrendingDown />}
            variant="destructive"
          />
          <StatCard
            title="Net Operating Balance"
            value={formatCurrency(stats.netBalance)}
            subtitle="Financial Position"
            trend={{ value: stats.netBalance >= 0 ? 4.3 : -4.3, label: stats.netBalance >= 0 ? "+4.3% YoY" : "-4.3% YoY" }}
            icon={<Wallet />}
            variant={stats.netBalance >= 0 ? "success" : "destructive"}
          />
          <StatCard
            title="Avg. Transaction Value"
            value={formatCurrency(stats.averageTransaction)}
            subtitle={`${stats.totalTransactions} Total Records`}
            icon={<BarChart3 />}
            variant="info"
          />
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-sm">
          
          {/* Date Range Filter */}
          <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-slate-100 overflow-x-auto">
            <Calendar className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 flex-shrink-0">
              {DATE_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    dateRange === range.value
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Advanced Dropdown Filters (Branch, Revenue Head) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={selectedRevenueHead}
                onChange={(e) => setSelectedRevenueHead(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="all">All Revenue Heads</option>
                {/* FIX: Added || [] to prevent 'map' on undefined */}
                {[...new Set((revenueHeads || []).map((rh: any) => rh.name || rh.revenueHeadName))].map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="all">All Branches/Offices</option>
                 {/* FIX: Added || [] to prevent 'map' on undefined */}
                {[...new Set((branches || []).map((b: any) => b.code))].map(code => (
                  <option key={code} value={code}>{code} ({((branches || []).find((b:any) => b.code === code)?.name || 'N/A')})</option>
                ))}
              </select>
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            
            {/* Type/Status Buttons */}
            <div className="flex space-x-3 items-center ml-auto">
                <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
                  {TRANSACTION_TYPES.filter(t => t.value !== 'all').map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setActiveType(type.value === activeType ? 'all' : type.value)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeType === type.value
                          ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
                  {STATUS_TYPES.filter(s => s.value !== 'all').map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setActiveStatus(status.value === activeStatus ? 'all' : status.value)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeStatus === status.value
                          ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
            </div>
          </div>
          
          {/* Search Box */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Payer, ID, or Description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm w-full"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table and Details Panel (Dynamic Layout) */}
        <div className={`grid ${gridLayout} gap-6`}>
          {/* Transactions Table */}
          <div className={tableSpan}>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Transaction History</h3>
                    <p className="text-slate-600 text-sm mt-1">
                      Showing **{paginatedTransactions.length} of {filteredTransactions.length}** relevant records.
                    </p>
                  </div>
                  {selectedTransaction && (
                    <button 
                        onClick={() => setSelectedTransaction(null)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Hide Details
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Date/Time</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('customer')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Payer/Customer</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Source/Head
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('amount')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Amount</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paginatedTransactions.length > 0 ? (
                      paginatedTransactions.map((tx) => (
                        <TransactionRow 
                          key={tx.id} 
                          transaction={tx} 
                          onViewDetails={handleViewDetails} 
                          isSelected={tx.id === selectedTransaction?.id}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-lg">
                          No transactions match the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Page **{currentPage} of {totalPages}**
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-slate-300 rounded-lg text-sm py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {ITEMS_PER_PAGE.map(n => <option key={n} value={n}>{n} per page</option>)}
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Panel - Conditionally Rendered */}
          {selectedTransaction && (
            <div className="lg:col-span-1">
              <TransactionDetails transaction={selectedTransaction} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}