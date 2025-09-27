import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Search, Eye, AlertCircle, Loader2 } from "lucide-react";
import {
  getExpenditures,
  getExpenditureHeads,
  getRevenueHeads,
  getTransactions,
} from "@/services/api";
import type { Account, Transaction, Expenditure, RevenueHead, ExpenditureHead } from "@/utils/Types";

// --- Constants ---
const ACCOUNT_TYPES = ["All Accounts", "Income Accounts", "Expense Accounts"] as const;
type AccountType = typeof ACCOUNT_TYPES[number];

// --- Custom Hooks ---
const useAccountsData = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [transactionsRes, revenueHeads, expendituresRes, expenditureHeadsRes] = await Promise.all([
        getTransactions(),
        getRevenueHeads(),
        getExpenditures({ limit: 100, offset: 0 }),
        getExpenditureHeads(),
      ]);

      // Validate responses
      if (!transactionsRes?.transactions || !revenueHeads || !expendituresRes?.expenditures || !expenditureHeadsRes) {
        throw new Error("Invalid API response structure");
      }

      // Merge transactions with revenue head names
      const mergedTransactions = transactionsRes.transactions.map((tx) => {
        const head = revenueHeads.find((h: RevenueHead) => h.code === tx.revenueHeadCode);
        return {
          ...tx,
          revenueHeadName: head?.name || "Unknown",
        };
      });

      // Merge expenditures with expenditure head names
      const mergedExpenditures = expendituresRes.expenditures.map((exp: Expenditure) => {
        const head = expenditureHeadsRes.find((h: ExpenditureHead) => h.code === exp.expenditureHeadCode);
        return {
          ...exp,
          expenditureHeadName: head?.name || "Unknown",
        };
      });

      // Create income accounts from revenue heads
      const incomeAccounts: Account[] = revenueHeads.map((head: RevenueHead) => {
        const accountTransactions = mergedTransactions.filter(
          (tx) => tx.revenueHeadCode === head.code
        );

        const balance = accountTransactions.reduce(
          (sum, tx) => sum + (parseFloat(tx.amount) || 0),
          0
        );

        return {
          id: `income-${head.code}`,
          accountName: head.name,
          balance,
          debitBalance: balance,
          creditBalance: undefined,
          transactions: accountTransactions,
          type: 'income' as const,
        };
      });

      // Create expense accounts from expenditure heads
      const expenseAccounts: Account[] = expenditureHeadsRes.map((head: ExpenditureHead) => {
        const accountExpenditures = mergedExpenditures.filter(
          (exp) => exp.expenditureHeadCode === head.code
        );

        const balance = accountExpenditures.reduce(
          (sum, exp) => sum + (parseFloat(exp.totalAmount ?? exp.amount) || 0),
          0
        );

        return {
          id: `expense-${head.code}`,
          accountName: head.name,
          balance: -balance, // Negative balance for expenses
          debitBalance: undefined,
          creditBalance: balance,
          expenditures: accountExpenditures,
          type: 'expense' as const,
        };
      });

      const allAccounts = [...incomeAccounts, ...expenseAccounts];

      setAccounts(allAccounts);
      setExpenditures(mergedExpenditures);
      setTransactions(mergedTransactions);

    } catch (err) {
      console.error("Error fetching accounts data:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { accounts, expenditures, transactions, loading, error, refetch: fetchData };
};

// --- Helper Functions ---
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

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

const SearchBar: React.FC<{
  searchTerm: string;
  onSearchChange: (value: string) => void;
}> = ({ searchTerm, onSearchChange }) => (
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

const AccountTabs: React.FC<{
  activeTab: AccountType;
  onTabChange: (tab: AccountType) => void;
}> = ({ activeTab, onTabChange }) => (
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
  const { accounts, loading, error, refetch } = useAccountsData();

  // Filter accounts based on active tab and search term
  const filteredAccounts = useMemo(() => {
    let filtered = accounts;

    // Filter by account type
    if (activeTab === "Income Accounts") {
      filtered = filtered.filter(account => account.type === 'income');
    } else if (activeTab === "Expense Accounts") {
      filtered = filtered.filter(account => account.type === 'expense');
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(account =>
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
        {/* Header and Action Button */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Accounts</h1>
         
        </header>

        <AccountTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Accounts Table */}
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
                  <tr
                    key={account.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
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
                        onClick={() => console.log(`Viewing details for ${account.accountName}`)}
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

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Total Accounts</div>
            <div className="text-2xl font-bold">{filteredAccounts.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Total Balance</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(filteredAccounts.reduce((sum, acc) => sum + acc.balance, 0))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Active Tab</div>
            <div className="text-2xl font-bold text-blue-600">{activeTab}</div>
          </div>
        </div>
      </div>
    </div>
  );
}