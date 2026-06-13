export interface Ingredient {
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Dairy' | 'Protein' | 'Pantry Items' | 'Spices';
  qtyPerPerson: number;
  unit: string;
  costPerUnit: number;
  isKey: boolean;
}

export interface Substitution {
  original: string;
  substitute: string;
  costImpact: number; // difference in cost per unit or total
  dietaryImpact: string;
  alternativeRecipeName?: string;
}

export interface Recipe {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  prepTime: number; // in mins
  cookTime: number; // in mins
  calories: number; // per person
  macros: {
    protein: number; // grams
    carbs: number;   // grams
    fat: number;     // grams
  };
  baseCost: number; // per person
  dietaryTags: string[]; // 'vegetarian', 'vegan', 'keto', 'high-protein', 'low-carb', 'gluten-free'
  cuisines: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  ingredients: Ingredient[];
  instructions: string[];
  substitutions: Substitution[];
}

export const recipeDatabase: Recipe[] = [
  // --- BREAKFASTS ---
  {
    id: 'b1',
    name: 'Quick Berry Oatmeal',
    mealType: 'breakfast',
    prepTime: 3,
    cookTime: 7,
    calories: 350,
    macros: { protein: 10, carbs: 62, fat: 6 },
    baseCost: 1.5,
    dietaryTags: ['vegetarian', 'vegan', 'low-carb', 'gluten-free'],
    cuisines: ['American', 'Any'],
    skillLevel: 'beginner',
    ingredients: [
      { name: 'Rolled Oats', category: 'Pantry Items', qtyPerPerson: 50, unit: 'g', costPerUnit: 0.01, isKey: true },
      { name: 'Mixed Berries', category: 'Fruits', qtyPerPerson: 60, unit: 'g', costPerUnit: 0.02, isKey: true },
      { name: 'Almond Milk', category: 'Dairy', qtyPerPerson: 200, unit: 'ml', costPerUnit: 0.003, isKey: false },
      { name: 'Chia Seeds', category: 'Pantry Items', qtyPerPerson: 10, unit: 'g', costPerUnit: 0.02, isKey: false },
      { name: 'Banana', category: 'Fruits', qtyPerPerson: 0.5, unit: 'pcs', costPerUnit: 0.3, isKey: false }
    ],
    instructions: [
      'In a small pot, bring almond milk to a gentle simmer.',
      'Stir in the rolled oats and cook for 5 minutes, stirring occasionally, until thickened.',
      'Slice the banana and wash the mixed berries.',
      'Pour oatmeal into a bowl, top with sliced bananas, berries, and chia seeds.',
      'Drizzle with maple syrup if budget allows.'
    ],
    substitutions: [
      { original: 'Mixed Berries', substitute: 'Bananas', costImpact: -0.6, dietaryImpact: 'Budget-friendly, slightly higher carb' },
      { original: 'Almond Milk', substitute: 'Water', costImpact: -0.4, dietaryImpact: 'Lowest cost option, reduces creaminess' }
    ]
  },
  {
    id: 'b2',
    name: 'Avocado Toast with Poached Egg',
    mealType: 'breakfast',
    prepTime: 5,
    cookTime: 7,
    calories: 420,
    macros: { protein: 14, carbs: 28, fat: 28 },
    baseCost: 2.8,
    dietaryTags: ['vegetarian', 'high-protein'],
    cuisines: ['American', 'Mediterranean', 'Any'],
    skillLevel: 'beginner',
    ingredients: [
      { name: 'Whole Wheat Bread', category: 'Pantry Items', qtyPerPerson: 2, unit: 'slices', costPerUnit: 0.2, isKey: false },
      { name: 'Avocado', category: 'Fruits', qtyPerPerson: 0.5, unit: 'pcs', costPerUnit: 1.2, isKey: true },
      { name: 'Egg', category: 'Protein', qtyPerPerson: 1, unit: 'pcs', costPerUnit: 0.3, isKey: true },
      { name: 'Cherry Tomatoes', category: 'Vegetables', qtyPerPerson: 50, unit: 'g', costPerUnit: 0.012, isKey: false },
      { name: 'Chili Flakes', category: 'Spices', qtyPerPerson: 1, unit: 'g', costPerUnit: 0.05, isKey: false }
    ],
    instructions: [
      'Toast your slices of whole wheat bread until golden and crisp.',
      'Mash the avocado in a small bowl with a squeeze of lemon juice, salt, and pepper.',
      'Poach or fry the egg to your preference (runny yolk recommended).',
      'Spread mashed avocado evenly over toast slices, top with halved cherry tomatoes and the cooked egg.',
      'Garnish with chili flakes and a pinch of salt.'
    ],
    substitutions: [
      { original: 'Egg', substitute: 'Tofu (Scrambled)', costImpact: 0.2, dietaryImpact: 'Vegan-friendly alternative' },
      { original: 'Avocado', substitute: 'Hummus', costImpact: -0.5, dietaryImpact: 'Lower cost, lower fat, higher protein' }
    ]
  },
  {
    id: 'b3',
    name: 'Protein Tofu Scramble',
    mealType: 'breakfast',
    prepTime: 5,
    cookTime: 10,
    calories: 310,
    macros: { protein: 22, carbs: 12, fat: 19 },
    baseCost: 2.1,
    dietaryTags: ['vegetarian', 'vegan', 'keto', 'high-protein', 'low-carb', 'gluten-free'],
    cuisines: ['Any'],
    skillLevel: 'beginner',
    ingredients: [
      { name: 'Firm Tofu', category: 'Protein', qtyPerPerson: 150, unit: 'g', costPerUnit: 0.008, isKey: true },
      { name: 'Spinach', category: 'Vegetables', qtyPerPerson: 50, unit: 'g', costPerUnit: 0.015, isKey: false },
      { name: 'Bell Pepper', category: 'Vegetables', qtyPerPerson: 0.5, unit: 'pcs', costPerUnit: 0.5, isKey: false },
      { name: 'Olive Oil', category: 'Pantry Items', qtyPerPerson: 10, unit: 'ml', costPerUnit: 0.015, isKey: false },
      { name: 'Turmeric Powder', category: 'Spices', qtyPerPerson: 2, unit: 'g', costPerUnit: 0.03, isKey: true }
    ],
    instructions: [
      'Heat olive oil in a pan over medium heat. Sauté diced bell pepper for 3 minutes.',
      'Crumble firm tofu directly into the pan using your hands or a fork.',
      'Add turmeric powder, salt, and pepper. Stir well until tofu is evenly yellow and heated through.',
      'Fold in the fresh spinach and cook until wilted (about 1-2 minutes).',
      'Serve hot immediately.'
    ],
    substitutions: [
      { original: 'Firm Tofu', substitute: 'Eggs', costImpact: -0.5, dietaryImpact: 'Non-vegan, vegetarian, lower cost' },
      { original: 'Olive Oil', substitute: 'Butter', costImpact: 0.0, dietaryImpact: 'Adds dairy, keto-friendly' }
    ]
  },
  {
    id: 'b4',
    name: 'Keto Bacon & Egg Cups',
    mealType: 'breakfast',
    prepTime: 5,
    cookTime: 15,
    calories: 450,
    macros: { protein: 28, carbs: 3, fat: 37 },
    baseCost: 3.5,
    dietaryTags: ['keto', 'high-protein', 'low-carb', 'gluten-free'],
    cuisines: ['American', 'Any'],
    skillLevel: 'intermediate',
    ingredients: [
      { name: 'Egg', category: 'Protein', qtyPerPerson: 2, unit: 'pcs', costPerUnit: 0.3, isKey: true },
      { name: 'Bacon', category: 'Protein', qtyPerPerson: 2, unit: 'slices', costPerUnit: 0.9, isKey: true },
      { name: 'Cheddar Cheese', category: 'Dairy', qtyPerPerson: 30, unit: 'g', costPerUnit: 0.015, isKey: false },
      { name: 'Spinach', category: 'Vegetables', qtyPerPerson: 30, unit: 'g', costPerUnit: 0.015, isKey: false },
      { name: 'Butter', category: 'Dairy', qtyPerPerson: 10, unit: 'g', costPerUnit: 0.01, isKey: false }
    ],
    instructions: [
      'Preheat oven or air fryer to 375°F (190°C) and grease muffin cups with butter.',
      'Line each muffin cup with a slice of bacon, wrapping it around the inside wall.',
      'Drop a few chopped spinach leaves in the center and sprinkle with cheddar cheese.',
      'Crack a whole egg into each cup over the cheese and spinach.',
      'Bake for 12-15 minutes until egg whites are set but yolks remain soft.'
    ],
    substitutions: [
      { original: 'Bacon', substitute: 'Turkey Bacon', costImpact: -0.2, dietaryImpact: 'Lower fat and calories' },
      { original: 'Bacon', substitute: 'Mushrooms (Portobello)', costImpact: -0.4, dietaryImpact: 'Vegetarian-friendly, much lower fat' }
    ]
  },
  {
    id: 'b5',
    name: 'Indian Masala Poha',
    mealType: 'breakfast',
    prepTime: 5,
    cookTime: 10,
    calories: 290,
    macros: { protein: 6, carbs: 54, fat: 6 },
    baseCost: 1.2,
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
    cuisines: ['Indian'],
    skillLevel: 'beginner',
    ingredients: [
      { name: 'Flattened Rice (Poha)', category: 'Pantry Items', qtyPerPerson: 60, unit: 'g', costPerUnit: 0.005, isKey: true },
      { name: 'Onion', category: 'Vegetables', qtyPerPerson: 0.5, unit: 'pcs', costPerUnit: 0.2, isKey: false },
      { name: 'Peanuts', category: 'Protein', qtyPerPerson: 20, unit: 'g', costPerUnit: 0.01, isKey: true },
      { name: 'Mustard Seeds', category: 'Spices', qtyPerPerson: 2, unit: 'g', costPerUnit: 0.02, isKey: false },
      { name: 'Turmeric Powder', category: 'Spices', qtyPerPerson: 2, unit: 'g', costPerUnit: 0.03, isKey: false },
      { name: 'Green Chili', category: 'Vegetables', qtyPerPerson: 1, unit: 'pcs', costPerUnit: 0.1, isKey: false }
    ],
    instructions: [
      'Rinse Poha in a colander under running water for 1 minute until damp, then set aside to soften.',
      'Heat oil in a pan, fry peanuts until golden brown, then remove and set aside.',
      'In the same pan, add mustard seeds. When they splutter, add chopped onions, green chilies, and sauté until translucent.',
      'Add turmeric powder and salt, then stir in the softened poha and fried peanuts. Mix gently.',
      'Cover and steam on low heat for 2 minutes. Garnish with fresh cilantro and lemon juice.'
    ],
    substitutions: [
      { original: 'Peanuts', substitute: 'Green Peas', costImpact: -0.1, dietaryImpact: 'Nut-free option, lower fat' },
      { original: 'Flattened Rice (Poha)', substitute: 'Rolled Oats', costImpact: 0.2, dietaryImpact: 'Higher fiber, oats version' }
    ]
  },

  // --- LUNCHES ---
  {
    id: 'l1',
    name: 'Mediterranean Chickpea Salad',
    mealType: 'lunch',
    prepTime: 10,
    cookTime: 0,
    calories: 460,
    macros: { protein: 16, carbs: 52, fat: 22 },
    baseCost: 1.8,
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
    cuisines: ['Mediterranean', 'Any'],
    skillLevel: 'beginner',
    ingredients: [
      { name: 'Canned Chickpeas', category: 'Protein', qtyPerPerson: 120, unit: 'g', costPerUnit: 0.005, isKey: true },
      { name: 'Cucumber', category: 'Vegetables', qtyPerPerson: 0.5, unit: 'pcs', costPerUnit: 0.4, isKey: false },
      { name: 'Tomato', category: 'Vegetables', qtyPerPerson: 1, unit: 'pcs', costPerUnit: 0.3, isKey: false },
      { name: 'Red Onion', category: 'Vegetables', qtyPerPerson: 0.25, unit: 'pcs', costPerUnit: 0.1, isKey: false },
      { name: 'Feta Cheese', category: 'Dairy', qtyPerPerson: 30, unit: 'g', costPerUnit: 0.02, isKey: true },
      { name: 'Olive Oil', category: 'Pantry Items', qtyPerPerson: 15, unit: 'ml', costPerUnit: 0.015, isKey: false }
    ],
    instructions: [
      'Drain and rinse the chickpeas thoroughly under cold water.',
      'Dice the cucumber, tomato, and red onion into small bite-sized pieces.',
      'In a large bowl, combine chickpeas, cucumber, tomato, and red onion.',
      'Crumble feta cheese over the top.',
      'Drizzle with olive oil, lemon juice, salt, and dried oregano, then toss gently to combine.'
    ],
    substitutions: [
      { original: 'Feta Cheese', substitute: 'Olives (Kalamata)', costImpact: -0.2, dietaryImpact: 'Vegan option, dairy-free' },
      { original: 'Canned Chickpeas', substitute: 'Black Beans', costImpact: 0.0, dietaryImpact: 'Alternative protein source' }
    ]
  },
  {
    id: 'l2',
    name: 'Chicken Broccoli & Rice Bowl',
    mealType: 'lunch',
    prepTime: 10,
    cookTime: 15,
    calories: 620,
    macros: { protein: 44, carbs: 68, fat: 12 },
    baseCost: 3.2,
    dietaryTags: ['high-protein'],
    cuisines: ['Asian', 'Any'],
    skillLevel: 'beginner',
    ingredients: [
      { name: 'Chicken Breast', category: 'Protein', qtyPerPerson: 180, unit: 'g', costPerUnit: 0.01, isKey: true },
      { name: 'Jasmine Rice', category: 'Pantry Items', qtyPerPerson: 80, unit: 'g', costPerUnit: 0.004, isKey: true },
      { name: 'Broccoli', category: 'Vegetables', qtyPerPerson: 100, unit: 'g', costPerUnit: 0.005, isKey: false },
      { name: 'Soy Sauce', category: 'Pantry Items', qtyPerPerson: 20, unit: 'ml', costPerUnit: 0.01, isKey: false },
      { name: 'Sesame Oil', category: 'Pantry Items', qtyPerPerson: 5, unit: 'ml', costPerUnit: 0.03, isKey: false },
      { name: 'Garlic', category: 'Pantry Items', qtyPerPerson: 2, unit: 'cloves', costPerUnit: 0.1, isKey: false }
    ],
    instructions: [
      'Cook jasmine rice in a pot or rice cooker according to package instructions (1:1.5 water ratio).',
      'Cut chicken breast into bite-sized cubes. Chop broccoli into small florets.',
      'Heat sesame oil in a skillet over medium-high heat. Add minced garlic and sauté for 1 minute.',
      'Add chicken cubes and cook until browned on all sides (about 6-7 minutes).',
      'Add broccoli florets and soy sauce. Sauté for another 5 minutes until broccoli is tender-crisp. Serve over hot rice.'
    ],
    substitutions: [
      { original: 'Chicken Breast', substitute: 'Firm Tofu', costImpact: -0.6, dietaryImpact: 'Vegetarian/Vegan option, lower cost' },
      { original: 'Chicken Breast', substitute: 'Paneer', costImpact: -0.4, dietaryImpact: 'Vegetarian option, dairy-based' },
      { original: 'Jasmine Rice', substitute: 'Brown Rice', costImpact: 0.1, dietaryImpact: 'Higher fiber, slower digesting carb' }
    ]
  },
  {
    id: 'l3',
    name: 'Keto Chicken Salad Lettuce Wraps',
    mealType: 'lunch',
    prepTime: 10,
    cookTime: 0,
    calories: 490,
    macros: { protein: 35, carbs: 4, fat: 36 },
    baseCost: 3.4,
    dietaryTags: ['keto', 'high-protein', 'low-carb', 'gluten-free'],
    cuisines: ['American', 'Any'],
    skillLevel: 'beginner',
    ingredients: [
      { name: 'Chicken Breast', category: 'Protein', qtyPerPerson: 150, unit: 'g', costPerUnit: 0.01, isKey: true }, // assume cooked/canned
      { name: 'Mayonnaise', category: 'Pantry Items', qtyPerPerson: 40, unit: 'g', costPerUnit: 0.008, isKey: true },
      { name: 'Celery', category: 'Vegetables', qtyPerPerson: 30, unit: 'g', costPerUnit: 0.01, isKey: false },
      { name: 'Butter Lettuce', category: 'Vegetables', qtyPerPerson: 3, unit: 'leaves', costPerUnit: 0.2, isKey: true },
      { name: 'Walnuts', category: 'Protein', qtyPerPerson: 15, unit: 'g', costPerUnit: 0.025, isKey: false }
    ],
    instructions: [
      'Shred or dice the pre-cooked chicken breast.',
      'Finely chop the celery and crush the walnuts.',
      'In a bowl, mix chicken, mayonnaise, chopped celery, walnuts, salt, and black pepper until well combined.',
      'Wash and carefully peel butter lettuce leaves to act as cups.',
      'Spoon chicken salad into lettuce cups and serve immediately.'
    ],
    substitutions: [
      { original: 'Mayonnaise', substitute: 'Greek Yogurt', costImpact: -0.1, dietaryImpact: 'Lower fat, higher protein, non-keto' },
      { original: 'Chicken Breast', substitute: 'Canned Chickpeas (Mashed)', costImpact: -0.8, dietaryImpact: 'Vegetarian option, higher carb' }
    ]
  },
  {
    id: 'l4',
    name: 'Paneer Tikka Salad',
    mealType: 'lunch',
    prepTime: 10,
    cookTime: 10,
    calories: 510,
    macros: { protein: 20, carbs: 12, fat: 42 },
    baseCost: 2.9,
    dietaryTags: ['vegetarian', 'high-protein', 'keto', 'low-carb', 'gluten-free'],
    cuisines: ['Indian'],
    skillLevel: 'intermediate',
    ingredients: [
      { name: 'Paneer', category: 'Protein', qtyPerPerson: 150, unit: 'g', costPerUnit: 0.012, isKey: true },
      { name: 'Bell Pepper', category: 'Vegetables', qtyPerPerson: 0.5, unit: 'pcs', costPerUnit: 0.5, isKey: false },
      { name: 'Yogurt', category: 'Dairy', qtyPerPerson: 40, unit: 'g', costPerUnit: 0.005, isKey: true },
      { name: 'Garam Masala', category: 'Spices', qtyPerPerson: 3, unit: 'g', costPerUnit: 0.03, isKey: false },
      { name: 'Onion', category: 'Vegetables', qtyPerPerson: 0.25, unit: 'pcs', costPerUnit: 0.1, isKey: false },
      { name: 'Olive Oil', category: 'Pantry Items', qtyPerPerson: 10, unit: 'ml', costPerUnit: 0.015, isKey: false }
    ],
    instructions: [
      'Cut paneer, bell pepper, and onion into medium cubes.',
      'In a bowl, whisk yogurt, garam masala, salt, and lemon juice to form a marinade.',
      'Toss paneer and vegetables in the marinade. Let sit for 5 minutes.',
      'Heat olive oil in a pan. Sauté paneer and vegetables over medium-high heat for 6-8 minutes until slightly charred.',
      'Serve over a bed of fresh greens or as is.'
    ],
    substitutions: [
      { original: 'Paneer', substitute: 'Firm Tofu', costImpact: -0.4, dietaryImpact: 'Vegan option, lower saturated fat' },
      { original: 'Yogurt', substitute: 'Lemon Juice & Mustard', costImpact: -0.1, dietaryImpact: 'Dairy-free marinade' }
    ]
  },
  {
    id: 'l5',
    name: 'Creamy Tomato Basil Pasta',
    mealType: 'lunch',
    prepTime: 5,
    cookTime: 15,
    calories: 560,
    macros: { protein: 14, carbs: 82, fat: 18 },
    baseCost: 1.6,
    dietaryTags: ['vegetarian'],
    cuisines: ['Italian'],
    skillLevel: 'beginner',
    ingredients: [
      { name: 'Pasta', category: 'Pantry Items', qtyPerPerson: 100, unit: 'g', costPerUnit: 0.003, isKey: true },
      { name: 'Tomato Sauce', category: 'Pantry Items', qtyPerPerson: 150, unit: 'g', costPerUnit: 0.004, isKey: true },
      { name: 'Heavy Cream', category: 'Dairy', qtyPerPerson: 30, unit: 'ml', costPerUnit: 0.01, isKey: false },
      { name: 'Garlic', category: 'Pantry Items', qtyPerPerson: 2, unit: 'cloves', costPerUnit: 0.1, isKey: false },
      { name: 'Fresh Basil', category: 'Vegetables', qtyPerPerson: 10, unit: 'g', costPerUnit: 0.02, isKey: false },
      { name: 'Olive Oil', category: 'Pantry Items', qtyPerPerson: 10, unit: 'ml', costPerUnit: 0.015, isKey: false }
    ],
    instructions: [
      'Boil pasta in salted water according to package directions. Drain, reserving 1/4 cup pasta water.',
      'In a pan, heat olive oil and sauté minced garlic for 1 minute.',
      'Pour in tomato sauce and simmer for 5 minutes.',
      'Stir in heavy cream and fresh basil. Lower heat and cook for 2 minutes.',
      'Toss pasta into the sauce, adding a splash of pasta water to emulsify. Serve warm.'
    ],
    substitutions: [
      { original: 'Heavy Cream', substitute: 'Coconut Cream', costImpact: 0.1, dietaryImpact: 'Vegan/Dairy-free option' },
      { original: 'Pasta', substitute: 'Gluten-Free Pasta', costImpact: 0.4, dietaryImpact: 'Celiac friendly' },
      { original: 'Heavy Cream', substitute: 'Pasta Water & Olive Oil', costImpact: -0.3, dietaryImpact: 'Lower cost, lower calorie' }
    ]
  },

  // --- DINNERS ---
  {
    id: 'd1',
    name: 'Tofu & Vegetable Stir-Fry',
    mealType: 'dinner',
    prepTime: 10,
    cookTime: 10,
    calories: 390,
    macros: { protein: 18, carbs: 36, fat: 18 },
    baseCost: 2.0,
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
    cuisines: ['Asian'],
    skillLevel: 'beginner',
    ingredients: [
      { name: 'Firm Tofu', category: 'Protein', qtyPerPerson: 150, unit: 'g', costPerUnit: 0.008, isKey: true },
      { name: 'Broccoli', category: 'Vegetables', qtyPerPerson: 80, unit: 'g', costPerUnit: 0.005, isKey: false },
      { name: 'Carrot', category: 'Vegetables', qtyPerPerson: 0.5, unit: 'pcs', costPerUnit: 0.2, isKey: false },
      { name: 'Soy Sauce', category: 'Pantry Items', qtyPerPerson: 15, unit: 'ml', costPerUnit: 0.01, isKey: false },
      { name: 'Ginger', category: 'Spices', qtyPerPerson: 5, unit: 'g', costPerUnit: 0.02, isKey: false },
      { name: 'Garlic', category: 'Pantry Items', qtyPerPerson: 2, unit: 'cloves', costPerUnit: 0.1, isKey: false },
      { name: 'Sesame Oil', category: 'Pantry Items', qtyPerPerson: 10, unit: 'ml', costPerUnit: 0.03, isKey: false }
    ],
    instructions: [
      'Press tofu to remove excess water, then cut into cubes.',
      'Slice carrots thinly and cut broccoli into small florets.',
      'Heat sesame oil in a wok or large pan. Fry tofu cubes until crispy on all sides, then remove and set aside.',
      'In the same pan, sauté garlic and ginger for 30 seconds. Add broccoli and carrots, stir-fry for 4 minutes with a splash of water.',
      'Return tofu to the pan, add soy sauce, and toss together for 2 minutes before serving.'
    ],
    substitutions: [
      { original: 'Firm Tofu', substitute: 'Chicken Breast', costImpact: 0.6, dietaryImpact: 'Non-vegetarian, higher protein' },
      { original: 'Soy Sauce', substitute: 'Tamari (Gluten-Free)', costImpact: 0.1, dietaryImpact: 'Celiac friendly soy sauce' }
    ]
  },
  {
    id: 'd2',
    name: 'Pan-Seared Salmon with Asparagus',
    mealType: 'dinner',
    prepTime: 5,
    cookTime: 15,
    calories: 540,
    macros: { protein: 38, carbs: 6, fat: 40 },
    baseCost: 5.5,
    dietaryTags: ['keto', 'high-protein', 'low-carb', 'gluten-free'],
    cuisines: ['Mediterranean', 'French', 'Any'],
    skillLevel: 'advanced',
    ingredients: [
      { name: 'Salmon Fillet', category: 'Protein', qtyPerPerson: 150, unit: 'g', costPerUnit: 0.028, isKey: true },
      { name: 'Asparagus', category: 'Vegetables', qtyPerPerson: 100, unit: 'g', costPerUnit: 0.008, isKey: true },
      { name: 'Lemon', category: 'Fruits', qtyPerPerson: 0.5, unit: 'pcs', costPerUnit: 0.3, isKey: false },
      { name: 'Butter', category: 'Dairy', qtyPerPerson: 15, unit: 'g', costPerUnit: 0.01, isKey: false },
      { name: 'Garlic', category: 'Pantry Items', qtyPerPerson: 2, unit: 'cloves', costPerUnit: 0.1, isKey: false }
    ],
    instructions: [
      'Pat salmon dry and season with salt and pepper.',
      'Heat half of the butter in a pan over medium-high heat. Place salmon skin-side down.',
      'Sear for 4-5 minutes, flip, add minced garlic and remaining butter, and spoon melted butter over the salmon for 3 minutes.',
      'In a separate pan or alongside the salmon, sauté asparagus in butter for 5-6 minutes until tender.',
      'Plate the salmon and asparagus, squeeze fresh lemon juice over the top, and serve.'
    ],
    substitutions: [
      { original: 'Salmon Fillet', substitute: 'Chicken Breast', costImpact: -2.5, dietaryImpact: 'Budget upgrade to lower cost meat, lower fat' },
      { original: 'Salmon Fillet', substitute: 'Paneer', costImpact: -2.3, dietaryImpact: 'Vegetarian option' },
      { original: 'Asparagus', substitute: 'Green Beans', costImpact: -0.4, dietaryImpact: 'Lower cost vegetable alternative' }
    ]
  },
  {
    id: 'd3',
    name: 'Indian Lentil Curry (Dal Tadka) with Basmati Rice',
    mealType: 'dinner',
    prepTime: 8,
    cookTime: 22,
    calories: 490,
    macros: { protein: 18, carbs: 88, fat: 8 },
    baseCost: 1.4,
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free'],
    cuisines: ['Indian'],
    skillLevel: 'intermediate',
    ingredients: [
      { name: 'Red Lentils', category: 'Protein', qtyPerPerson: 80, unit: 'g', costPerUnit: 0.003, isKey: true },
      { name: 'Basmati Rice', category: 'Pantry Items', qtyPerPerson: 80, unit: 'g', costPerUnit: 0.004, isKey: true },
      { name: 'Onion', category: 'Vegetables', qtyPerPerson: 0.5, unit: 'pcs', costPerUnit: 0.2, isKey: false },
      { name: 'Tomato', category: 'Vegetables', qtyPerPerson: 1, unit: 'pcs', costPerUnit: 0.3, isKey: false },
      { name: 'Ginger Garlic Paste', category: 'Spices', qtyPerPerson: 10, unit: 'g', costPerUnit: 0.015, isKey: false },
      { name: 'Cumin Seeds', category: 'Spices', qtyPerPerson: 3, unit: 'g', costPerUnit: 0.02, isKey: false },
      { name: 'Turmeric Powder', category: 'Spices', qtyPerPerson: 2, unit: 'g', costPerUnit: 0.03, isKey: false }
    ],
    instructions: [
      'Cook Basmati rice (1:2 water ratio) with a pinch of salt until soft and fluffy.',
      'Boil red lentils in a pot with water, turmeric, and salt for 15 minutes until soft and creamy.',
      'For the Tadka (tempering): Heat oil in a small pan, fry cumin seeds, diced onion, and ginger garlic paste.',
      'Add chopped tomato and cook until soft and oil starts separating.',
      'Pour the tempered mixture into the boiled lentils, stir well, simmer for 2 minutes, and serve hot over rice.'
    ],
    substitutions: [
      { original: 'Basmati Rice', substitute: 'Quinoa', costImpact: 0.4, dietaryImpact: 'Higher protein, complete amino acid profile' },
      { original: 'Red Lentils', substitute: 'Canned Chickpeas', costImpact: 0.2, dietaryImpact: 'Slightly higher cost, alters texture' }
    ]
  },
  {
    id: 'd4',
    name: 'Cheesy Spinach Stuffed Chicken',
    mealType: 'dinner',
    prepTime: 10,
    cookTime: 25,
    calories: 630,
    macros: { protein: 48, carbs: 5, fat: 42 },
    baseCost: 3.8,
    dietaryTags: ['keto', 'high-protein', 'low-carb', 'gluten-free'],
    cuisines: ['American', 'Any'],
    skillLevel: 'intermediate',
    ingredients: [
      { name: 'Chicken Breast', category: 'Protein', qtyPerPerson: 180, unit: 'g', costPerUnit: 0.01, isKey: true },
      { name: 'Cream Cheese', category: 'Dairy', qtyPerPerson: 40, unit: 'g', costPerUnit: 0.015, isKey: true },
      { name: 'Spinach', category: 'Vegetables', qtyPerPerson: 40, unit: 'g', costPerUnit: 0.015, isKey: false },
      { name: 'Mozzarella Cheese', category: 'Dairy', qtyPerPerson: 30, unit: 'g', costPerUnit: 0.018, isKey: false },
      { name: 'Olive Oil', category: 'Pantry Items', qtyPerPerson: 10, unit: 'ml', costPerUnit: 0.015, isKey: false }
    ],
    instructions: [
      'Preheat oven to 400°F (200°C). Sauté spinach until wilted, let cool and squeeze out water.',
      'Mix spinach, cream cheese, and mozzarella together in a bowl with salt and pepper.',
      'Cut a deep pocket lengthwise into each chicken breast, making sure not to cut all the way through.',
      'Stuff each pocket generously with the spinach cheese mixture, and secure with toothpicks if needed.',
      'Brush chicken with olive oil, season outer skin, and bake for 22-25 minutes until cooked through.'
    ],
    substitutions: [
      { original: 'Chicken Breast', substitute: 'Portobello Mushrooms (Stuffed)', costImpact: -0.5, dietaryImpact: 'Vegetarian option, much lower protein' },
      { original: 'Cream Cheese', substitute: 'Ricotta Cheese', costImpact: -0.1, dietaryImpact: 'Lower fat stuffing' }
    ]
  },
  {
    id: 'd5',
    name: 'Savory Mushroom Risotto',
    mealType: 'dinner',
    prepTime: 10,
    cookTime: 30,
    calories: 520,
    macros: { protein: 12, carbs: 78, fat: 15 },
    baseCost: 3.0,
    dietaryTags: ['vegetarian', 'gluten-free'],
    cuisines: ['Italian'],
    skillLevel: 'advanced',
    ingredients: [
      { name: 'Arborio Rice', category: 'Pantry Items', qtyPerPerson: 80, unit: 'g', costPerUnit: 0.008, isKey: true },
      { name: 'Mushrooms', category: 'Vegetables', qtyPerPerson: 100, unit: 'g', costPerUnit: 0.008, isKey: true },
      { name: 'Vegetable Broth', category: 'Pantry Items', qtyPerPerson: 400, unit: 'ml', costPerUnit: 0.002, isKey: false },
      { name: 'Parmesan Cheese', category: 'Dairy', qtyPerPerson: 30, unit: 'g', costPerUnit: 0.02, isKey: false },
      { name: 'Onion', category: 'Vegetables', qtyPerPerson: 0.5, unit: 'pcs', costPerUnit: 0.2, isKey: false },
      { name: 'Butter', category: 'Dairy', qtyPerPerson: 15, unit: 'g', costPerUnit: 0.01, isKey: false }
    ],
    instructions: [
      'Heat vegetable broth in a pot and keep it warm on low heat.',
      'In a deep pan, melt half the butter. Sauté sliced mushrooms until golden, then set aside.',
      'Add remaining butter, sauté finely chopped onion for 3 minutes, then add Arborio rice and toast for 1 minute.',
      'Add warm broth one ladle at a time, stirring constantly. Wait until rice absorbs the liquid before adding another ladle. (Takes 20 minutes).',
      'Stir in the cooked mushrooms, parmesan cheese, and seasoning once rice is tender. Let rest 2 minutes before serving.'
    ],
    substitutions: [
      { original: 'Parmesan Cheese', substitute: 'Nutritional Yeast', costImpact: -0.2, dietaryImpact: 'Vegan-friendly alternative' },
      { original: 'Arborio Rice', substitute: 'Brown Rice', costImpact: -0.2, dietaryImpact: 'Not authentic texture, higher cooking time, whole grain' }
    ]
  }
];
