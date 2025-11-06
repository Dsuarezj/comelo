import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

vi.mock('../i18n', () => ({
  default: {},
}));

const mockT = (key: string) => {
  const translations: Record<string, string> = {
    'home.greeting': '¡Hola!',
    'home.subtitle': 'Crea tu lista de compras',
    'home.createListButton': 'Crear Nueva Lista',
    'home.recentLists': 'Listas Recientes',
    'home.featuredRecipes': 'Recetas Destacadas',
    'nav.home': 'Inicio',
    'nav.lists': 'Listas',
    'nav.recipes': 'Recetas',
    'nav.profile': 'Perfil',
    'lists.title': 'Mis Listas',
    'lists.comingSoon': 'Próximamente: Vista de listas de compras',
    'recipes.title': 'Recetas',
    'recipes.comingSoon': 'Próximamente: Vista de recetas',
    'common.back': 'Volver',
    'common.loading': 'Cargando',
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
      expect(screen.getByText('¡Hola!')).toBeInTheDocument();
    }, { timeout: 3000 });

    const listsNavButton = screen.getByRole('button', { name: /listas/i });
    expect(listsNavButton).toBeInTheDocument();

    await user.click(listsNavButton);

    await waitFor(() => {
      expect(screen.getByText('Mis Listas')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText('Próximamente: Vista de listas de compras')).toBeInTheDocument();

    const backButton = screen.getByRole('button', { name: /volver/i });
    expect(backButton).toBeInTheDocument();

    await user.click(backButton);

    await waitFor(() => {
      expect(screen.getByText('¡Hola!')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.queryByText('Mis Listas')).not.toBeInTheDocument();
  });

  it('should show back button only on non-home pages', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('¡Hola!')).toBeInTheDocument();
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
      expect(screen.getByText('¡Hola!')).toBeInTheDocument();
    }, { timeout: 3000 });

    const listsNavButton = screen.getByRole('button', { name: /listas/i });
    await user.click(listsNavButton);

    await waitFor(() => {
      expect(screen.getByText('Mis Listas')).toBeInTheDocument();
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
      expect(screen.getByText('¡Hola!')).toBeInTheDocument();
    }, { timeout: 3000 });

    const listsNavButton = screen.getByRole('button', { name: /listas/i });
    await user.click(listsNavButton);

    await waitFor(() => {
      expect(screen.getByText('Mis Listas')).toBeInTheDocument();
    }, { timeout: 3000 });

    let storedStack = sessionStorage.getItem('comelo_nav_stack');
    expect(storedStack).toBeTruthy();

    const homeNavButton = screen.getByRole('button', { name: /inicio/i });
    await user.click(homeNavButton);

    await waitFor(() => {
      expect(screen.getByText('¡Hola!')).toBeInTheDocument();
    }, { timeout: 3000 });

    storedStack = sessionStorage.getItem('comelo_nav_stack');
    const stack = JSON.parse(storedStack!);
    expect(stack).toEqual([]);
  });
});
