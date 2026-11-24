# Implementation Plan — Issue #15: Responsive Display for Colours and Pegs

> [!NOTE]
> **Branch:** `task/15/responsive-colours`  
> **Merge target:** `develop`  
> **Issue:** [nvcaine/mastermind-react#15](https://github.com/nvcaine/mastermind-react/issues/15)

---

## 1. Overview & Requirements

Issue #15 updates the main screen to correctly display multiple available colours (3 to 10) and colour combinations of higher lengths (3 to 6).

### Current Combination Component
- Change the layout of the container so the number of the attempt and the evaluation result take equal space.
- The width of the current combination container should take up all the available space.
- Define the size of each peg based on the length of the current combination (NOT the amount of available colours).

### Available Colours Component
- Display a maximum of 5 colours on a single row.
- If the number of available colours is higher than 5, divide the pegs equally on two rows.
- If the number of available colours is odd, the top row should contain one more peg than the bottom one.

---

## 2. Proposed Changes & Affected Files

| Area | File | Change Description |
|---|---|---|
| **Plan Artifact** | `plans/issue-15-plan.md` | Save approved copy in the repository per agent git flow guidelines. |
| **Current Combination** | `src/components/ColorSet.tsx` | - Set `attemptContainer` and `cluesContainer` to equal width/flex (`width: 70`, `alignItems: 'center'`).<br>- Ensure card width takes up all available space (`width: '100%'`, `marginHorizontal: 0`).<br>- Calculate peg size dynamically based on `totalSlots` (e.g. 3 slots -> 42, 4 slots -> 38, 5 slots -> 32, 6 slots -> 28). |
| **Available Colours** | `src/components/ColorMenu.tsx` | - Split available colours array into one or two rows based on count.<br>- When `count > 5`: `topCount = Math.ceil(count / 2)` and `bottomCount = Math.floor(count / 2)`.<br>- Render rows with maximum 5 colours per row. |

---

## 3. Step-by-Step Commit Breakdown

1. `docs: add implementation plan for issue #15`
2. `change the layout of the container so the number of the attempt and the evaluation result take equal space`
3. `the width of the current combination container should take up all the available space`
4. `define the size of each peg based on the length of the current combination (NOT the amount of available colours)`
5. `display a maximum of 5 colours on a single row`
6. `if the number of available colours is higher than 5, divide the pegs equally on two rows`
7. `if the number of available colours is odd, the top row should contain one more peg than the bottom one`

---

## 4. Verification & Testing

- **Typecheck:** `npx tsc --noEmit`
- **PR Submission:** Open PR using `gh pr create --base develop` targeting `develop`.
