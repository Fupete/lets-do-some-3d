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
// noise-bubbles

/////////
///////// SETUP + RENDER
/////////

// Scene
let scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.fog = new THREE.FogExp2(new THREE.Color(0xf0f0f0), 0.001);

// Camera
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 1000);

// Renderer
let renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // < Shadows enabled
renderer.shadowMap.Type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Orbit controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.19;

let perlin = new THREE.SimplexNoise()
// let perlin = new THREE.ImprovedNoise()

// Add listener for window resize.
window.addEventListener('resize', onWindowResize, false);


/////////
///////// LIGHTS
/////////

// Ambient
let lightAmb = new THREE.AmbientLight( 0x666666 );
scene.add(lightAmb);

// Directional
// let light = new THREE.DirectionalLight(0xdddddd, .5);
// light.position.set(-100, 200, 50);
// light.penumbra = 0.8;
// light.castShadow = true;
// light.receiveShadow = true;
// light.shadow.camera.near = 0.5;
// scene.add(light);
// let dlight = new THREE.DirectionalLightHelper( light );
// scene.add( dlight );

// Point
let light2 = new THREE.PointLight(0xeeeeee, 0.9);
light2.position.set(0, 200, -150);
light2.castShadow = true;
scene.add(light2);
// let plight2 = new THREE.PointLightHelper( light2 );
// scene.add( plight2 );

// Spot
let light3 = new THREE.SpotLight(0xffffff, 0.7);
light3.position.set(200, 400, 200);
light3.angle = Math.PI / 7;
light3.penumbra = 0.8;
light3.castShadow = true;
light3.receiveShadow = true;
light3.shadow.camera.near	= 0.5;
// light3.shadowCameraVisible = true;
light3.shadow.mapSize.width = light3.shadow.mapSize.width = 4096;
scene.add(light3);
// let slight3 = new THREE.SpotLightHelper( light3 );
// scene.add( slight3 );

/////////
///////// MATERIALS
/////////

let material = new THREE.MeshStandardMaterial({
  color: 0x676767,
  specular: 0xfafafa,
  shininess: 0.3,
  // side: THREE.DoubleSide,
  // transparent: true,
  // opacity: 0.4
}) // + material
// Normal Lambert Phong Standard Toon

/////////
///////// UI
/////////

let guiOptions = {
  // REFRESH: function() { crea(); },
  mondo: 10,
  noSfere: 10
}

let gui = new dat.GUI();
gui.add(guiOptions, 'mondo', 1, 300, 1).onFinishChange(function() {
  riCrea()
});
gui.add(guiOptions, 'noSfere', 1, 2000, 1).onFinishChange(function() {
  riCrea()
});

let mondo = guiOptions.mondo
let noSfere = guiOptions.noSfere

function riCrea() { // < per dat gui ...
  for (let id=0; id<spheres.length; id++) {
    scene.remove(spheres[id]);
  }
  t=[]
  tincr=[]
  spheres=[]
  mondo = guiOptions.mondo
  noSfere = guiOptions.noSfere
  crea()
}

/////////
///////// GEOMETRIES
/////////

let geomSph = new THREE.SphereGeometry(2,18,18)
let spheres = []
let tis = []
let tincr = []
let colore = new THREE.Color( 0xffffff )

crea()

function crea() {
  for(let id = 0; id < noSfere; id++){
      // let colore = "0x" + Math.floor(Math.random()*16777215).toString(16)
      colore.setHex( Math.random() * 0xffffff )
      spheres[id] = new THREE.Mesh(geomSph, new THREE.MeshPhongMaterial({color: colore}))
      scene.add(spheres[id])
      tis.push(id)
      tincr.push(0.0005 + Math.random() * 0.003)
  }
}

/////////
///////// SCENE/CAMERA
/////////

controls.target.set(0,0,0);
camera.position.z = -4 * mondo;
/////////
///////// RENDER/ANIMATION LOOP
/////////

// set
let time = 0;
let render = function() {
  requestAnimationFrame(render)
  for(let id = 0; id < spheres.length; id++){
    spheres[id].position.x = perlin.noise(tis[id], 0, 0) * mondo
    spheres[id].position.y = perlin.noise(tis[id]+5, 0, 0) * mondo
    spheres[id].position.z = perlin.noise(tis[id]+10, 0, 0) * mondo
    spheres[id].scale.x = perlin.noise(tis[id]+15, 0, 0) + 1
    spheres[id].scale.y = perlin.noise(tis[id]+15, 0, 0) + 1
    spheres[id].scale.z = perlin.noise(tis[id]+15, 0, 0) + 1
    tis[id]+=tincr[id]
  }
  controls.update()
  renderer.render(scene, camera)
};

// go
render();


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
