class MeshObject extends SceneObject {
    constructor(initialPosition, color, mesh, material, texture) {
        super(initialPosition, color, material);
        this._mesh = mesh;
        this.usesTexture = texture != null;
        this.texture = texture;
    }


    initBuffers(gl) {
        OBJ.initMeshBuffers( gl, this._mesh);

        this.normalBuffer = this._mesh.normalBuffer;
        this.vertexBuffer = this._mesh.vertexBuffer;
        this.indexBuffer = this._mesh.indexBuffer;

        if(this.usesTexture && app.loaded) {
            this.textureBuffer = this._mesh.textureBuffer;

            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.texture.image);
            gl.generateMipmap(gl.TEXTURE_2D);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, app.mipMapLevels);
            this.glTexture = texture;
        } else {
            this.textureData = new Array(this.indexBuffer.numItems * 2);
            var textureBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureData), gl.STATIC_DRAW);
            textureBuffer.itemSize = 2;
            textureBuffer.numItems = this.textureData.length / 2;
            this.textureBuffer = textureBuffer;
        }
    }
}