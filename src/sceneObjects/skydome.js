class Skydome extends Sphere {
    constructor(initialPosition, color, radius, material, texture) {
        super(initialPosition, color, radius, material, texture);
        this.usesLighting = false;

        this.xPos = 0.0;
        this.yPos = 10.0;
        this.zPos = -650.0;
        this.rotationY = 0.0;
        this.usesTexture = texture != null;
        this.usesHeightTexture = false;
    }

    moveWithCamera() {
        var tmp = mat4.create();
        mat4.translate(tmp, tmp, [-this.xPos, -this.yPos, -this.zPos]);

        this.transformationMatrix = tmp;
        mat4.scale(this.transformationMatrix, this.transformationMatrix, [20,20,20]);
        var translation = vec3.create();
        mat4.getTranslation(translation, this.transformationMatrix);
        var xxx = [-this.xPos, -this.yPos, -this.zPos];
        document.getElementById("sphere-info").innerText = xxx.toString();
    }


    moveForward(step) {
        this.xPos -= Math.sin(degToRad(this.rotationY)) * step;
        this.zPos += Math.cos(degToRad(this.rotationY)) * step;
    }

    moveRight(step) {
        this.xPos -= Math.sin(degToRad(this.rotationY - 90)) * step;
        this.zPos += Math.cos(degToRad(this.rotationY - 90)) * step;
    }
}