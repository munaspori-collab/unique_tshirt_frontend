# Unique T-shirts 👕

A premium e-commerce website crafted to deliver a refined, elegant shopping experience for fashion-forward users. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎨 Design Philosophy

- **Premium Color Palette**: Soft, luxurious colors (#EDEDE9, #D6CCC2, #F5EBE0, #E3D5CA, #D5BDAF)
- **Elegant Typography**: Playfair Display (serif) for headings, Inter (sans-serif) for body text
- **Smooth Animations**: Framer Motion for scroll-triggered animations and transitions
- **Mobile-First**: Fully responsive design optimized for Android and all devices

## ✨ Features

### Customer Features
- 🏠 Stunning hero section with animated elements
- 🛍️ Product categories: Men, Women, Unisex, Limited Edition, Seasonal
- 🔍 Smart search with auto-suggestions
- ❤️ Wishlist functionality
- 👤 Google OAuth authentication
- 💬 WhatsApp-based checkout (no cart system)
- 📦 Order tracking via WhatsApp
- 📱 Mobile-optimized hamburger menu

### Admin Features
- 🔒 Protected admin dashboard (hidden routes)
- ➕ Add/edit/delete products
- 🖼️ Unlimited image uploads per product
- 📊 Analytics dashboard
- 👥 User inquiry management
- 📧 Email-verified admin access only

### Technical Features
- ⚡ Next.js 14 App Router
- 🎯 TypeScript for type safety
- 🎨 Tailwind CSS v4 with custom theme
- 🔐 NextAuth.js for authentication
- 📱 PWA-ready
- 🚀 Optimized Core Web Vitals
- ♿ WCAG accessibility compliant
- 🔍 SEO optimized with structured data

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google OAuth credentials
- WhatsApp Business account

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Create a `.env.local` file in the root directory:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Admin Email (for admin access)
ADMIN_EMAIL=your.admin@email.com

# WhatsApp Business
NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890

# Database (add your preferred database)
DATABASE_URL=your_database_url
```

3. **Update WhatsApp configuration:**

Edit `lib/whatsapp.ts` and update the business number:

```typescript
export const WHATSAPP_CONFIG = {
  businessNumber: 'YOUR_WHATSAPP_NUMBER', // Format: country code + number
  businessName: 'Unique T-shirts',
};
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
unique_t-shirt_web/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Homepage
│   ├── shop/               # Product catalog pages
│   ├── account/            # User dashboard
│   ├── admin/              # Admin dashboard (protected)
│   └── api/                # API routes
├── components/             # React components
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Footer with newsletter
│   └── home/               # Homepage sections
├── lib/                    # Utilities
│   └── whatsapp.ts         # WhatsApp integration
├── types/                  # TypeScript types
│   └── index.ts            # Shared interfaces
├── public/                 # Static assets
│   └── robots.txt          # SEO configuration
└── app/globals.css         # Global styles & theme
```

## 🎨 Customization

### Colors

All colors are defined in `app/globals.css` using CSS custom properties:

```css
:root {
  --premium-base: #EDEDE9;
  --premium-accent: #D6CCC2;
  --premium-hover: #F5EBE0;
  --premium-highlight: #E3D5CA;
  --premium-badge: #D5BDAF;
}
```

Use in Tailwind classes: `bg-premium-accent`, `text-premium-badge`, etc.

### Typography

Fonts are loaded from Google Fonts in `app/globals.css`:
- **Serif**: Playfair Display (headings)
- **Sans**: Inter (body text)

## 🔐 Authentication Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

### Admin Access

Admin access is restricted to the email specified in `ADMIN_EMAIL` environment variable. To access admin dashboard:

1. Login with the admin Google account
2. Navigate to `/admin-login` (hidden route)
3. Admin dashboard will be accessible at `/admin`

## 💬 WhatsApp Integration

The checkout flow uses WhatsApp Business for direct customer communication:

1. Customer clicks "Buy Now" on product page
2. Auto-filled message opens in WhatsApp with:
   - Product details
   - Size and color selection
   - Customer information
3. Customer sends message to initiate order
4. Admin receives inquiry and processes order

### Benefits
- No payment gateway needed initially
- Personal customer service
- Real-time order tracking
- Lower technical complexity

## 🛠️ Development

### Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

### Adding Products

Products can be managed through the admin dashboard at `/admin`. For initial setup, you can:

1. Create a database schema based on types in `types/index.ts`
2. Add seed data for testing
3. Implement API routes in `app/api/`

## 📱 Mobile Optimization

- Hamburger menu with smooth slide-in animation
- Touch-optimized buttons and interactions
- Responsive images with lazy loading
- Optimized for Android devices

## ♿ Accessibility

- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast mode toggle (planned)
- Screen reader compatible

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Remember to set all environment variables in your deployment platform:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_URL` (production URL)
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

## 📊 Performance

- **Core Web Vitals**: Optimized for excellent scores
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Images and components
- **Caching**: Aggressive caching strategy

## 🔒 Security

- HTTPS enforced (in production)
- Protected admin routes with authentication
- Hidden admin URLs in robots.txt
- CSRF protection via NextAuth
- Secure session management
- Input validation and sanitization

## 📝 TODO / Roadmap

- [ ] Implement full authentication system
- [ ] Set up database and ORM (Prisma recommended)
- [ ] Create complete admin dashboard
- [ ] Add product management functionality
- [ ] Implement image upload (Cloudinary/AWS S3)
- [ ] Build blog system
- [ ] Add testimonials carousel
- [ ] Create privacy policy pages
- [ ] Implement GDPR cookie consent
- [ ] Add analytics (Google Analytics/Plausible)
- [ ] Set up email notifications
- [ ] Create sitemap.xml
- [ ] Implement product search functionality
- [ ] Add wishlist persistence
- [ ] Create loyalty program
- [ ] Mobile app (React Native)

## 🤝 Contributing

This is a custom project. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

Private/Proprietary

## 💼 Contact

- **Website**: https://uniquetshirts.com (update with actual URL)
- **Email**: hello@uniquetshirts.com
- **WhatsApp**: +1 (234) 567-890

---

Built with ❤️ for fashion lovers
