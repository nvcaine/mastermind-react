export enum HexCodes {
    RED = '#FF4444',
    GREEN = '#44BB22',
    BLUE = '#0066FF',
    YELLOW = '#FFFF00',
    BEIGE = '#FF9933',
    TEAL = '#33CC99'
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
    const result: string[] = [];
    const colors: string[] = Object.values(HexCodes).slice(0, availableColors);

    for (let i: number = 0; i < maxColors; i++) {
        const index: number = Math.floor(Math.random() * colors.length);

        result.push(colors[index]);
        colors.splice(index, 1);
    }

    return result;
};

export const evaluate: Checker = (
    colors: string[],
    solution: string[]
): SetData => {
    let correct: number = 0;
    let offset: number = 0;

    for (let i: number = 0; i < colors.length; i++) {
        if (colors[i] === solution[i]) {
            correct++;
            continue;
        }

        for (let j: number = 0; j < solution.length; j++) {
            if (colors[i] === solution[j] && i !== j) {
                offset++;
            }
        }
    }

    console.log('Evaluated:', colors, correct, offset);

    return { colors, correct, offset };
};
