import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { generateTodoList } from '../services/budgetCalculator'
import type { TodoList } from '../types'

export default function TodoTimeline() {
  const { mealPlan, todoChecked, setTodoChecked } = useApp()

  const todoList: TodoList = useMemo(() => generateTodoList(mealPlan), [mealPlan])

  const checklistCompletion = useMemo(() => {
    const allItems = [...todoList.morning, ...todoList.afternoon, ...todoList.evening]
    if (allItems.length === 0) return 0
    const checkedCount = allItems.filter(item => todoChecked[item]).length
    return Math.round((checkedCount / allItems.length) * 100)
  }, [todoList, todoChecked])

  const handleToggle = (item: string) => {
    setTodoChecked(prev => ({ ...prev, [item]: !prev[item] }))
  }

  interface SectionDef {
    key: keyof TodoList
    label: string
    icon: string
  }

  const sections: SectionDef[] = [
    { key: 'morning', label: 'Morning Preparation', icon: '☀' },
    { key: 'afternoon', label: 'Afternoon: Lunch', icon: '🌤' },
    { key: 'evening', label: 'Evening: Dinner & Clean', icon: '🌙' }
  ]

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Cooking Timeline</h2>
          <p className="text-xs text-slate-500 mt-1">Track your cooking progress throughout the day.</p>
        </div>
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-1 rounded-full font-bold">
          {checklistCompletion}% Done
        </span>
      </div>

      <div className="space-y-6">
        {sections.map(section => {
          const items = todoList[section.key]
          if (!items || items.length === 0) return null
          return (
            <div key={section.key} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                <span className="text-lg">{section.icon}</span>
                <span>{section.label}</span>
              </div>
              <div className="space-y-2 pl-6 border-l border-slate-200 dark:border-slate-700">
                {items.map((item, idx) => {
                  const isChecked = !!todoChecked[item]
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggle(item)}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-emerald-500/55 bg-emerald-500/[0.02]'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-slate-300 focus:ring-emerald-500"
                      />
                      <span className={`text-xs font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {item}
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
