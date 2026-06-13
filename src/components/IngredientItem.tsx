import type { GroceryItem } from '../types'

interface IngredientItemProps {
  ingredient: GroceryItem
  checked: boolean
  onToggle: () => void
  showCost?: boolean
}

export default function IngredientItem({ ingredient, checked, onToggle, showCost = false }: IngredientItemProps) {
  return (
    <div
      onClick={onToggle}
      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
        ingredient.isPantryAvailable
          ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 opacity-60'
          : checked
          ? 'border-emerald-500/50 bg-emerald-500/[0.02]'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={ingredient.isPantryAvailable || checked}
          disabled={ingredient.isPantryAvailable}
          onChange={() => {}}
          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />
        <span className={`text-xs font-medium ${
          (ingredient.isPantryAvailable || checked) ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
        }`}>
          {ingredient.name}
          {ingredient.isPantryAvailable && (
            <span className="ml-1.5 px-1 py-0.2 bg-slate-200 dark:bg-slate-800 text-slate-500 text-[8px] font-bold rounded uppercase">Pantry</span>
          )}
        </span>
      </div>
      <span className="text-xs text-slate-500 font-bold text-right">
        {ingredient.qty.toFixed(0)} {ingredient.unit}
        {showCost && !ingredient.isPantryAvailable && (
          <span className="block text-[9px] text-emerald-500 mt-0.5">${ingredient.estimatedCost.toFixed(2)}</span>
        )}
      </span>
    </div>
  )
}
