# Project Dharmyk — Implementation Plan

**Version:** 1.0  
**Source:** PRD v5.0 (Context-Rich Implementation Plan)  
**Target:** AI Coding Agent / Full-Stack Team  

This document is a step-by-step implementation plan for building the Dharmyk app: a gamified, daily spiritual habit PWA (then iOS/Android) with AMP-driven content from WordPress and user state in Firebase.

---

## Table of Contents

1. [Prerequisites & Dependencies](#1-prerequisites--dependencies)
2. [Phase 1: WordPress Backend](#2-phase-1-wordpress-backend)
3. [Phase 2: Expo Shell (React Native)](#3-phase-2-expo-shell-react-native)
4. [Phase 3: Integration, Polish & Launch Prep](#4-phase-3-integration-polish--launch-prep)
5. [Verification Checklist](#5-verification-checklist)
6. [Reference: Data Shapes & Protocols](#6-reference-data-shapes--protocols)

---

## 1. Prerequisites & Dependencies

### 1.1 Environment Assumptions

| Item | Requirement |
|------|-------------|
| **WordPress** | Fresh WordPress on VPS (DigitalOcean/Linode) or managed host (WP Engine/Kinsta). Root/admin access. |
| **CLI** | `wp-cli` installed on server for Phase 1 configuration. |
| **Local dev** | Node 18+, npm/yarn, Expo CLI. For PWA testing: browser; for native: Xcode (iOS) / Android Studio. |
| **Firebase** | Firebase project created; Auth and Firestore enabled. |

### 1.2 Phase Dependencies

```
Phase 1 (WordPress) ——► Phase 2 (Expo Shell)
       │                         │
       └── API must return       └── Depends on API URL + bridge protocol
           valid JSON + AMP          (dharma://) being stable
```

**Blocking:** Phase 2.0 (Pre-Flight) must succeed before Phase 2.1+.

---

## 2. Phase 1: WordPress Backend

**Goal:** Headless CMS that exposes daily Sadhana as JSON and serves AMP HTML cards. No separate Node backend; logic in WordPress plugin + minimal AMP theme.

### 2.1 Environment Setup (Human-Owned)

| Step | Action | Owner |
|------|--------|--------|
| 1 | Provision VPS or managed WordPress host. | Human |
| 2 | Install fresh WordPress. | Human |
| 3 | Install and verify `wp-cli` on server. | Human |
| 4 | Note site URL and ensure HTTPS. | Human |

**Deliverable:** SSH + wp-cli access; base URL (e.g. `https://api.dharma.com`).

---

### 2.2 Core Configuration (Agent / CLI)

**Input:** SSH access, WordPress root, wp-cli in PATH.

| Step | Command / Action | Success Criteria |
|------|------------------|------------------|
| 1 | Install & activate plugins | No errors |
| 2 | Clean default content | No posts/pages listed |
| 3 | Set options | `blogname` and `blogdescription` updated |

**Commands to run:**

```bash
# Plugins (adjust if ACF Pro is licensed zip)
wp plugin install amp advanced-custom-fields editorial-calendar wp-rest-api-controller --activate

# If ACF Pro is manual: upload zip, then:
# wp plugin activate advanced-custom-fields-pro

# Clean default content
wp post delete $(wp post list --post_type=post --format=ids) --force 2>/dev/null || true
wp post delete $(wp post list --post_type=page --format=ids) --force 2>/dev/null || true

# Site identity
wp option update blogname "Project Dharma CMS"
wp option update blogdescription "Headless Content Server"
```

**Deliverable:** WordPress admin with AMP, ACF, Editorial Calendar, WP REST API Controller active.

---

### 2.3 Plugin: `dharma-core` (Agent Task)

**Location:** `wp-content/plugins/dharma-core/`

#### 2.3.1 Files to Create

| File | Purpose |
|------|---------|
| `dharma-core.php` | Bootstrap: load ACF field group registration, CPT, REST controller. |
| `includes/class-dharma-cpt.php` | Register CPT `daily_sadhana`. |
| `includes/class-dharma-rest.php` | Register `GET /wp-json/dharma/v1/sadhana?date=YYYY-MM-DD`. |
| `includes/acf-fields.php` | Define ACF field group for `daily_sadhana` (meta, intro, tracks). |

#### 2.3.2 CPT: `daily_sadhana`

- **Labels:** “Daily Sadhana”, “Daily Sadhanas”.
- **Public:** true for REST; supports “view” capability.
- **Supports:** title, author, custom-fields.
- **Has archive:** false.
- **Show in rest:** true.
- **Rest base:** as needed for direct post fetches (optional).

#### 2.3.3 ACF Field Group (conceptual)

Attach to Post Type = `daily_sadhana`:

- `sadhana_date` (Date Picker, required) — used for API `?date=` lookup.
- `theme` (Text) — e.g. “Steadiness in Action”.
- `intro_card_content` or similar — for intro card (optional if intro is first card in default track).
- **Tracks:** Repeater or Group:
  - `track_slug` (e.g. default, anxious, grief).
  - `cards` — Repeater of card type + content or URL to AMP card.

Simplified variant for MVP:

- One “default” track stored as repeating “cards” (order: intro, sadhana, katha, smriti, manana).
- Optional repeaters for “anxious”, “grief” with same card structure (or override only specific positions).

REST controller will map these to the JSON shape below.

#### 2.3.4 REST Controller: `GET /wp-json/dharma/v1/sadhana`

- **Query:** `date` (required) `YYYY-MM-DD`.
- **Logic:** Find `daily_sadhana` where `sadhana_date === date` (meta query). If none, return 404 or empty schema.
- **Response shape:** See [Section 6.1](#61-sadhana-api-response).

**Base URL for cards:** e.g. `https://api.dharma.com/sadhana/{id}/card/{card_slug}/amp`. Theme will resolve `{id}` and `card_slug` to the correct template.

**Deliverable:** Plugin installable and activated; one draft Daily Sadhana editable in admin; `curl` to endpoint returns valid JSON.

---

### 2.4 Theme: `dharma-amp` (Agent Task)

**Location:** `wp-content/themes/dharma-amp/`

#### 2.4.1 Files to Create

| File | Purpose |
|------|---------|
| `style.css` | Theme header (required); minimal styles. |
| `functions.php` | `add_theme_support('amp');` and any AMP-related setup. |
| `single-daily_sadhana.php` | Router: read query (e.g. `card`, `variant`), load correct template part. |
| `template-parts/card-intro.php` | Intro card: mood selector with `dharma://mood_selected?value=...`. |
| `template-parts/card-sadhana.php` | Shloka card: `amp-audio`, Next → `dharma://next_slide`. |
| `template-parts/card-katha.php` | Story card: content + Next → `dharma://next_slide`. |
| `template-parts/card-smriti.php` | Quiz: `amp-state`, options, correct → confetti + `dharma://quiz_result?correct=true`. |
| `template-parts/card-manana.php` | Reflection: form `action="dharma://save_reflection"`, `textarea name="text"`, Submit. |

#### 2.4.2 URL Scheme

- Card URLs must be deterministic so the app can request them from the API response.
- Example: `/sadhana/101/card/intro/amp`, `/sadhana/101/card/sadhana/amp`, `/sadhana/101/card/sadhana-anxiety/amp`.
- Router in `single-daily_sadhana.php` (or a custom rewrite + template) parses post ID and card slug and includes the right `template-parts/card-*.php`.

#### 2.4.3 AMP Compliance

- No custom JS; only AMP components (`amp-audio`, `amp-state`, `amp-bind`, `amp-animation` if needed).
- All CTAs use `<a href="dharma://...">` or form `action="dharma://..."` and `target="_top"` where required.
- Bridge events: `dharma://card_ready`, `dharma://mood_selected`, `dharma://next_slide`, `dharma://save_reflection`, `dharma://quiz_result`.

**Deliverable:** AMP validator passes (`#development=1`); clicking “Next” tries to open `dharma://next_slide` (browser may show “unknown protocol”, which is expected).

---

### 2.5 Admin UX (Agent / Config)

- **Calendar:** Editorial Calendar already installed; ensure `daily_sadhana` appears and is schedulable by date.
- **Preview:** In `dharma-core.php` or theme, hook `post_submitbox_misc_actions` to add “Preview App” linking to PWA with that day’s date (or first card URL).

**Deliverable:** Creator can pick a date, add/edit Daily Sadhana, and open preview.

---

### 2.6 Phase 1 Verification

| Test | Command / Action | Success |
|------|------------------|--------|
| API JSON | `curl -s 'https://YOUR-DOMAIN/wp-json/dharma/v1/sadhana?date=YYYY-MM-DD'` | HTTP 200, JSON with `intro_card`, `tracks.default` (and optional `tracks.anxious`). |
| AMP validity | Open card URL, add `#development=1`, open DevTools console | “AMP validation successful.” |
| Bridge | Click “Next” on a card | Navigation attempt to `dharma://next_slide` (or similar). |

---

## 3. Phase 2: Expo Shell (React Native)

**Goal:** Native shell (tabs, auth, streaks, badges) and an in-app “Player” that loads AMP card URLs in a horizontal pager and handles `dharma://` via WebView interception.

### 3.0 Pre-Flight (Blocking)

- Call the production or staging API:  
  `GET ${WP_API_URL}/wp-json/dharma/v1/sadhana?date=${today}`  
- **Success:** JSON with `tracks` (and preferably one sample date with content).  
- **Failure:** Fix Phase 1 or use mock date/content before continuing.

**Deliverable:** Documented `WP_API_URL` and one working `date` for dev.

---

### 3.1 Project Init & Dependencies (Agent)

| Step | Action |
|------|--------|
| 1 | `npx create-expo-app@latest dharma-app --template tabs@50` (or current Expo Router tabs template). |
| 2 | Install: `nativewind`, `tailwindcss`, `react-native-webview`, `react-native-pager-view`, `expo-av`, `zustand`, `firebase`, `lucide-react-native`, `expo-haptics`. |
| 3 | Configure NativeWind (Tailwind) and ensure babel/content config for Expo. |

**Deliverable:** App runs with `npx expo start`; Tailwind classes apply.

---

### 3.2 Architecture & Store (Agent)

#### 3.2.1 API Service

**File:** `services/api.ts` (or `src/services/api.ts`)

- Function: `getSadhanaByDate(date: string)`.
- Request: `GET ${WP_API_URL}/wp-json/dharma/v1/sadhana?date=${date}`.
- Return: Typed response (see [Section 6.1](#61-sadhana-api-response)).

#### 3.2.2 User Store (Zustand)

**File:** `store/useUserStore.ts`

- State: `user` (Firebase User | null), `streak: number`, `badges: string[]`, loading flags.
- Actions: `login`, `logout`, `hydrateFromFirestore`, `updateStreak`, `addBadge` (if not already present).
- Firestore: Read/write `users/{uid}` (current_streak, last_completed_iso, badges).

#### 3.2.3 Player Store (Zustand)

**File:** `store/usePlayerStore.ts`

- State: `playlist: string[]` (AMP URLs), `currentIndex: number`, `mood: string | null`, `sadhanaPayload` (full API object).
- Actions:
  - `loadSadhana(date: string)`: fetch API, set `intro_card` + one track (default or mood) into `playlist`, reset index.
  - `setMood(mood: string)`: if payload has `tracks[mood]`, replace remaining playlist (after intro) with `tracks[mood]`; else use `tracks.default`; then advance.
  - `nextSlide()`: increment `currentIndex`; if at end, trigger completion (e.g. CompletionModal, streak update).
  - `resetPlayer()`: clear playlist, index, mood.

**Deliverable:** Stores and API service exist; `loadSadhana(today)` populates playlist from real API.

---

### 3.3 Bridge Logic (Agent)

**File:** `hooks/useAmpBridge.ts` (or `lib/useAmpBridge.ts`)

- Input: `request` (WebView request object with `url`).
- Behavior:
  - If `request.url` does not start with `dharma://`, return `true` (allow load).
  - Else parse URL: `hostname` = action, `searchParams` = params.
  - Handle:
    - `mood_selected` → `playerStore.setMood(params.value)`; then `playerStore.nextSlide()`.
    - `next_slide` → `playerStore.nextSlide()`.
    - `save_reflection` → Firestore save (e.g. `reflections/{uid}/{date}` with `user_text`, `mood_selected`); then `playerStore.nextSlide()`.
    - `quiz_result` → if `params.correct === 'true'` trigger success haptic; else failure haptic.
    - `card_ready` → hide loading indicator (if using one).
  - Return `false` to cancel navigation for all `dharma://` URLs.

**Platform:** On iOS use `onShouldStartLoadWithRequest`; on Android use `onNavigationStateChange` and compare `navState.url` (and prevent load via other means if needed). Document in code.

**Deliverable:** Hook used by Player WebView; every `dharma://` hit is handled and logged in dev.

---

### 3.4 Player Screen (Agent)

**Route:** `app/sadhana/index.tsx` (or equivalent so it opens as main flow from Home).

- **Container:** Full-screen Modal (or dedicated stack) so it covers tabs.
- **Layout:** `PagerView` with horizontal swipe; each page = one WebView (one AMP URL).
- **Data source:** `playerStore.playlist`; current page = `playerStore.currentIndex`.
- **Optimization:** Render WebView only for `currentIndex`, `currentIndex - 1`, `currentIndex + 1`.
- **WebView props:**  
  `originWhitelist={['*']}`,  
  `onShouldStartLoadWithRequest={handleWebViewRequest}` (iOS),  
  `onNavigationStateChange={...}` (Android bridge),  
  `showsVerticalScrollIndicator={false}`.  
- **Entry:** On mount, if playlist empty, call `playerStore.loadSadhana(today)` (and optionally show loading until first card loads).
- **Completion:** When `nextSlide()` is called on last card, open CompletionModal (confetti + chime + updated streak), then close Player and return to Home.

**Deliverable:** User can open Today’s Sadhana, swipe through cards, use Next/mood/reflection/quiz; completion triggers native overlay and updates streak.

---

### 3.5 Native Shell UI (Agent)

#### 3.5.1 Design Tokens

- Primary: Saffron/Orange `#FF9933`.
- Secondary: Deep Red `#8B0000`.
- Background: Warm Off-White `#FDFBF7`.
- Text: Dark Charcoal `#333333`.
- Headings: Merriweather (or similar serif); UI: Inter (or similar sans).

#### 3.5.2 Tab: Home (`app/(tabs)/index.tsx`)

- Header: “Today’s Sadhana” and streak (e.g. “Day N” or “Streak: N”).
- Hero card: “Start Today’s Practice” (saffron gradient); on press → navigate to Player (`/sadhana`).
- Small stats row: current streak.

#### 3.5.3 Tab: Profile (`app/(tabs)/profile.tsx`)

- Badges grid: from Firestore; locked vs unlocked.
- History: list or calendar of completed days (from `reflections` or completion log).

#### 3.5.4 Global: CompletionModal

- Shown when last card sends `dharma://next_slide` and player detects end.
- Content: short celebration, confetti (optional lib), chime via `expo-av`, new streak count.
- Action: Dismiss → close Player, refresh Home streak.

**Deliverable:** Tabs render; Home → Player → Completion → Home flow works; Profile shows badges and history.

---

### 3.6 Offline (MVP)

- Before opening Player, check connectivity (e.g. `@react-native-community/netinfo`).
- If offline, show a native “No Internet” screen; do not open WebView or attempt to cache AMP HTML.

**Deliverable:** Offline user sees message instead of broken Player.

---

### 3.7 Phase 2 Verification

- Run `npx expo start`; test on simulator/emulator and, if possible, device.
- Confirm `handleWebViewRequest` logs every intercepted `dharma://` URL.
- Tap “Next” in WebView → log + PagerView advances.
- Complete full flow for one day → CompletionModal, streak increment, reflection in Firestore.

---

## 4. Phase 3: Integration, Polish & Launch Prep

- **End-to-end:** Multiple days (use API with different dates or mock) to test streak and badges.
- **Badge rules (MVP):** “The Seeker” = Day 1 completed; “Tri-Murti” = 3-day streak; “Saptarishi” = 7-day streak. Implement in backend (Firebase function or client after `updateStreak`).
- **Analytics (optional):** Reflection save rate, Sadhana completion rate; define events (e.g. “sadhana_completed”, “reflection_saved”).
- **PWA:** Configure service worker, manifest, and icons so Phase 1 launch is PWA-first.
- **iOS/Android:** Expo EAS Build; test on real devices; ensure WebView and bridge work on both platforms.

---

## 5. Verification Checklist

- [ ] Phase 1: API returns valid JSON for `?date=`.
- [ ] Phase 1: At least one card URL passes AMP validator.
- [ ] Phase 1: Bridge links use `dharma://` and are interceptable.
- [ ] Phase 2: Pre-flight CURL/API check passes.
- [ ] Phase 2: Player loads intro + track; mood selection switches track when available.
- [ ] Phase 2: `next_slide`, `save_reflection`, `quiz_result` all drive native behavior.
- [ ] Phase 2: Completion updates Firestore streak and shows CompletionModal.
- [ ] Phase 2: Offline shows native message; no WebView.
- [ ] Phase 3: Badges unlock correctly; PWA installable; native builds run.

---

## 6. Reference: Data Shapes & Protocols

### 6.1 Sadhana API Response

```json
{
  "id": 101,
  "date": "2023-10-27",
  "theme": "Steadiness in Action",
  "intro_card": "https://api.dharma.com/sadhana/101/card/intro/amp",
  "tracks": {
    "default": [
      "https://api.dharma.com/sadhana/101/card/sadhana/amp",
      "https://api.dharma.com/sadhana/101/card/katha/amp",
      "https://api.dharma.com/sadhana/101/card/smriti/amp",
      "https://api.dharma.com/sadhana/101/card/manana/amp"
    ],
    "anxious": [
      "https://api.dharma.com/sadhana/101/card/sadhana-anxiety/amp",
      "https://api.dharma.com/sadhana/101/card/katha/amp",
      "https://api.dharma.com/sadhana/101/card/smriti/amp",
      "https://api.dharma.com/sadhana/101/card/manana/amp"
    ]
  }
}
```

### 6.2 Bridge Protocol (dharma://)

| URL | Meaning | App action |
|-----|---------|------------|
| `dharma://card_ready` | Card has loaded | Hide loading spinner |
| `dharma://mood_selected?value=anxious` | User chose mood | Set track, then next slide |
| `dharma://next_slide` | Advance to next card | Increment index; if last → completion |
| `dharma://save_reflection?text=...` | Reflection submitted | Save to Firestore, next slide |
| `dharma://quiz_result?correct=true|false` | Quiz answered | Haptic; optional analytics |

### 6.3 Firestore Schema

- **Collection `users`:** document ID = `uid`; fields: `current_streak`, `last_completed_iso`, `badges` (array of strings).
- **Collection `users/{uid}/reflections`:** document ID = `YYYY-MM-DD`; fields: `prompt`, `user_text`, `timestamp`, `mood_selected`.

---

**End of Implementation Plan.** Use this alongside the PRD for implementation order and acceptance criteria.
