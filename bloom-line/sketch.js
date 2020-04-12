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
// bloom-line (1st approach with three.js to render my allucinations)

/////////
///////// SETUP
/////////

// Scene
let scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000);
// scene.fog = new THREE.FogExp2( scene.background, 0.0017 );

// Camera
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 4000);

// Renderer
let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;
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
let lightAmb = new THREE.AmbientLight( 0xffffff );
scene.add(lightAmb);

// Directional
let light = new THREE.DirectionalLight( 0xefdddd, 1 );
light.position.set( -200, 200, 0 );
/*let dlh = new THREE.DirectionalLightHelper( light );
scene.add( dlh );*/
scene.add(light);

// Point
let light2 = new THREE.PointLight( 0x99feb4, 1.5 );
light2.position.set (-50,150,100);
/*let plh = new THREE.PointLightHelper( light2 );
scene.add( plh );*/
scene.add(light2);

// Spot
let light3 = new THREE.SpotLight( 0xffffa2, 1.2 );
light3.position.set (400,100,100);
light3.angle = Math.PI / 7;
light3.penumbra = 0.8;
/*let slh = new THREE.SpotLightHelper( light3 );
scene.add( slh );*/
scene.add(light3);

/////////
///////// MATERIALS
/////////

var oceanMat = new THREE.MeshStandardMaterial( {
  color: 0x0000ff,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.9,
} );

var wireMat = new THREE.MeshLambertMaterial( {
  wireframe: false,
  color: 0xffff00,
  //side: THREE.DoubleSide
} );

/////////
///////// GEOMETRIES
/////////

let loader = new THREE.GLTFLoader().setPath( 'assets/' );
loader.load( 'scene.gltf', function ( gltf ) {
	gltf.scene.traverse( function ( child ) {
		// if ( child.isMesh ) {
			child.material = wireMat;
		// }
	});
  gltf.scene.position.y = 200;
  gltf.scene.position.x = 0;
  gltf.scene.position.z = -600;
  gltf.scene.rotation.x = -Math.PI/2;
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  var model = gltf.scene;
	scene.add( model );
});

// let's make the plane
let seaPlane = new THREE.PlaneGeometry(10000,10000);
//oceanMat = matCool;
let sea = new THREE.Mesh(seaPlane, oceanMat);
sea.rotation.x = - Math.PI/2;
sea.position.y = 10;
//scene.add(sea);

////////
///////// DIRECTION
/////////

// grid helper
var gh = new THREE.GridHelper( 1000, 10, 0xcccccc, 0x555555 );
scene.add( gh );
gh.position.y = -0.02;


// scene
camera.position.z = 1000;
camera.position.y = 100;

/////////
///////// EFFECTS
/////////

let params = {
  exposure: 1.5,
  bloomStrength: 1.7,
  bloomThreshold: 0,
  bloomRadius: 0.68
};

let renderScene = new THREE.RenderPass( scene, camera );
let bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0, 1.7 );
bloomPass.renderToScreen = true;
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

let composer = new THREE.EffectComposer( renderer );
composer.setSize( window.innerWidth, window.innerHeight );
composer.addPass( renderScene );
composer.addPass( bloomPass );

/////////
///////// GUI
/////////

let gui = new dat.GUI();
gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {
	renderer.toneMappingExposure = Math.pow( value, 4.0 );
} );
gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {
	bloomPass.threshold = Number( value );
} );
gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {
	bloomPass.strength = Number( value );
} );
gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
	bloomPass.radius = Number( value );
} );


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
  light2.position.x = -200+Math.sin(time)*300;
  light2.position.y = Math.cos(time)*300;
  time+=0.02;
  controls.update();
  composer.render();
  //renderer.render(scene, camera);
};

// go
render();


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
		composer.setSize(window.innerWidth,window.innerHeight );
    //controls.handleResize();
}
