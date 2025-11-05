import { Plus, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Recipe, ShoppingList } from '../types';
import recipesData from '../data/recipes.json';
import { shoppingListService } from '../services/ShoppingListService';
import { Text, Card } from '../elements';
import { RecipeGrid, ListSection } from '../modules';

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
        <Text variant="h1" className="mb-2">
          {t('home.greeting')}
        </Text>
        <Text variant="body" color="muted" className="mb-8">
          {t('home.subtitle')}
        </Text>

        <div className="mb-8">
          <Text variant="small" className="font-semibold mb-3" color="secondary">
            {t('home.myLists')}
          </Text>

          <Card
            onClick={handleCreateList}
            padding="md"
            className="flex items-center gap-3"
          >
            <div className="bg-pink-100 rounded-xl p-3">
              <Plus size={24} className="text-pink-600" />
            </div>
            <Text variant="body" className="font-medium">
              {t('home.createListButton')}
            </Text>
          </Card>

          {lists.length > 0 && (
            <div className="mt-3">
              <ListSection lists={lists} onListClick={(id) => navigate(`/lists/${id}`)} />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Text variant="small" className="font-semibold" color="secondary">
              {t('home.recommendedRecipes')}
            </Text>
            <button
              onClick={() => navigate('/recipes')}
              className="text-blue-600 text-sm font-medium flex items-center gap-1"
            >
              {t('home.viewMoreRecipes')}
              <ArrowRight size={16} />
            </button>
          </div>

          <RecipeGrid
            recipes={recipes}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      </div>
    </div>
  );
}
