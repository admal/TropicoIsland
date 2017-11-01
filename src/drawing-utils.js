var drawingUtils = {
    drawObject: function (gl, app, model, translation) {
        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.vertexBuffer);
        gl.vertexAttribPointer( app.program.vertexPositionAttribute, model.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.normalBuffer);
        gl.vertexAttribPointer(app.program.normalAttribute, model.mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.colorBuffer);
        gl.vertexAttribPointer(app.program.colorAttribute, model.mesh.colorBuffer.itemSize, gl.FLOAT, false, 0,0);



        var m = mat4.create();
        mat4.multiply(m, app.camera.getMatrix(), translation);
        gl.uniformMatrix4fv(app.program.matrixUniform, false, m);

        var lightingDirection = [-0.25, -0.25, -1];
        var adjustedLD = vec3.create();
        vec3.normalize(adjustedLD, lightingDirection);
        // console.log("lightingDirection", lightingDirection);
        vec3.scale(adjustedLD,adjustedLD, -1);
        // console.log("adjustedLd", adjustedLD);
        gl.uniform3fv(app.program.reverseLightDirectionLocation, adjustedLD);

        //FAKE SHADER CALCS
        // var lights = [];
        // for(var i = 0; i < model.mesh.vertexNormals.length; i+=3){
        //     var tmp = model.mesh.vertexNormals;
        //     var vecN = [tmp[i], tmp[i+1],tmp[i+2]];
        //     var light = vec3.dot(vecN, adjustedLD);
        //     var xsad = vec4.create();
        //     vec4.scale(xsad, model.mesh.color, light);
        //     lights.push(xsad);
        // }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, model.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
};