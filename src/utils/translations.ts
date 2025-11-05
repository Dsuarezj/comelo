import { Recipe } from '../types';

// Import all recipe translations
import bowlAmarantoEs from '../data/translations/recipes/bowl-amaranto-frutas.es.json';
import bowlAmarantoEn from '../data/translations/recipes/bowl-amaranto-frutas.en.json';
import polloCurryEs from '../data/translations/recipes/pollo-curry.es.json';
import polloCurryEn from '../data/translations/recipes/pollo-curry.en.json';
import polloCurryCa from '../data/translations/recipes/pollo-curry.ca.json';
import ensaladaQuinoaEs from '../data/translations/recipes/ensalada-quinoa.es.json';
import ensaladaQuinoaEn from '../data/translations/recipes/ensalada-quinoa.en.json';
import ensaladaQuinoaCa from '../data/translations/recipes/ensalada-quinoa.ca.json';

type Language = 'es' | 'en' | 'ca';

interface RecipeTranslations {
  [recipeId: string]: {
    [lang: string]: {
      recipe: {
        [key: string]: {
          name: string;
          description: string;
          [key: string]: any;
        };
      };
    };
  };
}

const translations: RecipeTranslations = {
  'bowl-amaranto-frutas': {
    es: bowlAmarantoEs,
    en: bowlAmarantoEn,
  },
  'pollo-curry': {
    es: polloCurryEs,
    en: polloCurryEn,
    ca: polloCurryCa,
  },
  'ensalada-quinoa': {
    es: ensaladaQuinoaEs,
    en: ensaladaQuinoaEn,
    ca: ensaladaQuinoaCa,
  },
};

export function getRecipeName(recipe: Recipe, lang: Language = 'es'): string {
  // Legacy format support
  if (recipe.name && typeof recipe.name === 'object') {
    return recipe.name[lang] || recipe.name.es || '';
  }

  // New format with nameKey
  if (recipe.nameKey && translations[recipe.id]?.[lang]) {
    const recipeData = translations[recipe.id][lang].recipe[recipe.id];
    return recipeData?.name || recipe.id;
  }

  return recipe.id;
}

export function getRecipeDescription(recipe: Recipe, lang: Language = 'es'): string {
  // Legacy format support
  if (recipe.description && typeof recipe.description === 'object') {
    return recipe.description[lang] || recipe.description.es || '';
  }

  // New format with descriptionKey
  if (recipe.descriptionKey && translations[recipe.id]?.[lang]) {
    const recipeData = translations[recipe.id][lang].recipe[recipe.id];
    return recipeData?.description || '';
  }

  return '';
}

export function getRecipeImage(recipe: Recipe): string {
  // New format
  if (recipe.featuredImage) {
    return recipe.featuredImage;
  }

  // Legacy format
  if (recipe.image) {
    return recipe.image;
  }

  return '/placeholder.svg';
}
