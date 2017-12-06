class Camera {
    constructor(aspectRatio){
        this.aspectRatio = aspectRatio;
        this.transformationMatrix = mat4.create();
        this.aspectRatio = aspectRatio;

        this.rotationX = 0.0; //in degrees
        this.rotationY = 0.0; //in degrees

        this.xPos = 0.0;
        this.yPos = -500.0;
        this.zPos = -650.0;
    }

    getMatrix() {
        if (this.rotationX >= 360 || this.rotationX <= -360)
            this.rotationX = 0;

        if (this.rotationY >= 360 || this.rotationY <= -360)
            this.rotationY = 0;

        var zNear = 1;
        var zFar = 10000;
        var fieldOfViewRadians = degToRad(60);
        var projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfViewRadians, this.aspectRatio, zNear, zFar);

        var cameraMatrix = mat4.create();
        mat4.rotateX(cameraMatrix, cameraMatrix, degToRad(this.rotationX));
        mat4.rotateY(cameraMatrix, cameraMatrix, degToRad(this.rotationY));
        mat4.translate(cameraMatrix, cameraMatrix, [this.xPos, this.yPos, this.zPos]);

        var viewMatrix = cameraMatrix;// mat4.create();
        // mat4.invert(viewMatrix, cameraMatrix);

        var viewProjectionMatrix = mat4.create();
        mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

        var worldMatrix = mat4.create();

        var worldViewProjectionMatrix = mat4.create();
        mat4.multiply(worldViewProjectionMatrix, viewProjectionMatrix, worldMatrix);
        var worldInverseMatrix = mat4.create();
        mat4.invert(worldInverseMatrix, worldMatrix);
        var worldInverseTransposeMatrix = mat4.create();
        mat4.transpose(worldInverseTransposeMatrix, worldInverseMatrix);

        return {
            cameraMatrix: cameraMatrix,
            worldMatrix: worldMatrix,
            worldViewProjectionMatrix: worldViewProjectionMatrix,
            worldInverseTransposeMatrix: worldInverseTransposeMatrix,
            viewProjectionMatrix: viewProjectionMatrix
        };
    }

    moveForward(step) {
        this.xPos -= Math.sin(degToRad(this.rotationY)) * step;
        this.zPos += Math.cos(degToRad(this.rotationY)) * step;
        this.yPos += Math.tan(degToRad(this.rotationX)) * step;
    }

    moveRight(step) {
        this.xPos -= Math.sin(degToRad(this.rotationY - 90)) * step;
        this.zPos += Math.cos(degToRad(this.rotationY - 90)) * step;
    }

    toString() {
        var ret = "<br>Rotation X: " + this.rotationX + " deg";
        ret += "<br>Rotation Y: " + this.rotationY + " deg";
        ret += "<br>X: " + this.xPos + "; ";
        ret += "Y: " + this.yPos + "; ";
        ret += "Z: " + this.zPos + "; ";
        return ret;
    }

}