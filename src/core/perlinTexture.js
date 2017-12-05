class PerlinNoiseTexture {
    // size = 100;
    // _data = [];
    // _gradient = [];
    // image = [];

    constructor(size) {
        this.size = size;
        this._gradient = [];
        this._data = [];
        this._colorData = [];
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

    zeros(dimensions) {
        var array = [];

        for (var i = 0; i < dimensions[0]; ++i) {
            array.push(dimensions.length == 1 ? 0 : this.zeros(dimensions.slice(1)));
        }

        return array;
    }

    generateTexture() {
        this._initGradient();

        var octaves = 10;
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;
        var frequence = 0.9;
        var amplitude = 2.0;
        var persistance = 0.25;
        var width = this.size;
        var height = this.size;

        this._data = this.zeros([width, height]);

        for(var octave = 0; octave < octaves; octave++) {
            for(var offset = 0; offset < this.size * this.size; offset++) {
                var i = Math.floor(offset / width);
                var j = offset % width;

                var noise = this._perlin(
                    i * frequence / width,
                    j * frequence / height
                );

                noise = this._data[i][j] += noise * amplitude;

                min = Math.min(min, noise);
                max = Math.max(max, noise);
            }

            frequence *= 2;
            amplitude /= 2;
        }

        var plainData = [];
        for(var i = 0; i < this._data.length; i++) {
            this._colorData.push([]);
            for(var j = 0; j < this._data[0].length; j++) {
                var normalized = (this._data[i][j] - min) / (max - min);

                this._colorData[i].push([]);
                this._colorData[i][j] = [normalized, normalized, normalized, normalized];
                var color = normalized * 255;
                plainData.push(color);
                plainData.push(color);
                plainData.push(color);
                plainData.push(255);

            }
        }
        //
        // var plainData = [];
        // for(var i = 0.0; i < this.size-1; i = i + 0.3) {
        //     this._data.push([]);
        //     for (var j = 0.0; j < this.size - 1; j = j + 0.4) {
        //         var perlin = this._perlin(i, j);
        //         var color = new RgbColor((1.0 + perlin) * 255, (1.0 + perlin) * 255, (1.0 + perlin) * 255);
        //
        //         this._data[Math.floor(i)][Math.floor(j)] = color.getColorVector();
        //         plainData.push(color.r);
        //         plainData.push(color.g);
        //         plainData.push(color.b);
        //         plainData.push(1.0);
        //     }
        // }

        this.image = new Uint8Array(plainData);

    }
}