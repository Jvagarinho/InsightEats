# InsightEats

InsightEats is a modern nutrition tracking application that helps you take control of your nutrition with intelligent tracking and personalized insights. Log meals, monitor macros, track weight, and achieve your health goals with ease.

## Features

- **🎯 AI Food Recognition** - Take photos or upload images to automatically identify foods using OpenAI Vision
- **🍎 Smart Food Search** - Search foods from our local database and external sources (USDA, Open Food Facts)
- **📓 Food Diary** - Log your daily meals and track your caloric and macro intake
- **⚖ Weight Tracking** - Monitor your weight evolution with beautiful charts
- **🎯 Personalized Goals** - Set your profile to calculate daily calorie and macro targets
- **📊 Dashboard** - View your daily progress and weight evolution over time
- **🥗 Food Database** - Manage your personal food library
- **📤 Data Export** - Export your logs and weight data to CSV or JSON
- **🌍 Internationalization** - Available in English and Portuguese
- **📱 Mobile-First** - Designed for mobile devices with camera integration

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

| Variable | Description | Required | Cost |
|----------|-------------|-----------|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for frontend | Yes | Free |
| `CLERK_SECRET_KEY` | Clerk secret key for backend | Yes | Free |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL | Yes | Free |
| `OPENAI_API_KEY` | OpenAI API key for AI food recognition | Yes* | Paid |
| `OPENAI_MODEL` | OpenAI model (gpt-4o or gpt-4o-mini) | No | See below |
| `AI_PROVIDER` | AI provider (openai or google) | No | See below |
| `GOOGLE_CLOUD_API_KEY` | Google Cloud Vision API key | Yes** | Free tier |
| `USDA_API_KEY` | USDA API key for food search (optional) | No | Free |

\*Required if using OpenAI as provider (default)
\*\*Required if using Google as provider

## AI Food Recognition

InsightEats includes an AI-powered food recognition feature that allows you to:

1. **Take photos directly** - Use your device camera to capture food images
2. **Upload from gallery** - Select existing photos from your device
3. **Automatic identification** - OpenAI Vision (GPT-4) identifies foods in the image
4. **Nutritional estimation** - Get estimated macros for each identified food
5. **Smart matching** - Search for matching foods in the database for accurate logging

### Getting OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add the key to your `.env.local` file:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

### Usage

1. Go to the Food Diary page
2. Click "Take Photo" or "Upload from Gallery" in the AI Food Recognition section
3. The AI will analyze the image and identify foods
4. Review the identified foods with confidence levels
5. Click "Search" on a food to find matching items in the database
6. Add the food to your diary as usual

## AI Provider Options

### OpenAI (Default)
- **Models**:
  - `gpt-4o` (default): Most accurate, ~$0.04 per image
  - `gpt-4o-mini`: ~50x cheaper, ~$0.0008 per image (recommended)
- **Pros**:
  - Best image recognition accuracy
  - Detailed nutritional estimation
  - Fast response times
- **Cons**:
  - Requires paid API key
  - Usage-based pricing

### Google Cloud Vision
- **Pricing**:
  - Free tier: 1000 requests/month
  - Paid: $1.50 per 1000 requests (after free tier)
- **Pros**:
  - Free tier available
  - Good for food label detection
- **Cons**:
  - Does not estimate nutritional values (uses randomized estimates)
  - Limited label detection compared to GPT-4

### Cost Comparison

| Provider | Model | Cost per Image | Free Tier | Accuracy |
|----------|--------|----------------|------------|-----------|
| OpenAI | gpt-4o-mini | ~$0.0008 | No | Highest |
| OpenAI | gpt-4o | ~$0.04 | No | Highest |
| Google Vision | - | $0.0015 | 1000/mo | Medium |

**Recommendation**: Use `gpt-4o-mini` for best balance between accuracy and cost. Set `OPENAI_MODEL=gpt-4o-mini` in `.env.local`.

### Switching Providers

To use Google Cloud Vision instead of OpenAI:

1. Get Google Cloud API key: https://console.cloud.google.com/apis/credentials
2. Add to `.env.local`:
   ```env
   AI_PROVIDER=google
   GOOGLE_CLOUD_API_KEY=your_api_key_here
   ```
3. Restart the development server

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
