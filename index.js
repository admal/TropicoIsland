var app = {
    program: null,
    objects: [],
    camera: null,
    meshes: [],
    models: [],
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

    var meshColors = {
        'palm-tree': [0.0, 142/255.0, 42/255.0,1],
        'palm-tree-2': [0.0, 255/255.0, 110/255.0,1],
        'barrel': [142/255, 80/255.0, 0.0, 1]
    };
    app.meshes = meshes;
    for(var mesh in app.meshes ){
        var color = meshColors[mesh];
        OBJ.initMeshBuffers( gl, app.meshes[ mesh ],color );
        // this loops through the mesh names and creates new
        // model objects and setting their mesh to the current mesh
        app.models[ mesh ] = {};
        app.models[ mesh ].mesh = app.meshes[ mesh ];
    }

    var program = webglUtils.createProgramFromScripts(gl, ['x-shader', 'x-fragment-shader']);
    gl.useProgram(program);
    program.vertexPositionAttribute = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(program.vertexPositionAttribute);
    program.normalAttribute = gl.getAttribLocation(program, 'a_normal');
    gl.enableVertexAttribArray(program.vertexNormalAttribute);
    program.colorAttribute = gl.getAttribLocation(program, "a_color");
    gl.enableVertexAttribArray(program.colorAttribute);

    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    program.matrixUniform = matrixLocation;
    var reverseLightDirectionLocation =
        gl.getUniformLocation(program, "u_lightingDirection");
    program.reverseLightDirectionLocation = reverseLightDirectionLocation;


    var see = new Plane(mat4.create(), [0,0,1, 1], [1000, 1000]);
    mat4.scale(see.translation, see.translation, [200, 1, 200]);
    app.objects.push(see);

    var island = new Sphere(200, [0,-20, 0], [1.0, 0.9, 0.2, 1.0]);
    mat4.scale(island.translation, island.translation, [3, 1.3, 2]);
    app.objects.push(island);


    app.program = program;

    app.objects.forEach(function (t) { t.initBuffers(gl);  });

    document.getElementById('camera-info').innerHTML = app.camera.toString();
    document.getElementById('sphere-info').innerHTML = app.objects[0].toString();

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    tick();
    //drawScene(gl);
}

function drawScene(gl) {
    webglUtils.fillScreen(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    // gl.enable(gl.CULL_FACE);

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(app.program);

    // Compute the matrix

    app.camera.aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;

    app.objects.forEach(function (t, i) {
        t.draw(gl, app);
    });

    var tmp = mat4.create();
    mat4.translate(tmp, tmp, [-200, 100,0]);
    drawingUtils.drawObject(gl, app, app.models['palm-tree'], tmp);
    var tmp = mat4.create();
    mat4.translate(tmp, tmp, [200, 100,0]);
    mat4.rotateY(tmp, tmp, radToDeg(60));
    drawingUtils.drawObject(gl, app, app.models['palm-tree-2'],  tmp);
    var tmp = mat4.create();
    mat4.translate(tmp, tmp, [120,210, 90]);
    mat4.rotateX(tmp,tmp,degToRad(10));
    drawingUtils.drawObject(gl, app, app.models['barrel'],  tmp);
}

var currentlyPressedKeys = {};
var cameraMovementRate = {
    forward: 0.0,
    right: 0.0,
    up: 0.0
};
var cameraRotationRate = {
    up: 0.0,
    right: 0.0
};
var rotateStep = 10.0;
var movementStep = 8.0;
function handleKeys() {
    if(currentlyPressedKeys[87]) {
        // console.info('W was pressed');
        // mat4.translate(app.camera.translation, app.camera.translation, [0,0 ,20]);
        // app.camera.rotateX(5)
        cameraMovementRate.forward += -movementStep;
    }
    else if(currentlyPressedKeys[83]) {
        // console.info('S was pressed');
        // mat4.translate(app.camera.translation, app.camera.translation, [0, 0,-20]);
        // app.camera.rotateX(-5);
        cameraMovementRate.forward += movementStep;
    } else {
        cameraMovementRate.forward = 0;
    }

    if(currentlyPressedKeys[33]) {
        // console.info('PageUp was pressed');
        // mat4.translate(app.camera.translation, app.camera.translation, [0,0 ,20]);
        // app.camera.rotateX(5)
        cameraMovementRate.up += -movementStep;
    }
    else if(currentlyPressedKeys[34]) {
        // console.info('PageDown was pressed');
        // mat4.translate(app.camera.translation, app.camera.translation, [0, 0,-20]);
        // app.camera.rotateX(-5);
        cameraMovementRate.up += movementStep;
    } else {
        cameraMovementRate.up = 0;
    }

    if(currentlyPressedKeys[68]) {
        // console.info('D was pressed');
        // app.camera.rotateY(-5);
        cameraMovementRate.right += -movementStep;
    } else if(currentlyPressedKeys[65]) {
        // console.info('A was pressed');
        // app.camera.rotateY(5);
        cameraMovementRate.right += movementStep;
    } else {
        cameraMovementRate.right = 0;
    }

    if(currentlyPressedKeys[38]) {
        // console.info('UP was pressed');
        // app.camera.moveForward(20)
        cameraRotationRate.up += rotateStep;
    }
    else if(currentlyPressedKeys[40]) {
        // console.info('DOWN was pressed');
        // app.camera.moveForward(-20);
        cameraRotationRate.up += -rotateStep;
    } else {
        cameraRotationRate.up = 0;
    }

    if(currentlyPressedKeys[39]) {
        // console.info('RIGHT was pressed');
        // app.camera.moveRight(20);
        cameraRotationRate.right += -rotateStep;
    } else if(currentlyPressedKeys[37]) {
        // console.info('LEFT was pressed');
        // app.camera.moveRight(-20);
        cameraRotationRate.right += rotateStep;
    } else {
        cameraRotationRate.right = 0;
    }
    // console.info('camera', app.camera.getMatrix());
    document.getElementById('camera-info').innerHTML = app.camera.toString();
    document.getElementById('sphere-info').innerHTML = app.objects[0].toString();
}


function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}
function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}


function animate(deltaTime) {
    if(deltaTime > 0){
        if(cameraMovementRate.forward != 0.0){
            app.camera.xPos -= Math.sin(degToRad(app.camera.rotationY)) * cameraMovementRate.forward * deltaTime;
            app.camera.zPos += Math.cos(degToRad(app.camera.rotationY)) * cameraMovementRate.forward * deltaTime;
            app.camera.yPos += Math.tan(degToRad(app.camera.rotationX)) * cameraMovementRate.forward * deltaTime;
        }
        if(cameraMovementRate.right != 0.0) {
            app.camera.xPos -= Math.sin(degToRad(app.camera.rotationY - 90)) * cameraMovementRate.right * deltaTime;
            app.camera.zPos += Math.cos(degToRad(app.camera.rotationY - 90)) * cameraMovementRate.right * deltaTime;
        }

        if(cameraMovementRate.up != 0.0){
            app.camera.yPos += cameraMovementRate.up * deltaTime;
        }

        app.camera.rotationX += cameraRotationRate.up * deltaTime;
        app.camera.rotationY += cameraRotationRate.right * deltaTime;
    }
}
var then = 0;
function tick(now) {
    //to seconds
    now *= 0.001;
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
        'palm-tree-2': 'models/palm_tree.obj',
        'barrel': 'models/barrel2.obj'
    }, initWebGl);
};