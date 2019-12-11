import React, { Component }  from 'react';
import './index.scss'
// import videoSrc from '../../assets/clipped-video.mp4';
import videoSrc from '../../assets/fly.mp4';
import { Drawer } from 'draw-frames';

const offScreenCvs = document.createElement('canvas')
const PREVIEW_WIDTH = 960

export default class Preview extends Component{

    state = {
        videoWidth: 0,
        videoHeight: 0,
        cvsWidth: 0,
        cvsHeight: 0,
        seeking: false
    }

    play () {
        this.refs.video.play()
    }
    pause () {
        this.refs.video.pause()
    }

    onPlay () {
        const video = this.refs.video
        if (video.paused || video.ended) {
            return
        }
        this.drawFrame()
        this.props.onPlaying(video.currentTime)
        requestAnimationFrame(() => this.onPlay())
    }
    
    onPause () {}

    setOptions (options) {
        this.drawer.setOptions(options)
        this.drawFrame()
    }
    
    drawFrame () {
        if (this.state.seeking) {
            this.setState({ seeking: false })
        }
        this.drawer.execute(this.refs.video)
    }

    componentDidMount () {
        this.ctx = this.refs.cvs.getContext('2d')
        this.drawer = new Drawer(this.refs.cvs, offScreenCvs)
    }

    loadVideo () {
        this.initCvsSize()
        this.seekVideo(0)
    }

    seekVideo (time) {
        if (this.state.seeking) {
            return
        }
        const { video } = this.refs
        video.currentTime = time
    }

    initCvsSize () {
        const { videoWidth, videoHeight } = this.refs.video
        let cvsWidth = videoWidth
        let cvsHeight = videoHeight
        if (videoWidth > videoHeight) {
            if (videoWidth > PREVIEW_WIDTH) {
                cvsWidth = PREVIEW_WIDTH
                cvsHeight = videoHeight * PREVIEW_WIDTH / videoWidth
            }
        } else {
            if (videoHeight > PREVIEW_WIDTH) {
                cvsHeight = PREVIEW_WIDTH
                cvsWidth = videoWidth * PREVIEW_WIDTH / videoHeight
            }
        }
        
        offScreenCvs.width = cvsWidth
        offScreenCvs.height = cvsHeight
        this.setState({ cvsWidth, cvsHeight, videoWidth, videoHeight })
    }

    render () {
        const {  cvsWidth, cvsHeight } = this.state
        return (
            <div className="preview" ref="preview">
                <canvas
                    ref="cvs"
                    width={cvsWidth}
                    height={cvsHeight}
                />
                <video
                    ref="video"
                    onPlay={() => this.onPlay()}
                    onPause={() => this.onPause()}
                    onLoadedMetadata={() => this.loadVideo()}
                    onSeeked={() => this.drawFrame()}
                    onSeeking={() => this.setState({ seeking: true })}
                    hidden
                    loop
                    src={videoSrc}
                />
            </div>
        )
    }

}