function DirectionalLight(direction, color) {
    this.direction = direction;
    this.color = color;

    this._getLightVector = function () {
        var adjustedLD = vec3.create();
        vec3.normalize(adjustedLD, this.direction);
        vec3.scale(adjustedLD,adjustedLD, -1);
        return adjustedLD;
    };

    this.setUniforms = function (gl, program) {
        gl.uniform4fv(program.directionalLightColor, app.directionalLight.color);
        gl.uniform3fv(program.directionalLightDirection, this._getLightVector());
    }
}