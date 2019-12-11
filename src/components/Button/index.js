import React from 'react';
import { genClassName } from '../../utils';

export default function (props) {
    const { active, children, ...otherProps } = props
    return (
        <button className={genClassName({ active })} {...otherProps} >{children}</button>
    )
}