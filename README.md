Payment Dashboard Documentation
🔍 Purpose
What problem does this solve?
Provides a centralized dashboard for monitoring payment transactions, analyzing financial metrics, and visualizing payment patterns.

Why React?
Chosen for component reusability, state management efficiency, and rich ecosystem for data visualization.

🧩 Component Architecture
mermaid
Copy
graph TD
  A[App] --> B[KpiHeader]
  A --> C[ChartHub]
  A --> D[TransactionTable]
  C --> E[BarChart]
  C --> F[DoughnutChart]
  B --> G[KPI Cards]
📦 Component Breakdown
1. TransactionTable.tsx
Purpose: Display and filter transactional data
Key Features:

Search by ID/customer

Dynamic sorting (date/amount/payment)

Amount filtering (up to $50K)

Pagination (25 items/page)

Key Decision:

tsx
Copy
// Using 25 items/page to balance performance and usability
const itemsPerPage = 25;
2. ChartHub.tsx
Purpose: Visualize payment patterns
Key Features:

Weekly volume trends (Bar chart)

Payment method distribution (Doughnut)

Auto-scaling Y-axis

Critical Code Note:

tsx

// Using subWeeks instead of subDays for weekly aggregates
const last7Weeks = Array.from({ length: 7 }, (_, i) => {
  const date = subWeeks(newestDate, i);
  // ...
});
3. App.tsx
Architecture:

Data loading from JSON

Error boundary implementation

Suspense loading states

KPI calculations

Key Pattern:

tsx
Copy
// Using Error Boundary to prevent full app crashes
class ErrorBoundary extends React.Component<...> {
  // ...
}
4. KpiHeader.tsx
Metrics:

Total revenue

Transaction count

Success rate

Revenue change

Visual Design:

tsx
Copy
// Color-coded icons for quick recognition
<DollarSign className="w-6 h-6 text-indigo-600" />
🚀 Quick Start
Install dependencies:

bash
Copy
npm install react-chartjs-2 chart.js date-fns lucide-react
Import components:

tsx
Copy
import { TransactionTable, ChartHub, KpiHeader } from './components';
Pass transaction data:

tsx
Copy
<ChartHub transactions={transactions} />
🛠️ Configuration
Data Requirements:

ts
Copy
interface Transaction {
  transaction_id: string;
  amount: number; // in cents
  date: string; // ISO format
  status: 'Success' | 'Failed' | 'Pending';
  payment_method: 'Card' | 'Bank Transfer' | 'Cash';
}
🚨 Common Errors
"Invalid Date Format"
Verify transaction dates are ISO strings:

ts
Copy
// Bad: 'MM/DD/YYYY' 
// Good: '2023-07-20T00:00:00Z'
Check date-fns parsing:

tsx
Copy
format(new Date(transaction.date), 'MMM dd, yyyy')
"Empty Charts"
Verify data array isn't empty

Check payment method matches exactly:

ts
Copy
['Bank Transfer', 'Card', 'Cash'] // Case-sensitive
⚠️ Gotchas
Amount Handling:

tsx
Copy
// Amounts stored in cents, displayed as dollars
toLocaleString() // Converts 1000 to "$1,000"
Sorting Performance:

tsx
Copy
// Memoize filteredTransactions for large datasets
const filteredTransactions = useMemo(() => ..., [transactions]);
🛠️ Maintainers
Ownership: @angel9154

Update Process:

Update charts when adding new payment methods

Review KPI calculations quarterly

📚 API Docs
<TransactionTable>
ts
Copy
interface TransactionTableProps {
  transactions: Transaction[]; // Required array
  // Default sorting: 'date'
}
<ChartHub>
ts
Copy
interface ChartHubProps {
  transactions: Transaction[]; 
  // Auto-generates 7-week history from newest date
}
ADR 001: Visualization Library Choice
✅ Decision: react-chartjs-2
📚 Context:

Requires dual chart types (Bar + Doughnut)

Need for interactive tooltips

Custom scale formatting requirements

⚖️ Tradeoffs:

Pros: Unified API, good customization

Cons: Bundle size (~45kb gzipped)
