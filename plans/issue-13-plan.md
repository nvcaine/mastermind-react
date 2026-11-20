# Implementation Plan — Issue #13: Navigation Bar Updates

> [!NOTE]
> **Branch:** `issue/13/nav-bar-updates`  
> **Merge target:** `develop`  
> **Issue:** [nvcaine/mastermind-react#13](https://github.com/nvcaine/mastermind-react/issues/13)

---

## 1. Overview & Requirements

Issue #13 requires updates to both mobile and web navigation bars:

### Mobile Navigation Bar
- Replace the current icon of the `Play` tab with a **gamepad** icon.
- Replace the current icon of the `Levels` tab with a **star** icon.
- Replace the current icon of the `Guide` tab with a **magnifying glass** icon.
- Save the new icons in the needed sizes for mobile (`@1x` 24×24, `@2x` 48×48, `@3x` 72×72) under `assets/images/tabIcons/`.

### Web Navigation Bar
- Move the web navigation bar to the **bottom** of the layout.
- Make sure the main container doesn't overlap the navigation bar.
- Update the tabs to look like the mobile version (labels matching `Play`, `Levels`, `Guide` with corresponding icons and styling).

---

## 2. Proposed Changes & Affected Files

| Area | File | Change Description |
|---|---|---|
| **Icons** | `assets/images/tabIcons/gamepad*.png`<br>`assets/images/tabIcons/star*.png`<br>`assets/images/tabIcons/magnifier*.png` | Create 24×24, 48×48, and 72×72 high-contrast alpha-masked template icons for mobile tab triggers. |
| **Mobile Nav** | `src/components/app-tabs.tsx` | Update icon `src` references for `index` (gamepad), `levels` (star), and `settings` (magnifier). |
| **Web Nav** | `src/components/app-tabs.web.tsx` | Reposition tab list to bottom (`bottom: 0`, safe padding), ensure tab container slot avoids content overlap, update trigger names & labels to match mobile (`Play`, `Levels`, `Guide`), and add tab icons to match mobile appearance. |
| **Plan Artifact** | `plans/issue-13-plan.md` | Save approved copy in the repository per agent git flow guidelines. |

---

## 3. Step-by-Step Commit Breakdown

As mandated by the git workflow guidelines, each commit corresponds directly to items in the issue description and ensures builds and type checks succeed:

1. **Plan:** `docs: add implementation plan for issue #13`
   - Save approved copy to `plans/issue-13-plan.md`.
2. **Commit 1:** `feat: save new mobile tab icons in required sizes`
   - Generate and add `gamepad.png`, `gamepad@2x.png`, `gamepad@3x.png`, `star.png`, `star@2x.png`, `star@3x.png`, `magnifier.png`, `magnifier@2x.png`, `magnifier@3x.png` to `assets/images/tabIcons/`.
3. **Commit 2:** `feat: update mobile navigation bar icons`
   - Point `AppTabs` triggers to the new icons (`Play` -> gamepad, `Levels` -> star, `Guide` -> magnifier).
4. **Commit 3:** `feat: move web navigation bar to bottom without container overlap`
   - Position `CustomTabList` at the bottom and adjust `TabSlot` padding so content is not obscured.
5. **Commit 4:** `feat: update web tabs to match mobile navigation appearance`
   - Update tab trigger labels (`Play`, `Levels`, `Guide`) and integrate matching icons into `TabButton`.

---

## 4. Verification & Testing

- **Typecheck:** `npx tsc --noEmit`
- **Lint:** `npx expo lint`
- **Expo Doctor / Config check:** Ensure all assets resolve properly in Metro bundler.
- **PR Submission:** Open PR using `gh pr create --base develop` targeting `develop`.
