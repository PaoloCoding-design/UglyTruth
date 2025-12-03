import { 
  type Product, 
  type InsertProduct, 
  type Category, 
  CATEGORIES,
  CATEGORY_LABELS
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: Category): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  getCategoryCounts(): Promise<Record<Category, number>>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;

  constructor() {
    this.products = new Map();
    this.seedProducts();
  }

  private seedProducts() {
    // Seed with initial product data across all categories
    const productData = this.generateProductCatalog();
    productData.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  private generateProductCatalog(): Product[] {
    const products: Product[] = [];

    // CPUs
    const cpus = [
      { name: "Intel Core i9-14900K", brand: "Intel" },
      { name: "Intel Core i7-14700K", brand: "Intel" },
      { name: "Intel Core i5-14600K", brand: "Intel" },
      { name: "Intel Core i9-13900K", brand: "Intel" },
      { name: "Intel Core i7-13700K", brand: "Intel" },
      { name: "Intel Core i5-13600K", brand: "Intel" },
      { name: "AMD Ryzen 9 7950X3D", brand: "AMD" },
      { name: "AMD Ryzen 9 7950X", brand: "AMD" },
      { name: "AMD Ryzen 7 7800X3D", brand: "AMD" },
      { name: "AMD Ryzen 7 7700X", brand: "AMD" },
      { name: "AMD Ryzen 5 7600X", brand: "AMD" },
      { name: "AMD Ryzen 9 5950X", brand: "AMD" },
      { name: "AMD Ryzen 7 5800X3D", brand: "AMD" },
      { name: "AMD Ryzen 5 5600X", brand: "AMD" },
      { name: "Intel Core i9-12900K", brand: "Intel" },
      { name: "Intel Core i5-12600K", brand: "Intel" },
      { name: "AMD Ryzen 9 9950X", brand: "AMD" },
      { name: "AMD Ryzen 7 9700X", brand: "AMD" },
      { name: "AMD Ryzen 5 9600X", brand: "AMD" },
      { name: "Intel Core Ultra 9 285K", brand: "Intel" },
    ];

    // GPUs
    const gpus = [
      { name: "NVIDIA GeForce RTX 4090", brand: "NVIDIA" },
      { name: "NVIDIA GeForce RTX 4080 Super", brand: "NVIDIA" },
      { name: "NVIDIA GeForce RTX 4080", brand: "NVIDIA" },
      { name: "NVIDIA GeForce RTX 4070 Ti Super", brand: "NVIDIA" },
      { name: "NVIDIA GeForce RTX 4070 Ti", brand: "NVIDIA" },
      { name: "NVIDIA GeForce RTX 4070 Super", brand: "NVIDIA" },
      { name: "NVIDIA GeForce RTX 4070", brand: "NVIDIA" },
      { name: "NVIDIA GeForce RTX 4060 Ti", brand: "NVIDIA" },
      { name: "NVIDIA GeForce RTX 4060", brand: "NVIDIA" },
      { name: "AMD Radeon RX 7900 XTX", brand: "AMD" },
      { name: "AMD Radeon RX 7900 XT", brand: "AMD" },
      { name: "AMD Radeon RX 7800 XT", brand: "AMD" },
      { name: "AMD Radeon RX 7700 XT", brand: "AMD" },
      { name: "AMD Radeon RX 7600", brand: "AMD" },
      { name: "Intel Arc A770", brand: "Intel" },
      { name: "Intel Arc A750", brand: "Intel" },
      { name: "NVIDIA GeForce RTX 3090 Ti", brand: "NVIDIA" },
      { name: "NVIDIA GeForce RTX 3080 Ti", brand: "NVIDIA" },
      { name: "NVIDIA GeForce RTX 3070 Ti", brand: "NVIDIA" },
      { name: "AMD Radeon RX 6900 XT", brand: "AMD" },
    ];

    // Laptops
    const laptops = [
      { name: "MacBook Pro 16-inch M3 Max", brand: "Apple" },
      { name: "MacBook Pro 14-inch M3 Pro", brand: "Apple" },
      { name: "MacBook Air 15-inch M3", brand: "Apple" },
      { name: "MacBook Air 13-inch M3", brand: "Apple" },
      { name: "Dell XPS 15 9530", brand: "Dell" },
      { name: "Dell XPS 13 Plus", brand: "Dell" },
      { name: "Dell XPS 17", brand: "Dell" },
      { name: "Lenovo ThinkPad X1 Carbon Gen 11", brand: "Lenovo" },
      { name: "Lenovo ThinkPad X1 Extreme Gen 5", brand: "Lenovo" },
      { name: "Lenovo Legion Pro 7i", brand: "Lenovo" },
      { name: "HP Spectre x360 16", brand: "HP" },
      { name: "HP Omen 17", brand: "HP" },
      { name: "HP EliteBook 1040 G10", brand: "HP" },
      { name: "ASUS ROG Zephyrus G16", brand: "ASUS" },
      { name: "ASUS ROG Strix SCAR 18", brand: "ASUS" },
      { name: "ASUS ZenBook Pro 16X", brand: "ASUS" },
      { name: "Razer Blade 16", brand: "Razer" },
      { name: "Razer Blade 14", brand: "Razer" },
      { name: "MSI Titan GT77", brand: "MSI" },
      { name: "Framework Laptop 16", brand: "Framework" },
    ];

    // Phones
    const phones = [
      { name: "iPhone 15 Pro Max", brand: "Apple" },
      { name: "iPhone 15 Pro", brand: "Apple" },
      { name: "iPhone 15 Plus", brand: "Apple" },
      { name: "iPhone 15", brand: "Apple" },
      { name: "Samsung Galaxy S24 Ultra", brand: "Samsung" },
      { name: "Samsung Galaxy S24+", brand: "Samsung" },
      { name: "Samsung Galaxy S24", brand: "Samsung" },
      { name: "Samsung Galaxy Z Fold 5", brand: "Samsung" },
      { name: "Samsung Galaxy Z Flip 5", brand: "Samsung" },
      { name: "Google Pixel 8 Pro", brand: "Google" },
      { name: "Google Pixel 8", brand: "Google" },
      { name: "Google Pixel 8a", brand: "Google" },
      { name: "Google Pixel Fold", brand: "Google" },
      { name: "OnePlus 12", brand: "OnePlus" },
      { name: "OnePlus Open", brand: "OnePlus" },
      { name: "Xiaomi 14 Ultra", brand: "Xiaomi" },
      { name: "Xiaomi 14 Pro", brand: "Xiaomi" },
      { name: "Sony Xperia 1 V", brand: "Sony" },
      { name: "ASUS ROG Phone 8 Pro", brand: "ASUS" },
      { name: "Nothing Phone 2", brand: "Nothing" },
    ];

    // Headphones
    const headphones = [
      { name: "Sony WH-1000XM5", brand: "Sony" },
      { name: "Sony WH-1000XM4", brand: "Sony" },
      { name: "Sony WF-1000XM5", brand: "Sony" },
      { name: "Apple AirPods Max", brand: "Apple" },
      { name: "Apple AirPods Pro 2", brand: "Apple" },
      { name: "Apple AirPods 3", brand: "Apple" },
      { name: "Bose QuietComfort Ultra Headphones", brand: "Bose" },
      { name: "Bose QuietComfort Ultra Earbuds", brand: "Bose" },
      { name: "Bose QuietComfort 45", brand: "Bose" },
      { name: "Sennheiser Momentum 4 Wireless", brand: "Sennheiser" },
      { name: "Sennheiser HD 660S2", brand: "Sennheiser" },
      { name: "Sennheiser IE 600", brand: "Sennheiser" },
      { name: "Beyerdynamic DT 770 Pro", brand: "Beyerdynamic" },
      { name: "Beyerdynamic DT 1990 Pro", brand: "Beyerdynamic" },
      { name: "Audio-Technica ATH-M50x", brand: "Audio-Technica" },
      { name: "Samsung Galaxy Buds 2 Pro", brand: "Samsung" },
      { name: "Jabra Elite 85t", brand: "Jabra" },
      { name: "Shure AONIC 50 Gen 2", brand: "Shure" },
      { name: "HiFiMan Sundara", brand: "HiFiMan" },
      { name: "Focal Bathys", brand: "Focal" },
    ];

    // Create products for each category
    const createProducts = (
      items: { name: string; brand: string }[],
      category: Category
    ) => {
      items.forEach((item, index) => {
        const id = `${category}-${index + 1}`;
        products.push({
          id,
          name: item.name,
          category,
          brand: item.brand,
          imageUrl: null,
          affiliateLink: `https://www.amazon.com/s?k=${encodeURIComponent(item.name)}`,
          isFeatured: index < 3, // First 3 in each category are featured
          categoryDrawbacks: null,
          modelDrawbacks: null,
          doNotBuyIf: null,
          worstIssue: null,
          reviewGenerated: false,
        });
      });
    };

    createProducts(cpus, "cpus");
    createProducts(gpus, "gpus");
    createProducts(laptops, "laptops");
    createProducts(phones, "phones");
    createProducts(headphones, "headphones");

    return products;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: Category): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter((product) => product.isFeatured)
      .slice(0, 12);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.brand.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async getCategoryCounts(): Promise<Record<Category, number>> {
    const counts: Record<Category, number> = {
      cpus: 0,
      gpus: 0,
      laptops: 0,
      phones: 0,
      headphones: 0,
    };

    this.products.forEach((product) => {
      if (product.category in counts) {
        counts[product.category as Category]++;
      }
    });

    return counts;
  }
}

export const storage = new MemStorage();
