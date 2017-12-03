class Sphere extends SceneObject {
    constructor(initialPosition, color, radius, material, texture){
        super(initialPosition, color, material);
        this.radius = radius;
        // this.usesTexture = texture != null;
        this.usesHeightTexture = texture != null;
        this.texture = texture
    }

    _initData(){
        var radius = this.radius;

        var latitudeBands = radius;
        var longitudeBands = radius;

        for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                var u = 1 - (longNumber / longitudeBands);
                var v = 1 - (latNumber / latitudeBands);

                this.normalData.push(x);
                this.normalData.push(y);
                this.normalData.push(z);
                this.textureData.push(u);
                this.textureData.push(v);
                this.vertexPositions.push(radius * x);
                this.vertexPositions.push(radius * y);
                this.vertexPositions.push(radius * z);
            }
        }

        for (latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (longNumber = 0; longNumber < longitudeBands; longNumber++) {
                var first = (latNumber * (longitudeBands + 1)) + longNumber;
                var second = first + longitudeBands + 1;
                this.indexData.push(first);
                this.indexData.push(second);
                this.indexData.push(first + 1);

                this.indexData.push(second);
                this.indexData.push(second + 1);
                this.indexData.push(first + 1);
            }
        }

        console.log("indexdata", this.indexData.length);
    };

    initBuffers(gl) {
        super.initBuffers(gl);

        if(this.usesHeightTexture) {
            console.log("texturedata", this.textureData.length);
            console.log("textureSize", this.texture._data.length * this.texture._data[0].length );

            var textureBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureData), gl.STATIC_DRAW);
            textureBuffer.itemSize = 2;
            textureBuffer.numItems = this.textureData.length / 2;
            this.textureBuffer = textureBuffer;

            var texture = gl.createTexture();
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.texture.size - 1, this.texture.size - 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.texture.image);
            // gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            this.glTexture = texture;
        }
    }
}