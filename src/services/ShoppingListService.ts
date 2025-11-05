import { ShoppingList, ShoppingItem, ShoppingListSchema } from '../types';
import { LocalStorageService, StorageKeys, generateId } from '../utils/storage';
import { sessionService } from './SessionService';

class ShoppingListService {
  private lists: ShoppingList[] = [];
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    await sessionService.init();
    this.lists = LocalStorageService.get<ShoppingList[]>(StorageKeys.SHOPPING_LISTS, []);

    this.lists = this.lists.map(list => ShoppingListSchema.parse(list));

    this.initialized = true;
  }

  private save(): void {
    LocalStorageService.set(StorageKeys.SHOPPING_LISTS, this.lists);
  }

  async getAllLists(): Promise<ShoppingList[]> {
    await this.init();
    return [...this.lists].sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async getListById(id: string): Promise<ShoppingList | null> {
    await this.init();
    return this.lists.find(list => list.id === id) || null;
  }

  async createList(name: string): Promise<ShoppingList> {
    await this.init();

    const newList: ShoppingList = {
      id: generateId(),
      name,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: this.lists.length,
    };

    this.lists.push(newList);
    this.save();

    return newList;
  }

  async updateList(id: string, updates: Partial<ShoppingList>): Promise<ShoppingList | null> {
    await this.init();

    const index = this.lists.findIndex(list => list.id === id);
    if (index === -1) return null;

    this.lists[index] = {
      ...this.lists[index],
      ...updates,
      id,
      updatedAt: Date.now(),
    };

    this.save();
    return this.lists[index];
  }

  async deleteList(id: string): Promise<boolean> {
    await this.init();

    const index = this.lists.findIndex(list => list.id === id);
    if (index === -1) return false;

    this.lists.splice(index, 1);
    this.save();

    return true;
  }

  async addItem(listId: string, item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingItem | null> {
    await this.init();

    const list = this.lists.find(l => l.id === listId);
    if (!list) return null;

    const newItem: ShoppingItem = {
      ...item,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    list.items.push(newItem);
    list.updatedAt = Date.now();
    this.save();

    return newItem;
  }

  async updateItem(listId: string, itemId: string, updates: Partial<ShoppingItem>): Promise<ShoppingItem | null> {
    await this.init();

    const list = this.lists.find(l => l.id === listId);
    if (!list) return null;

    const itemIndex = list.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return null;

    list.items[itemIndex] = {
      ...list.items[itemIndex],
      ...updates,
      id: itemId,
      updatedAt: Date.now(),
    };

    list.updatedAt = Date.now();
    this.save();

    return list.items[itemIndex];
  }

  async deleteItem(listId: string, itemId: string): Promise<boolean> {
    await this.init();

    const list = this.lists.find(l => l.id === listId);
    if (!list) return false;

    const itemIndex = list.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return false;

    list.items.splice(itemIndex, 1);
    list.updatedAt = Date.now();
    this.save();

    return true;
  }

  async reorderItems(listId: string, itemIds: string[]): Promise<boolean> {
    await this.init();

    const list = this.lists.find(l => l.id === listId);
    if (!list) return false;

    const reorderedItems: ShoppingItem[] = [];
    itemIds.forEach(id => {
      const item = list.items.find(i => i.id === id);
      if (item) reorderedItems.push(item);
    });

    list.items = reorderedItems;
    list.updatedAt = Date.now();
    this.save();

    return true;
  }

  async clearCompleted(listId: string): Promise<boolean> {
    await this.init();

    const list = this.lists.find(l => l.id === listId);
    if (!list) return false;

    list.items = list.items.filter(item => !item.completed);
    list.updatedAt = Date.now();
    this.save();

    return true;
  }

  async exportToJSON(listId: string): Promise<string> {
    await this.init();

    const list = this.lists.find(l => l.id === listId);
    if (!list) throw new Error('List not found');

    return JSON.stringify(list, null, 2);
  }

  async importFromJSON(jsonString: string): Promise<ShoppingList> {
    await this.init();

    const data = JSON.parse(jsonString);
    const list = ShoppingListSchema.parse({
      ...data,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    this.lists.push(list);
    this.save();

    return list;
  }
}

export const shoppingListService = new ShoppingListService();
