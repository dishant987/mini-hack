import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import BudgetStatus from '../components/BudgetStatus'
import { generateTodoList, generateTimeOptimizations } from '../services/budgetCalculator'
import { capitalize } from '../utils/helpers'
import MealPlanner from './MealPlanner'
import GroceryList from './GroceryList'
import TodoTimeline from './TodoTimeline'
import HistoryPage from './HistoryPage'
import AiSuggestions from '../components/AiSuggestions'
import type { Substitution } from '../types'

export default function Dashboard() {
  const { mealPlan, inputs, activeTab, setActiveTab, setStep, saveCurrentPlan, handleSwapIngredient, appliedSwaps, todoChecked } = useApp()
  const todoList = useMemo(() => generateTodoList(mealPlan), [mealPlan])
  const timeOptimizations = useMemo(() => generateTimeOptimizations(mealPlan), [mealPlan])

  const checklistCompletion = useMemo(() => {
    const allItems = [...todoList.morning, ...todoList.afternoon, ...todoList.evening]
    if (allItems.length === 0) return 0
    const checkedCount = allItems.filter(item => todoChecked[item]).length
    return Math.round((checkedCount / allItems.length) * 100)
  }, [todoList, todoChecked])

  const totalCalories = Object.values(mealPlan).reduce((sum, m) => sum + (m?.calories || 0), 0)
  const totalProtein = Object.values(mealPlan).reduce((sum, m) => sum + (m?.macros.protein || 0), 0)
  const totalCarbs = Object.values(mealPlan).reduce((sum, m) => sum + (m?.macros.carbs || 0), 0)
  const totalFat = Object.values(mealPlan).reduce((sum, m) => sum + (m?.macros.fat || 0), 0)
  const totalCookTime = Object.values(mealPlan).reduce((sum, m) => sum + (m ? m.recipe.prepTime + m.recipe.cookTime : 0), 0)

  const summaryTips = useMemo(() => {
    const tips: string[] = []
    if (inputs.skillLevel === 'beginner') {
      tips.push('Mise en Place: Chop and measure all ingredients before you turn on the stove.')
      tips.push('Moderate Heat: Stick to medium heat for better control.')
    } else if (inputs.skillLevel === 'intermediate') {
      tips.push('Pre-heating: Ensure pans/ovens are fully preheated for perfect browning.')
      tips.push('Seasoning layers: Salt and taste at each stage.')
    } else {
      tips.push('Texture focus: Focus on pan searing temperatures.')
      tips.push('Sauce Emulsification: Use cooking liquid for glossy emulsions.')
    }
    if (inputs.budget < 15) {
      tips.push('Build meals around bulk dry goods (oats, rice, lentils) to keep costs low.')
    }
    return tips
  }, [inputs.skillLevel, inputs.budget])

  const tabs = [
    { id: 'overview', label: 'Meal Plan', icon: '🍽' },
    { id: 'grocery', label: 'Grocery List', icon: '🛒' },
    { id: 'swaps', label: 'Swap Center', icon: '🔄' },
    { id: 'todo', label: 'Checklist', icon: '✓' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'optimizations', label: 'Time Hacks', icon: '⏱' },
    { id: 'ai', label: 'AI Chef', icon: '🤖' }
  ]

  return (
    <div className="pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm mb-8">
        <div>
          <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest">Dashboard</span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">Your Cooking Plan</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold"> {inputs.peopleCount} {inputs.peopleCount === 1 ? 'Person' : 'People'}</span>
            <span>•</span>
            <span className="capitalize font-semibold"> Skill: {inputs.skillLevel}</span>
            <span>•</span>
            <span className="capitalize font-semibold"> Goal: {inputs.healthGoal.replace('-', ' ')}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep(1)}
            className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer"
          >Adjust Inputs</button>
          <button
            onClick={saveCurrentPlan}
            className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-all cursor-pointer"
          >Save Plan</button>
          <button
            onClick={() => setStep(2)}
            className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md transition-all cursor-pointer"
          >+ Recipe</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-900 dark:to-slate-950 text-white rounded-3xl p-6 shadow-xl overflow-hidden border border-slate-800">
            <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Progress</h3>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-4xl font-extrabold">{checklistCompletion}%</div>
                <p className="text-xs text-slate-400 mt-1">Tasks completed</p>
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-slate-800" fill="transparent" />
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-emerald-500 transition-all" fill="transparent"
                    strokeDasharray={175} strokeDashoffset={175 - (175 * checklistCompletion) / 100} />
                </svg>
                <span className="absolute text-[10px] font-bold">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-4">Nutrition</h3>
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl mb-5">
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCalories}</div>
                <div className="text-xs text-slate-500">Total Kcal</div>
              </div>
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 text-xs font-bold px-2.5 py-1 rounded-lg">
                {capitalize(inputs.healthGoal.replace('-', ' '))}
              </span>
            </div>
            <div className="space-y-4">
              {([
                { label: 'Protein', value: totalProtein, max: 100, color: 'bg-emerald-500' },
                { label: 'Carbs', value: totalCarbs, max: 200, color: 'bg-amber-500' },
                { label: 'Fats', value: totalFat, max: 80, color: 'bg-indigo-500' }
              ] as const).map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{m.label}</span>
                    <span className="text-slate-500">{m.value}g</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full transition-all`} style={{ width: `${Math.min(100, (m.value / m.max) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BudgetStatus />

          {summaryTips.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-4">Coach Tips</h3>
              <ol className="space-y-3">
                {summaryTips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 space-y-6">
          <nav className="flex space-x-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {activeTab === 'overview' && <MealPlanner />}
          {activeTab === 'grocery' && <GroceryList />}
          {activeTab === 'todo' && <TodoTimeline />}
          {activeTab === 'history' && <HistoryPage />}
          {activeTab === 'ai' && <AiSuggestions />}

          {activeTab === 'swaps' && (
            <div className="space-y-6">
              {Object.values(mealPlan).filter(Boolean).map(meal => {
                if (!meal || !meal.recipe.substitutions.length) return null
                return (
                  <div key={meal.recipe.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold mb-4">{meal.recipe.name} - Swaps</h3>
                    <p className="text-xs text-slate-500 mb-4">Click to substitute ingredients.</p>
                    {meal.recipe.substitutions.map((sub: Substitution, i: number) => {
                      const swapKey = `${meal.recipe.id}:${sub.original}`
                      const isApplied = appliedSwaps[swapKey] === sub.substitute
                      return (
                        <button
                          key={i}
                          onClick={() => handleSwapIngredient(meal.recipe.id, sub.original, sub.substitute)}
                          className={`w-full p-3 rounded-xl border text-left text-xs mb-2 transition-all cursor-pointer ${
                            isApplied ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <span className="font-bold">{sub.original}</span> → <span className="text-emerald-500">{sub.substitute}</span>
                          <span className="ml-2 text-slate-500">({sub.costImpact < 0 ? 'Save' : 'Upgrade'} ${Math.abs(sub.costImpact).toFixed(2)})</span>
                          <p className="text-[10px] text-slate-400 mt-1">{sub.dietaryImpact}</p>
                          {isApplied && <span className="ml-2 text-emerald-500 text-[10px] font-bold">✓ Applied</span>}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'optimizations' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-1">Time Optimization Hacks</h2>
              <p className="text-xs text-slate-500 mb-6">Consolidate kitchen efforts and save time.</p>
              <div className="space-y-4">
                {timeOptimizations.map((tip, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0">⏱</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{tip}</p>
                  </div>
                ))}
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <p className="text-xs text-emerald-600 font-semibold">Total cooking time: ~{totalCookTime} minutes across all meals.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
