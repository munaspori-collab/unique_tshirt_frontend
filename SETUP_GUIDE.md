# Unique T-shirts - Complete Setup Guide

This guide will walk you through setting up the complete "Unique T-shirts" e-commerce platform.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Google OAuth Setup](#google-oauth-setup)
3. [WhatsApp Business Setup](#whatsapp-business-setup)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Running the Application](#running-the-application)
7. [Customization](#customization)
8. [Deployment](#deployment)

---

## Initial Setup

### 1. Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher): [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git**: [Download](https://git-scm.com/)
- A code editor (VS Code recommended)

### 2. Install Dependencies

```bash
cd unique_t-shirt_web
npm install
```

This will install all required packages including:
- Next.js 14
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- NextAuth.js
- Lucide React Icons

---

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Unique T-shirts"
4. Click "Create"

### Step 2: Enable Google+ API

1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure OAuth consent screen:
   - User Type: External
   - App name: "Unique T-shirts"
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue"
   - Scopes: Add email and profile
   - Test users: Add your admin email
4. Select "Web application" as Application type
5. Add Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Click "Create"
7. Copy the Client ID and Client Secret

### Step 4: Add to Environment Variables

Add to your `.env.local`:

```env
GOOGLE_CLIENT_ID=your_client_id_from_step_7
GOOGLE_CLIENT_SECRET=your_client_secret_from_step_7
```

---

## WhatsApp Business Setup

### Step 1: Get WhatsApp Business Number

You have two options:

#### Option A: WhatsApp Business App (Simple)
1. Download WhatsApp Business from Play Store/App Store
2. Register with your business phone number
3. Complete business profile setup

#### Option B: WhatsApp Business API (Advanced)
1. Apply for WhatsApp Business API access
2. Use a provider like Twilio, MessageBird, or direct from Meta
3. Complete verification process

### Step 2: Get Your Business Number

Format: `[country_code][phone_number]`

Examples:
- India: `919876543210`
- US: `14155551234`
- UK: `447911123456`

### Step 3: Update Configuration

**File: `lib/whatsapp.ts`**

```typescript
export const WHATSAPP_CONFIG = {
  businessNumber: '919876543210', // Replace with your number
  businessName: 'Unique T-shirts',
};
```

**Environment Variable:**

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

### Step 4: Test WhatsApp Link

Create a test link:
```
https://wa.me/919876543210?text=Hello
```

Open in browser to verify it opens WhatsApp correctly.

---

## Database Setup

You'll need a database to store products, users, and orders. Here are recommended options:

### Option 1: PostgreSQL with Supabase (Recommended)

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Copy the connection string from Settings → Database
4. Add to `.env.local`:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

### Option 2: MongoDB with MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env.local`:

```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/uniquetshirts
```

### Schema Setup with Prisma

1. Install Prisma:

```bash
npm install -D prisma
npm install @prisma/client
```

2. Initialize Prisma:

```bash
npx prisma init
```

3. Create schema based on types in `types/index.ts`

4. Run migrations:

```bash
npx prisma migrate dev --name init
```

---

## Environment Configuration

### Create `.env.local` File

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### Fill in All Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_32_char_string

# Admin
ADMIN_EMAIL=youradmin@email.com

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210

# Database
DATABASE_URL=your_database_connection_string
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Or use online generator: [Generate Secret](https://generate-secret.vercel.app/32)

---

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

---

## Customization

### Update Brand Colors

**File: `app/globals.css`**

```css
:root {
  --premium-base: #EDEDE9;     /* Base background */
  --premium-accent: #D6CCC2;    /* Accent color */
  --premium-hover: #F5EBE0;     /* Hover states */
  --premium-highlight: #E3D5CA; /* Highlights */
  --premium-badge: #D5BDAF;     /* Badges */
}
```

### Update Logo and Brand Name

**File: `components/Header.tsx`** (line 53)

```tsx
<h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800">
  Your Brand Name
</h1>
```

### Update Contact Information

**File: `components/Footer.tsx`**

Update social links, email, phone, and address.

### Add Product Images

Place your product images in `public/products/` folder:

```
public/
  products/
    tshirt-1.jpg
    tshirt-2.jpg
    ...
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com/)

3. Import your repository

4. Add environment variables in project settings

5. Deploy!

### Environment Variables for Production

Make sure to set all these in Vercel:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `DATABASE_URL`

### Custom Domain

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain
5. Update Google OAuth redirect URIs

---

## Testing

### Test Google Login

1. Start dev server
2. Go to `/account`
3. Click "Sign in with Google"
4. Complete OAuth flow
5. Verify you're logged in

### Test WhatsApp Integration

1. Click any "Buy Now" button (when product pages are created)
2. Verify WhatsApp opens with pre-filled message
3. Check message contains correct product details

### Test Admin Access

1. Login with admin email (set in `ADMIN_EMAIL`)
2. Navigate to `/admin-login`
3. Verify access to admin dashboard

---

## Troubleshooting

### Google OAuth Not Working

- Check redirect URI matches exactly
- Verify OAuth consent screen is configured
- Check credentials are active
- Clear browser cookies and try again

### WhatsApp Not Opening

- Verify number format (no spaces, dashes, or + sign)
- Check WhatsApp is installed on device
- Test with direct link: `https://wa.me/YOUR_NUMBER`

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill
```

---

## Next Steps

After basic setup, implement:

1. **Database Models**: Create Prisma schema for products, users, orders
2. **Product Management**: Build admin CRUD operations
3. **Image Upload**: Integrate Cloudinary or AWS S3
4. **Authentication**: Complete NextAuth setup
5. **Blog System**: Create blog posts and content management
6. **Analytics**: Add Google Analytics or Plausible
7. **Email**: Set up transactional emails (SendGrid, Resend)
8. **Payment**: Integrate payment gateway (if needed)

---

## Support

For issues or questions:

- Create an issue in the repository
- Check documentation in README.md
- Review error logs in `.next/` directory

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [WhatsApp Business API](https://business.whatsapp.com/)

---

**Good luck with your premium e-commerce store! 🚀**
