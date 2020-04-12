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
// 03-basic-template-effect-ascii (1st approach with three.js)
// started from the example at http://davidscottlyons.com/threejs-intro/#render-loop

/////////
///////// SETUP
/////////

// setup scene, camera and renderer
let scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000);
scene.fog = new THREE.FogExp2( scene.background, 0.002 );
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 2000);
let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);

//document.body.appendChild(renderer.domElement);

let effect = new THREE.AsciiEffect(renderer, ' .:-+*=%@#', { invert: true } ); // XXX
				effect.setSize( window.innerWidth, window.innerHeight );
				effect.domElement.style.color = 'white';
				effect.domElement.style.backgroundColor = 'black';
document.body.appendChild(effect.domElement);

// controls
//let controls = new THREE.OrbitControls( camera, renderer.domElement );
let controls = new THREE.OrbitControls( camera, effect.domElement ); // XXX
        controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
				controls.dampingFactor = 0.25;
				//controls.screenSpacePanning = false;
				//controls.minDistance = 100;
				//controls.maxDistance = 500;
        controls.enablePan = false;
        controls.enableZoom = true;
        controls.enableRotate = true;
				//controls.maxPolarAngle = Math.PI / 2;
        //controls.minPolarAngle = Math.PI / 2;

// lights
let lightAmb = new THREE.AmbientLight( 0x000000 );

let light = new THREE.DirectionalLight( 0xdddddd, 1.5 );
light.position.set( -200, 200, 0 );
//let dlh = new THREE.DirectionalLightHelper( light );
//scene.add( dlh );

let light2 = new THREE.PointLight( 0x00feb4, 0.7 );
light2.position.set (-50,50,50);
//let plh = new THREE.PointLightHelper( light2 );
//scene.add( plh );

let light3 = new THREE.SpotLight( 0xffffa2, .8 );
light3.position.set (100,-100,100);
light3.angle = Math.PI / 7;
light3.penumbra = 0.8;
//let slh = new THREE.SpotLightHelper( light3 );
//scene.add( slh );

// material...
let material = new THREE.MeshPhongMaterial({
  wireframe:false,
  color: 0xee00ee,
  specular: 0xff00ff,
  shininess: 4,
  /*map: texture,
  specularMap: specMap,
  normalMap: normalMap*/
  }); // + material
// Normal Lambert Phong Standard Toon

let materialSphere = new THREE.MeshPhongMaterial({
  wireframe:false,
  color: 0xee00ee,
  specular: 0xff00ff,
  shininess: 4,
  /*map: texture,
  specularMap: specMap,
  normalMap: normalMap*/
  }); // + material
// Normal Lambert Phong Standard Toon

// let's make a box
let geometry = new THREE.BoxGeometry(36, 70, 100); // dimensions
let box = new THREE.Mesh(geometry, material); // = the box

// let's make a sphere
let geomSphere = new THREE.SphereGeometry( 35, 35, 35 );
let sphere = new THREE.Mesh(geomSphere, materialSphere); // = the box

// grid helper
var gh = new THREE.GridHelper( 500, 10, 0xcccccc, 0x555555 );
//scene.add( gh );
gh.position.y = -0.02;

// ready
camera.position.z = 500;
box.scale.set(1,3,1); // scale, rotation, position ...
scene.add(box);
scene.add(sphere);
scene.add(lightAmb);
scene.add(light);
scene.add(light2);
scene.add(light3);

let time = 0;
// set
let render = function() {
  requestAnimationFrame(render);
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
  sphere.position.x = Math.cos(time)*100;
  sphere.position.y = Math.sin(time)*100;
  light.position.x = -100+Math.sin(time)*200;
  time+=0.05;

  //renderer.render(scene, camera)
  effect.render(scene, camera); // XXX
};

// go
render();
