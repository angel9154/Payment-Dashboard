import { format, subDays, parseISO, parse, subWeeks, addDays } from 'date-fns'; // Corrected import
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
  const paymentMethods = ['Bank Transfer', 'Card', 'Cash'] as const;
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
        'rgba(240, 150, 230, 0.8)',
        'rgba(170, 230, 90, 0.8)',
      ],
      borderColor: [
        'rgb(99, 102, 241)',
        'rgb(240, 150, 230)',
        'rgb(170, 230, 90)',
      ],
      borderWidth: 1,
    }],
  };

  // Process data for volume timeline

  const last7Weeks = Array.from({ length: 7 }, (_, i) => { // Declared first now
    // Use subWeeks instead of subDays
    const date = subWeeks(newestDate, i);
    // Format as week range (e.g., "Jul 14 - Jul 20")
    const startDateOfWeek = date;
    const endDateOfWeek = addDays(startDateOfWeek, 6); // Assuming week is 7 days
    const startFormat = format(startDateOfWeek, 'MMM dd');
    const endFormat = format(endDateOfWeek, 'MMM dd');
    return `${startFormat} - ${endFormat}`;
  }).reverse();

  const weeklyVolumes = last7Weeks.map(weekRange => { // Declared second now
    // 1. Extract Start and End Dates from weekRange label
    const [startLabel, endLabel] = weekRange.split(' - ');
    const startDate = parse(startLabel, 'MMM dd', newestDate);
    const endDate = parse(endLabel, 'MMM dd', newestDate);

    // 2. Filter Transactions for the Week Range
    const weekTransactions = transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // 3. Sum Weekly Transaction Amounts
    return weekTransactions.reduce((sum, t) => sum + t.amount, 0);
  });

  const volumeData = {
    labels: last7Weeks,
    datasets: [{
      label: 'Transaction Volume (Millions)',
      data: weeklyVolumes,
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
              return ` $${(value / 1000).toFixed(1)}K`;
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
          callback: (value) => `$${(value / 1000).toFixed(1)}K`
        },
        max: Math.ceil(Math.max(...weeklyVolumes) * 1.2) // Corrected: Use weeklyVolumes here
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