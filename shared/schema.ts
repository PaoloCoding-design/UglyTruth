
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product categories enum
export const CATEGORIES = [
  "pc-components",
  "laptops",
  "phones",
  "headphones"
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  "pc-components": "PC Components",
  laptops: "Laptops",
  phones: "Phones",
  headphones: "Headphones"
};

// PC Component types
export const PC_COMPONENT_TYPES = [
  "cpu",
  "gpu",
  "ram",
  "psu",
  "motherboard",
  "storage",
  "cooling"
] as const;

export type PCComponentType = typeof PC_COMPONENT_TYPES[number];

export const PC_COMPONENT_LABELS: Record<PCComponentType, string> = {
  cpu: "CPUs",
  gpu: "GPUs",
  ram: "RAM",
  psu: "Power Supplies",
  motherboard: "Motherboards",
  storage: "Storage",
  cooling: "Cooling"
};

// Brands by component type
export const COMPONENT_BRANDS: Record<PCComponentType, string[]> = {
  cpu: ["Intel", "AMD"],
  gpu: ["NVIDIA", "AMD", "Intel"],
  ram: ["Corsair", "G.Skill", "Kingston", "Crucial"],
  psu: ["Corsair", "EVGA", "Seasonic", "Thermaltake"],
  motherboard: ["ASUS", "MSI", "Gigabyte", "ASRock"],
  storage: ["Samsung", "Western Digital", "Crucial", "Seagate"],
  cooling: ["Noctua", "Corsair", "be quiet!", "Arctic"]
};

// Product tags
export const PRODUCT_TAGS = {
  GOOD: ["efficient", "quiet", "reliable", "value", "performance"],
  BAD: ["loud", "hot", "expensive", "incompatible", "poor-quality"]
} as const;

// Products table
export const products = pgTable("products", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  componentType: varchar("component_type", { length: 50 }),
  brand: text("brand").notNull(),
  releaseDate: text("release_date"),
  imageUrl: text("image_url"),
  affiliateLink: text("affiliate_link"),
  isFeatured: boolean("is_featured").default(false),
  tags: text("tags"), // JSON array of tags
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
  parsedTags: string[];
}

// Search params type
export interface SearchParams {
  query?: string;
  category?: Category;
  componentType?: PCComponentType;
  brand?: string;
  tags?: string[];
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
