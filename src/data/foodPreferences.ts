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
  translationKey: string;
  icon: any;
  priority: number;
}

export const FOOD_PREFERENCES_CONFIG: FoodPreferenceConfig[] = [
  { id: 'redMeat', translationKey: 'redMeat', icon: Beef, priority: 1 },
  { id: 'seafood', translationKey: 'seafood', icon: Fish, priority: 2 },
  { id: 'poultry', translationKey: 'poultry', icon: Drumstick, priority: 3 },
  { id: 'avocado', translationKey: 'avocado', icon: Apple, priority: 4 },
  { id: 'pineapple', translationKey: 'pineapple', icon: Cherry, priority: 5 },
  { id: 'fruits', translationKey: 'fruits', icon: Apple, priority: 6 },
  { id: 'spinach', translationKey: 'spinach', icon: Leaf, priority: 7 },
  { id: 'fish', translationKey: 'fish', icon: Fish, priority: 8 },
  { id: 'ultraProcessed', translationKey: 'ultraProcessed', icon: Cookie, priority: 9 },
  { id: 'softDrinks', translationKey: 'softDrinks', icon: Droplet, priority: 10 },
  { id: 'refinedSugar', translationKey: 'refinedSugar', icon: Candy, priority: 11 },
  { id: 'refinedGrains', translationKey: 'refinedGrains', icon: Wheat, priority: 12 }
];
