import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { generateGroceryList } from '../services/budgetCalculator'

export default function GroceryList() {
  const { mealPlan, inputs, groceryBought, setGroceryBought, budgetAnalysis, updateData } = useApp()

  const groceryList = useMemo(() => generateGroceryList(mealPlan, inputs), [mealPlan, inputs])

  const handleToggle = (category: string, name: string) => {
    const id = `${category}-${name}`
    setGroceryBought(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSaveList = () => {
    const listEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: groceryList,
      totalCost: budgetAnalysis.groceryCost
    }
    updateData(prev => ({
      ...prev,
      groceryLists: [listEntry, ...prev.groceryLists]
    }))
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Grocery List</h2>
          <p className="text-xs text-slate-500 mt-1">Cross off items as you gather them.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-emerald-500/10 text-emerald-500 text-xs px-2.5 py-1 rounded-full font-bold">
            Est. ${budgetAnalysis.groceryCost.toFixed(2)}
          </span>
          <button
            onClick={handleSaveList}
            className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
          >Save List</button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groceryList).map(([category, items]) => {
          if (items.length === 0) return null
          return (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((item: { name: string; qty: number; unit: string; estimatedCost: number; isPantryAvailable: boolean }, idx: number) => {
                  const id = `${category}-${item.name}`
                  const isChecked = !!groceryBought[id]
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggle(category, item.name)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        item.isPantryAvailable
                          ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/50 opacity-60'
                          : isChecked
                          ? 'border-emerald-500/50 bg-emerald-500/[0.02]'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.isPantryAvailable || isChecked}
                          disabled={item.isPantryAvailable}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className={`text-xs font-medium ${
                          (item.isPantryAvailable || isChecked) ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {item.name}
                          {item.isPantryAvailable && (
                            <span className="ml-1.5 px-1 py-0.2 bg-slate-200 dark:bg-slate-800 text-slate-500 text-[8px] font-bold rounded uppercase">Pantry</span>
                          )}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-bold text-right">
                        {item.qty.toFixed(0)} {item.unit}
                        {!item.isPantryAvailable && (
                          <span className="block text-[9px] text-emerald-500 mt-0.5">${item.estimatedCost.toFixed(2)}</span>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
