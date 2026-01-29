# Dharmyk - Spiritual Journey App

A React Native Expo app that delivers daily 2-3 minute spiritual practices (Sadhana) using AMP-powered content from WordPress.

## Architecture

- **Frontend**: React Native with Expo
- **Backend**: WordPress with AMP pages (Docker)
- **State Management**: Zustand with AsyncStorage
- **Content Delivery**: AMP HTML pages served from WordPress
- **Communication**: Custom URL scheme (`dharmyk://`) for WebView bridge

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

```bash
# Install dependencies (use --legacy-peer-deps to avoid peer dependency conflicts)
npm install --legacy-peer-deps

# Start the development server
npx expo start
```

### Running on Devices

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# Web (for testing)
npx expo start --web
```

## Project Structure

```
expo-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home screen
│   │   └── profile.tsx    # Profile screen
│   ├── _layout.tsx        # Root layout
│   └── sadhana.tsx        # Sadhana player (full-screen modal)
├── components/            # Reusable components
│   ├── AmpCardView.tsx    # WebView for AMP cards
│   └── CompletionModal.tsx # Completion celebration
├── services/              # API services
│   └── api.ts             # WordPress API client
├── store/                 # State management
│   ├── useUserStore.ts    # User data (streaks, badges)
│   └── useSadhanaStore.ts # Sadhana session state
└── app.json               # Expo configuration
```

## Features

- **Daily Sadhana**: 5-card journey (Intro, Shloka, Katha, Smriti, Manana)
- **Streak Tracking**: Maintain daily practice streaks
- **Badges**: Unlock achievements for consistent practice
- **AMP Integration**: Fast-loading, mobile-optimized content
- **Offline Detection**: Graceful handling of no internet
- **Local Storage**: All user data stored on device

## WordPress Integration

The app fetches daily Sadhana content from a WordPress backend:

**API Endpoint**: `http://localhost:8080/wp-json/dharmyk/v1/sadhana?date=YYYY-MM-DD`

**Response Format**:
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

## Bridge Communication

AMP pages communicate with the native app using custom URL schemes:

- `dharmyk://next` - Advance to next card
- `dharmyk://quiz_correct` - Quiz answered correctly
- `dharmyk://quiz_wrong` - Quiz answered incorrectly
- `dharmyk://save_reflection?reflection=...` - Save user reflection

## Development

### Modifying Styles

Colors are defined in each component. Main colors:
- Saffron: `#FF9933`
- Deep Red: `#8B0000`
- Warm White: `#FDFBF7`
- Charcoal: `#333333`

### Adding New Badges

Edit `app/(tabs)/profile.tsx` and add to the `ALL_BADGES` array.

### Debugging

```bash
# View logs
npx expo start

# Clear cache
npx expo start --clear
```

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## License

MIT
