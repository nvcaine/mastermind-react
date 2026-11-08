const LAST_PASSED_KEY: string = 'mastermind_last_passed_level';
const SELECTED_LEVEL_KEY: string = 'mastermind_selected_level';

// Safe memory storage fallback for SSR or environments without window.localStorage
const memoryStorage: Record<string, string> = {};

function safeGetItem(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            return window.localStorage.getItem(key);
        } catch {
            // Fallback to in-memory store
            return memoryStorage[key] ?? null;
        }
    }
    return memoryStorage[key] ?? null;
}

function safeSetItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            window.localStorage.setItem(key, value);
        } catch {
            // Fallback
        }
    }
    memoryStorage[key] = value;
}

/**
 * Returns the index of the highest level passed by the user (-1 if none passed).
 */
export function getLastPassedLevel(): number {
    const stored: string | null = safeGetItem(LAST_PASSED_KEY);

    if (stored === null || stored === undefined || stored === '') {
        return -1;
    }
    const parsed: number = parseInt(stored, 10);

    return Number.isNaN(parsed) ? -1 : parsed;
}

/**
 * Persists the passed level index if it is higher than the currently recorded progress.
 */
export function setLastPassedLevel(levelIndex: number): void {
    if (levelIndex < 0) {
        return;
    }

    const current: number = getLastPassedLevel();

    if (levelIndex > current) {
        safeSetItem(LAST_PASSED_KEY, levelIndex.toString());
    }
}

/**
 * Gets the user-selected or recommended resume level index.
 */
export function getSelectedLevel(totalLevels: number = 20): number {
    const selected: string | null = safeGetItem(SELECTED_LEVEL_KEY);

    if (selected !== null && selected !== '') {
        const parsed: number = parseInt(selected, 10);

        if (!Number.isNaN(parsed) && parsed >= 0 && parsed < totalLevels) {
            return parsed;
        }
    }

    const lastPassed: number = getLastPassedLevel();
    const nextLevel: number = lastPassed + 1;

    return Math.min(Math.max(0, nextLevel), totalLevels - 1);
}

/**
 * Sets the active level to play/replay.
 */
export function setSelectedLevel(levelIndex: number): void {
    if (levelIndex < 0) {
        return;
    }

    safeSetItem(SELECTED_LEVEL_KEY, levelIndex.toString());
}

/**
 * Checks whether a level index has been passed.
 */
export function isLevelPassed(levelIndex: number, lastPassed: number): boolean {
    return levelIndex <= lastPassed;
}

/**
 * Checks whether a level index is currently unlocked to play (passed OR next immediately available).
 */
export function isLevelUnlocked(
    levelIndex: number,
    lastPassed: number
): boolean {
    return levelIndex <= lastPassed + 1;
}
