import { Heart, Star } from 'lucide-react';
import { Recipe } from '../types';
import { useTranslation } from 'react-i18next';

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

export default function RecipeCard({ recipe, onFavoriteToggle, isFavorite = false }: RecipeCardProps) {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en' | 'ca';

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden w-40 flex-shrink-0">
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.name[currentLang]}
          className="w-full h-32 object-cover"
        />
        <button
          onClick={() => onFavoriteToggle?.(recipe.id)}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md"
        >
          <Heart
            size={18}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
          {recipe.name[currentLang]}
        </h3>

        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
          <span>{t('recipes.prepTime', { time: recipe.prepTime })}</span>
        </div>

        <div className="flex items-center gap-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium text-gray-700">{recipe.rating}</span>
        </div>
      </div>
    </div>
  );
}
