import { JSX } from 'react';

export interface Props {
    disabled?: boolean;
}

export type PropComponent<T extends Props | {}> = (props: T) => JSX.Element;
