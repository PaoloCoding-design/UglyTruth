# Design Guidelines for "The Ugly"

## Design Approach
**Selected Approach:** Design System with Editorial Influence  
**Justification:** Content-dense, text-focused review platform requiring excellent readability and scannable layouts. Drawing from design systems like Carbon Design (information hierarchy) and Medium (editorial typography) while incorporating brutalist honesty elements that align with the "Ugly" brand personality.

**Core Principles:**
- Brutal clarity over decoration
- Information hierarchy that surfaces critical drawbacks immediately
- Scannable, digestible negative review content
- Professional credibility despite edgy positioning

---

## Typography System

**Font Families:**
- Primary: Inter (400, 500, 600, 700) - body text, UI elements
- Accent: Space Grotesk (700) - headings, product names

**Hierarchy:**
- Hero Headline: text-5xl md:text-6xl font-bold (Space Grotesk)
- Page Titles: text-4xl font-bold
- Section Headers: text-2xl font-semibold
- Product Names: text-xl md:text-2xl font-bold
- Body Text: text-base leading-relaxed
- Captions/Meta: text-sm
- Warnings/Alerts: text-base font-medium

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, and 16  
**Container Strategy:**
- Max-width: `max-w-7xl` for main containers
- Reading width: `max-w-4xl` for review text blocks
- Card grids: `max-w-6xl`

**Grid Patterns:**
- Product grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Featured products: `grid-cols-1 lg:grid-cols-2` (larger cards)

---

## Page Layouts

### Home Page
**Structure (No Hero Image):**
1. **Header/Navigation** (py-4 md:py-6)
   - Logo left, search bar center, category links right
   - Sticky navigation on scroll

2. **Statement Section** (py-16 md:py-24)
   - Centered, bold typography: "See the potential downsides before you buy."
   - Subheading explaining the brutal honesty approach
   - Prominent search bar (larger than header version)

3. **Featured/Trending Products Grid** (py-12)
   - 2-3 column grid on desktop
   - Product cards with image, name, category badge, short "worst issue" preview

4. **Category Quick Links** (py-12)
   - 5 large category cards in horizontal scroll on mobile, grid on desktop
   - Icon + category name + product count

5. **Footer** (py-12)
   - About the site, affiliate disclosure, category links, social links

### Category Listing Page
**Structure:**
1. **Category Header** (py-8)
   - Category name, description of common category drawbacks
   - Product count

2. **Filter/Sort Bar** (py-4)
   - Simple dropdowns: Sort by (Name, Newest, Most Issues)

3. **Product Grid** (py-8)
   - 3-column grid on desktop
   - Consistent card design with hover states

### Product Review Page
**Structure:**
1. **Product Header** (py-8)
   - Product image left (400px width max), name + category right
   - Affiliate button: "View Price" with subtle background blur overlay

2. **Warning Banner** (py-4)
   - Full-width alert-style banner: "This page focuses on drawbacks only"

3. **Review Sections** (Each section: py-8, max-w-4xl)
   - **Category-Level Drawbacks:** List format with em-dash bullets
   - **Model-Specific Drawbacks:** Numbered list with bold issue headers
   - **Do Not Buy If Checklist:** Styled checkbox list (unchecked boxes as visual element)

4. **Affiliate CTA Section** (py-12)
   - Centered, prominent button with disclaimer text below

---

## Component Library

### Product Cards
- Image: aspect-square, rounded-lg
- Badge: Category label (top-right overlay on image)
- Title: font-bold, truncate at 2 lines
- Preview text: "Worst reported issue:" + 1 line summary
- Hover: Subtle lift effect (transform scale)

### Search Bar
- Large input with icon prefix
- Rounded-full on home, rounded-lg in header
- Placeholder: "Search for a product..."

### Warning Banners
- Bordered box with alert icon
- Used for disclaimers and context

### Review Section Containers
- Each section has: heading, divider line, content
- Spacing: gap-4 within sections, gap-12 between sections

### Affiliate Buttons
- Primary: Large, rounded-lg, font-semibold
- When over images: backdrop-blur-md with semi-transparent background
- No custom hover states (use default Button behavior)

### Category Badges
- Small, rounded-full pills
- Uppercase text, font-medium, text-xs

---

## Images

**Product Images:**
- Square aspect ratio (1:1) for consistency in grids
- Minimum 600x600px resolution
- Show actual product photography (not lifestyle shots)
- Placement: Product cards, product detail header

**No Hero Images Used** - This site leads with bold typography and immediate utility (search/browse)

---

## Accessibility & Interactions

**Focus States:** Visible outline on all interactive elements  
**Touch Targets:** Minimum 44x44px for mobile  
**Semantic HTML:** Proper heading hierarchy, list elements for checklists  
**Animations:** Minimal - only subtle hover transitions (0.2s ease)

---

## Vertical Rhythm

**Section Spacing:**
- Mobile: py-8 to py-12
- Desktop: py-12 to py-16
- Hero/Statement: py-16 to py-24

**Consistent padding** across all sections creates scannable, digestible content flow. No forced viewport heights - content determines section size naturally.