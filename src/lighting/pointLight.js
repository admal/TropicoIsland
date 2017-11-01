function PointLight(position, color) {
    this.position = position;
    this.color = color;

    this.setUniforms = function (gl, program) {
        gl.uniform3fv(program.pointLightPosition, this.position);
        gl.uniform4fv(program.pointLightColor, this.color);
    }
}