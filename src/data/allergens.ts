import {
  Wheat,
  Milk,
  Nut,
  Fish,
  Egg,
  Leaf,
  Coffee
} from 'lucide-react';

export interface AllergenConfig {
  id: string;
  translationKey: string;
  icon: any;
  priority: number;
}

export const ALLERGENS_CONFIG: AllergenConfig[] = [
  { id: 'gluten', translationKey: 'gluten', icon: Wheat, priority: 1 },
  { id: 'lactose', translationKey: 'lactose', icon: Milk, priority: 2 },
  { id: 'nuts', translationKey: 'nuts', icon: Nut, priority: 3 },
  { id: 'egg', translationKey: 'egg', icon: Egg, priority: 4 },
  { id: 'fish', translationKey: 'fish', icon: Fish, priority: 5 },
  { id: 'soy', translationKey: 'soy', icon: Leaf, priority: 6 },
  { id: 'caffeine', translationKey: 'caffeine', icon: Coffee, priority: 7 }
];
