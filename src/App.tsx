import { useApp } from './context/AppContext'
import Header from './components/Header'
import UserProfile from './pages/UserProfile'
import Dashboard from './pages/Dashboard'
import CreateRecipe from './pages/CreateRecipe'

function Landing() {
  const { setStep } = useApp()
  return (
    <div className="py-8 md:py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
          Personalized Cooking Coach & Budget Planner
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
          Generate tailored daily meal plans, smart grocery lists, chronological checklists, and time-saving kitchen tips designed for your budget, dietary needs, and cooking skill.
        </p>
        <div className="mt-10">
          <button
            onClick={() => setStep(1)}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-lg"
          >
            Get Started →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: '🍳', title: 'Smart Recipe Engine', desc: 'Selects recipes fitting your cuisine, time, and skill level.' },
          { icon: '🪙', title: 'Budget Guard', desc: 'Auto-swaps expensive items when budget is exceeded.' },
          { icon: '⏳', title: 'Morning-to-Night Checklist', desc: 'Chronological to-do list with progress tracker.' }
        ].map((feat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-md hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4">{feat.icon}</div>
            <h3 className="font-bold text-lg text-slate-950 dark:text-white mb-2">{feat.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const { step } = useApp()

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-12">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {step === 0 && <Landing />}
        {step === 1 && <UserProfile />}
        {step === 2 && <CreateRecipe />}
        {step >= 4 && <Dashboard />}
      </main>
    </div>
  )
}
