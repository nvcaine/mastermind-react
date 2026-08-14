export enum HexCodes {
    RED = '#FF4444',
    GREEN = '#44BB22',
    BLUE = '#0066FF',
    YELLOW = '#FFFF00',
    BEIGE = '#FF9933',
    TEAL = '#33CC99'
}

type Shuffler = (maxColors: number, availableColors: number) => string[];

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
