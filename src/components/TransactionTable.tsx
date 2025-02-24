import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'payment'>('date');
  const [amountFilter, setAmountFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const itemsPerPage = 25;

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAmount = amountFilter === 'all' ? true :
        transaction.amount <= parseInt(amountFilter) * 1000;
      
      const matchesPayment = paymentFilter === 'all' ? true :
        transaction.payment_method === paymentFilter;

      return matchesSearch && matchesAmount && matchesPayment;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount':
          return b.amount - a.amount;
        case 'payment':
          return a.payment_method.localeCompare(b.payment_method);
        default:
          return 0;
      }
    });

  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
  className="pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:border-indigo-500"
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'payment')}
>
  <option value="date">Sort by Date</option>
  <option value="amount">Sort by Amount</option>
  <option value="payment">Sort by Payment</option>
</select>

<select
  className="pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:border-indigo-500"
  value={amountFilter}
  onChange={(e) => setAmountFilter(e.target.value)}
>
  <option value="all">All Amounts</option>
  <option value="10">Up to $10K</option>
  <option value="20">Up to $20K</option>
  <option value="30">Up to $30K</option>
  <option value="40">Up to $40K</option>
  <option value="50">Up to $50K</option>
</select>

<select
  className="pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:border-indigo-500"
  value={paymentFilter}
  onChange={(e) => setPaymentFilter(e.target.value)}
>
  <option value="all">All Payment Methods</option>
  <option value="Card">Card</option>
  <option value="Bank Transfer">Bank Transfer</option>
  <option value="Cash">Cash</option>
</select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3">Transaction ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Payment Method</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction) => (
                <tr
                  key={transaction.transaction_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {transaction.transaction_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.customer_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.payment_method}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {pageCount}
            </span>
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}