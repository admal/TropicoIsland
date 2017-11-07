class DirectionalLight {
    constructor(direction, color) {
        this.direction = direction;
        this.color = color;
    }

    _getLightVector() {
        var adjustedLD = vec3.create();
        vec3.normalize(adjustedLD, this.direction);
        vec3.scale(adjustedLD,adjustedLD, -1);
        return adjustedLD;
    };

    setUniforms(gl, program) {
        gl.uniform4fv(program.directionalLightColor, app.directionalLight.color.getColorVector());
        gl.uniform3fv(program.directionalLightDirection, this._getLightVector());
    }
}