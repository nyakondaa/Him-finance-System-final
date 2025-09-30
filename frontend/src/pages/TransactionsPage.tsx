import React, { useState, useMemo } from "react";
import { Plus, Search, Eye, AlertCircle, Loader2, ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
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

const getBalanceClass = (balance: number): string => {
  if (balance > 0) return "text-green-600 font-semibold";
  if (balance < 0) return "text-red-600 font-semibold";
  return "text-gray-700";
};

// --- Subcomponents ---
const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
    <span className="text-lg text-gray-600">Loading accounts...</span>
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Accounts</h3>
    <p className="text-red-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const SearchBar: React.FC<{ searchTerm: string; onSearchChange: (value: string) => void }> = ({
  searchTerm,
  onSearchChange,
}) => (
  <div className="mb-6">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search accounts by name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
      />
    </div>
  </div>
);

const AccountTabs: React.FC<{ activeTab: AccountType; onTabChange: (tab: AccountType) => void }> = ({
  activeTab,
  onTabChange,
}) => (
  <div className="flex space-x-4 border-b border-gray-200 mb-6">
    {ACCOUNT_TYPES.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`pb-2 px-1 text-base font-medium transition duration-150 ease-in-out 
          ${
            activeTab === tab
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

// --- Main Component ---
export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState<AccountType>("All Accounts");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    accounts,
    loading,
    error,
    refetch,
    totalIncomeBalance,
    totalExpenseBalance,
    totalBalance,
  } = useAccountsData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleViewDetails = (account: Account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  // ✅ Filter accounts based on tab and search
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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Accounts Overview</h1>
        </header>

        {/* ✅ Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <ArrowUpCircle className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Income</div>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(totalIncomeBalance)}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-full">
              <ArrowDownCircle className="text-red-600 w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Expenses</div>
              <div className="text-2xl font-bold text-red-700">
                {formatCurrency(totalExpenseBalance)}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Wallet className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Net Balance</div>
              <div
                className={`text-2xl font-bold ${
                  totalBalance >= 0 ? "text-blue-700" : "text-red-600"
                }`}
              >
                {formatCurrency(totalBalance)}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Search */}
        <AccountTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* ✅ Accounts Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          {filteredAccounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? "No accounts match your search." : "No accounts found."}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Account Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Transactions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Account Balance
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {account.accountName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-red-500 mr-3">
                        Credit: {formatCurrency(account.creditBalance || 0)}
                      </span>
                      <span className="text-green-600">
                        Debit: {formatCurrency(account.debitBalance || 0)}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${getBalanceClass(
                        account.balance
                      )}`}
                    >
                      {formatCurrency(account.balance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(account)}
                        className="text-blue-600 hover:text-blue-800 flex items-center justify-center transition duration-150"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        <AccountDetailModal account={selectedAccount} isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  );
}
