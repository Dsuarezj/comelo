# 📋 Sistema de Formularios Multi-Paso

Sistema genérico y reutilizable para crear flujos de formularios multi-paso con navegación, validación y redirección condicional.

## 🏗️ Arquitectura

```
src/
├── types/
│   └── form-flow.ts              ← Tipos genéricos (FormFlowConfig, FormStepConfig, FormStepProps)
│
├── config/forms/
│   ├── onboarding.flow.ts        ← Configuración del flujo de onboarding
│   └── planner.flow.ts           ← Configuración del flujo del planificador
│
├── components/
│   ├── form-flow/
│   │   ├── FormFlowRunner.tsx    ← Runner genérico (orquesta todo)
│   │   ├── FormLayout.tsx         ← Layout común (progress, botones, contenido)
│   │   └── ProgressBar.tsx       ← Barra de progreso reutilizable
│   │
│   └── form-steps/
│       ├── onboarding/           ← Pasos específicos de onboarding
│       │   └── DropboxStep.tsx
│       ├── planner/              ← Pasos específicos del planificador
│       │   ├── ExercisePreferenceStep.tsx
│       │   └── TrainingDetailsStep.tsx
│       └── shared/               ← Pasos reutilizables entre flujos
│           └── AllergensStep.tsx
│
└── pages/
    ├── OnboardingPage.tsx         ← Página que usa el flujo de onboarding
    └── PlannerSetupPage.tsx       ← Página que usa el flujo del planificador
```

## 🎯 Conceptos Clave

### FormFlowConfig
Configuración completa de un flujo de formulario que define:
- **id**: Identificador único del flujo
- **steps**: Array de pasos que componen el flujo
- **onComplete**: Función que determina la redirección final según el origen

### FormStepConfig
Configuración de un paso individual:
- **id**: Identificador único del paso
- **component**: Componente React que renderiza el paso
- **primaryLabelKey**: Key de traducción para el botón principal (opcional)
- **secondaryLabelKey**: Key de traducción para el botón secundario (opcional)
- **showBack**: Si muestra el botón de retroceso (opcional)
- **isSkippable**: Si el paso puede ser saltado (opcional)
- **shouldSkip**: Función que determina si el paso debe saltarse condicionalmente (opcional)

### FormStepProps
Props que recibe cada componente de paso:
- **onNext**: Función para avanzar al siguiente paso
- **onBack**: Función para retroceder al paso anterior
- **onClose**: Función para cerrar el flujo
- **currentStep**: Número del paso actual (1-indexed)
- **totalSteps**: Total de pasos visibles
- **data**: Objeto con los datos acumulados del flujo
- **setData**: Función para actualizar los datos del flujo

## 📝 Cómo Crear un Nuevo Flujo

### 1. Crear los Pasos

Crea los componentes de paso en `src/components/form-steps/{dominio}/`:

```tsx
// src/components/form-steps/mi-dominio/MiPaso.tsx
import { useTranslation } from 'react-i18next';
import { FormStepProps } from '../../../types/form-flow';
import FormLayout from '../../form-flow/FormLayout';

export default function MiPaso({ 
  onNext, 
  onBack, 
  onClose, 
  currentStep, 
  totalSteps,
  data,
  setData 
}: FormStepProps) {
  const { t } = useTranslation();

  const handleContinue = () => {
    // Validación propia del paso
    if (data.miCampo) {
      onNext();
    }
  };

  return (
    <FormLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onClose={onClose}
      onBack={onBack}
      showBackButton={currentStep > 1}
      primaryButtonText={t('mi-dominio.paso.continueButton')}
      secondaryButtonText={t('mi-dominio.paso.skipButton')}
      onPrimaryClick={handleContinue}
      onSecondaryClick={onNext}
    >
      <div className="flex flex-col py-6">
        <h1 className="text-[28px] font-bold text-text-primary text-center mb-3">
          {t('mi-dominio.paso.title')}
        </h1>
        
        {/* Contenido del paso */}
      </div>
    </FormLayout>
  );
}
```

**Reglas importantes:**
- Cada paso es **autocontenido** con su propia validación
- Usa `FormLayout` para mantener consistencia visual
- Los textos deben venir de traducciones (i18n)
- Usa `data` y `setData` para persistir información entre pasos

### 2. Crear la Configuración del Flujo

Crea el archivo de configuración en `src/config/forms/`:

```tsx
// src/config/forms/mi-flujo.flow.ts
import { FormFlowConfig } from '../../types/form-flow';
import MiPaso from '../../components/form-steps/mi-dominio/MiPaso';
import OtroPaso from '../../components/form-steps/mi-dominio/OtroPaso';
import AllergensStep from '../../components/form-steps/shared/AllergensStep';

export const miFlujo: FormFlowConfig = {
  id: 'mi-flujo',
  steps: [
    {
      id: 'primer-paso',
      component: MiPaso,
      primaryLabelKey: 'mi-dominio.paso.continueButton',
      secondaryLabelKey: 'mi-dominio.paso.skipButton',
    },
    {
      id: 'alergias',
      component: AllergensStep, // Reutilizando paso compartido
    },
    {
      id: 'paso-condicional',
      component: OtroPaso,
      shouldSkip: (data) => data.miCampo === false, // Se salta si miCampo es false
    },
  ],
  onComplete: ({ origin, data }) => {
    // Lógica de redirección según el origen
    if (origin === 'home') {
      return '/';
    }
    if (origin === 'planner') {
      return '/plan-week';
    }
    return '/';
  },
};
```

### 3. Crear la Página

Crea la página que usa el flujo:

```tsx
// src/pages/MiFlujoPage.tsx
import FormFlowRunner from '../components/form-flow/FormFlowRunner';
import { miFlujo } from '../config/forms/mi-flujo.flow';

export default function MiFlujoPage() {
  return <FormFlowRunner config={miFlujo} />;
}
```

### 4. Añadir la Ruta

Añade la ruta en tu router:

```tsx
<Route path="/mi-flujo" element={<MiFlujoPage />} />
```

### 5. Añadir Traducciones

Añade las traducciones necesarias en `src/i18n/locales/`:

```json
{
  "mi-dominio": {
    "paso": {
      "title": "Título del paso",
      "description": "Descripción del paso",
      "continueButton": "Continuar",
      "skipButton": "Saltar"
    }
  }
}
```

## 🔄 Navegación y Origen

### Invocar un Flujo con Origen

Para que el flujo sepa a dónde redirigir al completarse, pasa el parámetro `origin`:

```tsx
// Desde un componente
<Link to="/planner-setup?origin=home">Configurar desde home</Link>
<Link to="/planner-setup?origin=planner">Configurar desde planner</Link>

// Desde código
navigate('/planner-setup?origin=home');
```

El `FormFlowRunner` lee automáticamente el query param `origin` y lo pasa al `onComplete`.

### Redirección Condicional

En el `onComplete` del config, puedes usar `origin` y `data` para decidir la redirección:

```tsx
onComplete: ({ origin, data }) => {
  // Guardar datos si es necesario
  if (data.miCampo) {
    LocalStorageService.set(StorageKeys.MI_DATO, data.miCampo);
  }
  
  // Redirigir según origen
  return origin === 'planner' ? '/plan-week' : '/';
}
```

## ⏭️ Saltos Condicionales

Para saltar pasos basados en datos del flujo, usa `shouldSkip`:

```tsx
{
  id: 'entrenamiento',
  component: TrainingDetailsStep,
  shouldSkip: (data) => data.likesExercise === false,
}
```

**Comportamiento:**
- Si `shouldSkip` retorna `true`, el paso se omite automáticamente
- La barra de progreso se ajusta automáticamente
- La navegación (next/back) salta los pasos omitidos

## 🔁 Reutilización de Pasos

Los pasos pueden reutilizarse entre diferentes flujos. Colócalos en `form-steps/shared/`:

```tsx
// Usado en onboarding.flow.ts
{
  id: 'allergens',
  component: AllergensStep,
}

// Usado también en planner.flow.ts
{
  id: 'allergens',
  component: AllergensStep,
}
```

## ✅ Validación

Cada paso maneja su propia validación:

```tsx
const handleContinue = () => {
  // Validación propia
  if (!data.email || !isValidEmail(data.email)) {
    // Mostrar error o no avanzar
    return;
  }
  
  // Si pasa la validación, avanzar
  onNext();
};
```

**No configures validaciones en el config** - esto generaría acoplamiento. Cada paso es responsable de validar sus propios datos.

## 📊 Ejemplo Completo: Flujo del Planificador

```tsx
// config/forms/planner.flow.ts
export const plannerFlow: FormFlowConfig = {
  id: 'planner',
  steps: [
    {
      id: 'allergens',
      component: AllergensStep, // Paso compartido
    },
    {
      id: 'exercise',
      component: ExercisePreferenceStep,
    },
    {
      id: 'training',
      component: TrainingDetailsStep,
      shouldSkip: (data) => data.likesExercise === false, // Se salta si no hace ejercicio
    },
  ],
  onComplete: ({ origin }) => {
    return origin === 'home' ? '/' : '/plan-week';
  },
};
```

**Flujo:**
1. Usuario selecciona alergias
2. Usuario indica si hace ejercicio
3. Si hace ejercicio → muestra detalles de entrenamiento
4. Si no hace ejercicio → salta directamente al final
5. Redirige según el origen

## 🎨 Componentes del Sistema

### FormFlowRunner
Runner genérico que:
- Maneja el estado del flujo (paso actual, datos)
- Calcula qué pasos son visibles (considerando `shouldSkip`)
- Maneja navegación (next, back, close)
- Lee el parámetro `origin` de la URL
- Ejecuta `onComplete` al finalizar

### FormLayout
Layout común que proporciona:
- Barra de progreso
- Botón de cerrar (X)
- Botón de retroceso (opcional)
- Botones de acción (primary y secondary)
- Contenedor de contenido con scroll

### ProgressBar
Barra de progreso que muestra:
- Progreso visual basado en `currentStep / totalSteps`
- Transición suave al cambiar de paso

## 🚫 Anti-Patrones

### ❌ No configurar validaciones en el config
```tsx
// ❌ MAL
{
  id: 'email',
  component: EmailStep,
  required: true, // ❌ Acoplamiento
  validation: (value) => isValidEmail(value), // ❌ Acoplamiento
}

// ✅ BIEN - Validación en el componente
const handleContinue = () => {
  if (!isValidEmail(data.email)) return;
  onNext();
};
```

### ❌ No usar strings hardcodeados
```tsx
// ❌ MAL
primaryButtonText="Continuar"

// ✅ BIEN
primaryButtonText={t('mi-dominio.paso.continueButton')}
```

### ❌ No crear pasos que dependan de otros
```tsx
// ❌ MAL - Paso que importa otro paso
import { OtherStep } from './OtherStep';

// ✅ BIEN - Usar data para compartir información
setData(prev => ({ ...prev, miCampo: valor }));
```

## 📈 Flujos Actuales

| Flujo | Pasos | Descripción |
|-------|-------|-------------|
| `onboarding` | 2 | Dropbox + Alergias |
| `planner` | 3 | Alergias + Ejercicio + Entrenamiento (condicional) |

## 🔮 Futuros Flujos

- **Preferencias de recetas**: Configurar tipos de comida preferidos
- **Información personal**: Peso, altura, objetivos nutricionales
- **Combinaciones**: Alergias + Deporte para calcular calorías

## 🎯 Ventajas del Sistema

✅ **Escalable**: Añadir nuevos flujos es trivial
✅ **Reutilizable**: Pasos compartidos entre flujos
✅ **Consistente**: Mismo layout y UX en todos los flujos
✅ **Flexible**: Saltos condicionales y redirección dinámica
✅ **Mantenible**: Separación clara de responsabilidades
✅ **Type-safe**: TypeScript en toda la cadena

---

**📋 Mantén los formularios organizados y reutilizables!**

