import React, { Component }  from 'react';
import './index.scss'
import TimeLine from '../TimeLine/index';
import Preview from '../Preview/index';
import OpBar from '../OpBar/index';

export default class Editor extends Component{

    state = {
        previewStatus: 'stop',
    }

    setStatus (status) {
        this.refs.preview[status]()
        this.setState({ previewStatus: status })
    }

    seekVideo (time) {
        this.refs.preview.seekVideo(time)
    }

    onVideoPlaying (time) {
        this.refs.timeLine.updateTimeLine(time)
    }

    render () {
        const { previewStatus } = this.state
        return (
            <div className="editor">
                <div className="editor-upper">
                    <Preview
                        ref='preview'
                        onPlaying={(time) => this.onVideoPlaying(time)}
                    />
                    <OpBar onChange={options => this.refs.preview.setOptions(options)} />
                </div>
                <div className="editor-lower">
                    <TimeLine
                        ref="timeLine"
                        status={previewStatus}
                        onPlay={() => this.setStatus('play')}
                        onPause={() => this.setStatus('pause')}
                        onStop={() => this.setStatus('stop')}
                        onSeek={time => this.seekVideo(time)}
                    />
                </div>
            </div>
        )
    }

}