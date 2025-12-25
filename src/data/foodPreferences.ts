import {
  Beef,
  Fish,
  Drumstick,
  Apple,
  Cherry,
  Leaf,
  Candy,
  Droplet,
  Wheat,
  Cookie
} from 'lucide-react';

export interface FoodPreferenceConfig {
  id: string;
  name: string;
  icon: any;
  colors: {
    bg: string;
    iconBg: string;
    iconColor: string;
  };
  translationKey: string;
  category: 'protein' | 'produce' | 'processed' | 'grain';
  priority: number;
}

export const FOOD_PREFERENCES_CONFIG: FoodPreferenceConfig[] = [
  {
    id: 'redMeat',
    name: 'Carnes rojas',
    icon: Beef,
    colors: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-500',
      iconColor: 'text-white'
    },
    translationKey: 'redMeat',
    category: 'protein',
    priority: 1
  },
  {
    id: 'seafood',
    name: 'Mariscos',
    icon: Fish,
    colors: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-500',
      iconColor: 'text-white'
    },
    translationKey: 'seafood',
    category: 'protein',
    priority: 2
  },
  {
    id: 'poultry',
    name: 'Pollo',
    icon: Drumstick,
    colors: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-500',
      iconColor: 'text-white'
    },
    translationKey: 'poultry',
    category: 'protein',
    priority: 3
  },
  {
    id: 'avocado',
    name: 'Aguacate',
    icon: Apple,
    colors: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-500',
      iconColor: 'text-white'
    },
    translationKey: 'avocado',
    category: 'produce',
    priority: 4
  },
  {
    id: 'pineapple',
    name: 'Piña',
    icon: Cherry,
    colors: {
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-500',
      iconColor: 'text-white'
    },
    translationKey: 'pineapple',
    category: 'produce',
    priority: 5
  },
  {
    id: 'fruits',
    name: 'Frutas',
    icon: Apple,
    colors: {
      bg: 'bg-pink-50',
      iconBg: 'bg-pink-500',
      iconColor: 'text-white'
    },
    translationKey: 'fruits',
    category: 'produce',
    priority: 6
  },
  {
    id: 'spinach',
    name: 'Espinacas',
    icon: Leaf,
    colors: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white'
    },
    translationKey: 'spinach',
    category: 'produce',
    priority: 7
  },
  {
    id: 'fish',
    name: 'Pescados',
    icon: Fish,
    colors: {
      bg: 'bg-cyan-50',
      iconBg: 'bg-cyan-500',
      iconColor: 'text-white'
    },
    translationKey: 'fish',
    category: 'protein',
    priority: 8
  },
  {
    id: 'ultraProcessed',
    name: 'Ultraprocesados',
    icon: Cookie,
    colors: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-500',
      iconColor: 'text-white'
    },
    translationKey: 'ultraProcessed',
    category: 'processed',
    priority: 9
  },
  {
    id: 'softDrinks',
    name: 'Refrescos',
    icon: Droplet,
    colors: {
      bg: 'bg-indigo-50',
      iconBg: 'bg-indigo-500',
      iconColor: 'text-white'
    },
    translationKey: 'softDrinks',
    category: 'processed',
    priority: 10
  },
  {
    id: 'refinedSugar',
    name: 'Productos altos en azúcar refinada',
    icon: Candy,
    colors: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-500',
      iconColor: 'text-white'
    },
    translationKey: 'refinedSugar',
    category: 'processed',
    priority: 11
  },
  {
    id: 'refinedGrains',
    name: 'Cereales refinados',
    icon: Wheat,
    colors: {
      bg: 'bg-stone-50',
      iconBg: 'bg-stone-500',
      iconColor: 'text-white'
    },
    translationKey: 'refinedGrains',
    category: 'grain',
    priority: 12
  }
];

export const getFoodPreferenceConfig = (id: string): FoodPreferenceConfig | undefined => {
  return FOOD_PREFERENCES_CONFIG.find(pref => pref.id === id);
};

export const getPriorityFoodPreferences = (): FoodPreferenceConfig[] => {
  return FOOD_PREFERENCES_CONFIG.sort((a, b) => a.priority - b.priority);
};
