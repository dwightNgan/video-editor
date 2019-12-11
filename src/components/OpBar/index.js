import React, { Component }  from 'react';
import './index.scss'
import { genClassName, deg } from '../../utils/index';
import Button from '../Button/index';

const HSV = ['hue', 'saturation', 'brightness']

export default class OpBar extends Component{

    state = {
        activeTabs: [0, 0, 0, 0, 0],
        rotateDeg: 0,
        options: {
            // scaleX, skewX, skewY, scaleY, translateX, translateY
            matrix: [1, 0, 0, 1, 0, 0],
            hsv: [1, 1, 1],
            chroma: false
        }
    }

    mutiply ([a, b, c, d, e, f]) {
        const m = this.state.options.matrix
        return [
            m[0] * a + m[2] * c,
            m[1] * a + m[3] * c,
            m[0] * b + m[2] * d,
            m[1] * b + m[3] * d,
            m[0] * e + m[2] * f + m[4],
            m[1] * e + m[3] * f + m[5],
        ]
    }

    genItemClass(index) {
        const { activeTabs } = this.state
        return genClassName([
            'op-bar__item',
            activeTabs[index] && 'op-bar__item--ative'
        ])
    }

    setTabs (index) {
        const { activeTabs } = this.state
        activeTabs[index] = 1 - activeTabs[index]
        this.setState({ activeTabs })
    }

    setOptions (key, value) {
        const { options } = this.state
        const { onChange } = this.props
        options[key] = value
        onChange(options)
        this.setState({ options })
    }

    setHSV (e, index) {
        const { hsv } = this.state.options
        hsv[index] = +e.target.value
        this.setOptions('hsv', hsv)
    }

    filpVertically () {
        this.setOptions('matrix', this.mutiply([-1, 0, 0, 1, 0, 0]))
    }
    filpHorizontally () {
        this.setOptions('matrix', this.mutiply([1, 0, 0, -1, 0, 0]))
    }
    rotate (d) {
        const diff = this.state.rotateDeg - d
        const cos = Math.cos(deg(diff))
        const sin = Math.sin(deg(diff))
        this.setState({ rotateDeg: d })
        this.setOptions('matrix', this.mutiply([cos, sin, -sin, cos, 0, 0]))
    }
    toggleChroma () {
        const { chroma } = this.state.options
        this.setOptions('chroma', !chroma)
    }
    render () {
        const { matrix, hsv, chroma } = this.state.options
        const { rotateDeg } = this.state
        return (
           <div className="op-bar">
                <div className={this.genItemClass(0)} >
                    <div className='op-bar__item__title' onClick={() => this.setTabs(0)}>Trim</div>
                    <div className='op-bar__item__main'>
                        main
                    </div>
                </div>
                <div className={this.genItemClass(1)} >
                    <div className='op-bar__item__title' onClick={() => this.setTabs(1)}>chroma key matting</div>
                    <div className='op-bar__item__main'>
                        <div>
                            <Button active={chroma} onClick={() => this.toggleChroma()}>matting</Button>
                        </div>
                    </div>
                </div>
                <div className={this.genItemClass(2)} >
                    <div className='op-bar__item__title' onClick={() => this.setTabs(2)}>Adjust</div>
                    <div className='op-bar__item__main'>
                        { hsv.map((item, index) => (
                            <div key={`hsv${index}`}>
                                {HSV[index]} <input type="range" min={0} max={2} value={item} step={0.1} onChange={(e) => this.setHSV(e, index)} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={this.genItemClass(3)}>
                    <div className='op-bar__item__title' onClick={() => this.setTabs(3)}>Rotate</div>
                    <div className='op-bar__item__main'>
                        <div>
                            <input type="number" value={rotateDeg} onChange={e => this.rotate(+e.target.value)}  />
                        </div>
                    </div>
                </div>
                <div className={this.genItemClass(4)} >
                    <div className='op-bar__item__title' onClick={() => this.setTabs(4)}>Flip</div>
                    <div className='op-bar__item__main'>
                        <div>
                            <Button active={matrix[0] < 0} onClick={() => this.filpVertically()}>vertical</Button>
                            <Button active={matrix[3] < 0} onClick={() => this.filpHorizontally()}>horizontal</Button>
                        </div>
                    </div>
                </div>
           </div>
        )
    }

}