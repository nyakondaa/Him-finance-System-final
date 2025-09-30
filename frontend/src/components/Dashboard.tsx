import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import useAccountsData from "@/hooks";

const StatCard = ({
  title,
  Icon,
  isPositive,
}: {
  title: string;
  Icon: React.ElementType;
  isPositive: boolean;
}) => {
  const {
    totalBalance,
    totalIncomeBalance,
    totalExpenseBalance,
    loading,
    error,
  } = useAccountsData();

  // Determine which value to display based on title
  let value = 0;
  if (title === "Total Balance") value = totalBalance;
  else if (title === "Income") value = totalIncomeBalance;
  else if (title === "Expense") value = totalExpenseBalance;

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

      {loading ? (
        <div className="text-gray-400 text-lg">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-sm">Error loading data</div>
      ) : (
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {formattedValue}
        </div>
      )}

      <div className="flex items-center text-sm">
        <div
          className={`flex items-center px-2 py-0.5 rounded-full mr-2 ${changeClass}`}
        >
          <ChangeIcon className="w-3 h-3 mr-1" />
          <span>{isPositive ? "+" : "-"}{Math.floor(Math.random() * 10 + 1)}%</span>
        </div>
        <span className="text-gray-500">vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;
