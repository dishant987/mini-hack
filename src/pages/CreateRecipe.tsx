import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { addCustomRecipe, generateRecipeId } from '../services/recipeService'
import type { Recipe, Ingredient } from '../types'

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Protein', 'Pantry Items', 'Spices'] as const
const DIET_TAGS = ['vegetarian', 'vegan', 'keto', 'high-protein', 'low-carb', 'gluten-free']
const CUISINES = ['Italian', 'Mexican', 'Indian', 'Asian', 'American', 'Mediterranean', 'French', 'Any']
const SKILLS = ['beginner', 'intermediate', 'advanced'] as const
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'] as const

interface IngredientForm {
  name: string
  category: string
  qtyPerPerson: number
  unit: string
  costPerUnit: number
  isKey: boolean
}

interface SubstitutionForm {
  original: string
  substitute: string
  costImpact: number
  dietaryImpact: string
}

const emptyIngredient = (): IngredientForm => ({
  name: '', category: 'Vegetables', qtyPerPerson: 1, unit: 'g', costPerUnit: 0, isKey: false
})

const emptySub = (): SubstitutionForm => ({
  original: '', substitute: '', costImpact: 0, dietaryImpact: ''
})

export default function CreateRecipe() {
  const { setStep, setActiveTab } = useApp()
  const [name, setName] = useState('')
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch')
  const [prepTime, setPrepTime] = useState(10)
  const [cookTime, setCookTime] = useState(15)
  const [calories, setCalories] = useState(400)
  const [protein, setProtein] = useState(15)
  const [carbs, setCarbs] = useState(40)
  const [fat, setFat] = useState(15)
  const [baseCost, setBaseCost] = useState(3)
  const [dietaryTags, setDietaryTags] = useState<string[]>([])
  const [cuisines, setCuisines] = useState<string[]>(['Any'])
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [ingredients, setIngredients] = useState<IngredientForm[]>([emptyIngredient()])
  const [instructions, setInstructions] = useState<string[]>([''])
  const [substitutions, setSubstitutions] = useState<SubstitutionForm[]>([])
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleTag = (tag: string) => {
    setDietaryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const toggleCuisine = (c: string) => {
    setCuisines(prev => {
      if (c === 'Any') return ['Any']
      const filtered = prev.filter(x => x !== 'Any')
      return filtered.includes(c) ? filtered.filter(x => x !== c) : [...filtered, c]
    })
  }

  const updateIngredient = (i: number, field: keyof IngredientForm, value: any) => {
    setIngredients(prev => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  const addIngredient = () => setIngredients(prev => [...prev, emptyIngredient()])
  const removeIngredient = (i: number) => setIngredients(prev => prev.filter((_, idx) => idx !== i))

  const updateInstruction = (i: number, value: string) => {
    setInstructions(prev => {
      const next = [...prev]
      next[i] = value
      return next
    })
  }

  const addInstruction = () => setInstructions(prev => [...prev, ''])
  const removeInstruction = (i: number) => setInstructions(prev => prev.filter((_, idx) => idx !== i))

  const updateSub = (i: number, field: keyof SubstitutionForm, value: any) => {
    setSubstitutions(prev => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  const addSub = () => setSubstitutions(prev => [...prev, emptySub()])
  const removeSub = (i: number) => setSubstitutions(prev => prev.filter((_, idx) => idx !== i))

  const handleSave = () => {
    setError(null)
    if (!name.trim()) { setError('Recipe name is required.'); return }
    if (ingredients.some(i => !i.name.trim())) { setError('All ingredients need a name.'); return }
    if (instructions.some(i => !i.trim())) { setError('All instructions need text.'); return }
    if (ingredients.length === 0) { setError('At least one ingredient is required.'); return }
    if (instructions.length === 0) { setError('At least one instruction is required.'); return }

    const recipe: Recipe = {
      id: generateRecipeId(),
      name: name.trim(),
      mealType,
      prepTime,
      cookTime,
      calories,
      macros: { protein, carbs, fat },
      baseCost,
      dietaryTags,
      cuisines: cuisines.length === 0 ? ['Any'] : cuisines,
      skillLevel,
      ingredients: ingredients.map(ing => ({
        name: ing.name.trim(),
        category: ing.category as Ingredient['category'],
        qtyPerPerson: ing.qtyPerPerson,
        unit: ing.unit,
        costPerUnit: ing.costPerUnit,
        isKey: ing.isKey
      })),
      instructions: instructions.filter(i => i.trim()).map(i => i.trim()),
      substitutions: substitutions.filter(s => s.original.trim()).map(s => ({
        original: s.original.trim(),
        substitute: s.substitute.trim(),
        costImpact: s.costImpact,
        dietaryImpact: s.dietaryImpact
      }))
    }

    addCustomRecipe(recipe)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Custom Recipe</h1>
          <button
            onClick={() => { setStep(4); setActiveTab('overview') }}
            className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >Back to Dashboard</button>
        </div>

        {saved && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-500 font-semibold">
            Recipe saved! It will be considered in future meal plans.
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500 font-semibold">{error}</div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Recipe Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. My Custom Bowl"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Meal Type</label>
              <div className="flex gap-2">
                {MEAL_TYPES.map(m => (
                  <button key={m} onClick={() => setMealType(m)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border capitalize cursor-pointer transition-all ${
                      mealType === m ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-200 dark:border-slate-800'
                    }`}>{m}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Prep Time (min)', val: prepTime, set: setPrepTime },
              { label: 'Cook Time (min)', val: cookTime, set: setCookTime },
              { label: 'Calories', val: calories, set: setCalories },
              { label: 'Base Cost ($)', val: baseCost, set: setBaseCost }
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold mb-1">{f.label}</label>
                <input type="number" min="0" value={f.val} onChange={e => f.set(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Protein (g)', val: protein, set: setProtein },
              { label: 'Carbs (g)', val: carbs, set: setCarbs },
              { label: 'Fat (g)', val: fat, set: setFat }
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold mb-1">{f.label}</label>
                <input type="number" min="0" value={f.val} onChange={e => f.set(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2">Dietary Tags</label>
            <div className="flex flex-wrap gap-2">
              {DIET_TAGS.map(t => (
                <button key={t} onClick={() => toggleTag(t)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border cursor-pointer transition-all capitalize ${
                    dietaryTags.includes(t) ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-200 dark:border-slate-800'
                  }`}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2">Cuisines</label>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map(c => (
                <button key={c} onClick={() => toggleCuisine(c)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border cursor-pointer transition-all ${
                    cuisines.includes(c) ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-200 dark:border-slate-800'
                  }`}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2">Skill Level</label>
            <div className="flex gap-2">
              {SKILLS.map(s => (
                <button key={s} onClick={() => setSkillLevel(s)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border cursor-pointer capitalize transition-all ${
                    skillLevel === s ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-200 dark:border-slate-800'
                  }`}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold">Ingredients</label>
              <button onClick={addIngredient} className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg font-bold hover:bg-emerald-500/20 transition-colors cursor-pointer">+ Add</button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 p-2 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <input value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)} placeholder="Name"
                    className="flex-1 min-w-[100px] px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-1 focus:ring-emerald-500" />
                  <select value={ing.category} onChange={e => updateIngredient(i, 'category', e.target.value)}
                    className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="number" value={ing.qtyPerPerson} onChange={e => updateIngredient(i, 'qtyPerPerson', Number(e.target.value))} placeholder="Qty"
                    className="w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent outline-none" />
                  <input value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)} placeholder="unit"
                    className="w-14 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent outline-none" />
                  <input type="number" step="0.01" value={ing.costPerUnit} onChange={e => updateIngredient(i, 'costPerUnit', Number(e.target.value))} placeholder="cost"
                    className="w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent outline-none" />
                  <label className="flex items-center gap-1 text-[10px] text-slate-500 whitespace-nowrap">
                    <input type="checkbox" checked={ing.isKey} onChange={e => updateIngredient(i, 'isKey', e.target.checked)} className="h-3 w-3" />
                    Key
                  </label>
                  {ingredients.length > 1 && (
                    <button onClick={() => removeIngredient(i)} className="text-rose-500 text-xs px-1.5 py-1 hover:bg-rose-500/10 rounded-lg cursor-pointer">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold">Instructions</label>
              <button onClick={addInstruction} className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg font-bold hover:bg-emerald-500/20 transition-colors cursor-pointer">+ Add</button>
            </div>
            <div className="space-y-2">
              {instructions.map((inst, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs font-bold text-emerald-500 mt-2 w-4">{i + 1}.</span>
                  <textarea value={inst} onChange={e => updateInstruction(i, e.target.value)} placeholder={`Step ${i + 1}`} rows={2}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-1 focus:ring-emerald-500 resize-none" />
                  {instructions.length > 1 && (
                    <button onClick={() => removeInstruction(i)} className="text-rose-500 text-xs mt-1.5 px-1.5 py-1 hover:bg-rose-500/10 rounded-lg cursor-pointer">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold">Substitutions (optional)</label>
              <button onClick={addSub} className="text-xs px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg font-bold hover:bg-amber-500/20 transition-colors cursor-pointer">+ Add</button>
            </div>
            {substitutions.length === 0 && (
              <p className="text-[10px] text-slate-400 italic">Add ingredient swaps (e.g. Chicken Breast → Tofu)</p>
            )}
            <div className="space-y-2 mt-2">
              {substitutions.map((sub, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 p-2 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <input value={sub.original} onChange={e => updateSub(i, 'original', e.target.value)} placeholder="Original"
                    className="flex-1 min-w-[80px] px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent outline-none" />
                  <span className="text-emerald-500 text-xs font-bold">→</span>
                  <input value={sub.substitute} onChange={e => updateSub(i, 'substitute', e.target.value)} placeholder="Substitute"
                    className="flex-1 min-w-[80px] px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent outline-none" />
                  <input type="number" step="0.1" value={sub.costImpact} onChange={e => updateSub(i, 'costImpact', Number(e.target.value))} placeholder="cost impact"
                    className="w-20 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent outline-none" />
                  <input value={sub.dietaryImpact} onChange={e => updateSub(i, 'dietaryImpact', e.target.value)} placeholder="diet impact"
                    className="flex-1 min-w-[80px] px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent outline-none" />
                  <button onClick={() => removeSub(i)} className="text-rose-500 text-xs px-1.5 py-1 hover:bg-rose-500/10 rounded-lg cursor-pointer">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button onClick={handleSave}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Save Recipe
          </button>
        </div>
      </div>
    </div>
  )
}
