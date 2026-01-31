# InsightEats

InsightEats is a modern nutrition tracking application that helps you take control of your nutrition with intelligent tracking and personalized insights. Log meals, monitor macros, track weight, and achieve your health goals with ease.

## Features

- **Smart Food Search** - Search foods from our local database and external sources (USDA, Open Food Facts)
- **Food Diary** - Log your daily meals and track your caloric and macro intake
- **Weight Tracking** - Monitor your weight evolution with beautiful charts
- **Personalized Goals** - Set your profile to calculate daily calorie and macro targets
- **Dashboard** - View your daily progress and weight evolution over time
- **Food Database** - Manage your personal food library
- **Data Export** - Export your logs and weight data to CSV or JSON
- **Internationalization** - Available in English and Portuguese

## Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org), [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com)
- **Backend**: [Convex](https://convex.dev) - Full-stack platform for building real-time applications
- **Authentication**: [Clerk](https://clerk.com)
- **Charts**: [Recharts](https://recharts.org)
- **Icons**: [Lucide React](https://lucide.dev)
- **Validation**: [Zod](https://zod.dev)
- **Styling**: Tailwind CSS with custom health-focused palette

## Getting Started

### Prerequisites

- Node.js 20+ installed
- A Convex account (free) - Get it at [convex.dev](https://convex.dev)
- A Clerk account (free) - Get it at [clerk.com](https://clerk.com)
- A USDA API Key (optional) - Get it at [api.data.gov](https://api.data.gov/signup/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Jvagarinho/InsightEats.git
cd InsightEats
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add the following variables:

```env
# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex (Backend)
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

4. Deploy Convex backend:

```bash
npx convex dev
```

This will start the Convex development server and sync your functions.

5. Start the development server:

In a new terminal, run:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── (dashboard)/   # Protected dashboard pages
│   ├── about/         # About Iterio Tech page
│   └── features/      # Features showcase page
├── components/       # Reusable components
│   ├── ui/          # UI components (dialogs, etc.)
│   ├── Sidebar.tsx
│   ├── MobileNavigation.tsx
│   └── LanguageProvider.tsx
├── lib/            # Utility functions
│   ├── validations.ts # Zod schemas
│   └── export.ts    # Data export utilities
└── types/          # TypeScript type definitions
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Routes

- `/api/external-foods` - Proxy for external food search (USDA, Open Food Facts)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for frontend | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key for backend | Yes |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL | Yes |
| `USDA_API_KEY` | USDA API key for food search (optional) | No |

## Deployment

### Convex Deployment

Deploy your Convex functions to production:

```bash
npx convex deploy
```

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

### Other Platforms

You can deploy to any platform that supports Next.js, such as:
- [Netlify](https://netlify.com)
- [Railway](https://railway.app)
- [Render](https://render.com)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

For questions, suggestions, or collaborations, reach out to the Iterio Tech team:

- Email: iteriotech@gmail.com
- GitHub: [Jvagarinho](https://github.com/Jvagarinho)

## Acknowledgments

- [Open Food Facts](https://world.openfoodfacts.org) - Open food database
- [USDA FoodData Central](https://fdc.nal.usda.gov) - USDA food data API
- [Next.js](https://nextjs.org) - React framework
- [Convex](https://convex.dev) - Backend platform
- [Clerk](https://clerk.com) - Authentication provider
