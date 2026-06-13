import { useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { getAiSuggestions, hasGeminiKey, getGeminiStatus } from '../services/geminiService'
import type { AiSuggestionResult, GeminiStatus } from '../services/geminiService'

export default function AiSuggestions() {
  const { inputs, mealPlan, data } = useApp()
  const [suggestions, setSuggestions] = useState<AiSuggestionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [geminiStatus, setGeminiStatus] = useState<GeminiStatus>(getGeminiStatus())

  const generate = useCallback(async () => {
    setLoading(true)
    setError(null)
    setGeminiStatus('checking')
    try {
      const result = await getAiSuggestions(inputs, mealPlan, data.history)
      setSuggestions(result)
    } catch {
      setError('Failed to get AI suggestions. Please try again.')
    } finally {
      setLoading(false)
      setGeminiStatus(getGeminiStatus())
    }
  }, [inputs, mealPlan, data.history])

  const hasKey = hasGeminiKey()

  const statusConfig: Record<GeminiStatus, { label: string; color: string; dot: string }> = {
    no_key:    { label: 'No API Key',  color: 'text-amber-500 bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-400' },
    checking:  { label: 'Checking…',   color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',   dot: 'bg-blue-400 animate-pulse' },
    connected: { label: 'Connected ✓', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400' },
    error:     { label: 'API Error',   color: 'text-rose-500 bg-rose-500/10 border-rose-500/30',   dot: 'bg-rose-400' },
  }
  const status = statusConfig[geminiStatus]

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold">AI Chef Assistant</h2>
              {/* Gemini Status Badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${status.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                Gemini: {status.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {hasKey
                ? 'Powered by Google Gemini — get personalized cooking advice.'
                : 'Add your Gemini API key in .env to unlock AI suggestions.'}
            </p>
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Thinking...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18l.75-2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Generate AI Suggestions
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500 mb-4">{error}</div>
        )}

        {!suggestions && !loading && (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">🤖</div>
            <p className="text-sm font-medium">Tap the button above</p>
            <p className="text-xs mt-1">Gemini will analyze your meal plan and offer smart suggestions.</p>
          </div>
        )}

        {loading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
        )}

        {suggestions && !loading && (
          <div className="space-y-6">
            {suggestions.tipOfTheDay && (
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Tip of the Day</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{suggestions.tipOfTheDay}</p>
                  </div>
                </div>
              </div>
            )}

            {suggestions.mealSuggestions.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Recipe Ideas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {suggestions.mealSuggestions.map((s, i) => (
                    <div key={i} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="text-[10px] font-bold uppercase text-emerald-500 capitalize">{s.type}</span>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{s.name}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{s.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestions.ingredientSwaps.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Smart Ingredient Swaps</h3>
                <div className="space-y-2">
                  {suggestions.ingredientSwaps.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                      <div className="flex items-center gap-2">
                        <span className="line-through text-slate-400">{s.original}</span>
                        <span className="text-emerald-500 font-bold">→</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{s.swap}</span>
                      </div>
                      <span className="text-slate-500">{s.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestions.budgetTips.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Budget Tips</h3>
                <ul className="space-y-2">
                  {suggestions.budgetTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <span className="text-emerald-500 mt-0.5">$</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestions.weeklyPrepAdvice && (
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-3">
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-indigo-500 font-bold">📋</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">{suggestions.weeklyPrepAdvice}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
