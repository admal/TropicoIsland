class PointLight {
    constructor(position, color) {
        this.position = position;
        this.color = color;
    }

    setUniforms(gl, program) {
        gl.uniform3fv(program.pointLightPosition, this.position);
        gl.uniform4fv(program.pointLightColor, this.color.getColorVector());
    }
}