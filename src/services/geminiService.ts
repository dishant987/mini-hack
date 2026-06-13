import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai'
import type { MealPlan, UserInputs, HistoryEntry } from '../types'

let genAI: GoogleGenerativeAI | null = null
let model: GenerativeModel | null = null

export type GeminiStatus = 'no_key' | 'connected' | 'error' | 'checking'

let _lastStatus: GeminiStatus = 'no_key'

function getApiKey(): string | null {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  // Gemini API keys start with "AIza"
  if (!key || key.trim().length < 10) return null
  return key.trim()
}

function initModel() {
  const apiKey = getApiKey()
  if (!apiKey) {
    _lastStatus = 'no_key'
    return false
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey)
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  }
  return true
}

export function getGeminiStatus(): GeminiStatus {
  return _lastStatus
}

function buildPrompt(inputs: UserInputs, mealPlan: MealPlan, history: HistoryEntry[]): string {
  const mealSummary = ['breakfast', 'lunch', 'dinner']
    .map(type => {
      const m = mealPlan[type as keyof MealPlan]
      return m ? `${type}: ${m.recipe.name} (${m.calories} cal, ${m.cost.toFixed(2)})` : `${type}: none`
    })
    .join('\n')

  const historySummary = history.slice(0, 3).map(h => {
    const meals = h.meals ? Object.values(h.meals).filter(Boolean).map(m => m!.name).join(', ') : ''
    return `[${new Date(h.date).toLocaleDateString()}] ${meals}`
  }).join('\n')

  return `You are a professional AI nutritionist and personal chef. Based on the user's profile and current meal plan, provide helpful cooking suggestions.

USER PROFILE:
- People: ${inputs.peopleCount}
- Diet: ${inputs.dietaryPreference}
- Allergies: ${inputs.allergies.join(', ') || 'none'}
- Skill Level: ${inputs.skillLevel}
- Budget: $${inputs.budget}/day
- Health Goal: ${inputs.healthGoal}
- Cuisines: ${inputs.preferredCuisines.join(', ')}

CURRENT MEAL PLAN:
${mealSummary}

RECENT HISTORY:
${historySummary || 'No history'}

Respond with a JSON object (no markdown, no code fences) with this structure:
{
  "tipOfTheDay": "one short actionable cooking tip (15 words max)",
  "mealSuggestions": [
    {
      "type": "breakfast|lunch|dinner",
      "name": "dish name",
      "reason": "why this fits their profile (10 words max)"
    }
  ],
  "budgetTips": ["tip 1", "tip 2"],
  "ingredientSwaps": [
    {
      "original": "ingredient name",
      "swap": "cheaper/healthier alternative",
      "reason": "brief explanation"
    }
  ],
  "weeklyPrepAdvice": "one sentence of weekly meal prep advice (20 words max)"
}

Keep suggestions practical, specific to their profile, and budget-aware.`
}

export interface AiSuggestionResult {
  tipOfTheDay: string
  mealSuggestions: { type: string; name: string; reason: string }[]
  budgetTips: string[]
  ingredientSwaps: { original: string; swap: string; reason: string }[]
  weeklyPrepAdvice: string
}

const FALLBACK_SUGGESTIONS: AiSuggestionResult = {
  tipOfTheDay: 'Prep ingredients the night before to save 15 minutes cooking time.',
  mealSuggestions: [],
  budgetTips: ['Buy grains in bulk to reduce cost per meal.', 'Seasonal vegetables are cheaper and fresher.'],
  ingredientSwaps: [],
  weeklyPrepAdvice: 'Cook a large batch of rice or quinoa on Sunday to use throughout the week.'
}

export async function getAiSuggestions(
  inputs: UserInputs,
  mealPlan: MealPlan,
  history: HistoryEntry[]
): Promise<AiSuggestionResult> {
  if (!initModel()) {
    _lastStatus = 'no_key'
    return { ...FALLBACK_SUGGESTIONS, tipOfTheDay: 'Set your Gemini API key in .env to unlock AI suggestions.' }
  }

  _lastStatus = 'checking'

  try {
    const prompt = buildPrompt(inputs, mealPlan, history)
    const result = await model!.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const parsed: AiSuggestionResult = JSON.parse(cleaned)

    _lastStatus = 'connected'
    return {
      tipOfTheDay: parsed.tipOfTheDay || FALLBACK_SUGGESTIONS.tipOfTheDay,
      mealSuggestions: parsed.mealSuggestions || [],
      budgetTips: parsed.budgetTips || [],
      ingredientSwaps: parsed.ingredientSwaps || [],
      weeklyPrepAdvice: parsed.weeklyPrepAdvice || FALLBACK_SUGGESTIONS.weeklyPrepAdvice
    }
  } catch (err) {
    console.warn('Gemini API error:', err)
    _lastStatus = 'error'
    // Reset cached model so the user can retry (e.g. after fixing the key)
    genAI = null
    model = null
    return { ...FALLBACK_SUGGESTIONS, tipOfTheDay: 'AI temporarily unavailable. Using smart defaults.' }
  }
}

export function hasGeminiKey(): boolean {
  return getApiKey() !== null
}
