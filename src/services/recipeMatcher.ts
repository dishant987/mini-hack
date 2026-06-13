import { isAllergyMatch } from '../utils/helpers'
import { getAllRecipes } from './recipeService'
import type { UserInputs, MatchedRecipes, MealPlan, MealType, Recipe } from '../types'

const categoryMap: Record<string, string> = {
  'tofu': 'Protein', 'paneer': 'Protein', 'chicken': 'Protein', 'lentil': 'Protein',
  'egg': 'Protein', 'bean': 'Protein', 'salmon': 'Protein', 'bacon': 'Protein',
  'hummus': 'Pantry Items', 'oil': 'Pantry Items', 'rice': 'Pantry Items',
  'oat': 'Pantry Items', 'pasta': 'Pantry Items', 'bread': 'Pantry Items',
  'mushroom': 'Vegetables', 'pea': 'Vegetables', 'spinach': 'Vegetables',
  'banana': 'Fruits', 'olive': 'Fruits', 'avocado': 'Fruits'
}

function inferCategory(name: string): string {
  const lower = name.toLowerCase()
  for (const [key, cat] of Object.entries(categoryMap)) {
    if (lower.includes(key)) return cat
  }
  return 'Pantry Items'
}

export function matchRecipes(inputs: UserInputs): MatchedRecipes {
  const selected: MatchedRecipes = { breakfast: null, lunch: null, dinner: null }
  const types: MealType[] = ['breakfast', 'lunch', 'dinner']

  types.forEach(type => {
    const allowedTime = type === 'breakfast' ? inputs.breakfastTime : type === 'lunch' ? inputs.lunchTime : inputs.dinnerTime

    const allRecipes = getAllRecipes()
    let candidates = allRecipes.filter((r: Recipe) => r.mealType === type)

    if (inputs.dietaryPreference !== 'none') {
      const filtered = candidates.filter(r => {
        if (inputs.dietaryPreference === 'vegetarian') {
          return r.dietaryTags.includes('vegetarian') || r.dietaryTags.includes('vegan')
        }
        if (inputs.dietaryPreference === 'low-carb') {
          return r.dietaryTags.includes('low-carb') || r.dietaryTags.includes('keto')
        }
        return r.dietaryTags.includes(inputs.dietaryPreference)
      })
      if (filtered.length > 0) candidates = filtered
    }

    const scored = candidates.map(recipe => {
      let score = 0

      if (inputs.skillLevel === recipe.skillLevel) score += 8
      else if (inputs.skillLevel === 'intermediate' && recipe.skillLevel === 'beginner') score += 5
      else if (inputs.skillLevel === 'advanced') score += 5

      const matchesCuisine = recipe.cuisines.some(c => inputs.preferredCuisines.includes(c)) || inputs.preferredCuisines.includes('Any')
      if (matchesCuisine) score += 10

      const totalTime = recipe.prepTime + recipe.cookTime
      if (totalTime <= allowedTime) score += 12
      else score -= (totalTime - allowedTime)

      let allergyConflict = false
      recipe.ingredients.forEach(ing => {
        const ingName = ing.name.toLowerCase()
        inputs.allergies.forEach(allergy => {
          if (isAllergyMatch(ingName, allergy)) {
            const hasSub = recipe.substitutions.some(s => s.original.toLowerCase() === ingName)
            if (!hasSub) allergyConflict = true
            else score -= 2
          }
        })
      })
      if (allergyConflict) score -= 100

      if (inputs.healthGoal === 'weight-loss' && recipe.calories < 500) score += 6
      else if (inputs.healthGoal === 'muscle-gain' && recipe.macros.protein > 25) score += 8
      else if (inputs.healthGoal === 'budget-saving') score += (10 - recipe.baseCost * 2)

      return { recipe, score }
    })

    scored.sort((a, b) => b.score - a.score)
    selected[type] = scored[0]?.recipe || null
  })

  return selected
}

export function resolveMeals(matchedRecipes: MatchedRecipes, inputs: UserInputs, appliedSwaps: Record<string, string>): MealPlan {
  const results: MealPlan = { breakfast: null, lunch: null, dinner: null }
  const types: MealType[] = ['breakfast', 'lunch', 'dinner']

  types.forEach(type => {
    const recipe = matchedRecipes[type]
    if (!recipe) return

    const ingredients: typeof recipe.ingredients = []
    const instructions = [...recipe.instructions]
    const autoSwapsApplied: string[] = []
    let totalCal = recipe.calories
    let totalProt = recipe.macros.protein
    let totalCarb = recipe.macros.carbs
    let totalFat = recipe.macros.fat

    const currentSwaps = { ...appliedSwaps }

    recipe.ingredients.forEach(ing => {
      const ingNameLower = ing.name.toLowerCase()
      inputs.allergies.forEach(allergy => {
        if (isAllergyMatch(ingNameLower, allergy)) {
          const sub = recipe.substitutions.find(s => s.original.toLowerCase() === ingNameLower)
          const swapKey = `${recipe.id}:${ing.name}`
          if (sub && !currentSwaps[swapKey]) {
            currentSwaps[swapKey] = sub.substitute
            autoSwapsApplied.push(`${ing.name} → ${sub.substitute} (Allergy Safe: ${allergy})`)
          }
        }
      })
    })

    recipe.ingredients.forEach(ing => {
      const swapKey = `${recipe.id}:${ing.name}`
      const substitutedName = currentSwaps[swapKey]

      if (substitutedName) {
        const sub = recipe.substitutions.find(s =>
          s.substitute.toLowerCase() === substitutedName.toLowerCase() &&
          s.original.toLowerCase() === ing.name.toLowerCase()
        )

        const category = inferCategory(substitutedName)
        const costDiff = sub ? sub.costImpact : 0
        const newCost = Math.max(0.1, ing.costPerUnit * (1 + costDiff))

        if (sub) {
          const impactLower = sub.dietaryImpact.toLowerCase()
          if (impactLower.includes('vegan') || impactLower.includes('vegetarian')) {
            if (ing.name === 'Chicken Breast' && substitutedName === 'Firm Tofu') {
              totalProt -= 15; totalFat += 4
            } else if (ing.name === 'Chicken Breast' && substitutedName === 'Paneer') {
              totalProt -= 10; totalFat += 20
            }
          } else if (impactLower.includes('lower fat') || impactLower.includes('reduces creaminess')) {
            totalFat -= 10; totalCal -= 90
          } else if (impactLower.includes('lower cost') || impactLower.includes('budget-friendly')) {
            if (ing.name === 'Mixed Berries' && substitutedName === 'Bananas') {
              totalCarb += 10; totalCal += 20
            }
          }
        }

        ingredients.push({ ...ing, name: substitutedName, category: category as any, costPerUnit: newCost })

        instructions.forEach((inst, idx) => {
          const regex = new RegExp(ing.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
          instructions[idx] = inst.replace(regex, substitutedName)
        })
      } else {
        ingredients.push({ ...ing })
      }
    })

    const baseCost = ingredients.reduce((sum, ing) => sum + (ing.qtyPerPerson * ing.costPerUnit), 0)

    results[type] = {
      recipe,
      ingredients,
      instructions,
      calories: totalCal,
      macros: { protein: totalProt, carbs: totalCarb, fat: totalFat },
      cost: baseCost,
      autoSwapsApplied
    }
  })

  return results
}
