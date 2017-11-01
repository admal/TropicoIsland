function Sphere(radius, initialPosition,color) {
    this.normalData = [];
    this.vertexPositions = [];
    this.indexData = [];
    this.radius = radius;
    this.color = color;
    this.initialPosition = initialPosition;
    this.translation = mat4.create();

    this._initData = function(){
        mat4.translate(this.translation, this.translation, this.initialPosition);
        var radius = this.radius;

        var latitudeBands = radius;
        var longitudeBands = radius;

        for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;

                this.normalData.push(x);
                this.normalData.push(y);
                this.normalData.push(z);

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
    };

    this.initBuffers = function(gl) {
        this._initData();

        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalData), gl.STATIC_DRAW);
        normalBuffer.itemSize = 3;
        normalBuffer.numItems = this.normalData.length / 3;

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexPositions), gl.STATIC_DRAW);
        vertexBuffer.itemSize = 3;
        vertexBuffer.numItems = this.vertexPositions.length / 3;

        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexData), gl.STATIC_DRAW);
        indexBuffer.itemSize = 1;
        indexBuffer.numItems = this.indexData.length;

        this.normalBuffer = normalBuffer;
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
    };

    this.draw = function(gl, app){
        var m = mat4.create();
        mat4.multiply(m, app.camera.getMatrix(), this.translation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(app.program.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(app.program.normalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);


        gl.uniform4fv(app.program.colorUniform, this.color);
        gl.uniformMatrix4fv(app.program.matrixUniform, false, m);
        // gl.uniform3fv(app.program.directionalLightDirection, app.directionalLight.getLightVector());
        app.directionalLight.setUniforms(gl, app.program);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    };

    this.toString = function () {
        var ret = "<br>Translation: " + this.translation + "<br> Initial position: " + this.initialPosition;
        return ret;
    }
}