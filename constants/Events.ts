export enum Events {
    ADD_COLOR = 'ADD_COLOR',
    SUBMIT_SET = 'SUBMIT_SET',
    FOUND_SET = 'FOUND_SET',
    RESET_SETS = 'RESET_SETS'
}

export type EventCallback = () => void;
export type EventParamCallback<T> = (data: T) => void;
