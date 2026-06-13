import { useApp } from '../context/AppContext'
import MealCard from '../components/MealCard'
import type { MealType } from '../types'

export default function MealPlanner() {
  const { mealPlan } = useApp()

  const types: MealType[] = ['breakfast', 'lunch', 'dinner']

  return (
    <div className="space-y-6">
      {types.map(type => {
        const meal = mealPlan[type]
        if (!meal) return (
          <div key={type} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center">
            <p className="text-slate-500 text-sm">No recipe matched for {type}. Try adjusting your preferences.</p>
          </div>
        )
        return <MealCard key={type} mealType={type} meal={meal} />
      })}
    </div>
  )
}
