export enum HexCodes {
    RED = '#FF4400',
    GREEN = '#22DD00',
    BLUE = '#0066FF',
    YELLOW = '#FFFF00',
    BEIGE = '#FF9933',
    TEAL = '#33CC99'
}

type Shuffler = (maxColors: number, availableColors: number) => string[];
export type ColorCallback = (color: string) => void;
export type SetCallback = (colorSet: string[]) => void;

export const getRandomColors: Shuffler = (
    maxColors: number,
    availableColors: number
): string[] => {
    const result: string[] = [];
    const colors: string[] = Object.values(HexCodes).slice(0, availableColors);

    for (let i: number = 0; i < maxColors; i++) {
        let index: number = Math.floor(Math.random() * colors.length);
        let currentIndex: number = result.indexOf(colors[index]);

        while (currentIndex !== -1) {
            index = Math.floor(Math.random() * colors.length);
            currentIndex = result.indexOf(colors[index]);
        }

        result.push(colors[index]);
    }

    return result;
};
