import { MonthlySummary } from '@/types/dashboardTypes';
import CategoryInsights from './CategoryInsights';
import QuickStats from './QuickStats';
import FinancialHealthGauge from './FinancialHealthGuage';
import ExpenseBreakdown from './ExpenseBreakdown';
import { useAuthStore } from '@/store/authStore';
import AddExpenseModal from './AddExpenseModal';
import AddIncomeModal from './AddIncomeModal';

interface ChartsSectionProps {
  monthlySummary: MonthlySummary;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ monthlySummary }) => {
  const { userProfile } = useAuthStore();

  const expenseData = Object.entries(monthlySummary.expenseCategoryTotals)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ 
      name, 
      value,
      fill: getCategoryColor(name)
    }));

  function getCategoryColor(category: string): string {
    const colorMap: Record<string, string> = {
      food: '#ef4444',
      transport: '#f59e0b',
      accommodation: '#8b5cf6',
      utilities: '#0d8af1',
      entertainment: '#ec4899',
      healthcare: '#22c55e',
      education: '#6366f1',
      shopping: '#f97316',
      others: '#6b7280'
    };
    return colorMap[category] || '#6b7280';
  }

  return (
    <>
      <section className="charts-section grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="chart-container bg-[var(--bg-secondary)] p-[10px] md:p-6 md:rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Financial Insights</h3>
            <AddIncomeModal/>
          </div>
          
          <QuickStats monthlySummary={monthlySummary} />
          
          <div className="grid grid-cols-1 gap-4 mb-0">
            <FinancialHealthGauge 
              income={monthlySummary.income}
              expenses={monthlySummary.expenses}
              balance={monthlySummary.balance}
              monthlySummary={monthlySummary}
            />
          </div>
          
          <CategoryInsights 
            expenseData={expenseData}
            totalExpenses={monthlySummary.expenses}
          />
        </div>

        <ExpenseBreakdown 
          expenseData={expenseData}
          monthlySummary={monthlySummary}
          userProfile={userProfile}
        />
      </section>
    </>
  );
};

export default ChartsSection;