class MeshObject extends SceneObject {
    constructor(initialPosition, color, mesh) {
        super(initialPosition, color);
        this._mesh = mesh;
    }


    initBuffers(gl) {
        OBJ.initMeshBuffers( gl, this._mesh);

        this.normalBuffer = this._mesh.normalBuffer;
        this.vertexBuffer = this._mesh.vertexBuffer;
        this.indexBuffer = this._mesh.indexBuffer;
    }
}