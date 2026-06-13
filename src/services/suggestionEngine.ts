import type { MealPlan, UserInputs, HistoryEntry, Suggestions, Substitution } from '../types'

export function generateSuggestions(mealPlan: MealPlan, inputs: UserInputs, history: HistoryEntry[] = []): Suggestions {
  const alternatives: Suggestions['alternatives'] = []
  const cheaper: Suggestions['cheaper'] = []
  const healthier: Suggestions['healthier'] = []
  const quickCook: Suggestions['quickCook'] = []

  Object.entries(mealPlan).forEach(([mealType, meal]) => {
    if (!meal) return

    meal.recipe.substitutions.forEach((sub: Substitution) => {
      if (sub.costImpact < 0) {
        cheaper.push({
          mealType,
          recipeId: meal.recipe.id,
          original: sub.original,
          substitute: sub.substitute,
          savings: Math.abs(sub.costImpact) * inputs.peopleCount,
          dietaryImpact: sub.dietaryImpact,
          type: 'cheaper'
        })
      }

      if (sub.dietaryImpact.toLowerCase().includes('lower fat') ||
          sub.dietaryImpact.toLowerCase().includes('lower calorie') ||
          sub.dietaryImpact.toLowerCase().includes('higher fiber')) {
        healthier.push({
          mealType,
          recipeId: meal.recipe.id,
          original: sub.original,
          substitute: sub.substitute,
          dietaryImpact: sub.dietaryImpact,
          type: 'healthier'
        })
      }
    })

    const totalTime = meal.recipe.prepTime + meal.recipe.cookTime
    if (totalTime <= 15) {
      quickCook.push({
        mealType,
        name: meal.recipe.name,
        time: totalTime,
        type: 'quick'
      })
    }
  })

  const recentMeals = history.slice(0, 5).map(h => {
    if (h.meals) {
      return Object.values(h.meals).map(m => m?.name).filter(Boolean) as string[]
    }
    return []
  }).flat()

  Object.values(mealPlan).forEach(meal => {
    if (!meal) return
    if (recentMeals.includes(meal.recipe.name)) {
      alternatives.push({
        mealType: meal.recipe.mealType,
        name: meal.recipe.name,
        message: `You had ${meal.recipe.name} recently. Consider swapping!`,
        type: 'alternative'
      })
    }
  })

  return { alternatives, cheaper, healthier, quickCook }
}
