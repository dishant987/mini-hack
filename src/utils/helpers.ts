export function isAllergyMatch(ingredientName: string, allergy: string): boolean {
  const name = ingredientName.toLowerCase()
  switch (allergy.toLowerCase()) {
    case 'nuts':
      return name.includes('peanut') || name.includes('walnut') || name.includes('almond') || name.includes('cashew') || name.includes('nut')
    case 'dairy':
      return name.includes('milk') || name.includes('cheese') || name.includes('feta') || name.includes('butter') || name.includes('yogurt') || name.includes('cream')
    case 'gluten':
      return name.includes('bread') || name.includes('pasta') || name.includes('flour') || name.includes('wheat')
    case 'soy':
      return name.includes('soy') || name.includes('tofu') || name.includes('edamame')
    case 'eggs':
      return name.includes('egg')
    case 'shellfish':
      return name.includes('shrimp') || name.includes('prawn') || name.includes('crab') || name.includes('lobster') || name.includes('clam')
    default:
      return false
  }
}

export function isAvailableInPantry(name: string, pantryItems: string[]): boolean {
  return pantryItems.some(p => {
    const pLower = p.toLowerCase().trim()
    const nLower = name.toLowerCase().trim()
    return nLower.includes(pLower) || pLower.includes(nLower)
  })
}

export function formatCurrency(amount: number): string {
  return `$${Math.max(0, amount).toFixed(2)}`
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getCurrentDateStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
