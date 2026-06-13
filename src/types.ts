import type { Recipe, Ingredient, Substitution } from './recipes'

export type { Recipe, Ingredient, Substitution }

export type MealType = 'breakfast' | 'lunch' | 'dinner'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export type HealthGoal = 'weight-loss' | 'muscle-gain' | 'maintenance' | 'budget-saving'

export interface UserInputs {
  name: string
  peopleCount: number
  skillLevel: SkillLevel
  preferredCuisines: string[]
  dietaryPreference: string
  allergies: string[]
  budget: number
  breakfastTime: number
  lunchTime: number
  dinnerTime: number
  availableIngredients: string[]
  healthGoal: HealthGoal
}

export interface ResolvedMeal {
  recipe: Recipe
  ingredients: Ingredient[]
  instructions: string[]
  calories: number
  macros: { protein: number; carbs: number; fat: number }
  cost: number
  autoSwapsApplied: string[]
}

export interface MealPlan {
  breakfast: ResolvedMeal | null
  lunch: ResolvedMeal | null
  dinner: ResolvedMeal | null
}

export interface MatchedRecipes {
  breakfast: Recipe | null
  lunch: Recipe | null
  dinner: Recipe | null
}

export interface BudgetAnalysis {
  totalMealCost: number
  groceryCost: number
  costPerMeal: number
  remainingBudget: number
  budgetExceeded: boolean
  withinBudget: boolean
}

export interface GroceryItem {
  name: string
  qty: number
  unit: string
  estimatedCost: number
  originalCost: number
  isPantryAvailable: boolean
}

export interface GroceryList {
  Vegetables: GroceryItem[]
  Fruits: GroceryItem[]
  Dairy: GroceryItem[]
  Protein: GroceryItem[]
  'Pantry Items': GroceryItem[]
  Spices: GroceryItem[]
}

export interface TodoList {
  morning: string[]
  afternoon: string[]
  evening: string[]
}

export interface Suggestion {
  mealType?: string
  recipeId?: string
  original?: string
  substitute?: string
  savings?: number
  dietaryImpact?: string
  type: string
  name?: string
  time?: number
  message?: string
}

export interface Suggestions {
  alternatives: Suggestion[]
  cheaper: Suggestion[]
  healthier: Suggestion[]
  quickCook: Suggestion[]
}

export interface HistoryEntry {
  id: number
  date: string
  savedAt?: string
  inputs?: Partial<UserInputs>
  meals?: Record<string, { name: string; id: string; calories: number; cost: number } | undefined>
  budget?: BudgetAnalysis
  swaps?: Record<string, string>
  todo?: Record<string, boolean>
  grocery?: Record<string, boolean>
}

export interface AppData {
  userProfile: Partial<UserInputs>
  mealPlans: HistoryEntry[]
  groceryLists: { id: number; date: string; items: GroceryList; totalCost: number }[]
  todoTasks: Record<string, boolean>[]
  history: HistoryEntry[]
  customRecipes?: Recipe[]
}

export type DietOption = { id: string; label: string; desc: string }

export type GoalOption = { id: string; label: string; desc: string }
