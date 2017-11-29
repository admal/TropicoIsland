class PhongMaterial {
    constructor(color, diffuse, specular, reflectivity) {
        this.color = color;
        this.diffuse = diffuse;
        this.specular = specular;
        this.reflectivity = reflectivity;
    }

    setUniforms(gl, program, camera) {
        gl.uniform1f(program.diffuseUniform, this.diffuse);
        gl.uniform1f(program.specularUniform, this.specular);
        gl.uniform1f(program.reflectivityUniform, this.reflectivity);
        var translation = mat4.create();
        mat4.invert(translation, camera.getMatrix());
        var rotation = vec3.create();
        mat4.getRotation(rotation, translation);
        gl.uniform4fv(program.cameraInversedUniform, rotation);
    }
}