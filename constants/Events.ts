import { RefObject } from 'react';
import { NativeEventEmitter, ScrollView } from 'react-native';
import { SetData } from '@/constants/HexCodes';

export enum Events {
    ADD_COLOR = 'ADD_COLOR',
    SUBMIT_SET = 'SUBMIT_SET',
    FOUND_SET = 'FOUND_SET',
    RESET_SETS = 'RESET_SETS'
}

export type EventCallback = () => void;
export type ParamCallback<T> = (data: T) => void;

type Emitter = NativeEventEmitter;
type ViewRefObject = RefObject<ScrollView | null>;

export type OnAddColor = (
    colors: string[],
    setColors: ParamCallback<string[]>,
    maxColors: number,
    submitSet: ParamCallback<string[]>
) => ParamCallback<string>;
export type OnSubmitSet = (
    sets: SetData[],
    setSets: ParamCallback<SetData[]>,
    solution: string[]
) => ParamCallback<string[]>;
export type OnResetSets = (
    setSets: ParamCallback<SetData[]>
) => ParamCallback<number>;
export type OnSizeChange = (viewRef: ViewRefObject) => EventCallback;

export type OnClose = (
    emitter: Emitter,
    showModal: boolean,
    setShowModal: ParamCallback<boolean>,
    setSolution: ParamCallback<string[]>
) => ParamCallback<number>;
export type OnNextLevel = (
    levelIndex: number,
    setLevel: ParamCallback<number>,
    closeHandler: ParamCallback<number>
) => EventCallback;

export type AddColorSetup = (
    emitter: Emitter,
    onAddColor: ParamCallback<string>
) => EventCallback;
export type FoundSetup = (
    emitter: Emitter,
    sets: SetData[],
    maxColors: number
) => EventCallback;
export type ResetSetup = (
    emitter: Emitter,
    onReset: ParamCallback<number>
) => EventCallback;
export type WinSetup = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: ParamCallback<boolean>
) => EventCallback;
