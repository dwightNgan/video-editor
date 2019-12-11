import { rgb2hsv, hsv2rgb } from 'utils';

export { rgb2hsv, hsv2rgb }

export function genClassName (classnames) {
    if (Array.isArray(classnames)) {
        return classnames.filter(name => name).join(' ')
    }
    if (typeof classnames === 'object') {
        return Object.keys(classnames).filter(key => classnames[key]).join(' ')
    }
    return ''
}


export function deg (d) {
    return d * Math.PI / 180
}

export function boundary (val, bound) {
    if (val < bound[0]) {
        val = bound[0]
    }
    if (val > bound[1]) {
        val = bound[1]
    }
    return val
}
