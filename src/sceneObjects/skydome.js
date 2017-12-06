class Skydome extends MeshObject {

    constructor(initialPosition, color, mesh, material, texture) {
        super(initialPosition, color, mesh, material, texture);
        this.usesLighting = false;
        this.xOffset = 0.0;
        // this.yPos = 0.0;
        this.zOffset = 0.0;
        this.rotationY = 0.0;

        this.xPos = 0.0;
        this.yPos = 1900.0;
        this.zPos = -650.0;
        this.rotationY = 0.0;
    }
    //
    // moveWithCamera(camera) {
    //     // var tmp = mat4.create();
    //     // mat4.translate(tmp, tmp, [-this.xPos, this.yPos, -this.zPos]);
    //
    //     // this.transformationMatrix = tmp;
    //     // mat4.scale(this.transformationMatrix, this.transformationMatrix, [20,20,20]);
    //
    //     var cameraTranslation = vec3.create();
    //     mat4.getTranslation(cameraTranslation, camera.getMatrix().cameraMatrix);
    //
    //     this.transformationMatrix = mat4.create();
    //     mat4.translate(this.transformationMatrix, this.transformationMatrix, [-cameraTranslation[0], 1900, -cameraTranslation[2]]);
    //     mat4.scale(this.transformationMatrix, this.transformationMatrix, [15, 10, 15]);
    //
    //     var translation = vec3.create();
    //     mat4.getTranslation(translation, this.transformationMatrix);
    //     var xxx = translation;
    //     document.getElementById("sphere-info").innerText = xxx.toString();
    //     this.xOffset = 0;
    //     this.zOffset = 0;
    // }


    moveWithCamera() {
        var tmp = mat4.create();
        mat4.translate(tmp, tmp, [this.xPos, this.yPos, this.zPos]);

        this.transformationMatrix = tmp;
        mat4.scale(this.transformationMatrix, this.transformationMatrix, [15,10,15]);
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