var app = {
    program: null,
    objects: [],
    camera: null,
    meshes: [],
    models: [],
    directionalLight: null,
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

    //INIT BUFFERS
    var sea = new Plane(mat4.create(), [0,0,1, 1], [1000, 1000]);
    mat4.scale(sea.translation, sea.translation, [400, 1, 400]);
    app.objects.push(sea);

    var island = new Sphere(200, [0,-20, 0], [1.0, 0.9, 0.2, 1.0]);
    mat4.scale(island.translation, island.translation, [3, 1.3, 2]);
    app.objects.push(island);


    app.program = program;

    app.objects.forEach(function (t) { t.initBuffers(gl);  });

    app.meshes = meshes;
    for(var mesh in app.meshes ){
        OBJ.initMeshBuffers( gl, app.meshes[ mesh ]);
        // this loops through the mesh names and creates new
        // model objects and setting their mesh to the current mesh
        app.models[ mesh ] = {};
        app.models[ mesh ].mesh = app.meshes[ mesh ];
    }

    app.directionalLight = new DirectionalLight([-0.25, -0.25, -1], [0.8, 0.8, 0.8, 1.0]);

    document.getElementById('camera-info').innerHTML = app.camera.toString();
    document.getElementById('sphere-info').innerHTML = app.objects[0].toString();

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

    var tmp = mat4.create();
    mat4.translate(tmp, tmp, [-200, 100,0]);
    drawingUtils.drawObject(gl, app, app.models['palm-tree'], tmp, [0.0, 142/255.0, 42/255.0,1]);
    tmp = mat4.create();
    mat4.translate(tmp, tmp, [200, 100,0]);
    mat4.rotateY(tmp, tmp, radToDeg(60));
    drawingUtils.drawObject(gl, app, app.models['palm-tree'],  tmp, [0.0, 255/255.0, 110/255.0,1]);
    tmp = mat4.create();
    mat4.translate(tmp, tmp, [120,210, 90]);
    mat4.rotateX(tmp,tmp,degToRad(10));
    drawingUtils.drawObject(gl, app, app.models['barrel'],  tmp, [142/255, 80/255.0, 0.0, 1]);
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
        cameraMovementRate.forward += -movementStep;
    }
    else if(currentlyPressedKeys[83]) {
        // console.info('S was pressed');
        cameraMovementRate.forward += movementStep;
    } else {
        cameraMovementRate.forward = 0;
    }

    if(currentlyPressedKeys[33]) {
        // console.info('PageUp was pressed');
        cameraMovementRate.up += -movementStep;
    }
    else if(currentlyPressedKeys[34]) {
        // console.info('PageDown was pressed');
        cameraMovementRate.up += movementStep;
    } else {
        cameraMovementRate.up = 0;
    }

    if(currentlyPressedKeys[68]) {
        // console.info('D was pressed');
        cameraMovementRate.right += -movementStep;
    } else if(currentlyPressedKeys[65]) {
        // console.info('A was pressed');
        cameraMovementRate.right += movementStep;
    } else {
        cameraMovementRate.right = 0;
    }

    if(currentlyPressedKeys[38]) {
        // console.info('UP was pressed');
        cameraRotationRate.up += rotateStep;
    }
    else if(currentlyPressedKeys[40]) {
        // console.info('DOWN was pressed');
        cameraRotationRate.up += -rotateStep;
    } else {
        cameraRotationRate.up = 0;
    }

    if(currentlyPressedKeys[39]) {
        // console.info('RIGHT was pressed');
        cameraRotationRate.right += -rotateStep;
    } else if(currentlyPressedKeys[37]) {
        // console.info('LEFT was pressed');
        cameraRotationRate.right += rotateStep;
    } else {
        cameraRotationRate.right = 0;
    }

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
        'barrel': 'models/barrel2.obj'
    }, initWebGl);
};