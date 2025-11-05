import { Recipe } from '../types';
import { translationService } from '../services/TranslationService';

type Language = 'es' | 'en' | 'ca';

export function getRecipeImage(recipe: Recipe): string {
  return translationService.getRecipeImage(recipe);
}

export async function getRecipeName(recipe: Recipe, lang: Language = 'es'): Promise<string> {
  return translationService.getRecipeName(recipe, lang);
}

export async function getRecipeDescription(recipe: Recipe, lang: Language = 'es'): Promise<string> {
  return translationService.getRecipeDescription(recipe, lang);
}

export function getRecipeNameSync(recipe: Recipe, lang: Language = 'es'): string {
  if (recipe.name && typeof recipe.name === 'object') {
    return recipe.name[lang] || recipe.name.es || recipe.id;
  }
  return recipe.id;
}
