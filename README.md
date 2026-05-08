# ISS Dashboard with AI Chatbot

A complete web application that tracks the International Space Station in real-time, displays latest news articles, and includes an AI-powered chatbot that answers questions based on dashboard data.

## Features

### 🛰️ ISS Live Tracking
- Real-time ISS location updates (refreshes every 15 seconds)
- Interactive Leaflet.js map showing ISS position
- Speed calculation using Haversine formula
- Last 15 positions trajectory visualization
- Current location reverse geocoding
- Number of people currently in space with names
- Manual refresh button

### 📰 News Dashboard
- Fetch latest news from NewsAPI
- Category filtering (general, business, entertainment, health, science, sports, technology)
- Search functionality
- Sort by date or relevance
- 15-minute local storage caching
- Responsive grid layout with article previews
- "Read More" links to full articles

### 🤖 AI Chatbot
- Floating chatbot window
- Answers questions ONLY based on ISS and News data (restricted scope)
- Uses Mistral-7B model from Hugging Face
- Last 30 messages stored in localStorage
- Typing indicators
- Clear chat history option

### 📊 Data Visualization
- **ISS Speed Trend**: Line chart showing speed over time (last 30 measurements)
- **News Distribution**: Pie/Doughnut chart showing articles per source
- Interactive charts with Chart.js

### 🎨 UI/UX
- Dark mode / Light mode toggle (persists in localStorage)
- Fully responsive design (mobile, tablet, desktop)
- Loading skeletons and spinners
- Error messages with retry functionality
- Toast notifications
- Smooth animations and transitions

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS v3
- **Mapping**: Leaflet.js
- **Charts**: Chart.js with react-chartjs-2
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **AI**: Hugging Face Mistral-7B model

## Setup Instructions

### 1. Clone or Extract Project
```bash
cd /Users/krishkothari/Desktop/hf-endsem-vscode
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:
```
VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_AI_TOKEN=your_huggingface_token_here
```

**Get API Keys:**
- **NewsAPI**: Visit https://newsapi.org, sign up with your student email, and copy your API key
- **Hugging Face**: Create an account at https://huggingface.co, go to Settings > Access Tokens, and create a new token

### 4. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

Output will be in the `dist/` folder.

## Project Structure

```
src/
├── components/
│   ├── ISS/
│   │   └── ISSTracker.jsx       # ISS tracking component
│   ├── News/
│   │   └── NewsPanel.jsx        # News dashboard
│   ├── Chatbot/
│   │   └── Chatbot.jsx          # AI chatbot
│   ├── Charts/
│   │   └── Charts.jsx           # Speed & news charts
│   └── Layout/
│       ├── Header.jsx           # App header
│       └── Tabs.jsx             # Tab navigation
├── utils/
│   ├── issApi.js               # ISS API calls
│   ├── newsApi.js              # News API calls
│   ├── aiApi.js                # Hugging Face API
│   ├── calculations.js         # Haversine formula, speed calc
│   ├── geocoding.js            # Reverse geocoding
│   └── store.js                # Zustand stores
├── styles/
│   └── index.css               # Custom styles
├── App.jsx                      # Main app component
├── index.css                    # Global styles & Tailwind
└── main.jsx                     # React entry point
```

## Deployment to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial ISS Dashboard commit"
git remote add origin https://github.com/yourusername/iss-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel login your-email@example.com
vercel         # First deployment (select defaults)
vercel --prod  # Production deployment
```

**Option B: Web Interface**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Select your GitHub repository
4. Add environment variables:
   - `VITE_NEWS_API_KEY`
   - `VITE_AI_TOKEN`
5. Click "Deploy"

### Step 3: Access Live App
After deployment, Vercel will provide a live URL (e.g., `https://iss-dashboard-xxxx.vercel.app`)

## Important Notes

### Security
- ✅ `.env` file added to `.gitignore` (never commit API keys)
- ✅ Environment variables configured in Vercel dashboard
- ✅ Chatbot restricted to dashboard data only (no internet access)

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## API Keys

**IMPORTANT**: Store your API keys securely:
```
HuggingFace Token: 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
NewsAPI Key: Get from https://newsapi.org (free tier available)
```

---

**Status**: ✅ Production Ready
**Last Updated**: May 8, 2026
