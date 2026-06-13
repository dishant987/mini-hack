import { useApp } from '../context/AppContext'
import { formatCurrency } from '../utils/helpers'

export default function BudgetStatus({ compact = false }: { compact?: boolean }) {
  const { budgetAnalysis, inputs, setInputs } = useApp()

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-slate-500">Budget:</span>
        <span className={`font-bold ${budgetAnalysis.withinBudget ? 'text-emerald-500' : 'text-rose-500'}`}>
          {formatCurrency(budgetAnalysis.groceryCost)} / {formatCurrency(inputs.budget)}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">Budget Analysis</h3>
        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
          budgetAnalysis.withinBudget
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
        }`}>
          {budgetAnalysis.withinBudget ? 'PASS' : 'EXCEEDED'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Grocery Cost</span>
          <div className="text-lg font-bold">{formatCurrency(budgetAnalysis.groceryCost)}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Budget</span>
          <div className="text-lg font-bold">{formatCurrency(inputs.budget)}</div>
        </div>
      </div>

      <div className="mt-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex justify-between text-xs font-semibold mb-1">
          <span>Adjust Budget</span>
          <span>{formatCurrency(inputs.budget)} / day</span>
        </div>
        <input
          type="range" min="5" max="80" step="5"
          value={inputs.budget}
          onChange={(e) => setInputs(prev => ({ ...prev, budget: Number(e.target.value) }))}
          className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>

      <div className="space-y-2 mt-4 text-xs font-semibold">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Total Meal Value</span>
          <span>{formatCurrency(budgetAnalysis.totalMealCost)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Cost per Meal</span>
          <span>{formatCurrency(budgetAnalysis.costPerMeal)}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
          <span>Remaining</span>
          <span className={budgetAnalysis.withinBudget ? 'text-emerald-500' : 'text-rose-500'}>
            {formatCurrency(budgetAnalysis.remainingBudget)}
          </span>
        </div>
      </div>

      <div className="mt-5">
        {budgetAnalysis.budgetExceeded ? (
          <div className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs rounded-xl flex items-start gap-2">
            <span className="text-lg leading-none">⚠</span>
            <div><span className="font-bold">Budget exceeded!</span> Lower-cost substitutes applied.</div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs rounded-xl flex items-start gap-2">
            <span className="text-lg leading-none">✓</span>
            <div><span className="font-bold">Within budget.</span> Optional upgrades available.</div>
          </div>
        )}
      </div>
    </div>
  )
}
