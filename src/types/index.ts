import { z } from 'zod';

export const ShoppingItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().default(1),
  unit: z.string().optional(),
  completed: z.boolean().default(false),
  category: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const ShoppingListSchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(ShoppingItemSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
  order: z.number().default(0),
});

export const RecipeSchema = z.object({
  id: z.string(),
  name: z.object({
    es: z.string(),
    en: z.string(),
    ca: z.string(),
  }).optional(),
  nameKey: z.string().optional(),
  description: z.object({
    es: z.string(),
    en: z.string(),
    ca: z.string(),
  }).optional(),
  descriptionKey: z.string().optional(),
  image: z.string().optional(),
  featuredImage: z.string().optional(),
  prepTime: z.number(),
  rating: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  ingredients: z.array(z.object({
    name: z.string().optional(),
    productId: z.string().optional(),
    quantity: z.number(),
    unit: z.string(),
    notes: z.string().optional(),
    optional: z.boolean().optional(),
  })),
});

export const UserProfileSchema = z.object({
  allergens: z.object({
    glutenFree: z.boolean().default(false),
    dairyFree: z.boolean().default(false),
    nutFree: z.boolean().default(false),
    eggFree: z.boolean().default(false),
    soyFree: z.boolean().default(false),
    fishFree: z.boolean().default(false),
    sulfiteFree: z.boolean().default(false),
  }),
  language: z.enum(['es', 'en', 'ca']).default('es'),
  favoriteRecipes: z.array(z.string()).default([]),
  favoriteProducts: z.array(z.string()).default([]),
});

export const QueueItemSchema = z.object({
  id: z.number().optional(),
  queueName: z.string(),
  resourceKey: z.string(),
  payload: z.any(),
  status: z.enum(['pending', 'processing', 'error']).default('pending'),
  updatedAt: z.number(),
  coalescingTs: z.number(),
});

export type ShoppingItem = z.infer<typeof ShoppingItemSchema>;
export type ShoppingList = z.infer<typeof ShoppingListSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type QueueItem = z.infer<typeof QueueItemSchema>;

export type Language = 'es' | 'en' | 'ca';

export type QueueState = 'IDLE' | 'PENDING' | 'PROCESSING' | 'ERROR';

export interface DropboxAuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}
