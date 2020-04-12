//   _____ _____ _____
//  |   __|  |  |  _  |
//  |   __|  |  |   __|
//  |__|  |_____|__|
//   _____ _____ _____
//  |   __|_   _|   __|
//  |   __| | | |   __|
//  |_____| |_| |_____|
//
// Daniele Tabellini @fupete © 2020 GNU General Public License v3.0
// lets-do-some-3d _ github repository
// Three js experiments and sandbox
//
// 04-astro-nascente (1st approach with three.js to render my allucinations)

let xAx = new THREE.Vector3( 1, 0, 0 );
let yAx = new THREE.Vector3( 0, 1, 0 );
let zAx = new THREE.Vector3( 0, 0, 1 );

/////////
///////// SETUP
/////////

// Scene
let scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
scene.fog = new THREE.FogExp2( scene.background, 0.001 );

// Camera
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);

// Renderer
let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;
//renderer.shadowMapType = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controls
let controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.19;

// Add listener for window resize.
window.addEventListener('resize', onWindowResize, false);


/////////
///////// LIGHTS
/////////

// Ambient
let lightAmb = new THREE.AmbientLight( 0x000000 );

// Directional
let light = new THREE.DirectionalLight( 0xffffff, 1.5 );
light.position.set( -100, 200, 50 );
//let dlh = new THREE.DirectionalLightHelper( light );
//scene.add( dlh );
light.castShadow = true;
light.shadowDarkness = 0.5;


// Point
let light2 = new THREE.PointLight( 0xffffff, 0.7 );
light2.position.set (-50,50,50);
//let plh = new THREE.PointLightHelper( light2 );
//scene.add( plh );
light2.castShadow = true;
light2.shadowDarkness = 0.5;

// Spot
let light3 = new THREE.SpotLight( 0xffffff, .8 );
light3.position.set (100,-100,100);
light3.angle = Math.PI / 7;
light3.penumbra = 0.8;
//let slh = new THREE.SpotLightHelper( light3 );
//scene.add( slh );


/////////
///////// MATERIALS
/////////

let material = new THREE.MeshLambertMaterial({
  wireframe:false,
  color: 0xff0000,
  specular: 0xffffff,
  shininess: 1.1,
  side: THREE.DoubleSide
  }); // + material
// Normal Lambert Phong Standard Toon

let matGlass = new THREE.MeshLambertMaterial({
  wireframe:false,
  color: 0xcccccc,
  specular: 0xffffff,
  shininess: 1.8,
  side: THREE.DoubleSide,
  transparent: true,
  opacity:0.5
  });

let matMan = new THREE.MeshLambertMaterial({
  wireframe:false,
  color: 0xffffff,
  specular: 0xffffff,
  shininess: 1.8,
  emissive: 0xffffff,
  emissiveIntensity: 1
  });


/////////
///////// GEOMETRIES
/////////

// let's make a box
let geomet = new THREE.BoxGeometry(1000, 100, 1000); // dimensions
let box = new THREE.Mesh(geomet, matMan); // = the box
box.position.y=-50;
box.castShadow = true;
box.receiveShadow = false;
box.position.y = -78;
//scene.add(box);

// VETRO
let geomSphere = new THREE.SphereGeometry( 10, 10, 10 );
let sphere = new THREE.Mesh(geomSphere, matGlass); // = the box
sphere.position.y=110;
sphere.position.x=20;
scene.add(sphere);

// ASTRONAUTA
let geomSphere2 = new THREE.SphereGeometry( 6, 6, 6 );
let sphere2 = new THREE.Mesh(geomSphere2, matMan); // = the box
sphere2.position.y=110;
sphere2.position.x=20;
scene.add(sphere2);

// CORPO ASTRONAVE
let geomPyr = new THREE.CylinderGeometry(0, 50, 60, 4, 1)
let pyramid = new THREE.Mesh(geomPyr, material);
let pyr2 = new THREE.Mesh(geomPyr, material);
pyramid.position.y=120;
pyr2.rotation.x = Math.PI;
pyramid.rotation.y = Math.PI/4;
pyr2.rotation.y = Math.PI/4;
pyr2.position.y = 60;
scene.add(pyr2);
scene.add(pyramid);
pyr2.castShadow = true;
pyr2.receiveShadow = false;
pyramid.castShadow = true;
pyramid.receiveShadow = false;
// ZAMPE ASTRONAVE
var geom = new THREE.Geometry();
var v1 = new THREE.Vector3(0,0,0);
var v2 = new THREE.Vector3(15,0,50);
var v3 = new THREE.Vector3(-15,0,50);
geom.vertices.push(v1);
geom.vertices.push(v2);
geom.vertices.push(v3);
geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
geom.computeFaceNormals();
var triangleLeft= new THREE.Mesh( geom, material );
triangleLeft.position.y = 30;
triangleLeft.rotateOnWorldAxis(xAx, Math.PI/10);
scene.add(triangleLeft);
var triangleRight= triangleLeft.clone();
triangleRight.rotateOnWorldAxis(yAx, Math.PI);
scene.add(triangleRight);
var triangleFront= triangleLeft.clone();
triangleFront.rotateOnWorldAxis(yAx, Math.PI/2);
scene.add(triangleFront);
var triangleBack= triangleLeft.clone();
triangleBack.rotateOnWorldAxis(yAx, -Math.PI/2);
scene.add(triangleBack);
var triangleLeftDown= triangleLeft.clone();
triangleLeftDown.rotateOnWorldAxis(xAx, -Math.PI/2);
scene.add(triangleLeftDown);
var triangleRightDown= triangleLeftDown.clone();
triangleRightDown.rotateOnWorldAxis(yAx, Math.PI);
scene.add(triangleRightDown);
var triangleFrontDown= triangleLeftDown.clone();
triangleFrontDown.rotateOnWorldAxis(yAx, Math.PI/2);
scene.add(triangleFrontDown);
var triangleBackDown= triangleLeftDown.clone();
triangleBackDown.rotateOnWorldAxis(yAx, -Math.PI/2);
scene.add(triangleBackDown);
triangleLeftDown.translateOnAxis(yAx,-50);
triangleRightDown.translateOnAxis(yAx,-50);
triangleFrontDown.translateOnAxis(yAx,-50);
triangleBackDown.translateOnAxis(yAx,-50);
triangleLeftDown.translateOnAxis(zAx,-50);
triangleRightDown.translateOnAxis(zAx,-50);
triangleFrontDown.translateOnAxis(zAx,-50);
triangleBackDown.translateOnAxis(zAx,-50);



var axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );


/////////
///////// DIRECTION
/////////

// grid helper
var gh = new THREE.GridHelper( 1000, 10, 0xcccccc, 0x555555 );
//scene.add( gh );
gh.position.y = -0.02;


// scene
camera.position.z = 500;
camera.position.y = 500;
// controls.center.set(0, 80, 0);
//scene.add(box);
//scene.add(sphere);
scene.add(lightAmb);
scene.add(light);
scene.add(light2);
scene.add(light3);

/////////
///////// RENDER/ANIMATION LOOP
/////////

// set
let time = 0;
let render = function() {
  requestAnimationFrame(render);
  /*box.rotation.x += 0.01;
  box.rotation.y += 0.01;
  sphere.position.x = Math.cos(time)*100;
  sphere.position.y = Math.sin(time)*100;*/
  //camera.position.x = -200+Math.sin(time)*300;
  time+=0.02;
  controls.update()
  renderer.render(scene, camera)
};

// go
render();


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //controls.handleResize();
}
