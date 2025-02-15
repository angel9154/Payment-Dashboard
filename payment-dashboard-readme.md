# Payment Dashboard
A React-based dashboard for visualizing and managing payment transactions with interactive charts and detailed transaction views.

## 📦 Components

### TransactionTable
Displays and filters transactional data with advanced filtering capabilities.

**Key Features:**
- Search functionality for transactions by ID or customer
- Dynamic sorting by date, amount, or payment type
- Amount filtering up to $50K
- Pagination with 25 items per page for optimal performance

```tsx
// Example of pagination implementation
const itemsPerPage = 25;
```

### ChartHub
Visualizes payment patterns through interactive charts.

**Key Features:**
- Weekly volume trends using Bar Chart
- Payment method distribution via Doughnut Chart
- Auto-scaling Y-axis for dynamic data ranges

```tsx
// Weekly data aggregation example
const last7Weeks = Array.from({ length: 7 }, (_, i) => {
  const date = subWeeks(newestDate, i);
  // ... further logic here
});
```

### KpiHeader
Displays key performance indicators with color-coded visual elements.

**Metrics:**
- Total Revenue
- Transaction Count
- Success Rate
- Revenue Change

```tsx
// Example KPI card implementation
<KpiCard value={totalRevenue} icon={<RevenueIcon />} />
```

## 🚀 Quick Start

### Installation

1. Install required dependencies:
```bash
npm install react-chartjs-2 chart.js date-fns lucide-react
```

2. Import components:
```tsx
import { TransactionTable, ChartHub, KpiHeader } from './components';
```

## 🛠️ Data Requirements

### Transaction Interface
```typescript
interface Transaction {
  transaction_id: string;
  amount: number;         // Amount in cents
  date: string;          // ISO format date string
  status: 'Success' | 'Failed' | 'Pending';
  payment_method: 'Card' | 'Bank Transfer' | 'Cash';
}
```

## 🚨 Common Issues & Solutions

### Date Format Issues
Transactions require ISO format dates:

```typescript
// ❌ Incorrect:
'MM/DD/YYYY'

// ✅ Correct:
'2023-07-20T00:00:00Z'

// Formatting example with date-fns:
format(new Date(transaction.date), 'MMM dd, yyyy')
```

### Empty Charts
Ensure payment method values are case-sensitive and match exactly:
```typescript
['Bank Transfer', 'Card', 'Cash']
```

### Amount Display
Convert cents to dollars for display:
```tsx
// Converts 1000 cents to "$1,000"
(1000 / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
```

### Performance Optimization
Memoize filtered transactions for large datasets:
```tsx
const filteredTransactions = useMemo(() => {
  // filtering logic
}, [transactions]);
```

## 📚 API Documentation

### TransactionTable Props
```typescript
interface TransactionTableProps {
  transactions: Transaction[]; // Required array of transactions
  // Default sorting: 'date'
}
```

### ChartHub Props
```typescript
interface ChartHubProps {
  transactions: Transaction[]; // Auto-generates 7-week history
}
```

## 👥 Maintenance

### Team
- Primary Maintainer: @angel9154

### Update Process
- Chart Updates: Required when adding new payment methods
- KPI Reviews: Quarterly updates for metric accuracy

## ⚖️ Architecture Decisions

### ADR 001: Visualization Library
**Decision:** Adopted react-chartjs-2 for chart rendering

**Context:**
- Supports multiple chart types (Bar and Doughnut)
- Interactive tooltips and customizable scale formatting

**Tradeoffs:**
- ✅ Unified API with excellent customization options
- ⚠️ Bundle size impact (~45kb gzipped)
