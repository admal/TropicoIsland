class Terrain extends SceneObject {

    constructor(initialTransformation, color, material, texture) {
        super(initialTransformation, color, material);

        this.usesTexture = texture != null;
        this.texture = texture;
    }

    generateTerrain() {

    }
}