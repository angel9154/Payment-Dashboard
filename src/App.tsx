import React, { Suspense } from 'react';
import { KpiHeader } from './components/KpiHeader';
import { ChartHub } from './components/ChartHub';
import { TransactionTable } from './components/TransactionTable';
import { Transaction } from './types';
import flutterwaveTransactions from './transactions/flutterwave_transactions.json';


// Calculate KPI data from transactions
const calculateKpiData = (transactions: Transaction[]) => {
  // add up transactions 
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const successfulTransactions = transactions.filter(t => t.status === 'Success');
  const successRate = Math.round((successfulTransactions.length / transactions.length) * 100);
  
  // Calculate revenue change (mock data for demonstration)
  const revenueChange = 5.2;

  return {
    totalRevenue,
    transactionCount: transactions.length,
    successRate,
    revenueChange
  };
};

function App() {
  const transactions = flutterwaveTransactions as Transaction[];

  const kpiData = calculateKpiData(transactions);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Payment Dashboard</h1>
        </div>
        
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-slate-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>  // ✅ Proper closing
          }>
            <KpiHeader data={kpiData} />
            <ChartHub transactions={transactions} />
            <TransactionTable transactions={transactions} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
          <p className="text-red-600">Please try refreshing the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;