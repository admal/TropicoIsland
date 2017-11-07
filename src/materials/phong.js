class PhongMaterial {
    constructor(color, diffuse, specular, reflectivity) {
        this.color = color;
        this.diffuse = diffuse;
        this.specular = specular;
        this.reflectivity = reflectivity;
    }

    setUniforms(gl, program, camera) {
        gl.uniformfv(program.diffuseUniform, this.diffuse);
        gl.uniformfv(program.specularUniform, this.specular);
        gl.uniformfv(program.reflectivityUniform, this.reflectivity);
        var translation = vec3.create();
        mat4.getTranslation(translation,  camera.getMatrix());
        gl.uniform4fv(program.cameraUniform, translation);
    }
}