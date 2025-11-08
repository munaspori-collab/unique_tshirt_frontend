# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Unique T-shirts** is a premium e-commerce platform for fashion t-shirts, built with Next.js 14, TypeScript, and Tailwind CSS v4. The site features a WhatsApp-based checkout system instead of traditional shopping carts, with Google OAuth authentication and a protected admin dashboard.

## Development Commands

### Core Commands
```bash
# Start development server on http://localhost:3000
npm run dev

# Production build (static export for GitHub Pages)
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Static export for deployment
npm run export
```

### Testing
No test framework is currently configured. When adding tests, install and configure Jest or Vitest.

### Database Commands
Database is not yet implemented. When adding Prisma:
```bash
npx prisma init
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio  # Open database browser
```

## Architecture

### Technology Stack
- **Framework**: Next.js 16.0.1 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with custom premium color palette
- **Animations**: Framer Motion for scroll-triggered effects
- **Authentication**: NextAuth.js (to be implemented)
- **Icons**: Lucide React + React Icons
- **Compiler**: React Compiler enabled

### Key Design Decisions
1. **WhatsApp-First Checkout**: No traditional cart system - users click "Buy Now" and are redirected to WhatsApp with pre-filled order messages
2. **Static Export**: Configured for GitHub Pages deployment with `output: 'export'` in next.config.ts
3. **Password-less Auth**: Google OAuth only for simplified UX (not yet implemented)
4. **Hidden Admin Routes**: Admin access through obscure URLs + authentication
5. **Mobile-First Design**: Optimized for Android with smooth animations and hamburger menu

### File Structure
```
app/
├── layout.tsx          # Root layout with Header/Footer
├── page.tsx            # Homepage with Hero, Categories, Features
├── globals.css         # Global styles, premium color palette, custom animations
└── [routes]            # To be created: /shop, /account, /admin, /api

components/
├── Header.tsx          # Sticky nav with mobile hamburger menu, search bar
├── Footer.tsx          # Newsletter signup, social links
└── home/               # Homepage-specific components
    ├── HeroSection.tsx      # Animated hero with Framer Motion
    ├── CategoryPreview.tsx  # Men/Women/Unisex/Limited/Seasonal cards
    └── WhyChooseUs.tsx      # Features section

lib/
└── whatsapp.ts         # WhatsApp integration utilities
    - generateWhatsAppMessage()
    - createWhatsAppLink()
    - openWhatsAppCheckout()
    - openWhatsAppTracking()

types/
└── index.ts            # TypeScript definitions
    - Product, User, Order, Address
    - BlogPost, Testimonial
    - ProductCategory, Size, OrderStatus
```

### Premium Color Palette
Defined in `app/globals.css`:
```css
--premium-base: #EDEDE9       /* Background */
--premium-accent: #D6CCC2     /* Cards, Buttons */
--premium-hover: #F5EBE0      /* Hover states */
--premium-highlight: #E3D5CA  /* CTAs, Headers */
--premium-badge: #D5BDAF      /* Tags, Footer */
```

Use in Tailwind: `bg-premium-accent`, `text-premium-badge`, etc.

### Typography
- **Headings**: Playfair Display (serif) - use `font-serif`
- **Body**: Inter (sans-serif) - use `font-sans`

## Important Implementation Notes

### WhatsApp Integration
All checkout flows use WhatsApp instead of traditional cart:
```typescript
import { openWhatsAppCheckout } from '@/lib/whatsapp';

// Example usage in Buy Now button
openWhatsAppCheckout({
  productName: product.name,
  productId: product.id,
  size: selectedSize,
  color: selectedColor,
  price: product.price,
  customerName: user?.name,
  customerEmail: user?.email,
});
```

Configuration in `lib/whatsapp.ts` - update `WHATSAPP_CONFIG.businessNumber` before deployment.

### Path Aliases
Use `@/` prefix for absolute imports:
```typescript
import { Product } from '@/types';
import { openWhatsAppCheckout } from '@/lib/whatsapp';
import Header from '@/components/Header';
```

### Static Export Configuration
The project is configured for static export (GitHub Pages):
- `output: 'export'` in next.config.ts
- Images are unoptimized (`images: { unoptimized: true }`)
- BasePath and assetPrefix set for GitHub Pages deployment
- **Limitation**: No API routes, server-side code, or dynamic server features

### Authentication Setup (Not Yet Implemented)
Admin access will be restricted by:
1. Google OAuth email verification
2. `ADMIN_EMAIL` environment variable check
3. Hidden admin routes (not listed in robots.txt)

When implementing auth:
- Install `next-auth` and `@auth/prisma-adapter`
- Create `app/api/auth/[...nextauth]/route.ts`
- Set up middleware for protected routes
- Check user email against `ADMIN_EMAIL` for admin access

### Environment Variables
Required (from `.env.example`):
```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
ADMIN_EMAIL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
DATABASE_URL=
```

## Current Implementation Status

### ✅ Completed
- Homepage with animated hero, category cards, and features section
- Responsive Header with mobile hamburger menu and search bar
- Footer with newsletter signup
- WhatsApp integration utilities
- Premium design system with custom color palette
- TypeScript type definitions for all entities
- SEO configuration (robots.txt, metadata)
- Accessibility features (semantic HTML, ARIA labels)

### 🚧 Not Yet Implemented
- Authentication system (Google OAuth)
- Database integration (Prisma recommended)
- Product catalog pages (`/shop/[category]`)
- Product detail pages (`/shop/[category]/[slug]`)
- Admin dashboard (`/admin`)
- User account pages (`/account`)
- API routes (`/api`)
- Search functionality
- Blog system
- Email notifications
- Testing framework

## Development Guidelines

### Adding New Routes
Since this uses Next.js App Router, create folders in `app/`:
```
app/
├── shop/
│   ├── [category]/
│   │   ├── page.tsx           # Category listing
│   │   └── [slug]/
│   │       └── page.tsx       # Product detail
├── admin/
│   ├── layout.tsx             # Admin-specific layout
│   └── page.tsx               # Admin dashboard
└── account/
    └── page.tsx               # User dashboard
```

### Component Organization
Follow the existing pattern:
- Layout components in `components/` root
- Feature-specific components in subdirectories (e.g., `components/home/`)
- Keep components small and focused
- Use TypeScript interfaces from `types/index.ts`

### Styling Patterns
- Use Tailwind utility classes (no custom CSS unless necessary)
- Leverage custom animations: `animate-fade-in`, `animate-slide-up`, `animate-slide-in`
- Use Framer Motion for complex animations
- Maintain mobile-first responsive design (test on mobile regularly)

### TypeScript Usage
- Strict mode is enabled
- Use interfaces from `types/index.ts` or create new ones there
- Avoid `any` type
- Enable auto-imports from `@/` paths

## Important Files to Reference

- **README.md**: Comprehensive project documentation, setup instructions
- **PROJECT_OVERVIEW.md**: Detailed architecture, design decisions, roadmap
- **NEXT_STEPS.md**: Step-by-step implementation checklist with code examples
- **SETUP_GUIDE.md**: Environment setup and configuration guide
- **types/index.ts**: All TypeScript interfaces (Product, User, Order, etc.)
- **lib/whatsapp.ts**: WhatsApp integration patterns

## Known Constraints

1. **Static Export**: Cannot use server-side API routes or dynamic server features
2. **No Database Yet**: Product data needs to be mocked or fetched from external API
3. **No Auth Yet**: User features and admin panel are placeholders
4. **WhatsApp Required**: Business number must be configured for checkout to work

## Future Database Schema (Prisma)

When implementing database, refer to `types/index.ts` for field definitions. Key models:
- **Product**: id, name, slug, description, price, images[], category, sizes[], colors[], inStock, featured, limited
- **User**: id, email, name, image, role, wishlist[], addresses[]
- **Order**: id, userId, productId, productName, size, color, quantity, totalPrice, status, whatsappNumber
- **BlogPost**: id, title, slug, excerpt, content, coverImage, author, category, tags[]
- **Testimonial**: id, name, image, rating, comment, productId

## Performance Targets

- Lighthouse Score: 90+ across all metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## Accessibility Standards

- Use semantic HTML elements
- Add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers

## Recommended Next Steps for Development

1. **Set up authentication** (NextAuth.js with Google OAuth)
2. **Integrate database** (Prisma with PostgreSQL)
3. **Build product catalog pages** (`/shop/[category]` and `/shop/[category]/[slug]`)
4. **Create admin dashboard** with product CRUD operations
5. **Implement search functionality** with filters and sorting
6. **Add user dashboard** with order history and wishlist

Refer to NEXT_STEPS.md for detailed implementation guidance with code examples.
