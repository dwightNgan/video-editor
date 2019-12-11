function rgb2hsv (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn
    rabs = r / 255
    gabs = g / 255
    babs = b / 255
    v = Math.max(rabs, gabs, babs)
    diff = v - Math.min(rabs, gabs, babs)
    diffc = c => (v - c) / 6 / diff + 1 / 2
    percentRoundFn = num => Math.round(num * 100) / 100
    if (diff === 0) {
        h = s = 0
    } else {
        s = diff / v
        rr = diffc(rabs)
        gg = diffc(gabs)
        bb = diffc(babs)

        if (rabs === v) {
            h = bb - gg
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb
        } else if (babs === v) {
            h = (2 / 3) + gg - rr
        }
        if (h < 0) {
            h += 1
        }else if (h > 1) {
            h -= 1
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    }
}

function hsv2rgb(h, s, v) {
    h /= 360
    s /= 100
    v /= 100
    let r, g, b, i, f, p, q, t
    i = Math.floor(h * 6)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break
        case 1: r = q; g = v; b = p; break
        case 2: r = p; g = v; b = t; break
        case 3: r = p; g = q; b = v; break
        case 4: r = t; g = p; b = v; break
        case 5: r = v; g = p; b = q; break
        default:;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

module.exports = {
    rgb2hsv,
    hsv2rgb
}