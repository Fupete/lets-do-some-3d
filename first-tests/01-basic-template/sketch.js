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
// 01-basic-template (1st approach with three.js)

/////////
///////// SETUP
/////////

// Scene
let scene = new THREE.Scene();
scene.background = new THREE.Color( 0x2357ab);
scene.fog = new THREE.FogExp2( scene.background, 0.0017 );

// Camera
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);

// Renderer
let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
let controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.19;


/////////
///////// LIGHTS
/////////

// Ambient
let lightAmb = new THREE.AmbientLight( 0x000000 );

// Directional
let light = new THREE.DirectionalLight( 0xdddddd, 1.5 );
light.position.set( -200, 200, 0 );
let dlh = new THREE.DirectionalLightHelper( light );
scene.add( dlh );

// Point
let light2 = new THREE.PointLight( 0x00feb4, 0.7 );
light2.position.set (-50,50,50);
let plh = new THREE.PointLightHelper( light2 );
scene.add( plh );

// Spot
let light3 = new THREE.SpotLight( 0xffffa2, .8 );
light3.position.set (100,-100,100);
light3.angle = Math.PI / 7;
light3.penumbra = 0.8;
let slh = new THREE.SpotLightHelper( light3 );
scene.add( slh );


/////////
///////// MATERIALS
/////////

let material = new THREE.MeshPhongMaterial({
  wireframe:false,
  color: 0xee0088,
  specular: 0xffffff,
  shininess: 4,
  }); // + material
// Normal Lambert Phong Standard Toon


/////////
///////// GEOMETRIES
/////////

// let's make a box
let geometry = new THREE.BoxGeometry(36, 70, 100); // dimensions
let box = new THREE.Mesh(geometry, material); // = the box

// let's make a sphere
let geomSphere = new THREE.SphereGeometry( 35, 35, 35 );
let sphere = new THREE.Mesh(geomSphere, material); // = the box


/////////
///////// DIRECTION
/////////

// grid helper
/*var gh = new THREE.GridHelper( 500, 10, 0xcccccc, 0x555555 );
scene.add( gh );
gh.position.y = -0.02;*/

// scene
camera.position.z = 500;
scene.add(box);
scene.add(sphere);
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
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
  sphere.position.x = Math.cos(time)*100;
  sphere.position.y = Math.sin(time)*100;
  light.position.x = -100+Math.sin(time)*200;
  time+=0.05;
  controls.update()
  renderer.render(scene, camera)
};

// go
render();
