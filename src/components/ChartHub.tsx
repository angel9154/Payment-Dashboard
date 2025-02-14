// Add these date-fns functions at the top
import { format, subDays, parseISO } from 'date-fns';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Transaction } from '../types';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartHubProps {
  transactions: Transaction[];
}

export function ChartHub({ transactions }: ChartHubProps) {
  // Process data for payment method distribution
  const paymentMethods = ['Bank Transfer', 'Card', 'Wallet'] as const;
  const paymentMethodCounts = paymentMethods.map(method =>
    transactions.filter(t => t.payment_method === method).length
  );
// new variables 
  const transactionDates = transactions.map(t => parseISO(t.date).getTime());
  const newestDate = new Date(Math.max(...transactionDates));

  const paymentMethodData = {
    labels: paymentMethods,
    datasets: [{
      data: paymentMethodCounts,
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(251, 191, 36, 0.8)',
      ],
      borderColor: [
        'rgb(99, 102, 241)',
        'rgb(16, 185, 129)',
        'rgb(251, 191, 36)',
      ],
      borderWidth: 1,
    }],
  };

  // Process data for volume timeline
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(newestDate, i); // Changed from new Date() to newestDate
    return format(date, 'MMM dd');
  }).reverse();

  const dailyVolumes = last7Days.map(day => {
    const dayTransactions = transactions.filter(t => {
      const transactionDate = format(parseISO(t.date), 'MMM dd');
      return transactionDate === day;
    });
    return dayTransactions.reduce((sum, t) => sum + t.amount, 0);
  });

  console.log('Processed dates:', {
    newestDate,
    last7Days,
    dailyVolumes
  });

  const volumeData = {
    labels: last7Days,
    datasets: [{
      label: 'Transaction Volume (Millions)', // Changed label
      data: dailyVolumes,
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { 
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.label?.includes('Volume')) {
              const value = context.parsed.y || 0;
              return ` $${(value / 1000).toFixed(1)}K`; // Changed to thousands
            } else {
              return ` ${context.raw} transactions`;
            }
          }
        },
        backgroundColor: 'rgba(17,24,39,0.9)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          callback: (value) => `$${(value/1000).toFixed(1)}K`
        },
        max: Math.ceil(Math.max(...dailyVolumes) * 1.2) // Added comma, removed division
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280' }
      }
    }
  };
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Payment Methods</h3>
        <div className="h-[300px] flex items-center justify-center">
          <Doughnut 
            data={paymentMethodData} 
            options={{
              ...chartOptions,
              cutout: '65%',
            }} 
          />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Transaction Volume</h3>
        <div className="h-[300px]">
          <Bar data={volumeData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}