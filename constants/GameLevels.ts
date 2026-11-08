export const FIRST_LEVEL: number = 0;

export interface GameLevel {
    availableColors: number;
    colorsLength: number;
    tierNumber?: number;
    levelInTier?: number;
}

export interface GameTier {
    tierNumber: number;
    title: string;
    colorsLength: number;
    levels: GameLevel[];
}

export const GameTiers: GameTier[] = [
    {
        tierNumber: 1,
        title: 'Tier 1 • Novice',
        colorsLength: 3,
        levels: [
            {
                availableColors: 3,
                colorsLength: 3,
                tierNumber: 1,
                levelInTier: 1
            },
            {
                availableColors: 4,
                colorsLength: 3,
                tierNumber: 1,
                levelInTier: 2
            },
            {
                availableColors: 5,
                colorsLength: 3,
                tierNumber: 1,
                levelInTier: 3
            },
            {
                availableColors: 6,
                colorsLength: 3,
                tierNumber: 1,
                levelInTier: 4
            },
            {
                availableColors: 7,
                colorsLength: 3,
                tierNumber: 1,
                levelInTier: 5
            }
        ]
    },
    {
        tierNumber: 2,
        title: 'Tier 2 • Apprentice',
        colorsLength: 4,
        levels: [
            {
                availableColors: 4,
                colorsLength: 4,
                tierNumber: 2,
                levelInTier: 1
            },
            {
                availableColors: 5,
                colorsLength: 4,
                tierNumber: 2,
                levelInTier: 2
            },
            {
                availableColors: 6,
                colorsLength: 4,
                tierNumber: 2,
                levelInTier: 3
            },
            {
                availableColors: 7,
                colorsLength: 4,
                tierNumber: 2,
                levelInTier: 4
            },
            {
                availableColors: 8,
                colorsLength: 4,
                tierNumber: 2,
                levelInTier: 5
            }
        ]
    },
    {
        tierNumber: 3,
        title: 'Tier 3 • Expert',
        colorsLength: 5,
        levels: [
            {
                availableColors: 5,
                colorsLength: 5,
                tierNumber: 3,
                levelInTier: 1
            },
            {
                availableColors: 6,
                colorsLength: 5,
                tierNumber: 3,
                levelInTier: 2
            },
            {
                availableColors: 7,
                colorsLength: 5,
                tierNumber: 3,
                levelInTier: 3
            },
            {
                availableColors: 8,
                colorsLength: 5,
                tierNumber: 3,
                levelInTier: 4
            },
            {
                availableColors: 9,
                colorsLength: 5,
                tierNumber: 3,
                levelInTier: 5
            }
        ]
    },
    {
        tierNumber: 4,
        title: 'Tier 4 • Master',
        colorsLength: 6,
        levels: [
            {
                availableColors: 6,
                colorsLength: 6,
                tierNumber: 4,
                levelInTier: 1
            },
            {
                availableColors: 7,
                colorsLength: 6,
                tierNumber: 4,
                levelInTier: 2
            },
            {
                availableColors: 8,
                colorsLength: 6,
                tierNumber: 4,
                levelInTier: 3
            },
            {
                availableColors: 9,
                colorsLength: 6,
                tierNumber: 4,
                levelInTier: 4
            },
            {
                availableColors: 10,
                colorsLength: 6,
                tierNumber: 4,
                levelInTier: 5
            }
        ]
    }
];

// Flattened list of all 20 levels for 1-to-1 backwards compatibility
export const GameLevels: GameLevel[] = GameTiers.flatMap((tier) => tier.levels);

export function getTierInfo(levelIndex: number): {
    tierNumber: number;
    tierTitle: string;
    levelInTier: number;
    colorsLength: number;
} {
    const safeIndex = Math.max(0, Math.min(levelIndex, GameLevels.length - 1));
    const tierIndex = Math.floor(safeIndex / 5);
    const tier = GameTiers[tierIndex] ?? GameTiers[0];
    const levelInTier = (safeIndex % 5) + 1;

    return {
        tierNumber: tier.tierNumber,
        tierTitle: tier.title,
        levelInTier,
        colorsLength: tier.colorsLength
    };
}
