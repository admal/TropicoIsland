var drawingUtils = {
    drawObject: function (gl, app, model, translation, color) {
        var m = mat4.create();
        mat4.multiply(m, app.camera.getMatrix(), translation);

        var lightingDirection = [-0.25, -0.25, -1];
        var adjustedLD = vec3.create();
        vec3.normalize(adjustedLD, lightingDirection);
        vec3.scale(adjustedLD,adjustedLD, -1);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.vertexBuffer);
        gl.vertexAttribPointer( app.program.vertexPositionAttribute, model.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.normalBuffer);
        gl.vertexAttribPointer(app.program.normalAttribute, model.mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(app.program.matrixUniform, false, m);
        gl.uniform3fv(app.program.reverseLightDirectionUniform, adjustedLD);
        gl.uniform4fv(app.program.colorUniform, color);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, model.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
};