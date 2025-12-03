import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product categories enum
export const CATEGORIES = [
  "cpus",
  "gpus", 
  "laptops",
  "phones",
  "headphones"
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  cpus: "CPUs",
  gpus: "GPUs",
  laptops: "Laptops",
  phones: "Phones",
  headphones: "Headphones"
};

// Products table
export const products = pgTable("products", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  brand: text("brand").notNull(),
  imageUrl: text("image_url"),
  affiliateLink: text("affiliate_link"),
  isFeatured: boolean("is_featured").default(false),
  // AI-generated content
  categoryDrawbacks: text("category_drawbacks"),
  modelDrawbacks: text("model_drawbacks"),
  doNotBuyIf: text("do_not_buy_if"),
  worstIssue: text("worst_issue"),
  reviewGenerated: boolean("review_generated").default(false),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Type for product with parsed review content
export interface ProductWithReview extends Product {
  parsedCategoryDrawbacks: string[];
  parsedModelDrawbacks: { title: string; description: string }[];
  parsedDoNotBuyIf: string[];
}

// Search params type
export interface SearchParams {
  query?: string;
  category?: Category;
  page?: number;
  limit?: number;
}

// API response types
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  count: number;
  description: string;
}
