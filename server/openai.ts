import OpenAI from "openai";
import { type Product, type Category, CATEGORY_LABELS } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface UglyReviewContent {
  categoryDrawbacks: string[];
  modelDrawbacks: { title: string; description: string }[];
  doNotBuyIf: string[];
  worstIssue: string;
}

export async function generateUglyReview(product: Product): Promise<UglyReviewContent> {
  const categoryLabel = CATEGORY_LABELS[product.category as Category] || product.category;
  
  const prompt = `You are a consumer advocate focused on helping buyers understand product drawbacks. Generate a comprehensive "ugly review" for the following product:

Product: ${product.name}
Brand: ${product.brand}
Category: ${categoryLabel}

Please provide the following in JSON format:

1. "categoryDrawbacks": An array of 4-5 general drawbacks that apply to all ${categoryLabel} in general (not specific to this model). These should be honest, common issues with this product category.

2. "modelDrawbacks": An array of 3-5 objects with "title" and "description" keys. These are specific issues reported by users for this exact product model. Focus on real, commonly reported problems.

3. "doNotBuyIf": An array of 4-6 bullet points starting with "You..." that describe user profiles who would be dissatisfied with this product.

4. "worstIssue": A single sentence (max 100 characters) describing the most commonly reported problem with this specific product.

Be honest, specific, and helpful. Base your response on commonly known issues with these types of products. Do not fabricate issues but focus on genuine, realistic concerns.

Response format:
{
  "categoryDrawbacks": ["..."],
  "modelDrawbacks": [{"title": "...", "description": "..."}],
  "doNotBuyIf": ["..."],
  "worstIssue": "..."
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a consumer advocate expert who helps buyers understand product drawbacks. Provide honest, balanced, and helpful information about product issues. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in response");
    }

    const parsed = JSON.parse(content) as UglyReviewContent;
    
    // Validate the response structure
    if (!Array.isArray(parsed.categoryDrawbacks) || 
        !Array.isArray(parsed.modelDrawbacks) || 
        !Array.isArray(parsed.doNotBuyIf) ||
        typeof parsed.worstIssue !== 'string') {
      throw new Error("Invalid response structure");
    }

    return parsed;
  } catch (error: any) {
    console.error("Error generating ugly review:", error?.message || error);
    // Return fallback content when OpenAI fails (quota, API errors, etc.)
    console.log(`Using fallback review content for ${product.name}`);
    return generateFallbackReview(product);
  }
}

function generateFallbackReview(product: Product): UglyReviewContent {
  const categoryLabel = CATEGORY_LABELS[product.category as Category] || product.category;
  
  const fallbacksByCategory: Record<Category, UglyReviewContent> = {
    cpus: {
      categoryDrawbacks: [
        "High-performance CPUs often require expensive cooling solutions to prevent thermal throttling",
        "Power consumption can significantly increase electricity costs for power users",
        "Compatibility with older motherboards may require costly upgrades",
        "Integrated graphics performance typically lags behind dedicated GPUs"
      ],
      modelDrawbacks: [
        { title: "Thermal Management", description: "Users report this CPU runs hot under sustained workloads, requiring quality cooling." },
        { title: "Power Draw", description: "Higher than expected power consumption during peak loads." },
        { title: "Price-to-Performance", description: "Some users feel the performance gain doesn't justify the price premium." }
      ],
      doNotBuyIf: [
        "You need to stay within a tight budget for the entire system build",
        "You don't plan to use adequate cooling solutions",
        "You primarily do light office work and web browsing",
        "You need maximum power efficiency"
      ],
      worstIssue: "Runs hot under heavy loads without premium cooling"
    },
    gpus: {
      categoryDrawbacks: [
        "Graphics cards are often the most expensive component in a PC build",
        "Power requirements may necessitate PSU upgrades",
        "Driver issues can cause instability in certain games or applications",
        "Coil whine is common and can be noticeable under load"
      ],
      modelDrawbacks: [
        { title: "Size Constraints", description: "Large form factor may not fit in all PC cases." },
        { title: "Noise Levels", description: "Fan noise can be significant during gaming sessions." },
        { title: "Power Requirements", description: "Requires a high-wattage power supply unit." }
      ],
      doNotBuyIf: [
        "You have a small form factor case with limited clearance",
        "Your power supply doesn't meet the recommended wattage",
        "You prioritize a quiet computing environment",
        "You only do basic productivity work"
      ],
      worstIssue: "High power consumption and heat output under load"
    },
    laptops: {
      categoryDrawbacks: [
        "Battery life degrades significantly over the product lifespan",
        "Upgradability is often limited compared to desktops",
        "Thermal throttling can reduce performance during intensive tasks",
        "Repair costs are typically higher than desktop equivalents"
      ],
      modelDrawbacks: [
        { title: "Battery Life", description: "Real-world battery life may fall short of advertised claims." },
        { title: "Heat Management", description: "Can get uncomfortably warm during extended use." },
        { title: "Port Selection", description: "Limited ports may require adapters or hubs." }
      ],
      doNotBuyIf: [
        "You need all-day battery life without charging",
        "You frequently use resource-intensive applications",
        "You prefer easily upgradable components",
        "You work in environments without easy access to power outlets"
      ],
      worstIssue: "Battery life shorter than advertised under real use"
    },
    phones: {
      categoryDrawbacks: [
        "Smartphone batteries degrade over time, reducing capacity",
        "Software support has a limited lifespan",
        "Displays are fragile and expensive to repair",
        "Storage is often not expandable on modern flagship phones"
      ],
      modelDrawbacks: [
        { title: "Battery Longevity", description: "Battery capacity noticeably decreases after first year." },
        { title: "Software Updates", description: "Major OS updates may slow down older hardware." },
        { title: "Repairability", description: "Repairs can be costly outside of warranty." }
      ],
      doNotBuyIf: [
        "You expect to use the phone for more than 3-4 years",
        "You frequently drop your devices",
        "You need expandable storage",
        "You're on a tight budget for accessories and repairs"
      ],
      worstIssue: "Battery health degrades noticeably after one year"
    },
    headphones: {
      categoryDrawbacks: [
        "Wireless headphones have limited battery life and eventual battery degradation",
        "Active noise cancellation may cause pressure sensation for some users",
        "Bluetooth connectivity can be inconsistent across devices",
        "Comfort issues may arise during extended listening sessions"
      ],
      modelDrawbacks: [
        { title: "Comfort", description: "May cause discomfort during long listening sessions." },
        { title: "Connectivity", description: "Bluetooth connection can drop occasionally." },
        { title: "Microphone Quality", description: "Call quality may not match audio playback quality." }
      ],
      doNotBuyIf: [
        "You need reliable performance for professional calls",
        "You wear glasses and need comfortable padding",
        "You require very long battery life between charges",
        "You're sensitive to ear pressure from ANC"
      ],
      worstIssue: "Comfort issues during extended wear sessions"
    }
  };

  return fallbacksByCategory[product.category as Category] || fallbacksByCategory.headphones;
}

export async function generateBatchReviews(products: Product[]): Promise<Map<string, UglyReviewContent>> {
  const results = new Map<string, UglyReviewContent>();
  
  // Process in batches of 5 to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const promises = batch.map(async (product) => {
      const review = await generateUglyReview(product);
      return { id: product.id, review };
    });
    
    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ id, review }) => {
      results.set(id, review);
    });
    
    // Small delay between batches
    if (i + batchSize < products.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}
