class  SceneObject {
    constructor(initialTransformation,color){
        this.transformationMatrix = initialTransformation;
        this.color = color;
        this.normalData = [];
        this.vertexPositions = [];
        this.indexData = [];
        if (new.target === SceneObject) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    _initData(){
        //every sub class overrides this method for itself if needed
    }

    initBuffers(gl) {
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
    }

    draw(gl, app) {
        var m = mat4.create();
        mat4.multiply(m, app.camera.getMatrix(), this.transformationMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(app.program.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(app.program.normalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(app.program.matrixUniform, false, m);
        app.directionalLight.setUniforms(gl, app.program);
        app.pointLight.setUniforms(gl, app.program);
        // gl.uniform3fv(app.program.directionalLightDirection, app.directionalLight.getLightVector());
        // gl.uniform4fv(app.program.directionalLightColor, app.directionalLight.color);
        gl.uniform4fv(app.program.colorUniform, this.color.getColorVector());

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}