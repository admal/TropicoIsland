class Camera {
    constructor(aspectRatio){
        this.aspectRatio = aspectRatio;
        this.rotation = mat4.create();
        this.transformationMatrix = mat4.create();
        this.aspectRatio = aspectRatio;

        this.rotationX = 0.0;
        this.rotationY = 0.0;

        this.xPos = 0.0;
        this.yPos = -200.0;
        this.zPos = 1000.0;
    }

    getMatrix() {
        if (this.rotationX >= 360 || this.rotationX <= -360)
            this.rotationX = 0;

        if (this.rotationY >= 360 || this.rotationY <= -360)
            this.rotationY = 0;

        var tmp = mat4.create();
        mat4.rotateX(tmp, tmp, degToRad(-this.rotationX));
        mat4.rotateY(tmp, tmp, degToRad(-this.rotationY));
        mat4.translate(tmp, tmp, [this.xPos, this.yPos, -this.zPos]);

        var viewMatrix = tmp;

        var zNear = 1;
        var zFar = 4000;
        var fieldOfViewRadians = degToRad(60);
        var projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfViewRadians, this.aspectRatio, zNear, zFar);
        var viewProjectionMatrix = mat4.create();
        mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

        return viewProjectionMatrix;
    }

    rotateX(deg) {
        this.rotationX += deg;

        if (this.rotationX >= 360 || this.rotationX <= -360)
            this.rotationX = 0;

        mat4.rotateX(this.rotation, this.rotation, degToRad(deg));
    }

    rotateY(deg) {
         this.rotationY += deg;

         if (this.rotationY >= 360 || this.rotationY <= -360)
             this.rotationY = 0;

        mat4.rotateY(this.rotation, this.rotation, degToRad(deg));
    }

    moveForward(step) {
        // this.xPos -= Math.sin(degToRad(this.rotationX)) * step;
        // this.zPos -= Math.cos(degToRad(this.rotationX)) * step;
        //
        // mat4.translate(this.translation, this.translation, [-this.xPos,0, -this.zPos]);
        this.zPos -= step;
        mat4.translate(this.transformationMatrix, this.transformationMatrix, [0,0,-step]);
    }

    moveRight(step) {
        this.yPos -= step;
        // mat4.translate(this.translation, this.translation, [-this.yPos,0,0]);
        mat4.translate(this.transformationMatrix, this.transformationMatrix, [step,0,0]);

    }

    toString() {
        var ret = "<br>Rotation X: " + this.rotationX + " deg";
        ret += "<br>Rotation Y: " + this.rotationY + " deg";
        ret += "<br>X: " + this.xPos + "; ";
        ret += "Y: " + this.yPos + "; ";
        ret += "Z: " + this.zPos + "; ";
        ret+="<br>" + this.getMatrix();
        return ret;
    }

}