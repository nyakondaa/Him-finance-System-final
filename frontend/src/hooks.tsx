import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  getExpenditures,
  getExpenditureHeads,
  getRevenueHeads,
  getTransactions,
  getMembers,
  getProjects,
  getBranches,
  getPaymentMethods,
} from "@/services/api";
import type {
  Account,
  Transaction,
  Expenditure,
  RevenueHead,
  ExpenditureHead,
  Member,
  Project,
} from "@/utils/Types";

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
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        transactionsRes,
        revenueHeadsRes,
        expendituresRes,
        expenditureHeadsRes,
        membersRes,
        projectsRes,
        branchesRes,
        paymentMethodsRes,
      ] = await Promise.all([
        getTransactions(),
        getRevenueHeads(),
        getExpenditures({ limit: 100, offset: 0 }),
        getExpenditureHeads(),
        getMembers(),
        getProjects(),
        getBranches(),
        getPaymentMethods(),
      ]);

      // Handle different response structures
      const transactionsData = Array.isArray(transactionsRes)
        ? transactionsRes
        : transactionsRes?.data || transactionsRes?.transactions || [];
      const revenueHeadsData = Array.isArray(revenueHeadsRes)
        ? revenueHeadsRes
        : revenueHeadsRes?.data || [];
      const expendituresData = Array.isArray(expendituresRes)
        ? expendituresRes
        : expendituresRes?.data || expendituresRes?.expenditures || [];
      const expenditureHeadsData = Array.isArray(expenditureHeadsRes)
        ? expenditureHeadsRes
        : expenditureHeadsRes?.data || [];
      const membersData = Array.isArray(membersRes)
        ? membersRes
        : membersRes?.data || membersRes?.members || [];
      const projectsData = Array.isArray(projectsRes)
        ? projectsRes
        : projectsRes?.data || projectsRes?.projects || [];
      const branchesData = Array.isArray(branchesRes)
        ? branchesRes
        : branchesRes?.data || branchesRes?.branches || [];
      const paymentMethodsData = Array.isArray(paymentMethodsRes)
        ? paymentMethodsRes
        : paymentMethodsRes?.data || paymentMethodsRes?.paymentMethods || [];

      if (!revenueHeadsData.length || !expenditureHeadsData.length) {
        throw new Error("Missing essential account data (revenue heads or expenditure heads)");
      }

      // ✅ Build payment method map
      const paymentMethodMap = new Map<number, string>();
      paymentMethodsData.forEach((pm) => {
        if (pm.id && pm.name) paymentMethodMap.set(pm.id, pm.name);
      });

      // Process transactions
      const processedTransactions: Transaction[] = transactionsData.map((tx: any) => {
        const payerName =
          tx.payerName ||
          `${tx.member?.firstName || ""} ${tx.member?.lastName || ""}`.trim() ||
          "Unknown Customer";

        const methodName =
          paymentMethodMap.get(tx.paymentMethodId) || tx.paymentMethod?.name || "Unknown";

        return {
          id: tx.id,
          receiptNumber: tx.receiptNumber || tx.rrn || `TX-${tx.id}`,
          revenueHeadCode: tx.revenueHeadCode || tx.revenueHead?.code || "",
          amount: String(tx.amount || 0),
          branchCode: tx.branchCode || tx.branch?.branchCode || "",
          transactionDate: tx.transactionDate || tx.createdAt,
          createdAt: tx.createdAt,
          currencyCode: tx.currencyCode || tx.currency?.code || "USD",
          memberId: tx.memberId || tx.member?.id,
          notes: tx.notes,
          paymentMethodId: tx.paymentMethodId || tx.paymentMethod?.id,
          paymentMethod: { id: tx.paymentMethodId, name: methodName },
          referenceNumber: tx.referenceNumber,
          status: tx.status || "completed",
          updatedAt: tx.updatedAt,
          userId: tx.userId || tx.processedBy?.id,
          branch: tx.branch || { code: tx.branchCode, name: tx.branch?.branchName },
          currency: tx.currency || { code: tx.currencyCode, name: "US Dollar" },
          member: tx.member || {
            id: tx.memberId,
            firstName: tx.member?.firstName || "Unknown",
            lastName: tx.member?.lastName || "Member",
          },
          revenueHead: tx.revenueHead || {
            code: tx.revenueHeadCode,
            name: revenueHeadsData.find((h: RevenueHead) => h.code === tx.revenueHeadCode)?.name || "Unknown",
          },
          user: tx.user || { id: tx.userId, username: "System" },
          payerName,
        };
      });

      console.log(processedTransactions)

      // Process expenditures
      const processedExpenditures: Expenditure[] = expendituresData.map((exp: any) => {
        const methodName =
          paymentMethodMap.get(exp.paymentMethodId) || exp.paymentMethod?.name || "Unknown";

        return {
          id: exp.id,
          voucherNumber: exp.voucherNumber || `VOUCHER-${exp.id}`,
          expenditureHeadCode: exp.expenditureHeadCode || exp.expenditureHead?.code || "",
          description: exp.description || "No description",
          amount: Number(exp.amount || 0),
          totalAmount: Number(exp.totalAmount || exp.amount || 0),
          currencyCode: exp.currencyCode || "USD",
          paymentMethodId: exp.paymentMethodId || exp.paymentMethod?.id,
          paymentMethod: { id: exp.paymentMethodId, name: methodName },
          branchCode: exp.branchCode || exp.branch?.branchCode || "",
          expenseDate: exp.expenseDate || exp.createdAt,
          isRecurring: Boolean(exp.isRecurring),
          approvalStatus: exp.approvalStatus || "approved",
          taxAmount: Number(exp.taxAmount || 0),
        };


      });

      // Income accounts
      const incomeAccounts: Account[] = revenueHeadsData.map((head: RevenueHead) => {
        const accountTransactions = processedTransactions.filter((tx) => tx.revenueHeadCode === head.code);
        const balance = accountTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
        return {
          id: `income-${head.code}`,
          accountName: head.name,
          balance: String(balance),
          debitBalance: balance,
          creditBalance: 0,
          transactions: accountTransactions,
          type: "income" as const,
        };
      });

      // Expense accounts
      const expenseAccounts: Account[] = expenditureHeadsData.map((head: ExpenditureHead) => {
        const accountExpenditures = processedExpenditures.filter((exp) => exp.expenditureHeadCode === head.code);
        const balance = accountExpenditures.reduce((sum, exp) => sum + exp.totalAmount, 0);
        return {
          id: `expense-${head.code}`,
          accountName: head.name,
          balance: String(-balance),
          debitBalance: 0,
          creditBalance: balance,
          expenditures: accountExpenditures,
          type: "expense" as const,
        };
      });

      setAccounts([...incomeAccounts, ...expenseAccounts]);
      setExpenditures(processedExpenditures);
      setTransactions(processedTransactions);
      setMembers(membersData);
      setProjects(projectsData);
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

  // Compute total balances
  const { totalIncomeBalance, totalExpenseBalance, totalBalance } = useMemo(() => {
    const income = accounts
      .filter((acc) => acc.type === "income")
      .reduce((sum, acc) => sum + parseFloat(acc.balance || "0"), 0);

    const expenses = accounts
      .filter((acc) => acc.type === "expense")
      .reduce((sum, acc) => sum + Math.abs(parseFloat(acc.balance || "0")), 0);

    return {
      totalIncomeBalance: income,
      totalExpenseBalance: expenses,
      totalBalance: income - expenses,
    };
  }, [accounts]);

  // Additional metrics
  const metrics = useMemo(() => {
    const totalTransactions = transactions.length + expenditures.length;
    const activeMembers = members.filter((m) => m.isActive).length;
    const incomeAccountsCount = accounts.filter((acc) => acc.type === "income").length;
    const expenseAccountsCount = accounts.filter((acc) => acc.type === "expense").length;
    const totalProjectContributions = transactions.filter(
      (tx) => tx.revenueHeadCode?.includes("PROJECT") || tx.notes?.includes("project")
    ).length;

    return {
      totalTransactions,
      activeMembers,
      incomeAccounts: incomeAccountsCount,
      expenseAccounts: expenseAccountsCount,
      totalProjectContributions,
      netProfit: totalIncomeBalance - totalExpenseBalance,
    };
  }, [transactions, expenditures, members, accounts, totalIncomeBalance, totalExpenseBalance]);

  return {
    accounts,
    expenditures,
    transactions,
    members,
    projects,
    loading,
    error,
    refetch: fetchData,
    totalIncomeBalance,
    totalExpenseBalance,
    totalBalance,
    metrics,
  };
};

export default useAccountsData;
