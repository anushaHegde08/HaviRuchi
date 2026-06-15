# HaviRuchi 🍛

> Discover, preserve and share authentic Havyaka Brahmin cuisine recipes

HaviRuchi is a full-stack recipe sharing web application built to celebrate and preserve the rich culinary heritage of Havyaka Brahmins from Karnataka, India. Users can discover traditional recipes, save their favourites, contribute their own family recipes, and connect with a community that shares a passion for authentic Havyaka cuisine.

---

## 🌐 Live Demo

[haviruchi.com](https://haviruchi.com) _(coming soon)_

---

## 📸 Screenshots

_(Add screenshots here after deployment)_

---

## ✨ Features

### Currently Implemented

- 🔐 **Authentication**
  - Email/password signup with email verification
  - Google OAuth sign in
  - JWT sessions via NextAuth.js
  - Forgot password and reset password via email (Resend)
  - Route protection middleware
  - Unverified users blocked from signing in
  - Delete account with cascade deletion

- 🍽️ **Recipe Management**
  - Add recipes with square image crop (800x800)
  - Cloudinary image upload and optimization
  - Edit and delete recipes (owner only)
  - Recipe detail page with ingredients and instructions
  - Cook time in hours and minutes
  - Ingredients with name and measurement
  - Difficulty levels (Easy, Medium, Hard)
  - Category support (Breakfast, Lunch, Dinner, Snack, Dessert, Beverage)

- 🔍 **Discover**
  - Search recipes by title, description and category
  - Filter by category badges
  - Filter panel (category, difficulty, max cook time)
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
  - Add/edit phone number inline
  - View My Recipes with count
  - View My Favourites with count
  - Logout
  - Delete account

- 📱 **Responsive Design**
  - Mobile first approach
  - Bottom navigation on mobile
  - Hamburger sheet menu on tablet
  - Full navigation on desktop
  - Infinite scroll on mobile, pagination on desktop

- ⚡ **Performance**
  - API field projection (ingredients/instructions excluded from list views)
  - Client-side recipe detail caching
  - Fetch flags (recipesFetched, favoritesFetched) prevent duplicate API calls
  - useMemo for filtered recipes
  - useCallback for stable handlers
  - Lazy loading for heavy components
  - Next.js Image optimization

- 🎨 **UI/UX**
  - Skeleton loading for recipe grids
  - Empty states vertically centered
  - Error screens with retry (3 attempts)
  - Unexpected error boundary
  - Button loading spinners
  - Page overlay blocks clicks during loading
  - Square image crop for recipes
  - Circular image crop for profile photos
  - Card hover effects
  - Toast notifications

- 🔒 **Security**
  - Zod validation on all API routes
  - Session check on all protected routes
  - Owner verification for edit/delete
  - Password hashing with bcryptjs
  - Email verification before login
  - Route protection via Next.js middleware

### 🚀 Coming Soon

- 🤖 **OpenAI Integration**
  - Recipe suggestions based on available ingredients
  - Smart search with AI
  - Recipe description generation

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
  - Recipe collections/playlists

- 📊 **Analytics**
  - Recipe view counts
  - Most popular recipes
  - User activity dashboard

- 📧 **Notifications**
  - Email notifications for new recipes
  - Weekly digest of popular recipes

- 🌐 **Internationalization**
  - Kannada language support
  - Recipe translations

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

### State Management

| Technology        | Purpose        |
| ----------------- | -------------- |
| React Context API | Global state   |
| Custom hooks      | Reusable logic |

---

## 📁 Project Structure

havi-ruchi/
├── app/
│ ├── api/
│ │ ├── auth/
│ │ │ ├── [...nextauth]/ # NextAuth handler
│ │ │ ├── forgot-password/ # Send reset email
│ │ │ ├── reset-password/ # Update password
│ │ │ ├── resend-verification/ # Resend verify email
│ │ │ └── verify-email/ # Verify email token
│ │ ├── recipes/
│ │ │ ├── route.ts # GET all, POST
│ │ │ ├── [id]/route.ts # GET, PUT, DELETE
│ │ │ └── my-recipes/route.ts # User's recipes
│ │ ├── upload/route.ts # Cloudinary upload
│ │ └── users/
│ │ ├── signup/route.ts # Create account
│ │ ├── profile/route.ts # GET, PATCH, DELETE
│ │ └── favorites/route.ts # GET, POST
│ ├── screens/ # App pages
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ ├── error.tsx # Error boundary
│ └── not-found.tsx # 404 page
├── components/
│ ├── auth/ # Auth components
│ ├── discover/ # Recipe card, search, pagination
│ ├── filter/ # Filter trigger, body, slider
│ ├── recipe/ # Recipe form, actions, detail
│ ├── profile/ # User profile
│ ├── add-recipes/ # Dynamic fields
│ ├── loading/ # Loading screen
│ ├── error-screens/ # Error components
│ └── ui/ # shadcn + custom components
├── context/ # Global context
├── providers/ # Context providers
├── hooks/ # Custom hooks
├── models/ # Mongoose models
├── lib/ # Utilities
├── types/ # TypeScript types
├── mockData/ # Constants
└── public/ # Static assets

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

Node.js 18+
npm or yarn
MongoDB Atlas account
Cloudinary account
Resend account
Google OAuth credentials

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/havi-ruchi.git
cd havi-ruchi
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create `.env.local`:**

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/haviruchi

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Resend
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
| GET    | `/api/auth/verify-email`        | Verify email        |
| POST   | `/api/auth/forgot-password`     | Send reset email    |
| POST   | `/api/auth/reset-password`      | Reset password      |
| POST   | `/api/auth/resend-verification` | Resend verify email |

### Recipes

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| GET    | `/api/recipes`            | Get all recipes (list view) |
| POST   | `/api/recipes`            | Create recipe               |
| GET    | `/api/recipes/[id]`       | Get recipe detail           |
| PUT    | `/api/recipes/[id]`       | Update recipe (owner only)  |
| DELETE | `/api/recipes/[id]`       | Delete recipe (owner only)  |
| GET    | `/api/recipes/my-recipes` | Get user's recipes          |

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

This project follows a professional Git workflow:
master (main branch)
↑ merged via Pull Requests
feature branches
01-feature-name
02-feature-name
...

### Commit Convention

feat: new feature
fix: bug fix
style: styling changes
perf: performance improvement
refactor: code refactoring
docs: documentation
chore: maintenance

---

## 🤝 Contributing

This is currently a personal project. Contributions will be welcome after the initial launch.

---

## 📄 License

MIT License — feel free to use this project as a reference.

---

## 👩‍💻 Author

**Anusha Hegde**

- Portfolio: [anushaHegde08.github.io/portfolio](https://anushaHegde08.github.io/portfolio)
- GitHub: [@anushaHegde08](https://github.com/anushaHegde08)

---

## 🙏 Acknowledgements

- Havyaka Brahmin community for the rich culinary heritage
- All open source libraries used in this project
- Anthropic Claude for development assistance

---

_Built with ❤️ to preserve Havyaka culinary heritage_
