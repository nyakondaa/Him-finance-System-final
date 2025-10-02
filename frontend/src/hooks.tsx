import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  getExpenditures,
  getExpenditureHeads,
  getRevenueHeads,
  getTransactions,
  getMembers, // <-- ADDED: Assuming this function exists in "@/services/api"
} from "@/services/api";
import type {
  Account,
  Transaction,
  Expenditure,
  RevenueHead,
  ExpenditureHead,
  // ADDED: Mock Member type for demonstration
  Member, 
} from "@/utils/Types";

// If Member type isn't defined in Types.ts, you might need a definition like this:
// type Member = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   joinDate: string;
// };


// --- Constants ---
const ACCOUNT_TYPES = [
  "All Accounts",
  "Income Accounts",
  "Expense Accounts",
] as const;
type AccountType = (typeof ACCOUNT_TYPES)[number];

// --- Custom Hook ---
const useAccountsData = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [members, setMembers] = useState<Member[]>([]); // <-- ADDED: New state for members
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        transactionsRes,
        revenueHeads,
        expendituresRes,
        expenditureHeadsRes,
        membersRes, // <-- ADDED: Result for members
      ] = await Promise.all([
        getTransactions(),
        getRevenueHeads(),
        getExpenditures({ limit: 100, offset: 0 }),
        getExpenditureHeads(),
        getMembers(), // <-- ADDED: New API call
      ]);

      // Validate responses
      if (
        !transactionsRes?.transactions ||
        !revenueHeads ||
        !expendituresRes?.expenditures ||
        !expenditureHeadsRes ||
        !membersRes?.members // <-- ADDED: Validation for members response structure
      ) {
        throw new Error("Invalid API response structure");
      }

      // ------------------------------------
      // Financial Data Processing (Unchanged)
      // ------------------------------------

      // Merge transactions with revenue head names
      const mergedTransactions = transactionsRes.transactions.map((tx) => {
        const head = revenueHeads.find(
          (h: RevenueHead) => h.code === tx.revenueHeadCode
        );
        return {
          ...tx,
          revenueHeadName: head?.name || "Unknown",
        };
      });

      // Merge expenditures with expenditure head names
      const mergedExpenditures = expendituresRes.expenditures.map(
        (exp: Expenditure) => {
          const head = expenditureHeadsRes.find(
            (h) => h.code === exp.expenditureHeadCode
          );
          return {
            ...exp,
            expenditureHeadName: head?.name || "Unknown",
          };
        }
      );

      // Create income accounts
      const incomeAccounts: Account[] = revenueHeads.map((head) => {
        const accountTransactions = mergedTransactions.filter(
          (tx) => tx.revenueHeadCode === head.code
        );

        const balance = accountTransactions.reduce(
          (sum, tx) => sum + (parseFloat(String(tx.amount)) || 0),
          0
        );

        return {
          id: `income-${head.code}`,
          accountName: head.name,
          balance,
          debitBalance: balance,
          transactions: accountTransactions,
          type: "income" as const,
        };
      });

      // Create expense accounts
      const expenseAccounts: Account[] = expenditureHeadsRes.map(
        (head: ExpenditureHead) => {
          const accountExpenditures = mergedExpenditures.filter(
            (exp) => exp.expenditureHeadCode === head.code
          );

          const balance = accountExpenditures.reduce(
            (sum, exp) =>
              sum + (parseFloat(String(exp.totalAmount ?? exp.amount)) || 0),
            0
          );

          return {
            id: `expense-${head.code}`,
            accountName: head.name,
            balance: -balance, // negative for expenses
            creditBalance: balance,
            expenditures: accountExpenditures,
            type: "expense" as const,
          };
        }
      );

      const allAccounts = [...incomeAccounts, ...expenseAccounts];

      // ------------------------------------
      // Set State
      // ------------------------------------
      setAccounts(allAccounts);
      setExpenditures(mergedExpenditures);
      setTransactions(mergedTransactions);
      setMembers(membersRes.members); // <-- ADDED: Setting members state
    } catch (err) {
      console.error("Error fetching accounts data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Compute total balances using useMemo for efficiency (Unchanged)
  const { totalIncomeBalance, totalExpenseBalance, totalBalance } = useMemo(() => {
    const income = accounts
      .filter((acc) => acc.type === "income")
      .reduce((sum, acc) => sum + (acc.balance || 0), 0);

    const expenses = accounts
      .filter((acc) => acc.type === "expense")
      .reduce((sum, acc) => sum + Math.abs(acc.balance || 0), 0);

    const total = income - expenses;

    return {
      totalIncomeBalance: income,
      totalExpenseBalance: expenses,
      totalBalance: total,
    };
  }, [accounts]);

  return {
    accounts,
    expenditures,
    transactions,
    members, // <-- ADDED: Returning members
    loading,
    error,
    refetch: fetchData,
    totalIncomeBalance,
    totalExpenseBalance,
    totalBalance,
  };
};

export default useAccountsData;
