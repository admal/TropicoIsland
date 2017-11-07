var app = {
    program: null,
    objects: [],
    camera: null,
    meshes: [],
    models: [],
    directionalLight: null,
    pointLight: null,
    gl: null
};

function initWebGl(meshes) {
    var canvas = document.getElementById('main-canvas');
    var gl = canvas.getContext('webgl');

    if(!gl){
        console.error('WebGL is not supported by current browser!');
    }
    app.gl = gl;
    app.camera = new Camera(gl.canvas.clientWidth / gl.canvas.clientHeight);

    var program = webglUtils.createProgramFromScripts(gl, ['x-shader', 'x-fragment-shader']);
    gl.useProgram(program);
    program.vertexPositionAttribute = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(program.vertexPositionAttribute);
    program.normalAttribute = gl.getAttribLocation(program, 'a_normal');
    gl.enableVertexAttribArray(program.normalAttribute);

    program.colorUniform = gl.getUniformLocation(program, "u_color");
    program.matrixUniform = gl.getUniformLocation(program, "u_matrix");
    program.directionalLightDirection = gl.getUniformLocation(program, "u_directionalLightDirection");
    program.directionalLightColor = gl.getUniformLocation(program, "u_directionalLightColor");
    program.pointLightPosition = gl.getUniformLocation(program, "u_pointLightPosition");
    program.pointLightColor = gl.getUniformLocation(program, "u_pointLightColor");
    app.program = program;

    //INIT BUFFERS
    var tmp = mat4.create();
    var sea = new Plane(mat4.create(), new RgbColor(0,0,255), [1000, 1000]);
    mat4.scale(sea.transformationMatrix, sea.transformationMatrix, [400, 1, 400]);
    app.objects.push(sea);

    mat4.translate(tmp, tmp, [0, -20, 0]);
    var island = new Sphere(tmp, new RgbColor(255,243,178),200);

    mat4.scale(island.transformationMatrix, island.transformationMatrix, [3, 1.3, 2]);
    app.objects.push(island);

    //init mesh objects
    var palmTreeColor1 = new RgbColor(0, 142, 42);
    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-200, 100,0]);
    var palmTree1 = new MeshObject(tmp, palmTreeColor1, meshes['palm-tree']);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-300, 100, 80]);
    mat4.rotateZ(tmp, tmp, degToRad(-20));
    var palmTree2 = new MeshObject(tmp, palmTreeColor1, meshes['palm-tree']);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-300, 100,5]);
    mat4.rotateX(tmp, tmp, degToRad(20));
    var palmTree3 = new MeshObject(tmp, palmTreeColor1, meshes['palm-tree']);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-350, 100,-30]);
    mat4.rotateY(tmp, tmp, degToRad(160));
    mat4.rotateX(tmp, tmp, degToRad(7));
    var palmTree4 = new MeshObject(tmp, palmTreeColor1, meshes['palm-tree']);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-300, 100, 80]);
    mat4.rotateZ(tmp, tmp, degToRad(-20));
    var palmTree5 = new MeshObject(tmp, palmTreeColor1, meshes['palm-tree']);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-325, 100, 40]);
    mat4.rotateY(tmp, tmp, degToRad(40));
    var palmTree6 = new MeshObject(tmp, palmTreeColor1, meshes['palm-tree']);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [350, 100,15]);
    mat4.rotateY(tmp, tmp, degToRad(60));
    var otherPalmTree = new MeshObject(tmp, new RgbColor(2, 79, 0), meshes['palm-tree']);

    //inna palma
    tmp = mat4.create();
    mat4.translate(tmp, tmp, [120,210, 90]);
    mat4.rotateX(tmp,tmp,degToRad(10));
    var barrel = new MeshObject(tmp, new RgbColor(142,80,0),meshes['barrel']);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [0, 210, 0]);
    mat4.rotateY(tmp, tmp, degToRad(180));
    mat4.scale(tmp,tmp,[40,40,40]);
    var lighthouse = new MeshObject(tmp, new RgbColor(255,0,0), meshes['lighthouse']);



    app.objects.push(palmTree1);
    app.objects.push(palmTree2);
    app.objects.push(palmTree3);
    app.objects.push(palmTree4);
    app.objects.push(palmTree5);
    app.objects.push(palmTree6);
    app.objects.push(otherPalmTree);
    app.objects.push(barrel);
    app.objects.push(lighthouse);
    //end

    app.objects.forEach(function (t) { t.initBuffers(gl);  });

    app.directionalLight = new DirectionalLight([-0.25, -0.25, -1], new RgbColor(204, 204, 204));
    app.pointLight = new PointLight([0, 750, 0],  new RgbColor(0, 0, 0));
    document.getElementById('camera-info').innerHTML = app.camera.toString();

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    tick();
}

function drawScene(gl) {
    webglUtils.fillScreen(gl.canvas);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(app.program);

    app.camera.aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;

    app.objects.forEach(function (t, i) {
        t.draw(gl, app);
    });


}

var currentlyPressedKeys = {};
var cameraMovementOffset = {
    forward: 0.0,
    right: 0.0,
    up: 0.0
};
var cameraRotationOffset = {
    up: 0.0,
    right: 0.0
};
var rotateStep = 10.0;
var movementStep = 8.0;
function handleKeys() {
    if(currentlyPressedKeys[87]) {
        // console.info('W was pressed');
        cameraMovementOffset.forward += -movementStep;
    }
    else if(currentlyPressedKeys[83]) {
        // console.info('S was pressed');
        cameraMovementOffset.forward += movementStep;
    } else {
        cameraMovementOffset.forward = 0;
    }

    if(currentlyPressedKeys[33]) {
        // console.info('PageUp was pressed');
        cameraMovementOffset.up += -movementStep;
    }
    else if(currentlyPressedKeys[34]) {
        // console.info('PageDown was pressed');
        cameraMovementOffset.up += movementStep;
    } else {
        cameraMovementOffset.up = 0;
    }

    if(currentlyPressedKeys[68]) {
        // console.info('D was pressed');
        cameraMovementOffset.right += -movementStep;
    } else if(currentlyPressedKeys[65]) {
        // console.info('A was pressed');
        cameraMovementOffset.right += movementStep;
    } else {
        cameraMovementOffset.right = 0;
    }

    if(currentlyPressedKeys[38]) {
        // console.info('UP was pressed');
        cameraRotationOffset.up += rotateStep;
    }
    else if(currentlyPressedKeys[40]) {
        // console.info('DOWN was pressed');
        cameraRotationOffset.up += -rotateStep;
    } else {
        cameraRotationOffset.up = 0;
    }

    if(currentlyPressedKeys[39]) {
        // console.info('RIGHT was pressed');
        cameraRotationOffset.right += -rotateStep;
    } else if(currentlyPressedKeys[37]) {
        // console.info('LEFT was pressed');
        cameraRotationOffset.right += rotateStep;
    } else {
        cameraRotationOffset.right = 0;
    }

    document.getElementById('camera-info').innerHTML = app.camera.toString();
}


function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}
function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

var lastTimeBlink = 0;
var framesCount = 0;
function animate(deltaTime) {
    if(deltaTime > 0){
        if(cameraMovementOffset.forward != 0.0){
            app.camera.xPos -= Math.sin(degToRad(app.camera.rotationY)) * cameraMovementOffset.forward * deltaTime;
            app.camera.zPos += Math.cos(degToRad(app.camera.rotationY)) * cameraMovementOffset.forward * deltaTime;
            app.camera.yPos += Math.tan(degToRad(app.camera.rotationX)) * cameraMovementOffset.forward * deltaTime;
        }
        if(cameraMovementOffset.right != 0.0) {
            app.camera.xPos -= Math.sin(degToRad(app.camera.rotationY - 90)) * cameraMovementOffset.right * deltaTime;
            app.camera.zPos += Math.cos(degToRad(app.camera.rotationY - 90)) * cameraMovementOffset.right * deltaTime;
        }

        if(cameraMovementOffset.up != 0.0){
            app.camera.yPos += cameraMovementOffset.up * deltaTime;
        }

        app.camera.rotationX += cameraRotationOffset.up * deltaTime;
        app.camera.rotationY += cameraRotationOffset.right * deltaTime;

        lastTimeBlink += deltaTime;
        framesCount++;

        if(lastTimeBlink >= 1) {
            document.getElementById('frames').innerHTML = framesCount;
            framesCount = 0;
            lastTimeBlink = 0;
           if(app.pointLight.color.r == 0){
               app.pointLight.color = new RgbColor(51,51,51);
           } else {
               app.pointLight.color = new RgbColor(0,0,0);
           }
        }
    }
}
var then = 0;
function tick(now) {
    now *= 0.001; //to seconds
    var deltaTime = now - then;
    then = now;
    requestAnimationFrame(tick);
    handleKeys();
    drawScene(app.gl);
    animate(deltaTime);
}


window.onload = function () {
    OBJ.downloadMeshes({
        'palm-tree': 'models/palm_tree.obj',
        'barrel': 'models/barrel2.obj',
        'lighthouse': 'models/lighthouse.obj'
    }, initWebGl);
};