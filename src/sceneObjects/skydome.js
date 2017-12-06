class Skydome extends MeshObject {

    constructor(initialPosition, color, mesh, material, texture) {
        super(initialPosition, color, mesh, material, texture);
        this.usesLighting = false;
        this.rotationY = 0.0;

        this.xPos = 0.0;
        this.yPos = 2800.0;
        this.zPos = -650.0;
        this.rotationY = 0.0;
    }


    moveWithCamera() {
        var tmp = mat4.create();
        mat4.translate(tmp, tmp, [-this.xPos, this.yPos, -this.zPos]);
        mat4.scale(tmp, tmp, [20,15,20]);

        this.transformationMatrix = tmp;
        var translation = vec3.create();
        mat4.getTranslation(translation, this.transformationMatrix);
        var xxx = [-this.xPos, this.yPos, -this.zPos];
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