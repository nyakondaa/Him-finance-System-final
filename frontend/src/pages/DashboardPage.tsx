import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  CreditCard,
  Download,
  Search,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  BarChart3,
  ListChecks, // New icon for goals
} from "lucide-react";
// Assuming the path to your hook is correctly resolved
import useAccountsData from "@/hooks";

// --- Charting Imports ---
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Define necessary types
interface Transaction {
  id: string;
  amount: string;
  status: string; // "completed", "pending", "failed"
  payerName: string;
  receiptNumber?: string;
  rrn?: string;
  transactionDate: string;
  createdAt: string;
  branch?: { branchName?: string };
  memberId?: string | number;
  revenueHead?: { name?: string };
  project?: { title?: string };
  paymentMethod: { name: string };
  branchCode?: string;
  revenueHeadCode?: string;
}

interface Expenditure {
  id: string;
  amount: number;
  totalAmount: number;
  expenditureHeadCode: string;
  expenditureHead?: { name?: string; code?: string };
}

interface Project {
  id: number;
  title: string;
  targetAmount: number;
  description: string;
}

// --- Helper Functions (No Change) ---
const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);

const formatCompactCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    minimumFractionDigits: 0,
  }).format(amount);

const formatNumber = (num: number): string =>
  new Intl.NumberFormat("en-US").format(num);

// --- Subcomponents (Copied for completeness) ---

const MetricCard: React.FC<any> = ({
  title,
  value,
  change,
  changePercent,
  trend,
  icon,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
      <div
        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
          trend === "up"
            ? "text-emerald-600 bg-emerald-50"
            : "text-rose-600 bg-rose-50"
        }`}
      >
        {trend === "up" ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        <span>{changePercent}</span>
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-slate-600 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-slate-500 text-sm">{change}</p>
    </div>
  </div>
);

const SummaryCard: React.FC<any> = ({ title, value, change, icon }) => (
  <div className="bg-white rounded-lg border border-slate-200 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
        <p className="text-emerald-600 text-xs font-medium">{change}</p>
      </div>
      <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
    </div>
  </div>
);

const TransactionRow: React.FC<any> = ({ transaction }) => {
  const isPositive = transaction.type === "income";

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150">
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isPositive ? "bg-emerald-100" : "bg-rose-100"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            ) : (
              <ArrowDownLeft className="w-4 h-4 text-rose-600" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">
              {transaction.customer}
            </div>
            <div className="text-xs text-slate-500">{transaction.time}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-700">{transaction.method}</span>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm font-mono text-slate-600">
          {transaction.transactionHash}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div
          className={`text-sm font-semibold ${
            isPositive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {transaction.amount}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div
          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            transaction.status === "success"
              ? "bg-emerald-50 text-emerald-700"
              : transaction.status === "pending"
              ? "bg-amber-50 text-amber-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {transaction.status === "success" && (
            <CheckCircle className="w-3 h-3" />
          )}
          {transaction.status === "pending" && <Clock className="w-3 h-3" />}
          {transaction.status === "failed" && (
            <AlertCircle className="w-3 h-3" />
          )}
          <span className="capitalize">{transaction.status}</span>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

const AlertCard: React.FC<any> = ({ type, title, message }) => {
  const config = {
    warning: { icon: AlertCircle, className: "bg-amber-50 border-amber-200" },
    success: {
      icon: CheckCircle,
      className: "bg-emerald-50 border-emerald-200",
    },
    info: { icon: Clock, className: "bg-blue-50 border-blue-200" },
  };

  const { icon: Icon, className } = config[type];

  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon
          className={`w-5 h-5 mt-0.5 ${
            type === "warning"
              ? "text-amber-600"
              : type === "success"
              ? "text-emerald-600"
              : "text-blue-600"
          }`}
        />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-600 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};

// --- New Project Goals Component ---

const ProjectGoalsCard: React.FC<{
  projects: Project[];
  transactions: Transaction[];
}> = ({ projects, transactions }) => {
  // ✅ Compute top 3 projects with progress and raised amounts
  const goals = useMemo(() => {
    const contributions: Record<number, number> = {};

    transactions.forEach((tx) => {
      if (tx.project?.title) {
        const project = projects.find((p) => p.title === tx.project?.title);
        if (project) {
          contributions[project.id] =
            (contributions[project.id] || 0) + parseFloat(tx.amount || "0");
        }
      }
    });

    return projects.slice(0, 3).map((p) => {
      const currentAmount = contributions[p.id] || 0;
      const percentage =
        p.targetAmount > 0
          ? Math.min(100, (currentAmount / p.targetAmount) * 100)
          : 0;

      return {
        ...p,
        currentAmount,
        percentage: Math.round(percentage),
      };
    });
  }, [projects, transactions]);

  // ✅ Compute overall project statistics (like total raised vs goal)
  const projectStats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) => p.status === "ACTIVE").length;
    const completed = projects.filter((p) => p.status === "COMPLETED").length;
    const draft = projects.filter((p) => p.status === "DRAFT").length;

    const totalFunding = projects.reduce(
      (sum, project) => sum + (parseFloat(project.currentFunding) || 0),
      0
    );
    const targetFunding = projects.reduce(
      (sum, project) => sum + (parseFloat(project.targetAmount) || 0),
      0
    );

    const percentage =
      targetFunding > 0
        ? Math.min(100, (totalFunding / targetFunding) * 100)
        : 0;

    return {
      total,
      active,
      completed,
      draft,
      totalFunding,
      targetFunding,
      percentage,
    };
  }, [projects]);

  // ✅ If no projects with goals
  if (goals.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
          <ListChecks className="w-5 h-5 text-slate-600" />
          <span>Project Goals</span>
        </h3>
        <p className="text-slate-500 text-sm">
          No active projects with defined goals found.
        </p>
      </div>
    );
  }

  console.log("here are your goals", goals);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
        <ListChecks className="w-5 h-5 text-slate-600" />
        <span>Project Goals</span>
      </h3>


      {goals.map((goal) => {
        const percentage = (
          (goal.currentFunding / goal.fundingGoal) *
          100
        ).toFixed(2);

        return (
          <div key={goal.id}>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-slate-900">{goal.title}</p>
              <p className="text-xs font-semibold text-slate-600">
                {percentage}%
              </p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>{formatCompactCurrency(goal.currentFunding)} raised</span>
              <span>Target: {formatCompactCurrency(goal.fundingGoal)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Main Dashboard Component ---
export default function RevenueDashboard() {
  const {
    transactions,
    expenditures,
    projects, // Include projects data
    loading,
    error,
  } = useAccountsData();

  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">(
    "month"
  );

  // --- Key Metrics and Data Transformation ---
  const metrics = useMemo(() => {
    // Helper to safely parse and sum amount
    const sumTransactions = (txs: Transaction[]) =>
      txs.reduce((sum, tx) => sum + parseFloat(tx.amount || "0"), 0);

    const totalRevenue = sumTransactions(transactions as Transaction[]);
    // Expenditure totalAmount is used if available, otherwise fall back to amount
    const totalExpenses = expenditures.reduce(
      (sum, exp) => sum + (exp.totalAmount || exp.amount || 0),
      0
    );
    const netVolume = totalRevenue - totalExpenses;

    // Status mapping: "completed" -> success, others -> pending/failed
    const successfulPayments = transactions.filter(
      (tx: Transaction) => tx.status === "completed"
    ).length;
    const pendingPayments = transactions.filter(
      (tx: Transaction) => tx.status !== "completed"
    ).length;

    // Unique customers based on memberId or payerName if memberId is missing
    const uniqueCustomers = new Set(
      (transactions as Transaction[]).map((tx) => tx.memberId || tx.payerName)
    ).size;
    const avgTransaction =
      transactions.length > 0 ? totalRevenue / transactions.length : 0;

    // Data for Charts
    const revenueByBranch: { [key: string]: number } = {};
    const expenseDistribution: { [key: string]: number } = {};
    const revenueByDate: { [key: string]: number } = {};

    // Process Revenue for Charts
    (transactions as Transaction[]).forEach((tx) => {
      const amount = parseFloat(tx.amount || "0");

      const branchName = tx.branch?.branchName || tx.branchCode || "Unknown";
      revenueByBranch[branchName] = (revenueByBranch[branchName] || 0) + amount;

      const dateKey = new Date(
        tx.transactionDate || tx.createdAt
      ).toLocaleDateString("en-US", { day: "numeric", month: "short" });
      revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + amount;
    });

    // Process Expenditures for Expense Distribution Chart
    (expenditures as Expenditure[]).forEach((exp) => {
      const amount = exp.totalAmount || exp.amount || 0;
      // Use expenditureHeadName if available, fallback to code, then 'Other'
      const headName =
        exp.expenditureHead?.name ||
        exp.expenditureHeadCode ||
        "Other Expenses";
      expenseDistribution[headName] =
        (expenseDistribution[headName] || 0) + amount;
    });

    const sortedRevenueByDate = Object.entries(revenueByDate)
      .sort(
        ([dateA], [dateB]) =>
          new Date(dateA).getTime() - new Date(dateB).getTime()
      )
      .slice(-30); // Show last 30 data points

    return {
      totalRevenue,
      totalExpenses,
      netVolume,
      successfulPayments,
      pendingPayments,
      uniqueCustomers,
      avgTransaction,
      revenueByBranch,
      expenseDistribution,
      revenueTrendData: sortedRevenueByDate,
      totalTransactions: transactions.length,
    };
  }, [transactions, expenditures]);

  const recentTransactions = useMemo(() => {
    return (transactions as Transaction[]).slice(0, 5).map((tx) => ({
      id: tx.id,
      customer: tx.payerName || "Anonymous",
      method: tx.paymentMethod?.name || "Card",
      transactionHash: tx.receiptNumber || tx.rrn || `TX-${tx.id}`,
      amount: `+ ${formatCurrency(parseFloat(tx.amount || "0"))}`,
      type: "income" as const,
      status:
        tx.status === "completed"
          ? "success"
          : tx.status === "pending"
          ? "pending"
          : "failed",
      time: new Date(tx.transactionDate || tx.createdAt).toLocaleDateString(),
    }));
  }, [transactions]);

  // Top performers (Revenue Heads/Projects)
  const topPerformers = useMemo(() => {
    const performance: { [key: string]: number } = {};

    (transactions as Transaction[]).forEach((tx) => {
      const key =
        tx.revenueHead?.name ||
        tx.revenueHeadCode ||
        tx.project?.title ||
        "General";
      performance[key] = (performance[key] || 0) + parseFloat(tx.amount || "0");
    });

    return Object.entries(performance)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, amount]) => ({ name, amount }));
  }, [transactions]);

  // --- Chart Data Preparation ---

  const lineChartData = useMemo(
    () => ({
      labels: metrics.revenueTrendData.map(([date]) => date),
      datasets: [
        {
          label: "Revenue",
          data: metrics.revenueTrendData.map(([, amount]) => amount),
          fill: true,
          backgroundColor: "rgba(52, 211, 163, 0.15)", // emerald-300 with alpha
          borderColor: "rgb(16, 185, 129)", // emerald-500
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: "rgb(16, 185, 129)",
        },
      ],
    }),
    [metrics.revenueTrendData]
  );

  const barChartData = useMemo(
    () => ({
      labels: Object.keys(metrics.revenueByBranch).slice(0, 5),
      datasets: [
        {
          label: "Revenue",
          data: Object.values(metrics.revenueByBranch).slice(0, 5),
          backgroundColor: [
            "rgba(79, 70, 229, 0.9)", // indigo-600
            "rgba(16, 185, 129, 0.9)", // emerald-500
            "rgba(249, 115, 22, 0.9)", // orange-500
            "rgba(236, 72, 153, 0.9)", // pink-500
            "rgba(34, 197, 94, 0.9)", // green-500
          ],
        },
      ],
    }),
    [metrics.revenueByBranch]
  );

  // NEW: Expense Distribution Chart Data
  const expenseChartData = useMemo(() => {
    const labels = Object.keys(metrics.expenseDistribution).slice(0, 5);
    const data = Object.values(metrics.expenseDistribution).slice(0, 5);
    const total = data.reduce((sum, val) => sum + val, 0);

    return {
      labels: labels,
      datasets: [
        {
          label: "Expense Distribution",
          data: data,
          backgroundColor: [
            "rgba(239, 68, 68, 0.9)", // red-500
            "rgba(251, 191, 36, 0.9)", // amber-400
            "rgba(59, 130, 246, 0.9)", // blue-500
            "rgba(147, 51, 234, 0.9)", // violet-600
            "rgba(113, 113, 122, 0.9)", // slate-500
          ],
          hoverOffset: 8,
        },
      ],
      total,
    };
  }, [metrics.expenseDistribution]);

  // --- Chart Options ---

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${formatCurrency(
              context.parsed.y || context.parsed.x
            )}`,
        },
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => formatCompactCurrency(Number(value)),
        },
      },
      x: { grid: { display: false } },
    },
    plugins: {
      ...chartOptions.plugins,
      legend: { display: true, position: "top" as const },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    indexAxis: "y" as const,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => formatCompactCurrency(Number(value)),
        },
      },
      y: { grid: { display: false } },
    },
  };

  // UPDATED: Doughnut chart options for Expense Distribution
  const expenseDoughnutOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: { position: "right" as const },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const amount = context.raw;
            const percentage = (
              (amount / expenseChartData.total) *
              100
            ).toFixed(1);
            return `${context.label}: ${formatCurrency(
              amount
            )} (${percentage}%)`;
          },
        },
      },
    },
  };

  // --- Loading/Error States ---

  if (loading)
    return (
      <div className="p-8 text-center text-slate-600">
        Loading Dashboard Data...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-rose-600 bg-rose-50 border border-rose-300 rounded-lg">
        Error: {error}
      </div>
    );

  // --- Render Dashboard ---

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Revenue Overview
              </h1>
              <p className="text-slate-600">
                Comprehensive view of your revenue performance and metrics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1 bg-white border border-slate-300 rounded-lg p-1">
                {["day", "week", "month", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range as any)}
                    className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-all duration-200 ${
                      timeRange === range
                        ? "bg-slate-800 text-white"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={formatCompactCurrency(metrics.totalRevenue)}
            change={`vs last ${timeRange}`}
            trend="up"
            icon={<DollarSign className="w-6 h-6 text-slate-600" />}
          />
          <MetricCard
            title="Total Transactions"
            value={formatNumber(metrics.totalTransactions)}
            change={`vs last ${timeRange}`}
            trend="up"
            icon={<CreditCard className="w-6 h-6 text-slate-600" />}
          />
          <MetricCard
            title="Avg. Transaction"
            value={formatCurrency(metrics.avgTransaction)}
            change={`vs last ${timeRange}`}
            trend="up"
            icon={<TrendingUp className="w-6 h-6 text-slate-600" />}
          />
          <MetricCard
            title="Total Expenses"
            value={formatCompactCurrency(metrics.totalExpenses)}
            change={`vs last ${timeRange}`}
            trend="down"
            icon={<Clock className="w-6 h-6 text-slate-600" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Real Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Revenue Trend ({timeRange})
              </h3>
              <div style={{ height: "300px" }}>
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue by Branch Chart */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Top 5 Revenue by Branch
                </h3>
                <div style={{ height: "250px" }}>
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </div>

              {/* Expense Distribution Chart (Replaced Payment Methods) */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                  <span>Expense Distribution (Top 5)</span>
                </h3>
                <div
                  style={{ height: "250px" }}
                  className="flex justify-center items-center"
                >
                  <Doughnut
                    data={expenseChartData}
                    options={expenseDoughnutOptions}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary and Alerts */}
          <div className="space-y-6">
            {/* Project Goals Card (NEW SECTION) */}
            <ProjectGoalsCard
              projects={projects as Project[]}
              transactions={transactions as Transaction[]}
            />

            {/* Alerts Panel */}
            <div className="space-y-3">
              <AlertCard
                type="warning"
                title="Pending Approvals"
                message={`${metrics.pendingPayments} transactions awaiting approval.`}
              />
              <AlertCard
                type="info"
                title="Report Ready"
                message={`The latest ${timeRange} revenue report is now available for review.`}
              />
              <AlertCard
                type="success"
                title="Target Achieved"
                message="Monthly revenue target exceeded by 15% (Mocked)."
              />
            </div>
          </div>
        </div>

        {/* Bottom Section - Transactions and Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Recent Transactions
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-sm w-48"
                      />
                    </div>
                    <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentTransactions.map((transaction) => (
                      <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Top Revenue Drivers
              </h3>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div
                    key={performer.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {performer.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatCurrency(performer.amount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-emerald-600 text-sm font-semibold">
                      +12.5% {/* Mocked */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
