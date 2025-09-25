import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useOrganization } from '../context/OrganizationContext';

interface BalanceCardProps {
  title: string;
  amount: number;
  currency: string;
  type: 'CREDIT' | 'DEBIT' | 'PLEDGE' | 'PREPAID';
  lastUpdated?: string;
  description?: string;
  className?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  currency,
  type,
  lastUpdated,
  description,
  className = ''
}) => {
  const { isSchool, isChurch } = useOrganization();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CREDIT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DEBIT':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PLEDGE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PREPAID':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    if (isSchool) {
      switch (type) {
        case 'CREDIT':
          return 'Paid';
        case 'DEBIT':
          return 'Outstanding';
        case 'PLEDGE':
          return 'Pledged';
        case 'PREPAID':
          return 'Prepaid';
        default:
          return type;
      }
    } else if (isChurch) {
      switch (type) {
        case 'CREDIT':
          return 'Contributed';
        case 'DEBIT':
          return 'Owed';
        case 'PLEDGE':
          return 'Pledged';
        case 'PREPAID':
          return 'Prepaid';
        default:
          return type;
      }
    }
    return type;
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Badge className={getTypeColor(type)}>
          {getTypeLabel(type)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatAmount(amount, currency)}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface BalanceSummaryProps {
  balances: Array<{
    id: number;
    balanceType: 'CREDIT' | 'DEBIT' | 'PLEDGE' | 'PREPAID';
    balance: number;
    currencyCode: string;
    lastUpdated: string;
    feeStructure?: {
      name: string;
      feeCategory: {
        name: string;
      };
    };
    project?: {
      name: string;
    };
  }>;
  title?: string;
  className?: string;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  balances,
  title = 'Balance Summary',
  className = ''
}) => {
  const { isSchool } = useOrganization();

  const groupedBalances = balances.reduce((acc, balance) => {
    const key = balance.balanceType;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(balance);
    return acc;
  }, {} as Record<string, typeof balances>);

  const getTotalByType = (type: string) => {
    return groupedBalances[type]?.reduce((sum, balance) => sum + balance.balance, 0) || 0;
  };

  const getPrimaryCurrency = () => {
    return balances[0]?.currencyCode || 'USD';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BalanceCard
          title={isSchool ? 'Total Paid' : 'Total Contributed'}
          amount={getTotalByType('CREDIT')}
          currency={getPrimaryCurrency()}
          type="CREDIT"
        />
        <BalanceCard
          title={isSchool ? 'Outstanding Fees' : 'Outstanding Contributions'}
          amount={getTotalByType('DEBIT')}
          currency={getPrimaryCurrency()}
          type="DEBIT"
        />
        <BalanceCard
          title="Pledged Amount"
          amount={getTotalByType('PLEDGE')}
          currency={getPrimaryCurrency()}
          type="PLEDGE"
        />
        <BalanceCard
          title="Prepaid Amount"
          amount={getTotalByType('PREPAID')}
          currency={getPrimaryCurrency()}
          type="PREPAID"
        />
      </div>
    </div>
  );
};
