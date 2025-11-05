import { Plus, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { Recipe, ShoppingList } from '../types';
import recipesData from '../data/recipes.json';
import { shoppingListService } from '../services/ShoppingListService';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [recipes] = useState<Recipe[]>(recipesData as Recipe[]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadLists();
    loadFavorites();
  }, []);

  const loadLists = async () => {
    const allLists = await shoppingListService.getAllLists();
    setLists(allLists.slice(0, 3));
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('comelo_favorite_recipes');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const handleFavoriteToggle = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('comelo_favorite_recipes', JSON.stringify(updated));
  };

  const handleCreateList = async () => {
    const name = prompt(t('lists.listName'));
    if (name?.trim()) {
      await shoppingListService.createList(name.trim());
      loadLists();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="px-6 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {t('home.greeting')}
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          {t('home.subtitle')}
        </p>

        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            {t('home.myLists')}
          </h2>

          <button
            onClick={handleCreateList}
            className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <div className="bg-pink-100 rounded-xl p-3">
              <Plus size={24} className="text-pink-600" />
            </div>
            <span className="text-gray-900 font-medium">
              {t('home.createListButton')}
            </span>
          </button>

          {lists.length > 0 && (
            <div className="mt-3 space-y-2">
              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => navigate(`/lists/${list.id}`)}
                  className="w-full bg-white rounded-xl shadow-sm p-3 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-lg p-2">
                      <Plus size={20} className="text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">{list.name}</h3>
                      <p className="text-xs text-gray-500">
                        {t('lists.itemsCount', { count: list.items.length })}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">
              {t('home.recommendedRecipes')}
            </h2>
            <button
              onClick={() => navigate('/recipes')}
              className="text-blue-600 text-sm font-medium flex items-center gap-1"
            >
              {t('home.viewMoreRecipes')}
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favorites.includes(recipe.id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
