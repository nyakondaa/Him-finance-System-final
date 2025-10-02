// Dashboard.tsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getProjects, getTransactions } from "@/services/api";
import useAccountsData from "@/hooks";
import useAuth from "@/hooks/useAuth";
import { RefreshCw, DollarSign, ArrowUp, ArrowDown, Users } from "lucide-react";
import { format } from "date-fns";

// ----------------------
// Chart.js Setup
// ----------------------
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend, Filler } from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

// ----------------------
// Types
// ----------------------
interface Project {
  id: number;
  name: string;
  totalCollected: number;
  targetAmount: number;
  status: string;
}

interface Transaction {
  id: number;
  transactionDate: string;
  amount: number;
  revenueHead?: { name: string };
  paymentMethod?: { name: string };
  branch?: { name: string };
  type: "income" | "expense";
}

interface Member {
  id: number;
  username: string;
  createdAt: string;
}

// ----------------------
// Components
// ----------------------
const KpiCard = React.memo(
  ({ title, value, icon: Icon, colorClass }: { title: string; value: string | number; icon: React.ElementType; colorClass: string }) => (
    <div className="bg-gray-800 rounded-2xl shadow hover:shadow-lg p-6 transition flex flex-col">
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <h2 className="text-white text-2xl font-bold truncate">{value}</h2>
    </div>
  )
);

const LoadingOverlay = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
  </div>
);

// ----------------------
// Dashboard Component
// ----------------------
const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { totalIncomeBalance, totalExpenseBalance, members, loading: accountsLoading, refetch: refetchAccounts } = useAccountsData();

  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 12)),
    end: new Date(),
  });

  // ----------------------
  // Fetch Data
  // ----------------------
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [projRes, transRes] = await Promise.all([getProjects(), getTransactions({ limit: 500, offset: 0 })]);
      setProjects(projRes);
      setTransactions(transRes.transactions || []);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ----------------------
  // Filter Transactions
  // ----------------------
  const normalizedQuery = searchQuery.toLowerCase();
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.transactionDate);
      const inRange = tDate >= dateRange.start && tDate <= dateRange.end;
      if (!inRange) return false;
      if (!normalizedQuery) return true;
      return (
        t.revenueHead?.name.toLowerCase().includes(normalizedQuery) ||
        t.branch?.name.toLowerCase().includes(normalizedQuery) ||
        t.paymentMethod?.name.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [transactions, normalizedQuery, dateRange]);

  // ----------------------
  // Chart Data
  // ----------------------
  const revenueTrendData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) =>
      format(new Date(new Date().setMonth(new Date().getMonth() - (11 - i))), "MMM")
    );
    const values = months.map((month) =>
      filteredTransactions
        .filter((t) => format(new Date(t.transactionDate), "MMM") === month && t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0)
    );
    return {
      labels: months,
      datasets: [
        {
          label: "Revenue",
          data: values,
          backgroundColor: "#3B82F6",
          borderColor: "#3B82F6",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [filteredTransactions]);

  const expenseBreakdownData = useMemo(() => {
    const categories: Record<string, number> = {};
    for (const t of filteredTransactions) {
      if (t.type === "expense") {
        const cat = t.revenueHead?.name || "Other";
        categories[cat] = (categories[cat] || 0) + t.amount;
      }
    }
    return {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: ["#3B82F6", "#60A5FA", "#2563EB", "#1D4ED8", "#93C5FD"],
        },
      ],
    };
  }, [filteredTransactions]);

  const memberGrowthData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) =>
      format(new Date(new Date().setMonth(new Date().getMonth() - (11 - i))), "MMM")
    );
    const dataPoints = months.map((month) =>
      members.filter((m) => format(new Date(m.createdAt), "MMM") === month).length
    );
    return {
      labels: months,
      datasets: [
        {
          label: "New Members",
          data: dataPoints,
          backgroundColor: "#3B82F6",
          borderColor: "#3B82F6",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [members]);

  const projectProgress = useMemo(
    () =>
      projects.map((p) => ({
        ...p,
        progress: p.targetAmount > 0 ? (p.totalCollected / p.targetAmount) * 100 : 0,
      })),
    [projects]
  );

  const overallLoading = loading || accountsLoading;

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      {overallLoading && <LoadingOverlay />}

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Executive Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, <strong>{currentUser?.username || "User"}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-3 pr-3 py-2 rounded-xl border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              fetchData();
              refetchAccounts();
            }}
            className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition"
          >
            <RefreshCw className="w-5 h-5 mr-1" /> Refresh
          </button>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <KpiCard title="Total Revenue" value={`$${totalIncomeBalance}`} icon={DollarSign} colorClass="bg-blue-600" />
        <KpiCard title="Total Income" value={`$${totalIncomeBalance}`} icon={ArrowUp} colorClass="bg-green-500" />
        <KpiCard title="Total Expenses" value={`$${totalExpenseBalance}`} icon={ArrowDown} colorClass="bg-red-500" />
        <KpiCard title="Members" value={members.length} icon={Users} colorClass="bg-purple-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-gray-800 rounded-2xl p-6 shadow">
          <h2 className="font-semibold mb-4">Monthly Revenue Trend</h2>
          <Line
            data={revenueTrendData}
            options={{
              responsive: true,
              plugins: { legend: { labels: { color: "white" } } },
              scales: { x: { ticks: { color: "white" } }, y: { ticks: { color: "white" } } },
            }}
          />
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 shadow">
          <h2 className="font-semibold mb-4">Expense Breakdown</h2>
          <Pie
            data={expenseBreakdownData}
            options={{ plugins: { legend: { labels: { color: "white" } } } }}
          />
        </div>
      </div>

      {/* Projects */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow mb-6">
        <h2 className="font-semibold mb-4">Project Progress</h2>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {projectProgress.map((p) => (
            <div key={p.id}>
              <div className="flex justify-between mb-1">
                <span>{p.name}</span>
                <span>{Math.min(p.progress, 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-700 h-2.5 rounded-full">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${Math.min(p.progress, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Growth */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow mb-6">
        <h2 className="font-semibold mb-4">Member Growth (Last 12 Months)</h2>
        <Line
          data={memberGrowthData}
          options={{
            responsive: true,
            plugins: { legend: { labels: { color: "white" } } },
            scales: { x: { ticks: { color: "white" } }, y: { ticks: { color: "white" } } },
          }}
        />
      </div>

      {/* Latest Transactions */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow overflow-x-auto">
        <h2 className="font-semibold mb-4">Latest Transactions</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-3 text-gray-400">Date</th>
              <th className="p-3 text-gray-400">Amount</th>
              <th className="p-3 text-gray-400">Revenue Head</th>
              <th className="p-3 text-gray-400">Payment Method</th>
              <th className="p-3 text-gray-400">Branch</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.slice(0, 10).map((t) => (
                <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-3">{format(new Date(t.transactionDate), "dd/MM/yyyy")}</td>
                  <td className="p-3">${Number(t.amount).toFixed(2)}</td>
                  <td className="p-3">{t.revenueHead?.name || "N/A"}</td>
                  <td className="p-3">{t.paymentMethod?.name || "N/A"}</td>
                  <td className="p-3">{t.branch?.name || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
