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

        var colors = [];
        for(var i = 0; i < this.indexData.length; i++) {
            colors.push(this.color[0]);
            colors.push(this.color[1]);
            colors.push(this.color[2]);
            colors.push(this.color[3]);
        }

        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        colorBuffer.itemSize = 4;
        indexBuffer.numItems = colors.length / 4;

        this.normalBuffer = normalBuffer;
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
        this.colorBuffer = colorBuffer;
    };

    this.draw = function(gl, app){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(app.program.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(app.program.colorAttribute, this.colorBuffer.itemSize, gl.FLOAT, false, 0,0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(app.program.normalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);



        // mat4.multiply(this.translation, this.translation, app.camera.getMatrix());
        var m = mat4.create();
        mat4.multiply(m, app.camera.getMatrix(), this.translation);
        // mat4.translate(this.translation, app.camera.getMatrix(), this.translation);
        // mat4.rotate(this.translation, app.camera.getMatrix(), this.translation);
        gl.uniformMatrix4fv(app.program.matrixUniform, false, m);   // set the light direction.

        var lightingDirection = [-0.25, -0.25, -1];
        var adjustedLD = vec3.create();
        vec3.normalize(lightingDirection, adjustedLD);
        vec3.scale(adjustedLD, -1);
        gl.uniform3fv(app.program.reverseLightDirectionLocation, adjustedLD);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    };

    this.toString = function () {
        var ret = "<br>Translation: " + this.translation + "<br> Initial position: " + this.initialPosition;
        return ret;
    }
}