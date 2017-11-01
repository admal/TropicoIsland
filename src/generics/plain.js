function Plane(initialPosition, color, size) {
    this.normalData = [];
    this.vertexPositions = [];
    this.indexData = [];
    this.color = color;
    this.size = size;
    this.initialPosition = initialPosition;
    this.translation = mat4.create();

    this._initData = function () {
        mat4.translate(this.translation, this.translation, this.initialPosition);

        var width = this.size[0];
        var height = this.size[1];
        var x1 = -width/2;
        var x2 = width/2;
        var y1 = -height/2;
        var y2 = height/2;
        var z = 0;

        this.vertexPositions = [
            y1,z, x1,
            y1,z, x2,
            y2,z,  x1,
            y2,z,  x1,
            y1,z,  x2,
            y2,z,  x2,
        ];

        // x1,z, y1,
        //     x2,z,y1,
        //     x1,z,  y2,
        //     x1,z,  y2,
        //     x2,z, y1,
        //     x2,z,  y2,

        this.indexData = [
            0, 1, 2, 3, 4, 5
        ];
    };

    this.initBuffers = function (gl) {
        this._initData();

        // var normalBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalData), gl.STATIC_DRAW);
        // normalBuffer.itemSize = 3;
        // normalBuffer.numItems = this.normalData.length / 3;

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
        for (var i = 0; i < this.indexData.length; i++) {
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

        // this.normalBuffer = normalBuffer;
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
        this.colorBuffer = colorBuffer;
    };

    this.draw = function (gl, app) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(app.program.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(app.program.colorAttribute, this.colorBuffer.itemSize, gl.FLOAT, false, 0,0);
        //
        // gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        // gl.vertexAttribPointer(app.program.normalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // mat4.multiply(this.translation, this.translation, app.camera.getMatrix());
        var m = mat4.create();
        mat4.multiply(m, app.camera.getMatrix(), this.translation);
        // mat4.translate(this.translation, app.camera.getMatrix(), this.translation);
        // mat4.rotate(this.translation, app.camera.getMatrix(), this.translation);
        gl.uniformMatrix4fv(app.program.matrixUniform, false, m);
        gl.uniform3fv(app.program.reverseLightDirectionLocation,  [-0.25, -0.25, -1]);
        // setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}