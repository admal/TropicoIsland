class  SceneObject {
    constructor(initialTransformation, color, material){
        this.transformationMatrix = initialTransformation;
        this.color = color;
        this.normalData = [];
        this.vertexPositions = [];
        this.indexData = [];
        this.textureData = [];
        this.usesTexture = false;
        this.usesHeightTexture = false;
        this.material = material;
        this.usesLighting = true;
        this.texture = null;
        this.glTexture = null;

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


        var textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);

        if(this.usesTexture === false && this.usesHeightTexture === false) {
            this.textureData = new Array(this.indexData.length * 2);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureData), gl.STATIC_DRAW);
            textureBuffer.itemSize = 2;
            textureBuffer.numItems = this.textureData.length / 2;

            this.textureBuffer = textureBuffer;
        }

        this.normalBuffer = normalBuffer;
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
    }

    draw(gl, app) {
        // var m = mat4.create();
        var cameraRet = app.camera.getMatrix();
        // var worldViewProjectionMatrix = cameraRet.worldViewProjectionMatrix;
        // var worldInverseTransposeMatrix = cameraRet.worldInverseTransposeMatrix;
        var worldMatrix = cameraRet.worldMatrix;

        mat4.multiply(worldMatrix, worldMatrix, this.transformationMatrix);

        var viewProjectionMatrix = cameraRet.viewProjectionMatrix;

        var worldViewProjectionMatrix = mat4.create();
        mat4.multiply(worldViewProjectionMatrix, viewProjectionMatrix, worldMatrix);
        var worldInverseMatrix = mat4.create();
        mat4.invert(worldInverseMatrix, worldMatrix);
        var worldInverseTransposeMatrix = mat4.create();
        mat4.transpose(worldInverseTransposeMatrix, worldInverseMatrix);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(app.program.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(app.program.normalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(app.program.textureAttributem, this.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

        var usesTexture = this.usesTexture ? 1 : 0;
        var usesHeightTexture = this.usesHeightTexture ? 1 : 0;
        var usesLighting = this.usesLighting ? 1 : 0;
        var usesFog = app.useFog ? 1 : 0;

        if(this.usesTexture || this.usesHeightTexture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.glTexture);

            if(app.magnitudeNearestFilter) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            }
        }

        gl.uniform1i(app.program.usesTexture, usesTexture);
        gl.uniform1i(app.program.usesHeightTexture, usesHeightTexture);
        gl.uniform1i(app.program.usesLighting, usesLighting);
        gl.uniform1i(app.program.textureSampler, 0);
        gl.uniform1i(app.program.usesFog, usesFog);


        gl.uniformMatrix4fv(app.program.matrixUniform, false, worldViewProjectionMatrix);
        gl.uniformMatrix4fv(app.program.inversedTransposedWorldMatrix, false, worldInverseTransposeMatrix);

        var cameraPosition = vec3.create();
        mat4.getTranslation(cameraPosition, cameraRet.cameraMatrix);
        gl.uniform3fv(app.program.cameraPosition, cameraPosition);

        app.directionalLight.setUniforms(gl, app.program);
        app.pointLight.setUniforms(gl, app.program);
        this.material.setUniforms(gl, app.program, app.camera);
        // gl.uniform3fv(app.program.directionalLightDirection, app.directionalLight.getLightVector());
        // gl.uniform4fv(app.program.directionalLightColor, app.directionalLight.color);
        gl.uniform4fv(app.program.colorUniform, this.color.getColorVector());

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}