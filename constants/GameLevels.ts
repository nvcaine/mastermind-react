export const FIRST_LEVEL: number = 0;

export interface GameLevel {
    availableColors: number;
    colorsLength: number;
}

export const GameLevels: GameLevel[] = [
    {
        availableColors: 3,
        colorsLength: 3
    },
    {
        availableColors: 4,
        colorsLength: 3
    },
    {
        availableColors: 5,
        colorsLength: 3
    },
    {
        availableColors: 6,
        colorsLength: 3
    },
    {
        availableColors: 7,
        colorsLength: 3
    }
];
