export interface GameLevel {
    availableColors: number;
    colorsLength: number;
}

export const GameLevels: GameLevel[] = [
    {
        availableColors: 4,
        colorsLength: 3
    },
    {
        availableColors: 4,
        colorsLength: 4
    },
    {
        availableColors: 5,
        colorsLength: 3
    },
    {
        availableColors: 5,
        colorsLength: 4
    }
];
