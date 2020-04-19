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
scene.fog = new THREE.FogExp2(new THREE.Color(0xffffff), 0.005);

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

// var cubeMat = new THREE.MeshStandardMaterial({envMap: textureCube, roughness: 0.5, metalness: 1});

// var cubeGeo = new THREE.BoxGeometry(2, 2, 2, 10, 10, 10);
// var smooth = cubeGeo.clone();
// var modifier = new THREE.SubdivisionModifier(3);
// modifier.modify(smooth);
// cubeGeo = smooth;
//
// cubeGeo.computeVertexNormals();

let material = new THREE.MeshStandardMaterial({
  color: 0x676767,
  roughness: 0.5,
  metalness: 1,
}) // + material
// Normal Lambert Phong Standard Toon

/////////
///////// UI
/////////

let guiOptions = {
  // REFRESH: function() { crea(); },
  worldSize: 10,
  elementsNo: 10,
  elementsType: 'A',
  minSpeed: 0.0005,
  maxSpeed: 0.0035,
  style: 'A',
  normalSize: 2,
  maxScale: 1
}

let gui = new dat.GUI();

gui.add(guiOptions, 'worldSize', 1, 300, 1).onFinishChange(function() {
  riCrea()
});
gui.add(guiOptions, 'elementsNo', 1, 2000, 1).onFinishChange(function() {
  riCrea()
});
gui.add(guiOptions, 'elementsType', { Cubes: 'A', Astro: 'B', Spheres: 'C' }).onFinishChange(function() {
  riCrea()
});
gui.add(guiOptions, 'minSpeed', 0.0005, 0.001, 0.00005).onFinishChange(function() {
  riCrea()
});
gui.add(guiOptions, 'maxSpeed', 0.0010, 0.01, 0.0005).onFinishChange(function() {
  riCrea()
});
gui.add(guiOptions, 'normalSize', 1, 10, 1).onFinishChange(function() {
  riCrea()
});
gui.add(guiOptions, 'maxScale', 1, 10, 1).onFinishChange(function() {
  riCrea()
});
gui.add(guiOptions, 'style', { Borg: 'A', Hippie: 'B'}).onFinishChange(function() {
  riCrea()
});

let worldSize = guiOptions.worldSize
let elementsNo = guiOptions.elementsNo
let minSpeed = guiOptions.minSpeed
let maxSpeed = guiOptions.maxSpeed
let normalSize = guiOptions.normalSize
let maxScale = guiOptions.maxScale

/////////
///////// GEOMETRIES
/////////

let geomSph

let elements = []
let tis = []
let tincr = []
let colore = new THREE.Color( 0xffffff )

function crea() {
  let colorato = gui.__controllers[7].__select.selectedOptions[0].value
  for(let id = 0; id < elementsNo; id++){
      if (colorato === 'A') {
        elements[id] = new THREE.Mesh(geomSph, material)
      }
      else {
        colore.setHex( Math.random() * 0xffffff )
        elements[id] = new THREE.Mesh(geomSph, new THREE.MeshPhongMaterial({color: colore}))
      }
      scene.add(elements[id])
      tis.push(id)
      tincr.push(minSpeed + Math.random() * maxSpeed)
  }
}

function riCrea() { // < per dat gui ...
  let type = gui.__controllers[2].__select.selectedOptions[0].value
  if (type === 'A') { geomSph = new THREE.BoxGeometry(normalSize, normalSize, normalSize, 10, 10, 10) }
  else if (type === 'B') { geomSph = new THREE.SphereGeometry(normalSize,1,1) }
  else if (type === 'C') { geomSph = new THREE.SphereGeometry(normalSize,36,36) }
  //
  if (type === 'A') {
    geomSph.computeVertexNormals();
    var smooth = geomSph.clone();
    var modifier = new THREE.SubdivisionModifier(3);
    modifier.modify(smooth);
    geomSph = smooth;
  }
  //
  for (let id=0; id<elements.length; id++) {
    scene.remove(elements[id]);
  }
  t=[]
  tincr=[]
  elements=[]
  worldSize = guiOptions.worldSize
  elementsNo = guiOptions.elementsNo
  minSpeed = guiOptions.minSpeed
  maxSpeed = guiOptions.maxSpeed
  maxScale = guiOptions.maxScale
  normalSize = guiOptions.normalSize
  crea()
}

riCrea() // < let's start

/////////
///////// SCENE/CAMERA
/////////

controls.target.set(0,0,0);
camera.position.z = -4 * worldSize;
/////////
///////// RENDER/ANIMATION LOOP
/////////

// set
let time = 0;
let render = function() {
  requestAnimationFrame(render)
  for(let id = 0; id < elements.length; id++){
    elements[id].position.x = perlin.noise(tis[id], 0, 0) * worldSize
    elements[id].position.y = perlin.noise(tis[id]+5, 0, 0) * worldSize
    elements[id].position.z = perlin.noise(tis[id]+10, 0, 0) * worldSize
    elements[id].scale.x = perlin.noise(tis[id]+15, 0, 0) * maxScale + 1
    elements[id].scale.y = perlin.noise(tis[id]+15, 0, 0) * maxScale + 1
    elements[id].scale.z = perlin.noise(tis[id]+15, 0, 0) * maxScale + 1
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
