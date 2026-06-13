import { useApp } from '../context/AppContext'
import type { HealthGoal } from '../types'

const CUISINES = ['Italian', 'Mexican', 'Indian', 'Asian', 'American', 'Mediterranean', 'French', 'Any']
const DIETS = [
  { id: 'none', label: 'No Diet Preference' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'keto', label: 'Keto / Low-Carb' },
  { id: 'high-protein', label: 'High-Protein' },
  { id: 'gluten-free', label: 'Gluten-Free' }
]
const ALLERGIES = ['Nuts', 'Dairy', 'Gluten', 'Soy', 'Shellfish', 'Eggs']
const GOALS = ['weight-loss', 'muscle-gain', 'maintenance', 'budget-saving']
const LEVELS = ['beginner', 'intermediate', 'advanced'] as const

export default function UserProfile() {
  const { inputs, setInputs, setStep, setUserProfile } = useApp()

  const handleSave = () => {
    if (!inputs.name.trim()) return
    setUserProfile(inputs)
    setStep(4)
  }

  const toggleCuisine = (cuisine: string) => {
    setInputs(prev => {
      if (cuisine === 'Any') return { ...prev, preferredCuisines: ['Any'] }
      const filterAny = prev.preferredCuisines.filter(c => c !== 'Any')
      const exists = filterAny.includes(cuisine)
      const newCuisines = exists ? filterAny.filter(c => c !== cuisine) : [...filterAny, cuisine]
      return { ...prev, preferredCuisines: newCuisines.length === 0 ? ['Any'] : newCuisines }
    })
  }

  const toggleAllergy = (allergy: string) => {
    setInputs(prev => {
      const exists = prev.allergies.includes(allergy)
      return { ...prev, allergies: exists ? prev.allergies.filter(a => a !== allergy) : [...prev.allergies, allergy] }
    })
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">Profile Setup</h1>

        <div className="space-y-6">
          <div>
            <label htmlFor="user-name" className="block text-sm font-semibold mb-2">Your Name</label>
            <input
              id="user-name"
              type="text" placeholder="Enter your name"
              value={inputs.name}
              onChange={(e) => setInputs(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="people-count" className="block text-sm font-semibold mb-2">Number of People</label>
            <div className="flex items-center gap-4" role="group" aria-labelledby="people-count">
              <button
                aria-label="Decrease number of people"
                onClick={() => setInputs(prev => ({ ...prev, peopleCount: Math.max(1, prev.peopleCount - 1) }))}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl text-lg font-bold hover:bg-slate-200 cursor-pointer"
              >-</button>
              <span id="people-count" className="text-2xl font-extrabold w-12 text-center" aria-live="polite">{inputs.peopleCount}</span>
              <button
                aria-label="Increase number of people"
                onClick={() => setInputs(prev => ({ ...prev, peopleCount: Math.min(12, prev.peopleCount + 1) }))}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl text-lg font-bold hover:bg-slate-200 cursor-pointer"
              >+</button>
            </div>
          </div>

          <div>
            <label htmlFor="daily-budget" className="block text-sm font-semibold mb-2">Daily Budget ($)</label>
            <input
              id="daily-budget"
              type="number" min="1" max="200"
              value={inputs.budget}
              onChange={(e) => setInputs(prev => ({ ...prev, budget: Number(e.target.value) }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Dietary Preference</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DIETS.map(d => (
                <button
                  key={d.id} onClick={() => setInputs(prev => ({ ...prev, dietaryPreference: d.id }))}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    inputs.dietaryPreference === d.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >{d.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Allergies</label>
            <div className="flex flex-wrap gap-2">
              {ALLERGIES.map(a => (
                <button
                  key={a} onClick={() => toggleAllergy(a)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    inputs.allergies.includes(a)
                      ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >{a}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Cooking Skill Level</label>
            <div className="grid grid-cols-3 gap-3">
              {LEVELS.map(l => (
                <button
                  key={l} onClick={() => setInputs(prev => ({ ...prev, skillLevel: l }))}
                  className={`py-3 px-3 rounded-2xl border text-center font-bold capitalize transition-all cursor-pointer ${
                    inputs.skillLevel === l
                      ? 'border-emerald-500 bg-emerald-500/5 text-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >{l}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Preferred Cuisine</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CUISINES.map(c => (
                <button
                  key={c} onClick={() => toggleCuisine(c)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    inputs.preferredCuisines.includes(c)
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >{c}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Health Goal</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GOALS.map(g => (
                <button
                  key={g} onClick={() => setInputs(prev => ({ ...prev, healthGoal: g as any }))}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border capitalize transition-all cursor-pointer ${
                    inputs.healthGoal === g
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >{g.replace('-', ' ')}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setStep(0)}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >Back</button>
          <button
            onClick={handleSave}
            disabled={!inputs.name.trim()}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
          >Save Profile & Continue</button>
        </div>
      </div>
    </div>
  )
}
