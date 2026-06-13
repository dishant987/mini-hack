import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { HistoryEntry } from '../types'

export default function HistoryPage() {
  const { data, deleteHistory, loadHistoryPlan } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filteredHistory = data.history.filter((entry: HistoryEntry) => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    const meals = entry.meals ? Object.values(entry.meals).map(m => m?.name || '').join(' ') : ''
    return meals.toLowerCase().includes(term) ||
      (entry.date && entry.date.toLowerCase().includes(term))
  })

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return 'Unknown'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold">Meal History</h2>
            <p className="text-xs text-slate-500 mt-1">{data.history.length} saved plans</p>
          </div>
          <input
            type="text" placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-64"
          />
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg mb-2">No history yet</p>
            <p className="text-xs">Save your meal plans to see them here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map(entry => (
              <div
                key={entry.id}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
              >
                <div
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {formatDate(entry.date)}
                      </span>
                      {entry.budget && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          entry.budget.withinBudget
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          ${entry.budget.groceryCost?.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
                      {entry.meals && Object.entries(entry.meals).map(([type, meal]) => (
                        <span key={type} className="capitalize">
                          {type}: <span className="font-semibold text-slate-800 dark:text-slate-200">{meal?.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); loadHistoryPlan(entry) }}
                      className="px-3 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors cursor-pointer"
                    >Reuse</button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteHistory(entry.id) }}
                      className="px-3 py-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-colors cursor-pointer"
                    >Delete</button>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === entry.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {expandedId === entry.id && (
                  <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="font-bold text-slate-500 block mb-1">Inputs</span>
                        <div className="space-y-1 text-slate-600 dark:text-slate-400">
                          <p>People: {entry.inputs?.peopleCount}</p>
                          <p>Diet: {entry.inputs?.dietaryPreference || 'none'}</p>
                          <p>Budget: ${entry.inputs?.budget}</p>
                          <p>Skill: {entry.inputs?.skillLevel}</p>
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 block mb-1">Budget</span>
                        <div className="space-y-1 text-slate-600 dark:text-slate-400">
                          <p>Grocery: ${entry.budget?.groceryCost?.toFixed(2)}</p>
                          <p>Total: ${entry.budget?.totalMealCost?.toFixed(2)}</p>
                          <p>Remaining: ${entry.budget?.remainingBudget?.toFixed(2)}</p>
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 block mb-1">Meals</span>
                        <div className="space-y-1 text-slate-600 dark:text-slate-400">
                          {entry.meals && Object.entries(entry.meals).map(([type, meal]) => (
                            <p key={type} className="capitalize">
                              {type}: {meal?.name} ({meal?.calories} cal)
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
