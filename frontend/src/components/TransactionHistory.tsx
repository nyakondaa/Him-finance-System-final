import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useOrganization } from '../context/OrganizationContext';

interface Transaction {
  id: number;
  receiptNumber: string;
  amount: number;
  currencyCode: string;
  paymentDate: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  notes?: string;
  referenceNumber?: string;
  paymentMethod: {
    name: string;
  };
  processor: {
    firstName: string;
    lastName: string;
  };
  // Church-specific fields
  member?: {
    firstName: string;
    lastName: string;
    memberNumber: string;
  };
  revenueHead?: {
    name: string;
  };
  project?: {
    name: string;
  };
  // School-specific fields
  student?: {
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  feeStructure?: {
    name: string;
    feeCategory: {
      name: string;
    };
  };
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  title?: string;
  showFilters?: boolean;
  className?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  title = 'Transaction History',
  showFilters = true,
  className = '',
  onLoadMore,
  hasMore = false,
  isLoading = false
}) => {
  const { isSchool, isChurch } = useOrganization();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    let filtered = transactions;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(t => new Date(t.paymentDate) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(t => new Date(t.paymentDate) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(t => new Date(t.paymentDate) >= filterDate);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter(t => new Date(t.paymentDate) >= filterDate);
          break;
      }
    }

    setFilteredTransactions(filtered);
  }, [transactions, statusFilter, dateFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getTransactionTitle = (transaction: Transaction) => {
    if (isSchool && transaction.student) {
      return `${transaction.student.firstName} ${transaction.student.lastName} (${transaction.student.studentNumber})`;
    } else if (isChurch && transaction.member) {
      return `${transaction.member.firstName} ${transaction.member.lastName} (${transaction.member.memberNumber})`;
    }
    return 'Unknown';
  };

  const getTransactionDescription = (transaction: Transaction) => {
    if (isSchool && transaction.feeStructure) {
      return `${transaction.feeStructure.name} - ${transaction.feeStructure.feeCategory.name}`;
    } else if (isChurch && transaction.revenueHead) {
      return transaction.revenueHead.name;
    }
    return 'Transaction';
  };

  const getProjectInfo = (transaction: Transaction) => {
    if (transaction.project) {
      return `Project: ${transaction.project.name}`;
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{getTransactionTitle(transaction)}</h4>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {getTransactionDescription(transaction)}
                  </p>
                  {getProjectInfo(transaction) && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {getProjectInfo(transaction)}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Receipt: {transaction.receiptNumber}</span>
                    {transaction.referenceNumber && (
                      <span>Ref: {transaction.referenceNumber}</span>
                    )}
                    <span>Method: {transaction.paymentMethod.name}</span>
                    <span>
                      By: {transaction.processor.firstName} {transaction.processor.lastName}
                    </span>
                  </div>
                  {transaction.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: {transaction.notes}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatAmount(transaction.amount, transaction.currencyCode)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(transaction.paymentDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                onClick={onLoadMore}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
