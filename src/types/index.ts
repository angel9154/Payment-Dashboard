export interface Transaction {
  transaction_id: string;
  customer_name: string;
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
  payment_method: 'Bank Transfer' | 'Card' | 'Wallet';
  date: string;
}

export interface KpiData {
  totalRevenue: number;
  transactionCount: number;
  successRate: number;
  revenueChange: number;
}