const isDrawable = state => ({
    setColor: function(color) {
        this.color = color;
    },
    setTranslation: function (translation) {
        this.transformationMatrix = translation;
    },
    draw: function(gl, app) {
        var m = mat4.create();
        mat4.multiply(m, app.camera.getMatrix(), translation);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.vertexBuffer);
        gl.vertexAttribPointer( app.program.vertexPositionAttribute, model.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.normalBuffer);
        gl.vertexAttribPointer(app.program.normalAttribute, model.mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(app.program.matrixUniform, false, m);
        app.directionalLight.setUniforms(gl, app.program);
        app.pointLight.setUniforms(gl, app.program);
        gl.uniform4fv(app.program.colorUniform, color);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, model.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }.bind(state)
});

const create3dObject = (initPosition, color) => {
    var object = {};
    Object.assign(
        object,
        isDrawable(object)
    );
    object.setColor(color);
    object.setTranslation(initPosition);
    return object;
};


var drawingUtils = {
    drawObject: function (gl, app, model, translation, color) {
        var m = mat4.create();
        mat4.multiply(m, app.camera.getMatrix(), translation);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.vertexBuffer);
        gl.vertexAttribPointer( app.program.vertexPositionAttribute, model.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.normalBuffer);
        gl.vertexAttribPointer(app.program.normalAttribute, model.mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(app.program.matrixUniform, false, m);
        app.directionalLight.setUniforms(gl, app.program);
        app.pointLight.setUniforms(gl, app.program);
        gl.uniform4fv(app.program.colorUniform, color);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, model.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
};