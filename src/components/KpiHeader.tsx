import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, PercentCircle } from 'lucide-react';
import { KpiData } from '../types';

interface KpiHeaderProps {
  data: KpiData;
}

export function KpiHeader({ data }: KpiHeaderProps) {
  const { totalRevenue, transactionCount, successRate, revenueChange } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
        <div className="bg-indigo-100 p-3 rounded-lg">
          <DollarSign className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-bold">${totalRevenue.toLocaleString()}</h2>
            <span className={`flex items-center text-sm ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {revenueChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(revenueChange)}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
        <div className="bg-emerald-100 p-3 rounded-lg">
          <CreditCard className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Transactions</p>
          <h2 className="text-2xl font-bold">{transactionCount.toLocaleString()}</h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
        <div className="bg-amber-100 p-3 rounded-lg">
          <PercentCircle className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Success Rate</p>
          <h2 className="text-2xl font-bold">{successRate}%</h2>
        </div>
      </div>
    </div>
  );
}