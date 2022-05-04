  'use strict';

  // Global variables that are set and used
  // across the application
  let gl;

  // GLSL programs
  let pink, waterFloor, baseMesh, pot, stands, catBox;
  let waterTexture, catTexture, wallTexture;
  
  // VAOs for the objects
  var pinkBall = null;
  var floor = null;
  var tPot = null;
  var tCylinder = null;
  var endCube = null;
  var catCube = null;
  var topCone = null;

// Here you set up your camera position, orientation, and projection
// Remember that your projection and view matrices are sent to the vertex shader
// as uniforms, using whatever name you supply in the shaders

function setUpCamera(program) {

	gl.useProgram (program);
	// projection
	let projMatrix = glMatrix.mat4.create();
	glMatrix.mat4.ortho(projMatrix, -5, 5, -5, 5, 1.0, 100.0);
	gl.uniformMatrix4fv (program.uProjT, false, projMatrix);

	// view
	let viewMatrix = glMatrix.mat4.create();
	glMatrix.mat4.lookAt(viewMatrix, [0, 1.5, 6], [0, 0, 0], [0, 1, 0]);
	// glMatrix.mat4.lookAt(viewMatrix, [-4, 2, 6], [0, 0, 0], [0, 1, 0]);
	gl.uniformMatrix4fv (program.uViewT, false, viewMatrix);
}

// Setup Phong params for directional light/color
function setUpPhong(program, color){

	var aLight = gl.getUniformLocation(program, 'ambientLight');
    gl.uniform3fv(aLight, [0.5, 0.55, 0.45]);
    var lPos = gl.getUniformLocation(program, 'lightPosition');
	gl.uniform3fv(lPos, [1,3.5,1]);
    var lColor = gl.getUniformLocation(program, 'lightColor');
    gl.uniform3fv(lColor, [1.0, 1.0, 1.0]);
    var oColor = gl.getUniformLocation(program, 'baseColor');
    gl.uniform3fv(oColor, color);
    var specColor = gl.getUniformLocation(program, 'specHighlightColor');
    gl.uniform3fv(specColor, [color - 0.1]);
    var ka = gl.getUniformLocation(program, 'ka');
    gl.uniform1fv(ka, [0.5]);
    var kd = gl.getUniformLocation(program, 'kd');
    gl.uniform1fv(kd, [0.8]);
    var ks = gl.getUniformLocation(program, 'ks');
    gl.uniform1fv(ks, [0.4]);
    var ke = gl.getUniformLocation(program, 'ke');
    gl.uniform1fv(ke, [0.08]);

}

function createShapes() {

	pinkBall = new Sphere(30,30);
	pinkBall.VAO = bindVAO(pinkBall, pink);

    topCone = new Cone(10,10);
	topCone.VAO = bindVAO(topCone, pink);

	tPot = new Cone(10,10);
	tPot.VAO = bindVAO(tPot, pot);

	floor = new Cube(5);
	floor.VAO = bindVAO(floor, waterFloor);

	// **************** Pedestal
	tCylinder = new Cylinder(24, 8);
	tCylinder.VAO = bindVAO(tCylinder, stands);

	endCube = new Cube(5);
	endCube.VAO = bindVAO(endCube, stands);
	
	catCube = new Cube(5);
	catCube.VAO = bindVAO(catCube, catBox);


}

function drawFloor() {
    // floor
    setUpCamera(waterFloor);
    setUpPhong(waterFloor, [0.5,0.5,0.5]);

    waterTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, waterTexture);
    // load the texture data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([0, 0, 255, 255]));
    // load the actual image
    var waterImage = document.getElementById ('water-texture');

    // bind the texture so we can perform operations on it
    gl.bindTexture (gl.TEXTURE_2D, waterTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, waterImage);
    gl.generateMipmap(gl.TEXTURE_2D);

    let modelMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate( modelMatrix, modelMatrix, [0, -3, 0.2, 0]);
    glMatrix.mat4.scale( modelMatrix, modelMatrix, [11, 2, 9 ,1]);
    gl.uniformMatrix4fv (waterFloor.uModelT, false, modelMatrix);
    gl.bindVertexArray(floor.VAO, baseMesh);
    gl.drawElements(gl.TRIANGLES, floor.indices.length, gl.UNSIGNED_SHORT, 0);
}

function drawPinkSphere(){
	// pink sphere

	// camera + shading
	setUpCamera(pink);
    setUpPhong(pink, [1 , 0 , 1]);

	// model transforms
    let modelMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate( modelMatrix, modelMatrix, [-1,1.4,-2,0]);
	gl.uniformMatrix4fv(pink.uModelT, false, modelMatrix);
    gl.bindVertexArray(pinkBall.VAO, baseMesh);
    gl.drawElements(gl.TRIANGLES, pinkBall.indices.length, gl.UNSIGNED_SHORT, 0);
}

function drawPot(){

	// camera + shading
	setUpCamera(pot);
    setUpPhong(pot, [0.5,0.5,0.5]);


    wallTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, wallTexture);
    // load the texture data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([0, 255, 0, 255]));
    // load the actual image
    var wallImage = document.getElementById ('wall-texture');

    // bind the texture so we can perform operations on it
    gl.bindTexture (gl.TEXTURE_2D, wallTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, wallImage);
    gl.generateMipmap(gl.TEXTURE_2D);

	// model transforms
    let modelMatrix = glMatrix.mat4.create();

    glMatrix.mat4.translate( modelMatrix, modelMatrix, [3 ,1.8,-2,0]);
    glMatrix.mat4.scale( modelMatrix, modelMatrix, [1.5,1.5,1.5 ,1]);

	gl.uniformMatrix4fv(pot.uModelT, false, modelMatrix);
    gl.bindVertexArray(tPot.VAO, baseMesh);
    gl.drawElements(gl.TRIANGLES, tPot.indices.length, gl.UNSIGNED_SHORT, 0);
}

function drawCatBox(){

	setUpCamera(catBox);
    setUpPhong(catBox, [0.5,0.5,0.5]);

    catTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, catTexture);
    // load the texture data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([255, 0, 0, 255]));
    // load the actual image
    var catImage = document.getElementById ('cat-texture');

    // bind the texture so we can perform operations on it
    gl.bindTexture (gl.TEXTURE_2D, catTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, catImage);
    gl.generateMipmap(gl.TEXTURE_2D);

	// model transforms
    let modelMatrix = glMatrix.mat4.create();

    glMatrix.mat4.translate( modelMatrix, modelMatrix, [1,1.6,0.8,0]);
    glMatrix.mat4.scale( modelMatrix, modelMatrix, [1.2,1.2,1.2,1]);
    glMatrix.mat4.rotateY(modelMatrix, modelMatrix, radians(45));

	gl.uniformMatrix4fv(catBox.uModelT, false, modelMatrix);
    gl.bindVertexArray(catCube.VAO, baseMesh);
    gl.drawElements(gl.TRIANGLES, catCube.indices.length, gl.UNSIGNED_SHORT, 0);
}

function drawLightSrc(){

	setUpCamera(pink);
    setUpPhong(pink, [1 , 1 , 0]);

    var aLight = gl.getUniformLocation(pink, 'ambientLight');
    gl.uniform3fv(aLight, [1,1,1]);
    var lPos = gl.getUniformLocation(pink, 'lightPosition');
	gl.uniform3fv(lPos, [1,3.5,1]);
    var lColor = gl.getUniformLocation(pink, 'lightColor');
    gl.uniform3fv(lColor, [1.0, 1.0, 1.0]);
    var oColor = gl.getUniformLocation(pink, 'baseColor');
    gl.uniform3fv(oColor, [1,1,0.2]);
    var specColor = gl.getUniformLocation(pink, 'specHighlightColor');
    gl.uniform3fv(specColor, [0,0,0]);
    var ka = gl.getUniformLocation(pink, 'ka');
    gl.uniform1fv(ka, [1]);
    var kd = gl.getUniformLocation(pink, 'kd');
    gl.uniform1fv(kd, [1]);
    var ks = gl.getUniformLocation(pink, 'ks');
    gl.uniform1fv(ks, [1]);
    var ke = gl.getUniformLocation(pink, 'ke');
    gl.uniform1fv(ke, [12]);


	// model transforms
    let modelMatrix = glMatrix.mat4.create();

    glMatrix.mat4.translate( modelMatrix, modelMatrix, [1,4,0.8]);
    glMatrix.mat4.rotateX(modelMatrix, modelMatrix, radians(30));
    glMatrix.mat4.rotateY(modelMatrix, modelMatrix, radians(120));
	gl.uniformMatrix4fv(pink.uModelT, false, modelMatrix);
    gl.bindVertexArray(pinkBall.VAO, baseMesh);
    gl.drawElements(gl.TRIANGLES, pinkBall.indices.length, gl.UNSIGNED_SHORT, 0);

    var oColor = gl.getUniformLocation(pink, 'baseColor');
    gl.uniform3fv(oColor, [0,0,0]);

    modelMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate( modelMatrix, modelMatrix, [1,5,0.8]);
    glMatrix.mat4.scale( modelMatrix, modelMatrix, [2,2,2,1]);
    glMatrix.mat4.rotateY(modelMatrix, modelMatrix, radians(90));
	gl.uniformMatrix4fv(pink.uModelT, false, modelMatrix);
    gl.bindVertexArray(topCone.VAO, baseMesh);
    gl.drawElements(gl.TRIANGLES, topCone.indices.length, gl.UNSIGNED_SHORT, 0);
}

function drawWoodUnit(modelMatrix, x, y, z, isBack){

    var yC = - 0.8;
    var yB = 0.8;
    modelMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(modelMatrix, modelMatrix, [x,yC,z]);
    glMatrix.mat4.scale(modelMatrix, modelMatrix, [1,3,1]);
    gl.uniformMatrix4fv (stands.uModelT, false, modelMatrix);
    gl.bindVertexArray(tCylinder.VAO, baseMesh);
    gl.drawElements(gl.TRIANGLES, tCylinder.indices.length, gl.UNSIGNED_SHORT, 0);

    modelMatrix = glMatrix.mat4.create();
    setUpPhong(stands, [0,1,1]);
    glMatrix.mat4.translate(modelMatrix, modelMatrix, [x,yB,z]);
    glMatrix.mat4.scale(modelMatrix, modelMatrix, [1.5 ,0.4, 1]);
    glMatrix.mat4.rotateY(modelMatrix, modelMatrix, radians(30));
    //glMatrix.mat4.rotateX(modelMatrix, modelMatrix, radians(30));
    //glMatrix.mat4.rotateZ(modelMatrix, modelMatrix, radians(30));
    gl.uniformMatrix4fv (stands.uModelT, false, modelMatrix);
    gl.bindVertexArray(endCube.VAO, baseMesh);
    gl.drawElements(gl.TRIANGLES, endCube.indices.length, gl.UNSIGNED_SHORT, 0);

}

function drawPedestals() {
    // floor
    setUpCamera(stands);
    setUpPhong(stands, [0.5,1,0.5]);
    // Pot Pedestal
    let modelMatrix = glMatrix.mat4.create();
    drawWoodUnit(modelMatrix, 3, 1, -2);
    drawWoodUnit(modelMatrix, -1, 1.4, -2);
    drawWoodUnit(modelMatrix, 1, 3, 1);
    // Ball Pedestal

}

//  This function draws all of the shapes required for your scene
function drawShapes() {
	drawFloor();
	drawPinkSphere();
	drawPot();
	drawPedestals();
	drawCatBox();
	drawLightSrc();
}


//
// Use this function to create all the programs that you need
// You can make use of the auxillary function initProgram
// which takes the name of a vertex shader and fragment shader
//
// Note that after successfully obtaining a program using the initProgram
// function, you will need to assign locations of attribute and uniform variable
// based on the in variables to the shaders.   This will vary from program
// to program.
//
function initPrograms() {

	waterFloor = initProgram("pink-V", "pink-F");
	pink = initProgram("pink-V", "pink-F");
    pot = initProgram("pink-V", "pink-F");
    stands = initProgram("wood-V", "wood-F");
    catBox = initProgram("pink-V", "pink-F");
}

// creates a VAO and returns its ID
function bindVAO (shape, program) {
	//create and bind VAO
	let theVAO = gl.createVertexArray();
    gl.bindVertexArray(theVAO);

    // create and bind vertex buffer
    let myVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.aVertexPosition);
    gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    // add code for any additional vertex attribute

    // create and bind bary buffer
    let myBaryBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, myBaryBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.bary), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.aBary);
    gl.vertexAttribPointer(program.aBary, 3, gl.FLOAT, false, 0, 0);

	// create, bind, and fill buffer for vertex locations
	// vertex locations can be obtained from the points member of the
	// shape object.  3 floating point values (x,y,z) per vertex are
	// stored in this array.
	var x,y,z;
	var pbuf = new Float32Array(shape.points.length);
	for ( var i = 0; i < shape.points.length; i += 3 ) {
		x = shape.points[i];
		y = shape.points[i + 1];
		z = shape.points[i + 2];
		pbuf[i] = x;
		pbuf[i + 1] = y;
		pbuf[i + 2] = z;
  	}
	var buf_id = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf_id);
	gl.bufferData(gl.ARRAY_BUFFER, pbuf, gl.STATIC_DRAW);
	var aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
	gl.enableVertexAttribArray(aVertexPosition);
	gl.vertexAttribPointer( aVertexPosition, 3, gl.FLOAT, false, 0, 0 );


	// create, bind, and fill buffer for normal values
	// normals can be obtained from the normals member of the
	// shape object.  3 floating point values (x,y,z) per vertex are
	// stored in this array.
	var nbuf = new Float32Array(shape.normals.length);
	for ( var i = 0; i < shape.normals.length; i += 3 ) {
		x = shape.normals[i];
		y = shape.normals[i + 1];
		z = shape.normals[i + 2];
		nbuf[i] = x;
		nbuf[i + 1] = y;
		nbuf[i + 2] = z;
	}
	var buf_id = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf_id);
	gl.bufferData(gl.ARRAY_BUFFER, nbuf, gl.STATIC_DRAW);
	var aNormal = gl.getAttribLocation(program, 'aNormal');
	gl.enableVertexAttribArray(aNormal);
	gl.vertexAttribPointer( aNormal, 3, gl.FLOAT, false, 0, 0 );

	let uvBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uv), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(program.aUV);
	gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);

	// Setting up element array
	// element indicies can be obtained from the indicies member of the
	// shape object.  3 values per triangle are stored in this
	// array.
	var ebuf = new Uint16Array(shape.indices.length);
	for ( var i = 0; i < shape.indices.length; i += 3 ) {
		x = shape.indices[i];
		y = shape.indices[i + 1];
		z = shape.indices[i + 2];
		ebuf[i] = x;
		ebuf[i + 1] = y;
		ebuf[i + 2] = z;
	}
	var buf_id = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf_id);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ebuf, gl.STATIC_DRAW);
	// Setting up the IBO
	let myIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

	// Clean
	gl.bindVertexArray(null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	return theVAO;
}

/////////////////////////////////////////////////////////////////////////////
//
//  You shouldn't have to edit anything below this line...but you can
//  if you find the need
//
/////////////////////////////////////////////////////////////////////////////

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
  }

  return shader;
}


  //
  // compiles, loads, links and returns a program (vertex/fragment shader pair)
  //
  // takes in the id of the vertex and fragment shaders (as given in the HTML file)
  // and returns a program object.
  //
  // will return null if something went wrong
  //
  function initProgram(vertex_id, fragment_id) {
    const vertexShader = getShader(vertex_id);
    const fragmentShader = getShader(fragment_id);
    // Create a program
    let program = gl.createProgram();

    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.aBary = gl.getAttribLocation(program, 'bary');
    program.uModelT = gl.getUniformLocation (program, 'modelT');
    program.uViewT = gl.getUniformLocation (program, 'viewT');
    program.uProjT = gl.getUniformLocation (program, 'projT');
    program.aUV = gl.getAttribLocation(program, 'aUV');
    program.uTheTexture = gl.getUniformLocation (program, 'theTexture');
    program.uTheta = gl.getUniformLocation (program, 'theta');

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
      return null;
    }

    return program;
  }


  // We call draw to render to our canvas
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // draw your shapes
    drawShapes();

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {

    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }

    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);

    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }

    // Set the clear color to be black
    gl.clearColor(0.5,0.5,0.5,0);

    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor( 0.5,0.5,0.5, 1 );
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)
    gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);

    // Read, compile, and link your shaders
    initPrograms();

    // create and bind your current object
    createShapes();
    // do a draw
    draw();
  }
