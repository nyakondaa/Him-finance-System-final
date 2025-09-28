import React from "react";
import { X } from "lucide-react";
import type { Account, Expenditure, Transaction } from "@/utils/Types";

interface AccountDetailModalProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
}

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

const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !account) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Use type assertion to access the properties that exist in your component
  const accountWithExtendedType = account as Account & {
    type?: "income" | "expense";
    expenditures?: Expenditure[];
  };

  const isIncome = accountWithExtendedType.type === "income";
  const items = isIncome
    ? account.transactions
    : accountWithExtendedType.expenditures;
  const headerTitle = isIncome
    ? "Transactions (Credit/Inflow)"
    : "Expenditures (Debit/Outflow)";

  // Safely format credit and debit balances
  const creditBalance = account.creditBalance || 0;
  const debitBalance = account.debitBalance || 0;

  // Parse balance from string to number for display
  const accountBalance =
    typeof account.balance === "string"
      ? parseFloat(account.balance)
      : account.balance;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 
             bg-black/40 backdrop-blur-sm overflow-y-auto transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl 
                  max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100"
      >
        {/* Your modal content */}
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            Ledger Detail: {account.accountName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Account Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-sm">
            <p className="font-medium text-gray-500">Account Type</p>
            <p className="font-semibold text-blue-600 capitalize">
              {isIncome ? "Income" : "Expense"}
            </p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-500">Net Balance</p>
            <p className={`text-lg ${getBalanceClass(accountBalance)}`}>
              {formatCurrency(accountBalance)}
            </p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-500">Total Credits</p>
            <p className="text-lg text-red-500">
              {formatCurrency(creditBalance)}
            </p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-500">Total Debits</p>
            <p className="text-lg text-green-600">
              {formatCurrency(debitBalance)}
            </p>
          </div>
        </div>

        {/* Ledger Table Body */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {headerTitle}
          </h3>

          {items && items.length > 0 ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/3">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item: any, index: number) => {
                    if (isIncome) {
                      // Handle Transaction type
                      const transaction = item as Transaction;
                      const date = transaction.transactionDate
                        ? new Date(
                            transaction.transactionDate
                          ).toLocaleDateString()
                        : "N/A";
                      const reference = transaction.receiptNumber || "N/A";
                      const notes =
                        transaction.notes || "No description provided";
                      const amount = parseFloat(transaction.amount) || 0;

                      return (
                        <tr
                          key={transaction.id || index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                            {reference}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {notes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-medium">
                            {formatCurrency(amount)}
                          </td>
                        </tr>
                      );
                    } else {
                      // Handle Expenditure type
                      const expenditure = item as Expenditure;
                      const date = expenditure.expenseDate
                        ? new Date(expenditure.expenseDate).toLocaleDateString()
                        : "N/A";
                      const reference = expenditure.voucherNumber || "N/A";
                      const description =
                        expenditure.description || "No description provided";
                      const amount =
                        expenditure.totalAmount || expenditure.amount || 0;

                      return (
                        <tr
                          key={expenditure.id || index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                            {reference}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-medium">
                            {formatCurrency(amount)}
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-white border border-dashed border-gray-300 rounded-lg">
              No {isIncome ? "transactions" : "expenditures"} found for this
              account.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Total {isIncome ? "Transactions" : "Expenditures"}:{" "}
            {items ? items.length : 0}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailModal;
