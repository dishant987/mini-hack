import { useState, useCallback } from 'react'
import type { AppData, UserInputs, HistoryEntry } from '../types'

const STORAGE_KEY = 'cookingAppData'

const DEFAULT_DATA: AppData = {
  userProfile: {},
  mealPlans: [],
  groceryLists: [],
  todoTasks: [],
  history: []
}

function loadFromStorage(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_DATA, ...parsed }
    }
  } catch {
    console.warn('Failed to load localStorage data')
  }
  return { ...DEFAULT_DATA }
}

function saveToStorage(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    console.warn('Failed to save to localStorage')
  }
}

export function useLocalStorage() {
  const [data, setData] = useState<AppData>(loadFromStorage)

  const updateData = useCallback((updater: ((prev: AppData) => AppData) | Partial<AppData>) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      saveToStorage(next)
      return next
    })
  }, [])

  const setUserProfile = useCallback((profile: Partial<UserInputs>) => {
    updateData(prev => ({ ...prev, userProfile: { ...prev.userProfile, ...profile } }))
  }, [updateData])

  const addMealPlan = useCallback((plan: HistoryEntry) => {
    updateData(prev => ({ ...prev, mealPlans: [plan, ...prev.mealPlans] }))
  }, [updateData])

  const addGroceryList = useCallback((list: { id: number; date: string; items: any; totalCost: number }) => {
    updateData(prev => ({ ...prev, groceryLists: [list, ...prev.groceryLists] }))
  }, [updateData])

  const updateGroceryList = useCallback((index: number, items: any) => {
    updateData(prev => {
      const groceryLists = [...prev.groceryLists]
      if (groceryLists[index]) {
        groceryLists[index] = { ...groceryLists[index], items }
      }
      return { ...prev, groceryLists }
    })
  }, [updateData])

  const setTodoTasks = useCallback((tasks: Record<string, boolean>[]) => {
    updateData(prev => ({ ...prev, todoTasks: tasks }))
  }, [updateData])

  const addHistory = useCallback((entry: HistoryEntry) => {
    updateData(prev => {
      const history = [{ ...entry, id: Date.now(), savedAt: new Date().toISOString() }, ...prev.history]
      return { ...prev, history }
    })
  }, [updateData])

  const deleteHistory = useCallback((id: number) => {
    updateData(prev => ({
      ...prev,
      history: prev.history.filter(h => h.id !== id)
    }))
  }, [updateData])

  const clearData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setData({ ...DEFAULT_DATA })
  }, [])

  return {
    data,
    setUserProfile,
    addMealPlan,
    updateMealPlan: addMealPlan,
    addGroceryList,
    updateGroceryList,
    setTodoTasks,
    addHistory,
    deleteHistory,
    clearData,
    updateData
  }
}
