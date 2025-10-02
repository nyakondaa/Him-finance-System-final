import React from "react";
import useAccountsData from "@/hooks";
import { DollarSign, ArrowUp, ArrowDown, RotateCw } from "lucide-react";

// --- Helper Component: SummaryCard ---
const SummaryCard = ({ 
    title, 
    value, 
    icon: Icon, 
    colorClass, 
}: { 
    title: string; 
    value: number; 
    icon: React.ElementType; 
    colorClass: string;
}) => {
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);

    return (
        <div className="bg-gray-800 dark:bg-gray-700 rounded-2xl shadow hover:shadow-lg transition p-6">
            <div className={`flex items-center justify-center p-3 rounded-full w-12 h-12 mb-4 ${colorClass}`}> 
                <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <h2 className="text-2xl font-bold text-white">{formattedValue}</h2>
        </div>
    );
};

// --- Main Component ---
const FinancialSummaryCards: React.FC = () => {
    const { totalIncomeBalance, totalExpenseBalance, totalBalance, loading, error, refetch } = useAccountsData();

    if (loading) {
        return (
            <div className="col-span-4 flex justify-center p-6">
                <RotateCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="col-span-4 p-6 bg-red-800 rounded-2xl text-center text-red-400 shadow">
                Error loading financials: {error}
                <button onClick={refetch} className="ml-3 text-blue-400 hover:underline">Retry</button>
            </div>
        );
    }

    const netColorClass = totalBalance >= 0 ? "bg-green-500" : "bg-red-500";

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard
                title="Total Income"
                value={totalIncomeBalance}
                icon={ArrowUp}
                colorClass="bg-green-500"
            />
            <SummaryCard
                title="Total Expenses"
                value={totalExpenseBalance}
                icon={ArrowDown}
                colorClass="bg-red-500"
            />
            <SummaryCard
                title="Net Cash Position"
                value={totalBalance}
                icon={DollarSign}
                colorClass={netColorClass}
            />
        </div>
    );
};

export default FinancialSummaryCards;