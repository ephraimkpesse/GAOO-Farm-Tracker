import { transactions, categories, inventoryItems, type Transaction, type InsertTransaction, type Category, type InsertCategory, type InventoryItem, type InsertInventoryItem } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Transactions
  getTransactions(): Promise<Transaction[]>;
  getTransactionById(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoriesByType(type: 'income' | 'expense'): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Inventory
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItemById(id: number): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private transactions: Map<number, Transaction>;
  private categories: Map<number, Category>;
  private inventoryItems: Map<number, InventoryItem>;
  private currentTransactionId: number;
  private currentCategoryId: number;
  private currentInventoryId: number;

  constructor() {
    this.transactions = new Map();
    this.categories = new Map();
    this.inventoryItems = new Map();
    this.currentTransactionId = 1;
    this.currentCategoryId = 1;
    this.currentInventoryId = 1;
    
    // Initialize with default categories
    this.initializeDefaultCategories();
  }

  private initializeDefaultCategories() {
    const defaultCategories: InsertCategory[] = [
      // Income categories
      { name: "Crop Sales", type: "income", icon: "seedling" },
      { name: "Livestock Sales", type: "income", icon: "cow" },
      { name: "Subsidies", type: "income", icon: "hand-holding-dollar" },
      { name: "Grants", type: "income", icon: "gift" },
      { name: "Other Income", type: "income", icon: "plus" },
      
      // Expense categories
      { name: "Seeds & Plants", type: "expense", icon: "seedling" },
      { name: "Equipment", type: "expense", icon: "tools" },
      { name: "Labor", type: "expense", icon: "users" },
      { name: "Utilities", type: "expense", icon: "bolt" },
      { name: "Fertilizer", type: "expense", icon: "flask" },
      { name: "Fuel", type: "expense", icon: "gas-pump" },
      { name: "Insurance", type: "expense", icon: "shield" },
      { name: "Maintenance", type: "expense", icon: "wrench" },
      { name: "Other Expenses", type: "expense", icon: "minus" },
    ];

    defaultCategories.forEach(category => {
      this.createCategory(category);
    });
  }

  // Transaction methods
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      paymentMethod: insertTransaction.paymentMethod || null,
      receiptUrl: insertTransaction.receiptUrl || null,
      receiptFilename: insertTransaction.receiptFilename || null,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, updateData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const existing = this.transactions.get(id);
    if (!existing) return undefined;
    
    const updated: Transaction = { ...existing, ...updateData };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoriesByType(type: 'income' | 'expense'): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(cat => cat.type === type);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      icon: insertCategory.icon || null
    };
    this.categories.set(id, category);
    return category;
  }

  // Inventory methods
  async getInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getInventoryItemById(id: number): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.currentInventoryId++;
    const item: InventoryItem = {
      ...insertItem,
      id,
      value: insertItem.value || null,
      lastUpdated: new Date(),
    };
    this.inventoryItems.set(id, item);
    return item;
  }

  async updateInventoryItem(id: number, updateData: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const existing = this.inventoryItems.get(id);
    if (!existing) return undefined;
    
    const updated: InventoryItem = {
      ...existing,
      ...updateData,
      lastUpdated: new Date(),
    };
    this.inventoryItems.set(id, updated);
    return updated;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventoryItems.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeDefaultCategories();
  }

  private async initializeDefaultCategories() {
    // Check if categories already exist
    const existingCategories = await db.select().from(categories).limit(1);
    if (existingCategories.length > 0) return;

    const defaultCategories: InsertCategory[] = [
      // Income categories
      { name: "Crop Sales", type: "income", icon: "seedling" },
      { name: "Livestock Sales", type: "income", icon: "cow" },
      { name: "Subsidies", type: "income", icon: "hand-holding-dollar" },
      { name: "Grants", type: "income", icon: "gift" },
      { name: "Other Income", type: "income", icon: "plus" },
      
      // Expense categories
      { name: "Seeds & Plants", type: "expense", icon: "seedling" },
      { name: "Equipment", type: "expense", icon: "tools" },
      { name: "Labor", type: "expense", icon: "users" },
      { name: "Utilities", type: "expense", icon: "bolt" },
      { name: "Fertilizer", type: "expense", icon: "flask" },
      { name: "Fuel", type: "expense", icon: "gas-pump" },
      { name: "Insurance", type: "expense", icon: "shield" },
      { name: "Maintenance", type: "expense", icon: "wrench" },
      { name: "Other Expenses", type: "expense", icon: "minus" },
    ];

    await db.insert(categories).values(defaultCategories);
  }

  // Transaction methods
  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values({
        ...insertTransaction,
        createdAt: new Date(),
      })
      .returning();
    return transaction;
  }

  async updateTransaction(id: number, updateData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set(updateData)
      .where(eq(transactions.id, id))
      .returning();
    return transaction || undefined;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    const result = await db.delete(transactions).where(eq(transactions.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoriesByType(type: 'income' | 'expense'): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.type, type));
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  // Inventory methods
  async getInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems).orderBy(desc(inventoryItems.lastUpdated));
  }

  async getInventoryItemById(id: number): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item || undefined;
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const [item] = await db
      .insert(inventoryItems)
      .values({
        ...insertItem,
        lastUpdated: new Date(),
      })
      .returning();
    return item;
  }

  async updateInventoryItem(id: number, updateData: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const [item] = await db
      .update(inventoryItems)
      .set({
        ...updateData,
        lastUpdated: new Date(),
      })
      .where(eq(inventoryItems.id, id))
      .returning();
    return item || undefined;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const result = await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
