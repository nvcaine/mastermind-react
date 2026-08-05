import React from 'react';

export interface Props {
    disabled?: boolean;
}

export type PropComponent<T extends Props | undefined> = (props: T) => React.JSX.Element;
