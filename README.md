# Dharmyk - AMP-Powered Spiritual Journey App

A modern spiritual practice app that combines WordPress AMP pages with a React Native Expo shell to deliver daily 2-3 minute guided Sadhana journeys.

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   React Native Expo Shell          │
│   - Navigation & UI                 │
│   - State Management (Zustand)      │
│   - User Data (AsyncStorage)        │
│   - WebView for AMP Content         │
└──────────┬──────────────────────────┘
           │
           │ REST API & AMP Pages
           │
┌──────────▼──────────────────────────┐
│   WordPress (Docker)                │
│   - Custom Post Type (Sadhana)      │
│   - REST API Endpoint               │
│   - AMP Theme & Templates           │
│   - ACF for Content Management      │
└─────────────────────────────────────┘
```

## 📁 Project Structure

```
newDharmyk/
├── wordpress/                  # WordPress backend (Docker)
│   ├── docker-compose.yml     # Docker configuration
│   ├── wp-content/
│   │   ├── plugins/
│   │   │   └── dharmyk-core/  # Custom plugin
│   │   └── themes/
│   │       └── dharmyk-amp/   # AMP theme
│   └── README.md
│
└── expo-app/                  # React Native Expo frontend
    ├── app/                   # Expo Router pages
    ├── components/            # Reusable components
    ├── services/              # API services
    ├── store/                 # State management
    └── README.md
```

## 🚀 Quick Start

### 1. Start WordPress Backend

```bash
cd wordpress
docker-compose up -d
```

Access WordPress at: http://localhost:8080

**Initial Setup:**
1. Complete WordPress installation wizard
2. Go to Plugins → Activate "Dharmyk Core"
3. Install and activate "AMP" and "Advanced Custom Fields" plugins
4. Go to Appearance → Themes → Activate "Dharmyk AMP"
5. Create your first Daily Sadhana post

### 2. Start Expo App

```bash
cd expo-app
npm install --legacy-peer-deps
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

## 📱 Features

### Daily Sadhana Journey
Each day presents a 5-card spiritual practice:
1. **Intro** - Welcome and theme introduction
2. **Shloka** - Sanskrit verse with audio and translation
3. **Katha** - Short story with moral lesson
4. **Smriti** - Interactive quiz to test understanding
5. **Manana** - Personal reflection prompt

### Gamification
- **Streak Tracking**: Maintain daily practice streaks
- **Badges**: Unlock achievements
  - The Seeker (1 day)
  - Tri-Murti (3 days)
  - Saptarishi (7 days)
  - Dedicated (30 days)
  - Enlightened (108 days)

### Technical Features
- **AMP-Powered**: Fast-loading, mobile-optimized content
- **Offline Detection**: Graceful handling of no internet
- **Local Storage**: All user data persists on device
- **WebView Bridge**: Custom URL scheme for AMP ↔ Native communication

## 🔌 API Integration

### WordPress REST API

**Endpoint**: `GET /wp-json/dharmyk/v1/sadhana?date=YYYY-MM-DD`

**Response**:
```json
{
  "id": 123,
  "date": "2026-01-29",
  "title": "Day 1 - The Journey Begins",
  "theme": "Steadiness in Action",
  "cards": [
    { "type": "intro", "url": "http://localhost:8080/sadhana/123?card=intro" },
    { "type": "shloka", "url": "http://localhost:8080/sadhana/123?card=shloka" },
    { "type": "katha", "url": "http://localhost:8080/sadhana/123?card=katha" },
    { "type": "smriti", "url": "http://localhost:8080/sadhana/123?card=smriti" },
    { "type": "manana", "url": "http://localhost:8080/sadhana/123?card=manana" }
  ]
}
```

### Bridge Communication

AMP pages use custom URL schemes to communicate with the native app:

| URL Scheme | Purpose |
|------------|---------|
| `dharmyk://next` | Advance to next card |
| `dharmyk://quiz_correct` | Quiz answered correctly |
| `dharmyk://quiz_wrong` | Quiz answered incorrectly |
| `dharmyk://save_reflection?reflection=...` | Save user reflection |

## 🎨 Design System

### Colors
- **Saffron**: `#FF9933` - Primary actions, highlights
- **Deep Red**: `#8B0000` - Headers, important text
- **Warm White**: `#FDFBF7` - Background
- **Charcoal**: `#333333` - Body text

### Typography
- **Headings**: Serif font (Merriweather-style)
- **Body**: Sans-serif font (Inter-style)

## 🛠️ Development

### WordPress Development

**Creating a Daily Sadhana:**
1. Go to WordPress Admin → Daily Sadhanas → Add New
2. Fill in all ACF fields (date, theme, content for each card)
3. Publish

**Testing AMP Validation:**
```
http://localhost:8080/sadhana/123?card=intro#development=1
```
Check browser console for "AMP validation successful"

### Expo Development

**Running on Devices:**
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# Web (testing only)
npx expo start --web
```

**Debugging:**
```bash
# View logs
npx expo start

# Clear cache
npx expo start --clear
```

## 📦 Tech Stack

### Backend
- WordPress 6.4+
- Docker & Docker Compose
- MySQL 8.0
- AMP Plugin
- Advanced Custom Fields (ACF)

### Frontend
- React Native
- Expo SDK 54+
- Expo Router (file-based routing)
- Zustand (state management)
- AsyncStorage (local persistence)
- React Native WebView
- React Native PagerView

## 🚢 Deployment

### WordPress
- Deploy to any VPS (DigitalOcean, Linode, etc.)
- Or use managed WordPress hosting (WP Engine, Kinsta)
- Update `WORDPRESS_BASE_URL` in `expo-app/services/api.ts`

### Expo App
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build
eas build --platform ios
eas build --platform android
```

## 📝 Next Steps

- [ ] Add sample Sadhana content
- [ ] Test AMP validation on all cards
- [ ] Test full user journey in Expo app
- [ ] Add more badges and achievements
- [ ] Implement badge unlock logic
- [ ] Add sound effects for quiz feedback
- [ ] Add confetti animation for completion
- [ ] Deploy WordPress to production server
- [ ] Build and test on physical devices

## 📄 License

MIT

## 🙏 Credits

Built with love for spiritual seekers everywhere.
# testDharmyk
