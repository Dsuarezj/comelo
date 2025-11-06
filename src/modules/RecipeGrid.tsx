import { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';

interface RecipeGridProps {
  recipes: Recipe[];
  favorites: string[];
  onFavoriteToggle: (id: string) => void;
}

export default function RecipeGrid({
  recipes,
  favorites,
  onFavoriteToggle,
}: RecipeGridProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favorites.includes(recipe.id)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
}
