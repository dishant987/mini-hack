import { createContext, useContext, useMemo, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { matchRecipes, resolveMeals } from '../services/recipeMatcher'
import { calculateBudget } from '../services/budgetCalculator'
import { generateSuggestions } from '../services/suggestionEngine'
import type { UserInputs, MealPlan, MatchedRecipes, BudgetAnalysis, Suggestions, AppData, HistoryEntry, HealthGoal, SkillLevel } from '../types'

interface AppContextValue {
  inputs: UserInputs
  setInputs: React.Dispatch<React.SetStateAction<UserInputs>>
  step: number
  setStep: React.Dispatch<React.SetStateAction<number>>
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
  darkMode: boolean
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
  pantryInput: string
  setPantryInput: React.Dispatch<React.SetStateAction<string>>
  appliedSwaps: Record<string, string>
  setAppliedSwaps: React.Dispatch<React.SetStateAction<Record<string, string>>>
  todoChecked: Record<string, boolean>
  setTodoChecked: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  groceryBought: Record<string, boolean>
  setGroceryBought: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  mealPlan: MealPlan
  matchedRecipes: MatchedRecipes
  budgetAnalysis: BudgetAnalysis
  suggestions: Suggestions
  handleSwapIngredient: (recipeId: string, original: string, substitute: string) => void
  resetPlanStates: () => void
  saveCurrentPlan: () => void
  loadHistoryPlan: (entry: HistoryEntry) => void
  data: AppData
  deleteHistory: (id: number) => void
  setUserProfile: (profile: Partial<UserInputs>) => void
  setTodoTasks: (tasks: Record<string, boolean>[]) => void
  updateData: (updater: ((prev: AppData) => AppData) | Partial<AppData>) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const DEFAULT_INPUTS: UserInputs = {
  name: '',
  peopleCount: 2,
  skillLevel: 'beginner',
  preferredCuisines: ['Any'],
  dietaryPreference: 'none',
  allergies: [],
  budget: 20,
  breakfastTime: 15,
  lunchTime: 30,
  dinnerTime: 40,
  availableIngredients: ['Salt', 'Pepper', 'Olive Oil'],
  healthGoal: 'maintenance'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const ls = useLocalStorage()
  const { data, setUserProfile, addMealPlan, addHistory, deleteHistory, setTodoTasks, updateData } = ls

  const [inputs, setInputs] = useState<UserInputs>(DEFAULT_INPUTS)
  const [appliedSwaps, setAppliedSwaps] = useState<Record<string, string>>({})
  const [todoChecked, setTodoChecked] = useState<Record<string, boolean>>({})
  const [groceryBought, setGroceryBought] = useState<Record<string, boolean>>({})
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [step, setStep] = useState(0)
  const [pantryInput, setPantryInput] = useState('')

  useEffect(() => {
    if (data.userProfile?.name) {
      setInputs(prev => ({
        ...prev,
        name: data.userProfile.name || '',
        peopleCount: data.userProfile.peopleCount || 2,
        dietaryPreference: data.userProfile.dietaryPreference || 'none',
        allergies: data.userProfile.allergies || [],
        skillLevel: (data.userProfile.skillLevel as SkillLevel) || 'beginner',
        preferredCuisines: data.userProfile.preferredCuisines || ['Any'],
        budget: data.userProfile.budget || 20,
        healthGoal: (data.userProfile.healthGoal as HealthGoal) || 'maintenance'
      }))
    }
  }, [data.userProfile])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const matchedRecipes = useMemo(() => matchRecipes(inputs), [inputs])

  const mealPlan = useMemo(() => resolveMeals(matchedRecipes, inputs, appliedSwaps), [matchedRecipes, inputs, appliedSwaps])

  const budgetAnalysis = useMemo(() => calculateBudget(mealPlan, inputs), [mealPlan, inputs])

  const suggestions = useMemo(() => generateSuggestions(mealPlan, inputs, data.history), [mealPlan, inputs, data.history])

  useEffect(() => {
    if (budgetAnalysis.budgetExceeded) {
      let newSwaps = { ...appliedSwaps }
      let appliedAny = false
      Object.values(mealPlan).forEach(meal => {
        if (!meal) return
        meal.recipe.substitutions.forEach((sub: { costImpact: number; original: string; substitute: string }) => {
          const swapKey = `${meal.recipe.id}:${sub.original}`
          if (sub.costImpact < 0 && !newSwaps[swapKey]) {
            newSwaps[swapKey] = sub.substitute
            appliedAny = true
          }
        })
      })
      if (appliedAny) setAppliedSwaps(newSwaps)
    }
  }, [budgetAnalysis.budgetExceeded])

  const handleSwapIngredient = useCallback((recipeId: string, original: string, substitute: string) => {
    setAppliedSwaps(prev => {
      const key = `${recipeId}:${original}`
      const copy = { ...prev }
      if (copy[key] === substitute) delete copy[key]
      else copy[key] = substitute
      return copy
    })
  }, [])

  const resetPlanStates = useCallback(() => {
    setAppliedSwaps({})
    setTodoChecked({})
    setGroceryBought({})
  }, [])

  const saveCurrentPlan = useCallback(() => {
    const planEntry: HistoryEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      inputs: { ...inputs },
      meals: Object.entries(mealPlan).reduce<Record<string, { name: string; id: string; calories: number; cost: number } | undefined>>((acc, [key, val]) => {
        if (val) acc[key] = { name: val.recipe.name, id: val.recipe.id, calories: val.calories, cost: val.cost }
        return acc
      }, {}),
      budget: budgetAnalysis,
      swaps: { ...appliedSwaps },
      todo: { ...todoChecked },
      grocery: { ...groceryBought }
    }
    addHistory(planEntry)
    addMealPlan(planEntry)
  }, [inputs, mealPlan, budgetAnalysis, appliedSwaps, todoChecked, groceryBought, addHistory, addMealPlan])

  const loadHistoryPlan = useCallback((entry: HistoryEntry) => {
    if (entry.inputs) {
      setInputs(prev => ({ ...prev, ...entry.inputs } as UserInputs))
      resetPlanStates()
      if (entry.swaps) setAppliedSwaps(entry.swaps)
      setStep(4)
    }
  }, [resetPlanStates])

  const value = useMemo<AppContextValue>(() => ({
    inputs, setInputs,
    step, setStep,
    activeTab, setActiveTab,
    darkMode, setDarkMode,
    pantryInput, setPantryInput,
    appliedSwaps, setAppliedSwaps,
    todoChecked, setTodoChecked,
    groceryBought, setGroceryBought,
    mealPlan, matchedRecipes, budgetAnalysis, suggestions,
    handleSwapIngredient, resetPlanStates,
    saveCurrentPlan, loadHistoryPlan,
    data, deleteHistory, setUserProfile, setTodoTasks, updateData
  }), [inputs, step, activeTab, darkMode, pantryInput, appliedSwaps, todoChecked, groceryBought, mealPlan, matchedRecipes, budgetAnalysis, suggestions, handleSwapIngredient, resetPlanStates, saveCurrentPlan, loadHistoryPlan, data, deleteHistory, setUserProfile, setTodoTasks, updateData])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
