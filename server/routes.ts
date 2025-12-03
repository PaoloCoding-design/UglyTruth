import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { CATEGORIES, type Category } from "@shared/schema";
import { generateUglyReview } from "./openai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get featured products for homepage
  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });

  // Search products
  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const products = await storage.searchProducts(query);
      res.json({
        products,
        total: products.length,
        page: 1,
        totalPages: 1,
      });
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ error: "Failed to search products" });
    }
  });

  // Get products by category
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as Category | undefined;
      const sort = req.query.sort as string || "name";
      
      let products;
      if (category && CATEGORIES.includes(category)) {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getAllProducts();
      }

      // Sort products
      products.sort((a, b) => {
        switch (sort) {
          case "name":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "brand":
            return a.brand.localeCompare(b.brand);
          default:
            return a.name.localeCompare(b.name);
        }
      });

      res.json({
        products,
        total: products.length,
        page: 1,
        totalPages: 1,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Get category counts
  app.get("/api/categories/counts", async (req, res) => {
    try {
      const counts = await storage.getCategoryCounts();
      res.json(counts);
    } catch (error) {
      console.error("Error fetching category counts:", error);
      res.status(500).json({ error: "Failed to fetch category counts" });
    }
  });

  // Generate ugly review for a product (on-demand)
  app.post("/api/products/:id/generate-review", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Check if review already generated
      if (product.reviewGenerated) {
        return res.json({ 
          message: "Review already generated",
          product 
        });
      }

      // Generate the ugly review
      const review = await generateUglyReview(product);
      
      // Update product with generated content
      const updated = await storage.updateProduct(product.id, {
        categoryDrawbacks: JSON.stringify(review.categoryDrawbacks),
        modelDrawbacks: JSON.stringify(review.modelDrawbacks),
        doNotBuyIf: JSON.stringify(review.doNotBuyIf),
        worstIssue: review.worstIssue,
        reviewGenerated: true,
      });

      res.json({ 
        message: "Review generated successfully",
        product: updated 
      });
    } catch (error) {
      console.error("Error generating review:", error);
      res.status(500).json({ error: "Failed to generate review" });
    }
  });

  // Generate reviews for all products without reviews (batch)
  app.post("/api/products/generate-all-reviews", async (req, res) => {
    try {
      const allProducts = await storage.getAllProducts();
      const productsNeedingReviews = allProducts.filter(p => !p.reviewGenerated);
      
      if (productsNeedingReviews.length === 0) {
        return res.json({ 
          message: "All products already have reviews",
          count: 0 
        });
      }

      // Start generating in background (don't await)
      generateReviewsInBackground(productsNeedingReviews);

      res.json({ 
        message: `Started generating reviews for ${productsNeedingReviews.length} products`,
        count: productsNeedingReviews.length 
      });
    } catch (error) {
      console.error("Error starting review generation:", error);
      res.status(500).json({ error: "Failed to start review generation" });
    }
  });

  return httpServer;
}

// Background function to generate reviews
async function generateReviewsInBackground(products: any[]) {
  for (const product of products) {
    try {
      const review = await generateUglyReview(product);
      await storage.updateProduct(product.id, {
        categoryDrawbacks: JSON.stringify(review.categoryDrawbacks),
        modelDrawbacks: JSON.stringify(review.modelDrawbacks),
        doNotBuyIf: JSON.stringify(review.doNotBuyIf),
        worstIssue: review.worstIssue,
        reviewGenerated: true,
      });
      console.log(`Generated review for: ${product.name}`);
      // Small delay between products
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to generate review for ${product.name}:`, error);
    }
  }
  console.log("Finished generating all reviews");
}
