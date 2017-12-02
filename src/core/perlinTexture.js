class PerlinNoiseTexture {
    // size = 100;
    // _data = [];
    // _gradient = [];
    // image = [];

    constructor(size) {
        this.size = size;
        this._gradient = [];
        this._data = [];
        this.image = [];
    }

    _initGradient() {
        for(var i = 0; i < this.size; i++) {
            this._gradient.push([]);
            for(var j = 0; j < this.size; j++) {
                this._gradient[i].push([]);
                this._gradient[i][j] = [];

                this._gradient[i][j][0] = 2 * Math.random() - 1;
                this._gradient[i][j][1] = 2 * Math.random() - 1;
            }
        }
    }

    _smoothstep(a0, a1, w) {
        return (1.0 - w) * a0 + w * a1;
    }

    _dotGridGradient(ix, iy, x, y) {
        var dx = x - ix;
        var dy = y - iy;

        return (dx * this._gradient[iy][ix][0] + dy * this._gradient[iy][ix][1]);
    }

    _perlin(x, y) {
        var x0 = Math.floor(x);
        var x1 = x0 + 1.0;
        var y0 = Math.floor(y);
        var y1 = y0 + 1.0;

        var sx = x - x0;
        var sy = y - y0;

        var n0 = this._dotGridGradient(x0, y0, x, y);
        var n1 = this._dotGridGradient(x1, y0, x, y);
        var ix0 = this._smoothstep(n0, n1, sx);

        n0 = this._dotGridGradient(x0, y1, x, y);
        n1 = this._dotGridGradient(x1, y1, x, y);
        var ix1 = this._smoothstep(n0, n1, sx);

        var value = this._smoothstep(ix0, ix1, sy);

        return value;
    }

    generateTexture() {
        this._initGradient();

        var plainData = [];
        for(var i = 0.0; i < this.size-1; i = i + 0.3) {
            this._data.push([]);
            for (var j = 0.0; j < this.size - 1; j = j + 0.4) {
                var perlin = this._perlin(i, j);
                var color = new RgbColor((1.0 + perlin) * 255, (1.0 + perlin) * 255, (1.0 + perlin) * 255);

                this._data[Math.floor(i)][Math.floor(j)] = color.getColorVector();
                plainData.push(color.r);
                plainData.push(color.g);
                plainData.push(color.b);
                plainData.push(1.0);
            }
        }

        this.image = new Uint8Array(plainData);

    }
}