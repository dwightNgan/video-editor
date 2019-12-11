import React, { Component }  from 'react';
import { boundary } from '../../utils';
import './index.scss'
const MAX_TIME = 10

export default class TimeLine extends Component{

    state = {
        indicatorPos: 0,
        scaleWidth: 0,
        scaleLeft: 0,
        scales: new Array(11).fill(1)
    }

    draggingTimeLine = false

    componentDidMount () {
        const { width, left } = this.refs.scale.getBoundingClientRect()
        this.setState({ scaleWidth: width, scaleLeft: left })
    }

    handleClick() {
        const { onPlay, onPause } = this.props
        switch (this.props.status) {
            case 'play':
                onPause();
                break;
            case 'pause':
                onPlay();
                break;
            case 'stop':
                onPlay();
                break;
            default:
        }
    }

    dragTimeLineBegin (e) {
        this.draggingTimeLine = true
        const { scaleLeft } = this.state
        this.setState({ indicatorPos: e.clientX - scaleLeft })
        this.props.onPause()
    }
    dragTimeLineMove (e) {
        if (!this.draggingTimeLine) {
            return
        }
        let { indicatorPos, scaleWidth } = this.state
        indicatorPos = boundary(indicatorPos += e.movementX, [0, scaleWidth])
        this.props.onSeek(indicatorPos / scaleWidth * MAX_TIME)
        this.setState({ indicatorPos })
    }
    dragTimeLineEnd () {
        if (!this.draggingTimeLine) {
            return
        }
        this.draggingTimeLine = false
        const { scaleWidth, indicatorPos } = this.state
        this.props.onSeek(indicatorPos / scaleWidth * MAX_TIME)
        this.setState({ indicatorPos })
    }

    updateTimeLine(time) {
        this.setState({ indicatorPos: time / MAX_TIME * this.state.scaleWidth })
    }

    render () {
        const { status } = this.props
        const actionMap = { pause: 'play', stop: 'play', play: 'pause' }
        const { indicatorPos, scales } = this.state
        return (
            <div className="time-line">
                <div className="time-line__left">
                    <div className="time-line__floor">
                        <div className="time-line__play" onClick={() => this.handleClick()}>{actionMap[status]}</div>
                    </div>
                    <div className="time-line__floor">
                        <div className="layer__name">fly.mp4</div>
                    </div>
                </div>
                <div className="time-line__right"                
                    onMouseDown={e => this.dragTimeLineBegin(e)}
                    onMouseMove={e => this.dragTimeLineMove(e)}
                    onMouseLeave={() => this.dragTimeLineEnd()}
                >
                    <div className="time-line__floor">
                        <div className="time-line__scale" ref="scale">
                            {scales.map((item, index) => <div key={`scale${index}`} >{index}</div>)}
                        </div>
                    </div>
                    <div className="time-line__floor">
                        <div className="layer__key-frame" ref="scale">
                            
                        </div>
                    </div>
                    <div
                        className="time-line__indicator"
                        onMouseUp={() => this.dragTimeLineEnd()}
                        style={{transform: `translate3d(${indicatorPos}px, 0, 0)`}}
                    />
                </div>
           </div>
        )
    }

}