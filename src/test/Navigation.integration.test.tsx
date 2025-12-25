import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

vi.mock('../i18n', () => ({
  default: {},
}));

const mockT = (key: string) => {
  const translations: Record<string, string> = {
    'app.name': 'Comelo',
    'home.greeting': 'Hola!',
    'home.subtitle': 'Tu camino para comer mejor',
    'home.createList.title': 'Crear nueva lista',
    'home.createList.description': 'Incluye comida real',
    'home.searchRecipes.title': 'Buscar nuevas recetas',
    'home.searchRecipes.description': 'Ideas faciles',
    'home.planWeek.title': 'Planificar la semana',
    'home.planWeek.description': 'Organiza tus comidas',
    'nav.home': 'Inicio',
    'nav.lists': 'Listas',
    'nav.recipes': 'Recetas',
    'lists.title': 'Mis Listas de Compras',
    'lists.comingSoon': 'Proximamente',
    'recipes.title': 'Recetas Saludables',
    'recipes.comingSoon': 'Proximamente',
    'common.back': 'Volver',
    'common.loading': 'Cargando',
    'menu.title': 'Mas Opciones',
    'language.selectLanguage': 'Seleccionar idioma',
  };
  return translations[key] || key;
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: {
      language: 'es',
      changeLanguage: vi.fn(),
    },
  }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Navigation Integration Tests', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
    window.history.pushState({}, '', '/');
  });

  it('should navigate from Home to Shopping Lists and back using back button', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Hola!')).toBeInTheDocument();
    }, { timeout: 3000 });

    const listsNavButton = screen.getByRole('button', { name: /listas/i });
    expect(listsNavButton).toBeInTheDocument();

    await user.click(listsNavButton);

    await waitFor(() => {
      expect(screen.getByText('Mis Listas de Compras')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText('Proximamente')).toBeInTheDocument();

    const backButton = screen.getByRole('button', { name: /volver/i });
    expect(backButton).toBeInTheDocument();

    await user.click(backButton);

    await waitFor(() => {
      expect(screen.getByText('Hola!')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.queryByText('Mis Listas de Compras')).not.toBeInTheDocument();
  });

  it('should show back button only on non-home pages', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Hola!')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.queryByRole('button', { name: /volver/i })).not.toBeInTheDocument();

    const recipesNavButton = screen.getByRole('button', { name: /recetas/i });
    await user.click(recipesNavButton);

    await waitFor(() => {
      const backButton = screen.queryByRole('button', { name: /volver/i });
      expect(backButton).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should persist navigation stack in sessionStorage', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Hola!')).toBeInTheDocument();
    }, { timeout: 3000 });

    const listsNavButton = screen.getByRole('button', { name: /listas/i });
    await user.click(listsNavButton);

    await waitFor(() => {
      expect(screen.getByText('Mis Listas de Compras')).toBeInTheDocument();
    }, { timeout: 3000 });

    const storedStack = sessionStorage.getItem('comelo_nav_stack');
    expect(storedStack).toBeTruthy();

    const stack = JSON.parse(storedStack!);
    expect(stack).toContain('/shopping-lists');
  });

  it('should clear navigation stack when returning to home', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Hola!')).toBeInTheDocument();
    }, { timeout: 3000 });

    const listsNavButton = screen.getByRole('button', { name: /listas/i });
    await user.click(listsNavButton);

    await waitFor(() => {
      expect(screen.getByText('Mis Listas de Compras')).toBeInTheDocument();
    }, { timeout: 3000 });

    let storedStack = sessionStorage.getItem('comelo_nav_stack');
    expect(storedStack).toBeTruthy();

    const homeNavButton = screen.getByRole('button', { name: /inicio/i });
    await user.click(homeNavButton);

    await waitFor(() => {
      expect(screen.getByText('Hola!')).toBeInTheDocument();
    }, { timeout: 3000 });

    storedStack = sessionStorage.getItem('comelo_nav_stack');
    const stack = JSON.parse(storedStack!);
    expect(stack).toEqual([]);
  });
});
