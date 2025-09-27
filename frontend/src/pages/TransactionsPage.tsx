import React, { useEffect, useState } from "react";
import { Plus, Search, Eye } from "lucide-react";
import {
  getExpenditures,
  getRevenueHeads,
  getTransactionById,
  getTransactions,
} from "@/services/api";

import type { Account, Transaction } from "@/utils/Types";

const accountsData = [
  {
    name: "Tithes",
    debit: 5000.0,
    credit: 12000.0,
    balance: 7000.0,
    branch: "Main Branch",
  },
  {
    name: "Pledges",
    debit: 2000.0,
    credit: 8000.0,
    balance: 6000.0,
    branch: "Main Branch",
  },
  {
    name: "Donations",
    debit: 1500.0,
    credit: 5500.0,
    balance: 4000.0,
    branch: "Main Branch",
  },
  {
    name: "Love & Offerings",
    debit: 800.0,
    credit: 3200.0,
    balance: 2400.0,
    branch: "Main Branch",
  },
  {
    name: "Expenses",
    debit: 3000.0,
    credit: 500.0,
    balance: -2500.0,
    branch: "Main Branch",
  },
];

const ACCOUNT_TYPES = ["All Accounts", "Income Accounts", "Expense Accounts"];

// --- Helper Functions ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

// --- Main Component ---
export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState("All Accounts");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const transactionsRes = await getTransactions(); // your merged transactions
        const revenueHeads = await getRevenueHeads();

        // Merge transactions with revenue head names
        const mergedTransactions = transactionsRes.transactions.map((tx) => {
          const head = revenueHeads.find((h) => h.code === tx.revenueHeadCode);
          return {
            ...tx,
            revenueHeadName: head ? head.name : "Unknown",
          };
        });

        // Generate accounts dynamically from revenue heads
        const accountsWithTransactions: Account[] = revenueHeads.map((head) => {
          const accountTransactions = mergedTransactions.filter(
            (tx) => tx.revenueHeadCode === head.code
          );

          // Calculate balance if needed, here just sum amounts
          const balance = accountTransactions.reduce(
            (sum, tx) => sum + parseFloat(tx.amount),
            0
          );

          return {
            accountName: head.name,
            balance: balance.toString(),
            debitBalance: undefined,
            creditBalance: undefined,
            transactions: accountTransactions,
          };
        });

        setAccounts(accountsWithTransactions);
        setFilteredAccounts(mergedTransactions);

        console.log("Accounts with transactions:", accountsWithTransactions);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  const getBalanceClass = (balance) => {
    if (balance > 0) return "text-green-600 font-semibold";
    if (balance < 0) return "text-red-600 font-semibold";
    return "text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header and Action Button */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Accounts</h1>
          <button
            onClick={() => console.log("New Account action")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Account
          </button>
        </header>

        {/* Account Type Tabs */}
        <div className="flex space-x-4 border-b border-gray-200 mb-6">
          {ACCOUNT_TYPES.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search accounts by name or branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                  Branch
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accountsData.map((account, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {account.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-red-500 mr-3">
                      Debit: {formatCurrency(account.debit)}
                    </span>
                    <span className="text-green-600">
                      Credit: {formatCurrency(account.credit)}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${getBalanceClass(
                      account.balance
                    )}`}
                  >
                    {formatCurrency(account.balance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.branch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() =>
                        console.log(`Viewing details for ${account.name}`)
                      }
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
        </div>
      </div>
    </div>
  );
}
