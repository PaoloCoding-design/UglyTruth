# The Ugly - Product Review Platform

## Overview

"The Ugly" is a content-driven web application that delivers AI-generated summaries focusing exclusively on the negative aspects and drawbacks of tech products. The platform helps users understand potential issues before making purchase decisions by presenting category-level and model-specific drawbacks, "Do Not Buy If" checklists, and worst-issue summaries.

The application features a static catalog of 100-300 tech products across five categories (CPUs, GPUs, laptops, phones, headphones) with dynamic AI-powered review generation using OpenAI's GPT-5 model.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing instead of React Router
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

**UI Component System:**
- shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom color system using HSL values with CSS variables for theme support
- Typography system using Inter (body) and Space Grotesk (headings) fonts
- Design philosophy: "Brutal clarity over decoration" with strong information hierarchy

**State Management:**
- TanStack Query (React Query) for server state management and caching
- Custom query client configuration with disabled refetching (stale time: Infinity)
- API request wrapper with credential support and error handling

**Key Pages:**
- Home: Hero section with search, featured products grid, and category cards
- Category: Filtered product listings with sorting capabilities
- Product: Detailed "ugly review" with on-demand AI generation
- Search: Product search results with query highlighting

### Backend Architecture

**Server Framework:**
- Express.js HTTP server with TypeScript
- Custom logging middleware for request/response tracking
- JSON body parsing with raw body preservation for webhooks
- Static file serving for production builds

**API Structure:**
- RESTful endpoints under `/api` prefix
- Product endpoints: featured, search, by-category, by-id
- Review generation endpoint: POST `/api/products/:id/generate-review`
- Category counts endpoint for homepage statistics

**Build Strategy:**
- esbuild for server bundling with selective dependency externalization
- Allowlist approach: critical dependencies (OpenAI, Drizzle, Express, etc.) are bundled
- Reduces cold start times by minimizing filesystem syscalls
- Separate client (Vite) and server (esbuild) build processes

**Data Storage:**
- In-memory storage implementation (`MemStorage` class) for MVP
- Interface-based design (`IStorage`) allows future database integration
- Pre-seeded product catalog with ~200+ products across all categories
- Product schema supports AI-generated content fields (categoryDrawbacks, modelDrawbacks, doNotBuyIf, worstIssue)

**AI Integration:**
- OpenAI GPT-5 API for generating product reviews
- Structured JSON responses with category-level and model-specific drawbacks
- Review generation triggered on-demand when users visit product pages
- Reviews cached after generation (reviewGenerated boolean flag)

### External Dependencies

**AI Services:**
- OpenAI API (GPT-5 model) for generating negative product reviews
- Requires `OPENAI_API_KEY` environment variable

**Database (Configured but Not Active in MVP):**
- Drizzle ORM with PostgreSQL dialect ready for production migration
- Schema defined with products table including AI-generated content fields
- Neon Database serverless driver configured
- Migration system ready via `drizzle-kit push` command
- Requires `DATABASE_URL` environment variable when activated

**UI Component Libraries:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui pre-built component collection
- Lucide React for consistent iconography
- class-variance-authority for component variant management

**Development Tools:**
- Replit-specific plugins for development banner, error overlay, and cartographer
- TypeScript with strict mode for type safety
- ESM modules throughout the codebase

**Design System:**
- Tailwind CSS with custom configuration extending base theme
- Custom border radius scale (3px, 6px, 9px)
- Neutral color palette with dark mode support
- CSS custom properties for dynamic theming