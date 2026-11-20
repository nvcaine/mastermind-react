# Implementation Plan — Issue #11: Update the Splash Screen Animation

> [!NOTE]
> **Branch:** `issue/11/update-splash-screen` (already exists on remote)  
> **Merge target:** `develop`  
> **Issue:** [nvcaine/mastermind-react#11](https://github.com/nvcaine/mastermind-react/issues/11)

---

## Summary

Replace the current Expo-logo animated splash screen with a game-themed element that visually matches the colour pegs used during gameplay, displays an animated colour-wheel glow, and is always visible for a minimum of **2 seconds**.

---

## Files to Change

| File | Change |
|------|--------|
| `src/components/animated-icon.tsx` | Full rewrite — replace `expo-logo.png` image with new `SplashPeg` component and add glow + timing logic |

No other files should need changes (the layout already uses `<AnimatedSplashOverlay />`).

---

## Step-by-Step Plan

### Step 1 — Checkout the branch
```bash
git fetch origin
git checkout issue/11/update-splash-screen
```

### Step 2 — Build the `SplashPeg` component (game-themed element)
Create a circular element styled identically to `ColorButton` (from `src/components/ColorButton.tsx`):
- Same circular shape (`borderRadius = size / 2`).
- Same glossy specular highlight (top, `rgba(255,255,255,0.45)`).
- Same bottom sheen (`rgba(255,255,255,0.15)`).
- A dark background (`#0B0F19` or `#1E293B`) since no specific colour is selected on the splash.
- **Animated conic/radial glow ring** around the peg cycling through all 10 game colours from `HexCodes`:
  `RED, GREEN, BLUE, YELLOW, BEIGE, TEAL, PURPLE, BROWN, WHITE, BLACK`

The glow will be implemented as an `Animated.View` positioned absolutely behind the peg, using `react-native-reanimated`'s `useSharedValue` + `withRepeat` / `withTiming` to rotate a radial gradient or a segmented colour ring. Since React Native does not support conic gradients natively, the colour ring will be rendered as **10 equally-sized arc segments** using absolute-positioned `View`s with `overflow: hidden` and `rotate` transforms — a pure RN approach requiring no extra dependencies.

### Step 3 — Add the 2-second minimum visibility guarantee
The issue requires the splash to be visible for **at least 2 seconds**, regardless of how fast the app loads.

**Strategy:**
```
startTime = Date.now()  (captured on mount)

SplashScreen.hideAsync() resolves  → record readyTime
remaining = max(0, 2000 - (Date.now() - startTime))
setTimeout(startExitAnimation, remaining)
```

This replaces the current approach where `hideAsync()` immediately triggers `setAnimate(true)`.

### Step 4 — Exit animation
Keep a similar fade-out keyframe to the current one (opacity 1 → 0 over ~600 ms), but applied to the whole overlay. After the animation finishes, `setVisible(false)` unmounts the overlay as today.

---

## Detailed Component Design

```
<AnimatedSplashOverlay>           ← absolute fill, dark bg, zIndex 1000
  <SplashPeg size={120}>
    <GlowRing />                  ← animated rotating colour segments behind peg
    <PegCircle />                 ← dark circle with gloss + sheen, same as ColorButton
  </SplashPeg>
</AnimatedSplashOverlay>
```

### Colour segments for `GlowRing`
10 segments, each rotated by `i * 36°` (360 / 10), using the colours from `HexCodes` in order:

| # | Colour | Hex |
|---|--------|-----|
| 0 | RED | `#EF4444` |
| 1 | GREEN | `#10B981` |
| 2 | BLUE | `#3B82F6` |
| 3 | YELLOW | `#F59E0B` |
| 4 | BEIGE | `#F97316` |
| 5 | TEAL | `#14B8A6` |
| 6 | PURPLE | `#8B5CF6` |
| 7 | BROWN | `#B45309` |
| 8 | WHITE | `#E2E8F0` |
| 9 | BLACK | `#334155` |

The ring slowly rotates continuously using `withRepeat(withTiming(360, { duration: 4000 }), -1)`.

---

## Commits (one per bullet in the issue)

| Commit | Description |
|--------|-------------|
| **1** | `feat: replace expo-logo with game-themed peg element on splash screen` |
| **2** | `feat: add animated colour-wheel glow ring to splash peg` |
| **3** | `feat: enforce 2-second minimum splash screen visibility` |

Each commit must pass lint + typecheck:
```bash
npx expo lint
npx tsc --noEmit
```

### Step 5 — Open a PR
```bash
gh pr create --base develop --title "feat: update splash screen animation (#11)" \
  --body "Closes #11"
```

---

## Risks / Notes

> [!WARNING]
> `react-native-reanimated` `Keyframe` is used in the current code. The new glow ring rotation should use `useAnimatedStyle` + `useSharedValue` instead, which is better suited for continuous looping animations.

> [!TIP]
> The `scheduleOnRN` import from `react-native-worklets` is already in the file — it can be reused to call `setVisible(false)` from the worklet callback after the exit animation completes.

> [!NOTE]
> No new dependencies are needed — `react-native-reanimated` and `expo-image` are already in the project.
