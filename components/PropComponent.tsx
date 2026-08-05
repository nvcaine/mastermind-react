import React from 'react';

export interface Props {
    disabled?: boolean;
}

export type PropComponent<T extends Props> = (props: T) => React.JSX.Element;
