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
import { format, subDays } from 'date-fns';

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
    const date = subDays(new Date(), i);
    return format(date, 'MMM dd');
  }).reverse();

  const dailyVolumes = last7Days.map(day => {
    const dayTransactions = transactions.filter(t => 
      format(new Date(t.date), 'MMM dd') === day
    );
    return dayTransactions.reduce((sum, t) => sum + t.amount, 0);
  });

  const volumeData = {
    labels: last7Days,
    datasets: [{
      label: 'Transaction Volume',
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
        grid: {
          drawBorder: false,
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
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