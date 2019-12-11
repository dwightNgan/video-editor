const { rgb2hsv, hsv2rgb } =  require('utils');

class Drawer {
    constructor (cvs, offScreenCvs) {
        this.cvs = cvs
        this.ctx = cvs.getContext('2d')
        this.offScreenCvs = offScreenCvs
        this.offScreenCtx = this.offScreenCvs.getContext('2d')
        this.options = {
            matrix: [1, 0, 0, 1, 0, 0],
            hsv: [1, 1, 1],
            chroma: false
        }
        this.procedurers = [
            this.chromaKeyMatting,
            this.setHSV
        ]
    }
    setOptions (options) {
        this.options = { ...this.options, ...options }
    }

    chromaKeyMatting (data, i,  extendData = {}) {
        const { chroma } = this.options
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const { h, s, v } = rgb2hsv(r, g, b)
        extendData = { h, s, v }
        if (chroma && h > 100 && h <= 124 && s > 43 && v > 35) {
            data[i + 3] = 0
        }
        return extendData
    }

    setHSV (data, i, extendData) {
        if (data[i + 3] === 0) {
            return extendData
        }
        let { h, s, v } = extendData
        const [h1, s1, v1] = this.options.hsv
        if (h1 === 1 && s1 === 1 && v1 === 1) {
            return extendData
        }
        h *= h1
        s *= s1
        v *= v1
        const { r, g, b } = hsv2rgb(h, s, v)
        data[i] = r
        data[i + 1] = g
        data[i + 2] = b
        return extendData
    }

    execute (video) {
        const sw = video.width || video.videoWidth || video.naturalWidth
        const sh = video.height || video.videoHeight || video.naturalHeight
        const dw = this.cvs.width
        const dh = this.cvs.height
        const { ctx, offScreenCtx } = this
        const { matrix = [] } = this.options
        offScreenCtx.save()
        offScreenCtx.clearRect(0, 0, dw, dh)
        const m = matrix.slice()
        if (m[0] < 0) {
            m[4] += dw * -m[0]
        }
        if (m[3] < 0) {
            m[5] += dh * -m[3]
        }
        offScreenCtx.setTransform(...m)
        offScreenCtx.drawImage(video, 0, 0, sw, sh, 0, 0, dw, dh)
        offScreenCtx.setTransform(1, 0, 0, 1, 0, 0)
        offScreenCtx.restore()
        
        const imageData = offScreenCtx.getImageData(0, 0, dw, dh)
        const { data } =  imageData;
        let extendData = {}
        for (let i = 0; i < data.length; i += 4) {
            for (const process of this.procedurers) {
                extendData = process.call(this, data, i, extendData)
            }
        }
        ctx.putImageData(imageData, 0, 0)
    }
}


module.exports = { Drawer };
