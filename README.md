# HaviRuchi 🍛

> Discover, preserve and share authentic Havyaka Brahmin cuisine recipes

HaviRuchi is a full-stack recipe sharing web application built to celebrate and preserve the rich culinary heritage of Havyaka Brahmins from Karnataka, India. Users can discover traditional recipes, save their favourites, contribute their own family recipes, and connect with a community that shares a passion for authentic Havyaka cuisine.

---

## 🌐 Live Demo

[haviruchi.com](https://haviruchi.com) _(coming soon)_

---

## 📸 Screenshots

_(coming soon)_

---

## ✨ Features

### Currently Implemented

- 🔐 **Authentication**
  - Email/password signup with email verification
  - Google OAuth sign in
  - JWT sessions via NextAuth.js
  - Forgot password and reset password via email (Resend)
  - Route protection via Next.js middleware
  - Unverified users blocked from signing in
  - Delete account with cascade deletion

- 🍽️ **Recipe Management**
  - Add recipes with square image crop (800x800)
  - Cloudinary image upload and optimization
  - Edit and delete recipes (owner only)
  - Recipe detail with ingredients and instructions
  - Drag-to-reorder ingredients and instructions
  - Cook time in hours and minutes
  - Difficulty levels (Easy, Medium, Hard)
  - No. of servings
  - Category support (Breakfast, Main Course, Sides, Snack, Sweets, Beverage)

- 🔍 **Discover**
  - Search recipes by title, description and category
  - Filter by category badges
  - Advanced filter panel (category, difficulty, max cook time)
  - Filter and badge selection are mutually exclusive
  - Persisted filter/search state across navigation
  - Desktop: pagination
  - Mobile: infinite scroll
  - Skeleton loading states
  - Empty states with helpful actions

- ❤️ **Favourites**
  - Toggle favourites with optimistic UI update
  - Saved per user in MongoDB
  - Persists across sessions and devices
  - Toast notifications on add/remove

- 👤 **Profile**
  - View and update profile photo (circular crop)
  - View, change and delete profile photo via dropdown
  - Add/edit phone number inline
  - View My Recipes count
  - View My Favourites count
  - Logout
  - Delete account with confirmation

- 📱 **Responsive Design**
  - Mobile first approach
  - Bottom navigation on mobile
  - Hamburger sheet menu on tablet
  - Full navigation on desktop
  - Infinite scroll on mobile, pagination on desktop

- ⚡ **Performance**
  - API field projection (ingredients/instructions excluded from list views)
  - Client-side recipe detail caching in React Context
  - Fetch flags (recipesFetched, favoritesFetched) prevent duplicate API calls
  - useMemo for filtered recipes
  - useCallback for stable handlers
  - Lazy loading for heavy components (ImageCropper, FilterTrigger)
  - Next.js Image optimization with priority loading for LCP images
  - Minimized session refetch (refetchOnWindowFocus disabled)

- 🎨 **UI/UX**
  - Skeleton loading for recipe grids
  - API error screens with 3-attempt retry logic
  - Unexpected error boundary with graceful recovery
  - Button loading spinners with page overlay during actions
  - Square image crop for recipes (800x800)
  - Circular image crop for profile photos (200x200)
  - Card hover effects with scale and shadow
  - Toast notifications with close button
  - Mobile viewport fix using dvh units

- 🔒 **Security**
  - Zod validation on all API routes
  - Session check on all protected API routes
  - Owner verification for edit/delete operations
  - Password hashing with bcryptjs
  - Email verification required before first login
  - Route protection via Next.js middleware

- 🔄 **CI/CD**
  - GitHub Actions workflow running lint and build on every PR
  - Automated deployment to Vercel on merge to master

### 🚀 Coming Soon

- 🤖 **OpenAI Integration**
  - Recipe suggestions based on available ingredients
  - Smart search with AI

- 🥗 **Nutritional Information**
  - AI-generated calorie, protein, carb breakdown per recipe
  - Calculated automatically from ingredients on recipe save
  - Displayed in recipe detail page

- 🤖 **Recipe Assistant (AI Chatbot)**
  - "What can I cook with..." ingredient-based suggestions
  - Powered by OpenAI
  - Suggests authentic Havyaka recipes matching available
    ingredients

- ✅ **Testing**
  - Unit tests with Jest and React Testing Library
  - E2E tests with Playwright for critical user flows

- 🔍 **SEO**
  - Dynamic metadata for recipe pages
  - Open Graph tags for social sharing
  - Sitemap generation

- 👥 **Social Features**
  - View recipes by specific user
  - User ratings and reviews

- 📊 **Analytics**
  - Recipe view counts
  - Most popular recipes

---

## 🛠️ Tech Stack

### Frontend

| Technology              | Purpose             |
| ----------------------- | ------------------- |
| Next.js 14 (App Router) | Framework           |
| TypeScript              | Type safety         |
| TailwindCSS             | Styling             |
| shadcn/ui               | UI components       |
| NextAuth.js             | Authentication      |
| Sonner                  | Toast notifications |
| react-image-crop        | Image cropping      |
| lucide-react            | Icons               |

### Backend

| Technology         | Purpose               |
| ------------------ | --------------------- |
| Next.js API Routes | Backend (Node.js)     |
| MongoDB Atlas      | Database              |
| Mongoose           | ODM                   |
| Cloudinary         | Image storage and CDN |
| Resend             | Email service         |
| bcryptjs           | Password hashing      |
| Zod                | Validation            |

### DevOps & Infrastructure

| Technology     | Purpose                      |
| -------------- | ---------------------------- |
| GitHub Actions | CI pipeline (lint + build)   |
| Vercel         | Hosting and CD pipeline      |
| Git/GitHub     | Version control, PR workflow |

### State Management

| Technology        | Purpose        |
| ----------------- | -------------- |
| React Context API | Global state   |
| Custom hooks      | Reusable logic |

---

## 📁 Project Structure

havi-ruchi/
├── .github/
│ └── workflows/
│ └── ci.yml
├── app/
│ ├── api/
│ │ ├── auth/
│ │ │ ├── [...nextauth]/route.ts
│ │ │ ├── forgot-password/route.ts
│ │ │ ├── reset-password/route.ts
│ │ │ ├── resend-verification/route.ts
│ │ │ └── verify-email/route.ts
│ │ ├── recipes/
│ │ │ ├── route.ts
│ │ │ ├── [id]/route.ts
│ │ │ └── my-recipes/route.ts
│ │ ├── upload/route.ts
│ │ └── users/
│ │ ├── signup/route.ts
│ │ ├── profile/route.ts
│ │ └── favorites/route.ts
│ ├── screens/
│ │ ├── add-recipe/page.tsx
│ │ ├── discover/page.tsx
│ │ ├── edit-recipe/[id]/page.tsx
│ │ ├── favorites/page.tsx
│ │ ├── forgot-password/page.tsx
│ │ ├── my-recipes/page.tsx
│ │ ├── profile/page.tsx
│ │ ├── recipe/[id]/page.tsx
│ │ ├── reset-password/page.tsx
│ │ ├── sign-in/page.tsx
│ │ ├── sign-up/page.tsx
│ │ └── layout.tsx
│ ├── error.tsx
| ├── favicon.ico
│ ├── globals.css
│ ├── layout.tsx
│ ├── not-found.tsx
│ └── page.tsx
├── components/
│ ├── add-recipes/AddFields.tsx
│ ├── auth/
│ │ ├── AuthLayout.tsx
│ │ ├── IconInput.tsx
│ │ ├── PasswordInput.tsx
│ │ └── PasswordRules.tsx
│ ├── discover/
│ │ ├── PaginationComponent.tsx
│ │ ├── RecipeCard.tsx
│ │ └── SearchBar.tsx
│ ├── empty-state/NoItemsFound.tsx
│ ├── error-screens/
│ │ ├── APIErrors.tsx
│ │ ├── PageNotFound.tsx
│ │ └── UnexpectedError.tsx
│ ├── filter/
│ │ ├── FilterBody.tsx
│ │ ├── FilterCheckboxGroup.tsx
│ │ ├── FilterSlider.tsx
│ │ └── FilterTrigger.tsx
│ ├── loading/
│ │ ├── ButtonLoadingSpinner.tsx
│ │ ├── LoadingScreen.tsx
│ │ └── RecipeCardSkeleton.tsx
│ ├── navbar/Navbar.tsx
│ ├── profile/UserProfile.tsx
│ ├── recipe/
│ │ ├── RecipeActions.tsx
│ │ ├── RecipeBadges.tsx
│ │ ├── RecipeForm.tsx
│ │ ├── RecipeImage.tsx
│ │ ├── RecipeIngredients.tsx
│ │ └── RecipeInstructions.tsx
│ └── ui/
│ ├── ImageCropper.tsx
│ ├── PageOverlay.tsx
│ └── (shadcn components)
├── context/
| ├── errorContext.tsx
│ ├── globalContext.tsx
│ └── index.tsx
├── hooks/
│ ├── useIsOwner.ts
│ └── useRecipes.ts
├── lib/
│ ├── authOptions.ts
│ ├── cloudinary.ts
│ ├── mongodb.ts
│ ├── uploadImage.ts
| ├── utilities/
│ | ├── categoryImages.ts
│ | ├── constants.ts
│ | └── helperFunction.ts
| └── utils.ts
├── models/
│ ├── Recipe.ts
│ └── User.ts
├── providers/
│ ├── errorProvider.tsx
│ ├── globalProvider.tsx
│ └── RootProvider.tsx
├── public/
│ ├── images/
| | ├── HaviRuchi_logo.png
│ | └── placeholder.png
│ ├── favicon-16x16.png
│ ├── favicon-32x32.png
│ ├── apple-touch-icon.png
│ ├── android-chrome-192x192.png
│ ├── android-chrome-512x512.png
│ └── site.webmanifest
├── types/
│ ├── filter.ts
│ ├── index.ts
| ├── next-auth.d.ts
│ └── recipe.ts
├── .env.local
├── .gitignore
├── components.json
├── next.config.ts
├── package.json
├── proxy.ts
├── README.md
├── tailwind.config.ts
└── tsconfig.json

---

## 🗄️ Data Models

### User

```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  image: string (Cloudinary URL)
  phone: string
  provider: "credentials" | "google"
  favorites: ObjectId[] (ref: Recipe)
  isVerified: boolean
  emailVerifyToken: string
  emailVerifyTokenExpiry: Date
  resetToken: string
  resetTokenExpiry: Date
  timestamps: true
}
```

### Recipe

```typescript
{
  title: string
  description: string
  image: string (Cloudinary URL)
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  timeNeeded: number (minutes)
  servings: number
  ingredients: string[] ("name - measurement")
  instructions: string[]
  isFavorite: boolean
  createdBy: ObjectId (ref: User)
  timestamps: true
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Resend account
- Google OAuth credentials

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/anushaHegde08/HaviRuchi.git
cd havi-ruchi
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create `.env.local`:**

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/haviruchi
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RESEND_API_KEY=re_your-api-key
```

4. **Run development server:**

```bash
npm run dev
```

5. **Open browser:**
   http://localhost:3000

---

## 🔑 Environment Variables

| Variable                | Description                     | Required |
| ----------------------- | ------------------------------- | -------- |
| `MONGODB_URI`           | MongoDB Atlas connection string | ✅       |
| `NEXTAUTH_SECRET`       | Random secret for NextAuth      | ✅       |
| `NEXTAUTH_URL`          | App URL                         | ✅       |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID          | ✅       |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret      | ✅       |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name           | ✅       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key              | ✅       |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret           | ✅       |
| `RESEND_API_KEY`        | Resend email API key            | ✅       |

---

## 📡 API Endpoints

### Auth

| Method | Endpoint                        | Description         |
| ------ | ------------------------------- | ------------------- |
| POST   | `/api/users/signup`             | Create account      |
| GET    | `/api/auth/verify-email`        | Verify email token  |
| POST   | `/api/auth/forgot-password`     | Send reset email    |
| POST   | `/api/auth/reset-password`      | Reset password      |
| POST   | `/api/auth/resend-verification` | Resend verify email |

### Recipes

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| GET    | `/api/recipes`            | Get all recipes (list)     |
| POST   | `/api/recipes`            | Create recipe              |
| GET    | `/api/recipes/[id]`       | Get recipe detail          |
| PUT    | `/api/recipes/[id]`       | Update recipe (owner only) |
| DELETE | `/api/recipes/[id]`       | Delete recipe (owner only) |
| GET    | `/api/recipes/my-recipes` | Get user's recipes         |

### Users

| Method | Endpoint               | Description     |
| ------ | ---------------------- | --------------- |
| GET    | `/api/users/profile`   | Get profile     |
| PATCH  | `/api/users/profile`   | Update profile  |
| DELETE | `/api/users/profile`   | Delete account  |
| GET    | `/api/users/favorites` | Get favorites   |
| POST   | `/api/users/favorites` | Toggle favorite |

### Upload

| Method | Endpoint      | Description                |
| ------ | ------------- | -------------------------- |
| POST   | `/api/upload` | Upload image to Cloudinary |

---

## 🔄 Git Workflow

```
master (main branch)
  ↑ merged via Pull Requests
feature branches
  01-feature-name
  02-feature-name
  ...
```

### Commit Convention

| Prefix      | Purpose                 |
| ----------- | ----------------------- |
| `feat:`     | New feature             |
| `fix:`      | Bug fix                 |
| `style:`    | Styling changes         |
| `perf:`     | Performance improvement |
| `refactor:` | Code refactoring        |
| `docs:`     | Documentation           |
| `chore:`    | Maintenance             |

### CI/CD Pipeline

| Trigger         | Action                                  |
| --------------- | --------------------------------------- |
| Push to branch  | GitHub Actions runs lint + build check  |
| PR opened       | Vercel generates preview deployment URL |
| Merge to master | Vercel auto-deploys to production       |

---

## 🤝 Contributing

This is currently a personal project. Contributions will be
welcome after the initial launch.

---

## 📄 License

MIT License — feel free to use this project as a reference.

---

## 👩‍💻 Author

**Anusha Hegde**

- Portfolio: [anushaHegde08.github.io/portfolio](https://anushaHegde08.github.io/portfolio)
- GitHub: [@anushaHegde08](https://github.com/anushaHegde08)
- LinkedIn: [@anusha-h](https://www.linkedin.com/in/anusha-h/)

---

## 🙏 Acknowledgements

- Havyaka Brahmin community for the rich culinary heritage
- All open source libraries used in this project
- Anthropic Claude for development assistance

---

_Built with ❤️ to preserve Havyaka culinary heritage_
