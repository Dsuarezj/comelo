import { Heart, Star } from 'lucide-react';
import { Recipe } from '../types';
import { useTranslation } from 'react-i18next';
import Text from '../elements/Text';
import Image from '../elements/Image';
import Card from '../elements/Card';
import IconButton from '../elements/IconButton';
import { getRecipeNameSync, getRecipeImage } from '../utils/recipeHelpers';

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

export default function RecipeCard({
  recipe,
  onFavoriteToggle,
  isFavorite = false,
}: RecipeCardProps) {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en' | 'ca';

  const recipeName = getRecipeNameSync(recipe, currentLang);
  const recipeImage = getRecipeImage(recipe);

  return (
    <Card padding="none" className="w-40 flex-shrink-0 overflow-hidden">
      <div className="relative">
        <Image
          src={recipeImage}
          alt={recipeName}
          aspectRatio="4:3"
          rounded="none"
          className="h-32"
        />
        <div className="absolute top-2 right-2">
          <IconButton
            icon={Heart}
            onClick={() => onFavoriteToggle?.(recipe.id)}
            variant="default"
            size={18}
            active={isFavorite}
            ariaLabel={isFavorite ? t('recipes.removeFromFavorites') : t('recipes.addToFavorites')}
            className={isFavorite ? 'text-red-500' : 'text-gray-600'}
          />
        </div>
      </div>

      <div className="p-3 space-y-2">
        <Text variant="small" className="font-semibold line-clamp-2">
          {recipeName}
        </Text>

        <Text variant="caption" color="muted">
          {t('recipes.prepTime', { time: recipe.prepTime })}
        </Text>

        <div className="flex items-center gap-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <Text variant="caption" className="font-medium">
            {recipe.rating}
          </Text>
        </div>
      </div>
    </Card>
  );
}
