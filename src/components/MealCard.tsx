import { useApp } from '../context/AppContext'
import { isAvailableInPantry } from '../utils/helpers'
import type { ResolvedMeal, MealType } from '../types'

interface MealCardProps {
  mealType: MealType
  meal: ResolvedMeal
}

export default function MealCard({ mealType, meal }: MealCardProps) {
  const { inputs } = useApp()
  if (!meal) return null

  const headerStyle = mealType === 'breakfast'
    ? 'from-amber-500 to-rose-500 text-amber-500 bg-amber-500/10'
    : mealType === 'lunch'
    ? 'from-emerald-500 to-teal-500 text-emerald-500 bg-emerald-500/10'
    : 'from-indigo-500 to-violet-500 text-indigo-500 bg-indigo-500/10'

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-lg transition-all">
      <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg capitalize ${headerStyle}`}>
            {mealType}
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{meal.recipe.name}</h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
          <span> {meal.recipe.prepTime + meal.recipe.cookTime} mins</span>
          <span> {meal.calories} Kcal</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Ingredients</h3>
          <ul className="space-y-2">
            {meal.ingredients.map((ing, i) => {
              const available = isAvailableInPantry(ing.name, inputs.availableIngredients)
              return (
                <li key={i} className="flex items-center justify-between text-xs border-b border-slate-50 dark:border-slate-800 pb-2">
                  <span className={available ? 'line-through text-slate-400 font-medium' : 'font-medium'}>
                    {ing.name} {available && <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1 py-0.5 rounded font-bold ml-1">Pantry</span>}
                  </span>
                  <span className="text-slate-500 font-semibold">{(ing.qtyPerPerson * inputs.peopleCount).toFixed(0)} {ing.unit}</span>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="md:col-span-7 space-y-4">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Steps</h3>
          <ol className="space-y-3">
            {meal.instructions.map((stepText, i) => (
              <li key={i} className="flex gap-3 text-xs leading-relaxed">
                <span className="font-bold text-emerald-500 text-right w-4">{i + 1}.</span>
                <span className="text-slate-600 dark:text-slate-300">{stepText}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {meal.autoSwapsApplied.length > 0 && (
        <div className="bg-rose-500/5 dark:bg-rose-500/10 border-t border-rose-500/10 px-6 py-2.5 text-[11px] text-rose-500 flex items-center gap-1.5">
          <span> Auto-Allergy Swaps:</span>
          <span className="font-semibold">{meal.autoSwapsApplied.join(' | ')}</span>
        </div>
      )}
    </div>
  )
}
