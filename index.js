var textureUrls = ["models/barrel2.jpg", "models/lighthouse_texture.bmp", "models/skydome2.jpg", "models/crate2.jpg"];

function loadTextures(meshes, callback) {
    var textures = [];
    var imagesToLoad = textureUrls.length;

    var onImageLoad = function () {
        --imagesToLoad;
        if(imagesToLoad == 0) {
            callback(meshes, textures);
        }
    };

    for(var i = 0; i < textureUrls.length; i++){
        var image = new Image();
        image.src = textureUrls[i];
        image.onload = onImageLoad;

        textures.push(new Texture(image.src, image));
    }
}

var select = null;
window.onload = function () {
    select = document.getElementById("resolution");
    OBJ.downloadMeshes({
            'palm-tree': 'models/palm_tree.obj',
            'barrel': 'models/barrel.obj',
            'lighthouse': 'models/lighthouse.obj',
            'crate': 'models/Crate1.obj',
            'skydome': 'models/skydome5.obj',
            'plane': 'models/plane.obj',
        }, function (meshes) {
            loadTextures(meshes, initWebGl);
        }
    );
};


var app = {
    program: null,
    objects: [],
    camera: null,
    meshes: [],
    models: [],
    directionalLight: null,
    pointLight: null,
    gl: null,
    textureMode: 1,
    resolution: null,
    useFog: false,
    loaded: false,
    magnitudeNearestFilter: false
};

function initWebGl(meshes, textures) {
    var canvas = document.getElementById('main-canvas');
    var gl = canvas.getContext('webgl2');

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
    program.textureAttributem = gl.getAttribLocation(program, 'a_texture');
    gl.enableVertexAttribArray(program.textureAttributem);

    program.colorUniform = gl.getUniformLocation(program, "u_color");
    program.matrixUniform = gl.getUniformLocation(program, "u_matrix");
    program.directionalLightDirection = gl.getUniformLocation(program, "u_directionalLightDirection");
    program.directionalLightColor = gl.getUniformLocation(program, "u_directionalLightColor");
    program.usesLighting = gl.getUniformLocation(program, "u_usesLighting");
    program.pointLightPosition = gl.getUniformLocation(program, "u_pointLightPosition");
    program.pointLightColor = gl.getUniformLocation(program, "u_pointLightColor");
    program.usesTexture = gl.getUniformLocation(program, "u_usesTexture");
    program.usesHeightTexture = gl.getUniformLocation(program, "u_usesHeightTexture");
    program.usesFog = gl.getUniformLocation(program, "u_usesFog");
    program.textureSampler = gl.getUniformLocation(program, "u_sampler");
    program.inversedTransposedWorldMatrix = gl.getUniformLocation(program, "u_worldInverseTranspose");
    program.cameraPosition = gl.getUniformLocation(program, "u_cameraPosition");

    program.diffuseUniform = gl.getUniformLocation(program, "u_diffuse");
    program.specularUniform = gl.getUniformLocation(program, "u_specular");
    program.reflectivityUniform = gl.getUniformLocation(program, "u_reflectivity");
    program.cameraInversedUniform = gl.getUniformLocation(program, "u_reversedCamera");
    app.program = program;

    //INIT BUFFERS
    var materialTmp = new PhongMaterial(new RgbColor(255, 0,0),0.5,0.5, 5);

    var tmp = mat4.create();
    var skydome = new Skydome(tmp, new RgbColor(165, 236, 255), meshes['skydome'], materialTmp, textures[2]);
    app.objects.push(skydome);

    tmp = mat4.create();
    var sea = new MeshObject(mat4.create(), new RgbColor(0,0,255), meshes['plane'], materialTmp);
    mat4.scale(sea.transformationMatrix, sea.transformationMatrix, [250, 1, 250]);
    app.objects.push(sea);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [0, -20, 0]);
    var island = new Sphere(tmp, new RgbColor(255,243,178),200 , materialTmp);
    mat4.scale(island.transformationMatrix, island.transformationMatrix, [3, 1.3, 2]);
    app.objects.push(island);

    tmp = mat4.create();
    var terrainTexture = new PerlinNoiseTexture(1024);
    terrainTexture.generateTexture();
    mat4.translate(tmp, tmp, [-800, -400, -1200]);

    var island2 = new Sphere(tmp, new RgbColor(255,243,178),200 , materialTmp, terrainTexture);
    mat4.scale(island2.transformationMatrix, island2.transformationMatrix, [5, 1, 3]);
    app.objects.push(island2);

    //init mesh objects
    //beczka
    tmp = mat4.create();
    mat4.translate(tmp, tmp, [120,210, 90]);
    mat4.rotateX(tmp,tmp,degToRad(10));
    var barrel = new MeshObject(tmp, new RgbColor(142,80,0),meshes['barrel'], materialTmp, textures[0]);
    app.objects.push(barrel);

    var palmTreeColor1 = new RgbColor(0, 142, 42);
    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-200, 100,0]);
    var palmTree1 = new MeshObject(tmp, palmTreeColor1, meshes['palm-tree'], materialTmp, null);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-300, 100, 80]);
    mat4.rotateZ(tmp, tmp, degToRad(-20));
    var palmTree2 = new MeshObject(tmp, palmTreeColor1, meshes['palm-tree'], materialTmp, null);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-300, 100,5]);
    mat4.rotateX(tmp, tmp, degToRad(20));
    var palmTree3 = new MeshObject(tmp, palmTreeColor1, meshes['palm-tree'], materialTmp, null);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-350, 100,-30]);
    mat4.rotateY(tmp, tmp, degToRad(160));
    mat4.rotateX(tmp, tmp, degToRad(7));
    var palmTree4 = new MeshObject(tmp, palmTreeColor1, meshes['palm-tree'], materialTmp, null);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-300, 100, 80]);
    mat4.rotateZ(tmp, tmp, degToRad(-20));
    var palmTree5 = new MeshObject(tmp, palmTreeColor1, meshes['palm-tree'], materialTmp, null);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-325, 100, 40]);
    mat4.rotateY(tmp, tmp, degToRad(40));
    var palmTree6 = new MeshObject(tmp, palmTreeColor1, meshes['palm-tree'], materialTmp, null);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [350, 100,15]);
    mat4.rotateY(tmp, tmp, degToRad(60));
    var otherPalmTree = new MeshObject(tmp, new RgbColor(2, 79, 0), meshes['palm-tree'], materialTmp, null);

    tmp = mat4.create();
    mat4.translate(tmp, tmp, [0, 210, 0]);
    mat4.rotateY(tmp, tmp, degToRad(180));
    mat4.scale(tmp,tmp,[40,40,40]);
    var lighthouse = new MeshObject(tmp, new RgbColor(255,0,0), meshes['lighthouse'], materialTmp, textures[1]);
    tmp = mat4.create();
    mat4.translate(tmp, tmp, [-90,250, 90]);
    mat4.scale(tmp, tmp, [30, 30, 30]);
    var crate = new MeshObject(tmp, new RgbColor(142,80,0),meshes['crate'], materialTmp, textures[3]);


    app.objects.push(lighthouse);
    app.objects.push(palmTree1);
    app.objects.push(palmTree2);
    app.objects.push(palmTree3);
    app.objects.push(palmTree4);
    app.objects.push(palmTree5);
    app.objects.push(palmTree6);
    app.objects.push(otherPalmTree);
    app.objects.push(crate);
    //end

    app.loaded = true;
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
    var width = 0;
    var height = 0;

    var res = JSON.parse(select.options[select.selectedIndex].value);
    app.resolution = res;

    if(app.resolution == null) {
        width = gl.canvas.width;
        height = gl.canvas.height;
        app.camera.aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    } else {
        width = app.resolution[0];
        height = app.resolution[1];
        app.camera.aspectRatio = width / height;
    }

    var useFog = document.getElementById("useFog").checked;
    app.useFog = useFog;

    app.magnitudeNearestFilter = document.getElementById("useMagnitudeNear").checked;

    if(app.loaded) {
        document.getElementById("loading").style.display = 'none';
    }

    gl.viewport(0, 0, width, height);
    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    // gl.disable(gl.DEPTH_TEST);
    app.objects[0].draw(gl, app);
    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(app.program);


    app.objects.forEach(function (t, i) {
        if(i > 0)
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
var rotateStep = 100.0;
var movementStep = 250.0;
function handleKeys() {
    if(currentlyPressedKeys[87]) {
        // console.info('W was pressed');
        cameraMovementOffset.forward = movementStep;
    }
    else if(currentlyPressedKeys[83]) {
        // console.info('S was pressed');
        cameraMovementOffset.forward = -movementStep;
    } else {
        cameraMovementOffset.forward = 0;
    }

    if(currentlyPressedKeys[33]) {
        // console.info('PageUp was pressed');
        cameraMovementOffset.up = -movementStep;
    }
    else if(currentlyPressedKeys[34]) {
        // console.info('PageDown was pressed');
        cameraMovementOffset.up = movementStep;
    } else {
        cameraMovementOffset.up = 0;
    }

    if(currentlyPressedKeys[68]) {
        // console.info('D was pressed');
        cameraMovementOffset.right = -movementStep;
    } else if(currentlyPressedKeys[65]) {
        // console.info('A was pressed');
        cameraMovementOffset.right = movementStep;
    } else {
        cameraMovementOffset.right = 0;
    }

    if(currentlyPressedKeys[38]) {
        // console.info('UP was pressed');
        cameraRotationOffset.up = -rotateStep;
    }
    else if(currentlyPressedKeys[40]) {
        // console.info('DOWN was pressed');
        cameraRotationOffset.up = rotateStep;
    } else {
        cameraRotationOffset.up = 0;
    }

    if(currentlyPressedKeys[39]) {
        // console.info('RIGHT was pressed');
        cameraRotationOffset.right = rotateStep;
    } else if(currentlyPressedKeys[37]) {
        // console.info('LEFT was pressed');
        cameraRotationOffset.right = -rotateStep;
    } else {
        cameraRotationOffset.right = 0;
    }

    if(currentlyPressedKeys[27]) {
        var gui = document.getElementById('gui');
        var newStyle = gui.style.display == 'none' ? 'block' : 'none';
        gui.style.display = newStyle;
        currentlyPressedKeys[27] = false;
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
        var skydome = app.objects[0];
        if(cameraMovementOffset.forward != 0.0){
            var step = cameraMovementOffset.forward * deltaTime;
            app.camera.moveForward(step);
            skydome.moveForward(step);
        }
        if(cameraMovementOffset.right != 0.0) {
            var step = cameraMovementOffset.right * deltaTime;
            app.camera.moveRight(step);
            skydome.moveRight(step);
        }

        if(cameraMovementOffset.up != 0.0){
            app.camera.yPos += cameraMovementOffset.up * deltaTime;
        }

        app.camera.rotationX += cameraRotationOffset.up * deltaTime;

        var rotation = cameraRotationOffset.right * deltaTime;
        app.camera.rotationY += rotation ;
        skydome.rotationY += rotation;

        skydome.moveWithCamera();

        lastTimeBlink += deltaTime;
        framesCount++;

        if(lastTimeBlink >= 1) {
            document.getElementById('frames').innerHTML = framesCount;
            framesCount = 0;
            lastTimeBlink = 0;
           if(app.pointLight.color.r == 0){
               app.pointLight.color = new RgbColor(31,31,31);
               // app.pointLight.color = new RgbColor(0,0,0);
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
