export enum HexCodes {
    RED = '#EF4444',
    GREEN = '#50B941',
    BLUE = '#3B82F6',
    YELLOW = '#C59E0B',
    BEIGE = '#F97316',
    TEAL = '#14B8A6',
    PURPLE = '#8B5CF6',
    BROWN = '#944309',
    WHITE = '#E2E8F0',
    BLACK = '#334155'
}

export interface SetData {
    colors: string[];
    correct: number; // right color, right position
    offset: number; // right color, wrong position
}

type Shuffler = (maxColors: number, availableColors: number) => string[];
type Checker = (colors: string[], solution: string[]) => SetData;

export const getRandomColors: Shuffler = (
    maxColors: number,
    availableColors: number
): string[] => {
    if (!maxColors || maxColors <= 0) return [];
    if (!availableColors || availableColors <= 0) return [];

    const result: string[] = [];
    const colors: string[] = Object.values(HexCodes).slice(0, availableColors);

    for (let i = 0; i < maxColors; i++) {
        if (colors.length === 0) break;
        const index = Math.floor(Math.random() * colors.length);
        result.push(colors[index]);
        colors.splice(index, 1);
    }

    return result;
};

export const evaluate: Checker = (
    colors: string[],
    solution: string[]
): SetData => {
    if (!colors || !solution) {
        return { colors: colors || [], correct: 0, offset: 0 };
    }

    let correct = 0;
    let offset = 0;

    for (let i = 0; i < colors.length; i++) {
        if (colors[i] === solution[i]) {
            correct++;
            continue;
        }

        for (let j = 0; j < solution.length; j++) {
            if (colors[i] === solution[j] && i !== j) {
                offset++;
            }
        }
    }

    return { colors, correct, offset };
};
