import { isAvailableInPantry } from '../utils/helpers'
import type { MealPlan, UserInputs, BudgetAnalysis, GroceryList, TodoList, Ingredient } from '../types'

export function calculateBudget(mealPlan: MealPlan, inputs: UserInputs): BudgetAnalysis {
  let totalMealCost = 0
  let totalGroceryCost = 0

  Object.values(mealPlan).forEach(meal => {
    if (!meal) return
    meal.ingredients.forEach((ing: Ingredient) => {
      const totalQty = ing.qtyPerPerson * inputs.peopleCount
      const cost = totalQty * ing.costPerUnit
      totalMealCost += cost
      if (!isAvailableInPantry(ing.name, inputs.availableIngredients)) {
        totalGroceryCost += cost
      }
    })
  })

  const costPerMeal = totalMealCost > 0 ? totalMealCost / 3 : 0
  const remainingBudget = inputs.budget - totalGroceryCost
  const budgetExceeded = remainingBudget < 0

  return {
    totalMealCost,
    groceryCost: totalGroceryCost,
    costPerMeal,
    remainingBudget,
    budgetExceeded,
    withinBudget: !budgetExceeded
  }
}

export function generateGroceryList(mealPlan: MealPlan, inputs: UserInputs): GroceryList {
  const list: GroceryList = {
    Vegetables: [],
    Fruits: [],
    Dairy: [],
    Protein: [],
    'Pantry Items': [],
    Spices: []
  }

  Object.values(mealPlan).forEach(meal => {
    if (!meal) return
    meal.ingredients.forEach((ing: Ingredient) => {
      const totalQty = ing.qtyPerPerson * inputs.peopleCount
      const totalCost = totalQty * ing.costPerUnit
      const available = isAvailableInPantry(ing.name, inputs.availableIngredients)
      const category = ing.category

      const existing = list[category as keyof GroceryList].find(item => item.name.toLowerCase() === ing.name.toLowerCase())
      if (existing) {
        existing.qty += totalQty
        existing.estimatedCost += available ? 0 : totalCost
        existing.originalCost += totalCost
      } else {
        list[category as keyof GroceryList].push({
          name: ing.name,
          qty: totalQty,
          unit: ing.unit,
          estimatedCost: available ? 0 : totalCost,
          originalCost: totalCost,
          isPantryAvailable: available
        })
      }
    })
  })

  return list
}

export function generateTodoList(mealPlan: MealPlan): TodoList {
  const morning: string[] = ['Purchase missing ingredients from grocery list']
  const afternoon: string[] = ['Assemble tools & preheat cooking surfaces']
  const evening: string[] = ['Check dinner ingredients', 'Wipe down countertops']

  const breakfast = mealPlan.breakfast
  const lunch = mealPlan.lunch
  const dinner = mealPlan.dinner

  if (breakfast) {
    morning.push(`Prep ingredients for ${breakfast.recipe.name}`)
    morning.push(`Cook ${breakfast.recipe.name} (${breakfast.recipe.prepTime + breakfast.recipe.cookTime} mins)`)
  }

  if (lunch) {
    afternoon.push(`Prepare ingredients for lunch: ${lunch.recipe.name}`)
    afternoon.push(`Cook & serve ${lunch.recipe.name} (Estimated time: ${lunch.recipe.prepTime + lunch.recipe.cookTime} mins)`)
    afternoon.push(`Store any leftover portions of ${lunch.recipe.name}`)
  }

  if (dinner) {
    evening.push(`Prepare ingredients for dinner: ${dinner.recipe.name}`)
    evening.push(`Cook & plate ${dinner.recipe.name} (Estimated time: ${dinner.recipe.prepTime + dinner.recipe.cookTime} mins)`)
    evening.push('Clean cooking pans and dishes')
    evening.push('Pack & store leftovers/remaining ingredients')
  }

  return { morning, afternoon, evening }
}

export function generateTimeOptimizations(mealPlan: MealPlan): string[] {
  const tips: string[] = []
  const allIngredients: Record<string, string[]> = {}

  Object.entries(mealPlan).forEach(([mealType, meal]) => {
    if (!meal) return
    meal.ingredients.forEach((ing: Ingredient) => {
      if (!allIngredients[ing.name]) allIngredients[ing.name] = []
      allIngredients[ing.name].push(mealType)
    })
  })

  const sharedIngredients = Object.entries(allIngredients)
    .filter(([, meals]) => meals.length > 1)
    .map(([name]) => name)

  if (sharedIngredients.length > 0) {
    tips.push(`Prep-Once: Chop and portion your shared ingredients (${sharedIngredients.slice(0, 3).join(', ')}) in the morning.`)
  }

  let hasGrain = false
  const grainMeals: string[] = []
  Object.entries(mealPlan).forEach(([mealType, meal]) => {
    if (!meal) return
    if (meal.ingredients.some((ing: Ingredient) => ing.name.toLowerCase().includes('rice') || ing.name.toLowerCase().includes('quinoa') || ing.name.toLowerCase().includes('oats'))) {
      hasGrain = true
      grainMeals.push(mealType)
    }
  })

  if (hasGrain && grainMeals.length > 1) {
    tips.push(`Batch Cooking: Cook grains (rice/oats) once for ${grainMeals.join(' & ')} and reheat.`)
  } else {
    tips.push('Batch Cooking: Cook extra grains to store for tomorrow.')
  }

  if (mealPlan.lunch && mealPlan.dinner) {
    tips.push(`Leftover Reuse: Store extra ${mealPlan.lunch.recipe.name} for tomorrow.`)
  }

  return tips
}
