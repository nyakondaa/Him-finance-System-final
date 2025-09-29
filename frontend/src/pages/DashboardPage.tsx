import React, { useState, useEffect, useMemo } from "react";
import { getProjects, getTransactions } from "@/services/api"; // Adjust the import path as necessary
import {
  Search,
  Bell,
  ArrowUpRight,
  Menu,
  Wallet,
  Landmark,
  ChevronDown,
  Plus,
  TrendingUp,
  TrendingDown,
  Settings2,
} from "lucide-react";

// --- MOCK TYPE DEFINITION (Replaces '@/utils/Types' for self-containment) ---
// This defines the expected structure of a transaction item.
// Your actual Transaction type should be more precise.
/**
 * @typedef {Object} Transaction
 * @property {string} date - Date and time of the transaction.
 * @property {number} amount - Amount of the transaction (negative for expense, positive for income).
 * @property {string} name - Name of the payment recipient/source.
 * @property {string} method - Payment method used.
 * @property {string} category - Category of the transaction.
 * @property {string} color - Color code for visual representation.
 */

// --- MOCK API FUNCTION (Replaces '@/services/api' for self-containment) ---
// Simulates the async API call to fetch transactions
const getTransactionsData = async ({ limit, offset }) => {
  const response = await getTransactions({ limit, offset });

  const transactionsData = response.transactions;

  const sliced = transactionsData.slice(offset, offset + limit);
  console.log("Mock API - Fetched transactions:", sliced);

  return { data: { transactions: sliced } };
};


interface ProjectData{
  id: number;
  name: string;
  currentAmount: number;
  targetAmount: number;
  status: string;  
}

// services/api.js
export const getProjectsData = async (): Promise<ProjectData[]> => {
  try {
    console.log("🔄 API: Fetching projects...");
    
    const response = await getProjects();
    console.log("📦 API: Raw response:", response);
    
    // Map the API response to match ProjectData interface
    const mappedProjects = response.map((project: any) => ({
      id: project.id,
      name: project.name,
      currentAmount: project.totalCollected || 0, // Use totalCollected from your backend
      targetAmount: parseFloat(project.targetAmount) || 0,
      status: project.status,
    
    }));
    
    console.log("🗺️ API: Mapped projects:", mappedProjects);
    return mappedProjects;
    
  } catch (error) {
    console.error('❌ API: Error fetching projects:', error);
    throw error;
  }
};

// --- MOCK DATA STRUCTURE (Now defined without transactions) ---
const MOCK_DATA_STATIC = {
  // 1. Summary Cards Data
  summary: [
    {
      title: "Total Balance",
      value: 15700.0,
      change: 12.1,
      isPositive: true,
      icon: Wallet,
    },
    {
      title: "Income",
      value: 8500.0,
      change: 6.3,
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Expense",
      value: 6222.0,
      change: 2.4,
      isPositive: false,
      icon: TrendingDown,
    },
    {
      title: "Total Savings",
      value: 32913.0,
      change: 12.1,
      isPositive: true,
      icon: Landmark,
    },
  ],
  // 3. Money Flow Chart Data
  moneyFlow: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    income: [4000, 3500, 8500, 4500, 6000, 5200, 8500],
    expense: [2500, 2000, 6222, 3000, 3500, 2800, 6222],
  },
  // 4. Budget Data
  budget: [
    { category: "Cafe & Restaurants", amount: 1500, color: "#6366F1" },
    { category: "Entertainment", amount: 800, color: "#34D399" },
    { category: "Investments", amount: 1200, color: "#F97316" },
    { category: "Food & Groceries", amount: 1000, color: "#F59E0B" },
    { category: "Health & Beauty", amount: 700, color: "#EC4899" },
    { category: "Traveling", amount: 300, color: "#10B981" },
  ],
  // 5. Saving Goals Data
  savingsGoals: [
    { name: "Macbook Pro", current: 1650, goal: 2500, color: "#3B82F6" },
    { name: "New car", current: 5000, goal: 60000, color: "#8B5CF6" },
    { name: "New house", current: 150, goal: 150000, color: "#EC4899" },
  ],
};

/**
 * Custom hook to manage all dashboard data fetching and state.
 */
const useDashboardData = () => {
  // Initialize data state with static mock data and an empty array for transactions
  const [data, setData] = useState({ ...MOCK_DATA_STATIC, transactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTransactionsData({ limit: 5, offset: 0 });
        console.log("Fetched transactions:", response);

        
        console.log("Fetched projects:", getProjectsData());

        // 2. Set the data state, merging the static mock data with the fetched transactions.
        setData((prevData) => ({
          ...prevData,
          transactions: response.data.transactions || [],
        }));

        console.log(
          "Transactions successfully fetched and merged into dashboard data."
        );
      } catch (error) {
        // Log the error but still render the dashboard with the static mock data
        console.error("Error fetching transactions:", error);
      } finally {
        // Indicate loading is complete regardless of whether transactions succeeded
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures it runs once on mount

  return { data, loading };
};

// --- HELPER COMPONENTS (No changes needed here, they automatically use the transactions property from data) ---

/**
 * Card for displaying summary statistics (Balance, Income, Expense, Savings).
 */
const StatCard = ({ title, value, change, isPositive, Icon }) => {
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

  const changeClass = isPositive
    ? "text-green-500 bg-green-500/10"
    : "text-red-500 bg-red-500/10";
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <ArrowUpRight className="w-5 h-5 text-gray-400" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {formattedValue.slice(0, -3)}
        <span className="text-xl font-normal text-gray-600">
          {formattedValue.slice(-3)}
        </span>
      </div>
      <div className="flex items-center text-sm">
        <div
          className={`flex items-center px-2 py-0.5 rounded-full mr-2 ${changeClass}`}
        >
          <ChangeIcon className="w-3 h-3 mr-1" />
          <span>{change}%</span>
        </div>
        <span className="text-gray-500">vs last month</span>
      </div>
    </div>
  );
};

/**
 * Placeholder for the Money Flow Bar/Line Chart.
 * In a real app, this would be a library like Recharts or Victory.
 */
const MoneyFlowChartPlaceholder = ({ data }) => {
  if (!data) return null;

  const maxVal = Math.max(...data.income, ...data.expense);
  const scale = (val) => (val / maxVal) * 100;

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Money flow</h2>
        <div className="flex space-x-4 text-sm font-medium">
          <span className="flex items-center text-indigo-600">
            <span className="w-2 h-2 rounded-full bg-indigo-600 mr-1"></span>{" "}
            Income
          </span>
          <span className="flex items-center text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>{" "}
            Expense
          </span>
          <button className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
            All accounts <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          <button className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
            This year <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="flex-grow flex items-end relative pt-4">
        {/* Placeholder for the $10,000 reference line/label */}
        <div className="absolute top-1/4 left-0 right-0 border-t border-dashed border-gray-300"></div>
        <div className="absolute top-[calc(25%-10px)] left-[18%] px-2 py-1 bg-gray-800 text-white text-xs rounded-lg shadow-md">
          $10,000
        </div>

        {data.labels.map((label, index) => {
          const incomeHeight = scale(data.income[index]);
          const expenseHeight = scale(data.expense[index]);

          return (
            <div key={label} className="flex flex-col items-center w-1/7">
              {/* Stacked Bars - Simplified for visual representation */}
              <div className="flex flex-col justify-end w-4 h-40 relative">
                <div
                  className="w-4 bg-red-400 absolute bottom-0 rounded-t-sm transition-all duration-500"
                  style={{ height: `${expenseHeight * 0.4}px`, zIndex: 1 }}
                ></div>
                <div
                  className="w-4 bg-indigo-400 absolute bottom-0 rounded-t-sm transition-all duration-500"
                  style={{ height: `${incomeHeight * 0.4}px`, zIndex: 2 }}
                ></div>
              </div>
              <span className="mt-2 text-sm text-gray-500">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Placeholder for the Budget Doughnut Chart.
 */
const BudgetChartPlaceholder = ({ data }) => {
  const totalBudgeted = data.reduce((acc, item) => acc + item.amount, 0);
  const totalValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalBudgeted);

  const getDoughnutStyles = () => {
    let totalPercent = 0;
    let style = "";

    data.forEach((item, index) => {
      const percentage = (item.amount / totalBudgeted) * 100;
      style += `${item.color} ${totalPercent}%, ${item.color} ${
        totalPercent + percentage
      }%, `;
      totalPercent += percentage;
    });

    // Fallback for visual effect, using conic-gradient
    return {
      backgroundImage: `conic-gradient(${style.slice(0, -2)})`,
    };
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Budget</h2>
        <ArrowUpRight className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex items-center space-x-6">
        {/* Chart Area */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={getDoughnutStyles()}
          ></div>
          {/* Inner white circle to create the "doughnut" effect */}
          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center border-4 border-gray-50 shadow-inner">
            <div className="text-center">
              <p className="text-sm text-gray-500 leading-none">
                Total for month
              </p>
              <p className="text-lg font-bold text-gray-900 leading-none mt-0.5">
                {totalValue.replace("$", "")}
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-grow space-y-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center text-gray-700 truncate">
                <span
                  className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></span>
                {item.category}
              </span>
              <span className="font-semibold text-gray-800">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(item.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Table for displaying recent transactions.
 */
const TransactionsTable = ({ transactions }) => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent transactions
        </h2>
        <div className="flex space-x-3 text-sm font-medium">
          <button className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
            All accounts <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            See all
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              {["DATE", "AMOUNT", "PAYMENT NAME", "METHOD", "Branch"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-8 text-center text-gray-500 italic"
                >
                  No recent transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((t, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {t.transactionDate
                      ? new Date(t.transactionDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                      t.amount < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      signDisplay: "always",
                      minimumFractionDigits: 0,
                    }).format(t.amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span
                        className="w-5 h-5 rounded-full mr-2"
                        style={{ backgroundColor: t.color }}
                      ></span>
                      {t.revenueHead ? t.revenueHead.name : "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {t.paymentMethod ? t.paymentMethod.name : "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {t.branch ? t.branch.name : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Progress bar component for savings goals.
 */
const ProgressBar = ({ current, goal, color }) => {
  const percent = Math.min(100, (current / goal) * 100);
  const formattedGoal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(goal);

  return (
    <div className="py-2">
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="text-gray-900 font-medium">{formattedGoal}</span>
        <span className="text-gray-500">{percent.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
};

/**
 * Main Dashboard Component
 */
const App = () => {
  const { data, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-xl font-semibold text-indigo-600">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-xl font-semibold text-red-600">
          Failed to load data. Please check API configuration.
        </div>
      </div>
    );
  }

  // Destructure data for cleaner usage
  const { summary, transactions, moneyFlow, budget, savingsGoals } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      {/* HEADER / NAVIGATION */}
      <header className="bg-white rounded-xl shadow-md p-4 mb-6 flex justify-between items-center sticky top-0 z-10">
        <div className="text-2xl font-bold text-gray-900">FinTrack</div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="flex items-center space-x-2 border-l pl-4">
            <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-800 font-bold text-sm">
              AL
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                Adaline Lively
              </p>
              <p className="text-xs text-gray-500">adalivelively@gmail.com</p>
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT GRID */}
      <main className="grid grid-cols-12 gap-6">
        {/* TOP CONTROLS (This month & Manage widgets) */}
        <div className="col-span-12 flex justify-between items-center mb-2">
          <button className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            <Menu className="w-4 h-4 mr-2" /> This month
          </button>
          <button className="flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-800 transition">
            <Settings2 className="w-4 h-4 mr-1.5" /> Manage widgets
          </button>
        </div>

        {/* STATS CARDS ROW */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {summary.map((item, index) => (
            <StatCard key={index} {...item} />
          ))}
        </div>

        {/* MONEY FLOW & BUDGET ROW (MAIN CONTENT) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col bg-white rounded-xl shadow-lg min-h-[400px]">
          <MoneyFlowChartPlaceholder data={moneyFlow} />
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col bg-white rounded-xl shadow-lg">
          <BudgetChartPlaceholder data={budget} />
        </div>

        {/* TRANSACTIONS & SAVING GOALS ROW */}
        <div className="col-span-12 lg:col-span-8 flex flex-col bg-white rounded-xl shadow-lg">
          <TransactionsTable transactions={transactions} />
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              PROJECT GOALS
            </h2>
            <ArrowUpRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {savingsGoals.map((goal, index) => (
              <div key={index} className="flex flex-col">
                <p className="text-md font-medium text-gray-800 mb-1">
                  {goal.name}
                </p>
                <ProgressBar
                  current={goal.current}
                  goal={goal.goal}
                  color={goal.color}
                />
              </div>
            ))}
          </div>
          <button className="mt-4 w-full flex items-center justify-center text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4 mr-1" /> Add New Goal
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
