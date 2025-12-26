# Ejemplos de uso del sistema de traducciones regionales

Este documento contiene ejemplos prácticos de cómo usar el sistema de traducciones regionales en diferentes escenarios.

## Ejemplo 1: Búsqueda de alérgenos con autocompletado

```tsx
import { useState, useEffect } from 'react';
import { searchService } from '@/services/SearchService';
import { translationService } from '@/services/TranslationService';

function AllergenSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const search = async () => {
      if (!searchTerm) {
        setResult(null);
        return;
      }

      const allergenId = await searchService.searchAllergen(searchTerm);

      if (allergenId) {
        const displayName = await translationService.translate(`allergens.${allergenId}`);
        setResult(displayName);
      } else {
        setResult(null);
      }
    };

    search();
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar alérgeno..."
      />
      {result && (
        <div>
          Alérgeno encontrado: <strong>{result}</strong>
        </div>
      )}
    </div>
  );
}
```

**Comportamiento por región:**
- Usuario de Ecuador escribe "chocho" → Muestra "Chocho"
- Usuario de España escribe "altramuces" → Muestra "Altramuces"
- Usuario de Ecuador escribe "lupino" → Muestra "Chocho" (su término regional)
- Usuario de España escribe "cacahuetes" → Muestra "Cacahuetes"

## Ejemplo 2: Lista de alérgenos del usuario

```tsx
import { useEffect, useState } from 'react';
import { translationService } from '@/services/TranslationService';

interface UserProfile {
  allergens: string[];
}

function UserAllergensList({ profile }: { profile: UserProfile }) {
  const [allergenNames, setAllergenNames] = useState<string[]>([]);

  useEffect(() => {
    const loadNames = async () => {
      const names = await Promise.all(
        profile.allergens.map(id =>
          translationService.translate(`allergens.${id}`)
        )
      );
      setAllergenNames(names);
    };

    loadNames();
  }, [profile.allergens]);

  return (
    <div>
      <h3>Mis alérgenos</h3>
      <ul>
        {allergenNames.map((name, index) => (
          <li key={profile.allergens[index]}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Si el usuario tiene `["lupin", "peanuts"]`:**
- España: muestra "Altramuces", "Cacahuetes"
- Ecuador: muestra "Chocho", "Maní"
- México: muestra "Altramuces", "Cacahuates"

## Ejemplo 3: Selector de alérgenos con búsqueda

```tsx
import { useState, useEffect } from 'react';
import { searchService } from '@/services/SearchService';
import { translationService } from '@/services/TranslationService';

const COMMON_ALLERGENS = ['gluten', 'dairy', 'eggs', 'peanuts', 'nuts', 'fish', 'lupin'];

function AllergenSelector({
  selected,
  onSelect
}: {
  selected: string[];
  onSelect: (allergens: string[]) => void;
}) {
  const [allergenNames, setAllergenNames] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const loadNames = async () => {
      const names: Record<string, string> = {};
      for (const id of COMMON_ALLERGENS) {
        names[id] = await translationService.translate(`allergens.${id}`);
      }
      setAllergenNames(names);
    };

    loadNames();
  }, []);

  useEffect(() => {
    const search = async () => {
      if (!searchTerm) {
        setSearchResult(null);
        return;
      }

      const allergenId = await searchService.searchAllergen(searchTerm);

      if (allergenId) {
        const displayName = await translationService.translate(`allergens.${allergenId}`);
        setSearchResult({ id: allergenId, name: displayName });
      } else {
        setSearchResult(null);
      }
    };

    search();
  }, [searchTerm]);

  const toggleAllergen = (id: string) => {
    if (selected.includes(id)) {
      onSelect(selected.filter(a => a !== id));
    } else {
      onSelect([...selected, id]);
    }
  };

  return (
    <div>
      <h3>Selecciona tus alérgenos</h3>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar alérgeno..."
      />

      {searchResult && !COMMON_ALLERGENS.includes(searchResult.id) && (
        <button onClick={() => toggleAllergen(searchResult.id)}>
          Añadir {searchResult.name}
        </button>
      )}

      <div>
        {COMMON_ALLERGENS.map(id => (
          <label key={id}>
            <input
              type="checkbox"
              checked={selected.includes(id)}
              onChange={() => toggleAllergen(id)}
            />
            {allergenNames[id]}
          </label>
        ))}
      </div>
    </div>
  );
}
```

## Ejemplo 4: Mostrar ingredientes de receta

```tsx
import { useEffect, useState } from 'react';
import { translationService } from '@/services/TranslationService';
import type { Recipe } from '@/types';

function RecipeIngredients({ recipe }: { recipe: Recipe }) {
  const [ingredients, setIngredients] = useState<Array<{
    name: string;
    quantity: number;
    unit: string;
  }>>([]);

  useEffect(() => {
    const loadIngredients = async () => {
      const loaded = await Promise.all(
        recipe.ingredients.map(async (ingredient) => {
          let name = ingredient.name || '';

          if (ingredient.productId) {
            name = await translationService.translate(
              `recipe.${recipe.id}.ingredients.${ingredient.productId}`
            );
          }

          return {
            name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          };
        })
      );

      setIngredients(loaded);
    };

    loadIngredients();
  }, [recipe]);

  return (
    <div>
      <h3>Ingredientes</h3>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.quantity} {ingredient.unit} de {ingredient.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Si la receta tiene ingrediente "potato":**
- España: "2 unidades de Patatas"
- Ecuador: "2 unidades de Papas"
- México: "2 unidades de Papas"

## Ejemplo 5: Búsqueda de productos para lista de compras

```tsx
import { useState } from 'react';
import { searchService } from '@/services/SearchService';
import { translationService } from '@/services/TranslationService';

function ProductSearch({ onAddProduct }: { onAddProduct: (productId: string, name: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Array<{ id: string; name: string }>>([]);

  const handleSearch = async () => {
    const productId = await searchService.searchProduct(searchTerm);

    if (productId) {
      const displayName = await translationService.translate(`products.${productId}`);

      setResults([{ id: productId, name: displayName }]);
    } else {
      setResults([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Buscar producto..."
      />

      {results.map(result => (
        <div key={result.id}>
          <span>{result.name}</span>
          <button onClick={() => onAddProduct(result.id, result.name)}>
            Añadir
          </button>
        </div>
      ))}
    </div>
  );
}
```

**Comportamiento:**
- Usuario de España escribe "patata" → Encuentra producto y muestra "Patata"
- Usuario de Ecuador escribe "papa" → Encuentra el mismo producto y muestra "Papa"
- Usuario de México escribe "jitomate" → Encuentra "tomato" y muestra "Jitomate"

## Ejemplo 6: Cambiar región manualmente

```tsx
import { useState } from 'react';
import i18n from '@/i18n';
import { translationService } from '@/services/TranslationService';
import { searchService } from '@/services/SearchService';

function RegionSelector() {
  const [region, setRegion] = useState(i18n.language);

  const regions = [
    { code: 'es-ES', name: 'España' },
    { code: 'es-EC', name: 'Ecuador' },
    { code: 'es-MX', name: 'México' },
    { code: 'es-AR', name: 'Argentina' },
    { code: 'en', name: 'English' },
    { code: 'ca', name: 'Català' },
  ];

  const handleChange = async (newRegion: string) => {
    await i18n.changeLanguage(newRegion);
    translationService.clearCache();
    searchService.clearCache();
    setRegion(newRegion);
  };

  return (
    <select value={region} onChange={(e) => handleChange(e.target.value)}>
      {regions.map(r => (
        <option key={r.code} value={r.code}>
          {r.name}
        </option>
      ))}
    </select>
  );
}
```

## Ejemplo 7: Precargar traducciones esenciales

```tsx
import { useEffect } from 'react';
import { translationService } from '@/services/TranslationService';
import i18n from '@/i18n';

function App() {
  useEffect(() => {
    const preload = async () => {
      await translationService.preloadEssentials();
      console.log('Traducciones esenciales cargadas');
    };

    preload();

    const handleLanguageChange = () => {
      translationService.clearCache();
      translationService.preloadEssentials();
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return <div>{/* App content */}</div>;
}
```

## Patrones de uso recomendados

### 1. Búsqueda + Visualización
```typescript
const id = await searchService.searchAllergen(userInput);
const displayName = await translationService.translate(`allergens.${id}`);
```

### 2. Batch loading
```typescript
const names = await Promise.all(
  ids.map(id => translationService.translate(`allergens.${id}`))
);
```

### 3. Caché manual
```typescript
i18n.on('languageChanged', () => {
  translationService.clearCache();
  searchService.clearCache();
});
```

### 4. Validación de entrada
```typescript
const allergenId = await searchService.searchAllergen(userInput);
if (!allergenId) {
  console.error('Alérgeno no encontrado');
  return;
}
```
