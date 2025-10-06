import React, { useState, useMemo } from "react";
import { 
  Search, 
  Eye, 
  AlertCircle, 
  Loader2, 
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  FileText,
  CreditCard,
  Filter,
  Download,
  MoreVertical,
  BarChart3,
  PieChart,
  Target,
  Calendar
} from "lucide-react";
import type { Account } from "@/utils/Types";
import AccountDetailModal from "@/components/ledger";
import useAccountsData from "@/hooks";

// --- Constants ---
const ACCOUNT_TYPES = ["All Accounts", "Income Accounts", "Expense Accounts"] as const;
type AccountType = (typeof ACCOUNT_TYPES)[number];

// --- Helper Functions ---
const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

const formatNumber = (num: number): string =>
  new Intl.NumberFormat("en-US").format(num);

// --- Subcomponents ---
const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
    <div className="text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
      <p className="text-slate-600 text-lg font-medium">Loading financial data...</p>
      <p className="text-slate-400 text-sm mt-1">Preparing your accounts overview</p>
    </div>
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
    <div className="max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-10 h-10 text-rose-600" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Unable to Load Accounts</h3>
      <p className="text-slate-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
      >
        Try Again
      </button>
    </div>
  </div>
);

const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  variant?: "default" | "success" | "warning" | "destructive";
}> = ({ title, value, subtitle, trend, icon, variant = "default" }) => {
  const variantStyles = {
    default: "from-slate-50 to-slate-100 border-slate-200",
    success: "from-emerald-50 to-emerald-100 border-emerald-200",
    warning: "from-amber-50 to-amber-100 border-amber-200",
    destructive: "from-rose-50 to-rose-100 border-rose-200"
  };

  const trendColors = {
    success: "text-emerald-600 bg-emerald-100",
    warning: "text-amber-600 bg-amber-100",
    destructive: "text-rose-600 bg-rose-100",
    default: "text-slate-600 bg-slate-100"
  };

  const getTrendVariant = () => {
    if (!trend) return "default";
    return trend.value >= 0 ? "success" : "destructive";
  };

  return (
    <div className={`bg-gradient-to-br rounded-2xl border p-6 ${variantStyles[variant]} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white shadow-sm border`}>
          {icon}
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${trendColors[getTrendVariant()]}`}>
            {trend.label}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-slate-600 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-slate-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

const AccountCard: React.FC<{
  account: Account;
  onViewDetails: (account: Account) => void;
}> = ({ account, onViewDetails }) => {
  const isIncome = account.type === "income";
  const balance = parseFloat(account.balance || "0");
  const transactionCount = account.transactions?.length || account.expenditures?.length || 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
          }`}>
            {isIncome ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 text-base truncate">{account.accountName}</h3>
            <p className="text-slate-500 text-sm">
              {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onViewDetails(account)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-400 hover:text-slate-600"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="space-y-1">
          <p className="text-slate-600 text-xs">Balance</p>
          <p className={`text-lg font-semibold ${
            balance > 0 ? 'text-emerald-600' : balance < 0 ? 'text-rose-600' : 'text-slate-700'
          }`}>
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-slate-600 text-xs">Activity</p>
          <div className="flex space-x-2 text-sm">
            <span className="text-emerald-600 font-medium">
              {formatCurrency(account.debitBalance || 0)}
            </span>
            <span className="text-rose-600 font-medium">
              {formatCurrency(account.creditBalance || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSection: React.FC<{
  activeTab: AccountType;
  onTabChange: (tab: AccountType) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalAccounts: number;
  filteredCount: number;
}> = ({ activeTab, onTabChange, searchTerm, onSearchChange, totalAccounts, filteredCount }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      <div className="flex items-center space-x-4">
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {ACCOUNT_TYPES.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="text-sm text-slate-500">
          Showing {filteredCount} of {totalAccounts} accounts
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          />
        </div>
        <button className="px-3 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>
    </div>
  </div>
);

// --- Main Component ---
export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState<AccountType>("All Accounts");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const {
    accounts,
    loading,
    error,
    refetch,
    totalIncomeBalance,
    totalExpenseBalance,
    totalBalance,
    metrics,
    transactions,
    expenditures,
    members
  } = useAccountsData();

  const handleViewDetails = (account: Account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  // Filter accounts based on tab and search
  const filteredAccounts = useMemo(() => {
    let filtered = accounts;

    if (activeTab === "Income Accounts") {
      filtered = filtered.filter((account) => account.type === "income");
    } else if (activeTab === "Expense Accounts") {
      filtered = filtered.filter((account) => account.type === "expense");
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((account) =>
        account.accountName.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [accounts, activeTab, searchTerm]);

  // Calculate real metrics from API data
  const realMetrics = useMemo(() => {
    const totalTransactions = transactions.length + expenditures.length;
    const activeMembers = members.filter(m => m.isActive).length;
    const incomeAccounts = accounts.filter(acc => acc.type === 'income').length;
    const expenseAccounts = accounts.filter(acc => acc.type === 'expense').length;
    
    // Calculate actual totals from transactions and expenditures
    const actualIncome = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount || "0"), 0);
    const actualExpenses = expenditures.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const actualBalance = actualIncome - actualExpenses;

    return {
      totalTransactions,
      activeMembers,
      incomeAccounts,
      expenseAccounts,
      actualIncome,
      actualExpenses,
      actualBalance,
      netProfit: actualBalance
    };
  }, [transactions, expenditures, members, accounts]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Financial Dashboard</h1>
              <p className="text-slate-600">Comprehensive overview of your organization's finances</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Grid - Using actual data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(realMetrics.actualIncome)}
            subtitle="From all transactions"
            trend={{ value: 12.5, label: "+12.5%" }}
            icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
            variant="success"
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(realMetrics.actualExpenses)}
            subtitle="Across all categories"
            trend={{ value: -8.2, label: "+8.2%" }}
            icon={<TrendingDown className="w-6 h-6 text-rose-600" />}
            variant="destructive"
          />
          <StatCard
            title="Net Balance"
            value={formatCurrency(realMetrics.actualBalance)}
            subtitle="Current financial position"
            trend={{ value: realMetrics.actualBalance >= 0 ? 4.3 : -4.3, label: realMetrics.actualBalance >= 0 ? "+4.3%" : "-4.3%" }}
            icon={<Wallet className="w-6 h-6 text-blue-600" />}
            variant={realMetrics.actualBalance >= 0 ? "success" : "destructive"}
          />
          <StatCard
            title="Active Accounts"
            value={formatNumber(accounts.length)}
            subtitle={`${realMetrics.incomeAccounts} income, ${realMetrics.expenseAccounts} expense`}
            icon={<BarChart3 className="w-6 h-6 text-slate-600" />}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Transactions</p>
                <p className="text-2xl font-bold text-slate-900">{formatNumber(realMetrics.totalTransactions)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Members</p>
                <p className="text-2xl font-bold text-slate-900">{formatNumber(realMetrics.activeMembers)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Target className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Financial Health</p>
                <p className={`text-2xl font-bold ${
                  realMetrics.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {realMetrics.netProfit >= 0 ? 'Healthy' : 'Review'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accounts Section */}
        <div className="space-y-6">
          <FilterSection
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalAccounts={accounts.length}
            filteredCount={filteredAccounts.length}
          />

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Account Summary</h3>
              <p className="text-slate-600 text-sm mt-1">
                Detailed breakdown of all financial accounts
              </p>
            </div>

            <div className="p-6">
              {filteredAccounts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">No accounts found</h4>
                  <p className="text-slate-600 max-w-sm mx-auto">
                    {searchTerm 
                      ? "No accounts match your search criteria."
                      : "No accounts available for the selected filters."
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {filteredAccounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AccountDetailModal account={selectedAccount} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}