import { recipeDatabase, type Recipe } from '../recipes'

const CUSTOM_RECIPES_KEY = 'cookingAppCustomRecipes'

export function loadCustomRecipes(): Recipe[] {
  try {
    const raw = localStorage.getItem(CUSTOM_RECIPES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCustomRecipes(recipes: Recipe[]): void {
  try {
    localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(recipes))
  } catch {
    console.warn('Failed to save custom recipes')
  }
}

export function addCustomRecipe(recipe: Recipe): Recipe[] {
  const recipes = loadCustomRecipes()
  recipes.unshift(recipe)
  saveCustomRecipes(recipes)
  return recipes
}

export function deleteCustomRecipe(recipeId: string): Recipe[] {
  const recipes = loadCustomRecipes().filter(r => r.id !== recipeId)
  saveCustomRecipes(recipes)
  return recipes
}

export function getAllRecipes(): Recipe[] {
  const custom = loadCustomRecipes()
  return [...recipeDatabase, ...custom]
}

export function generateRecipeId(): string {
  return 'custom_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
