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
// calaveras-mafia
// partly inspired by this official example:

/////////
///////// SETUP + RENDER
/////////

// Vars
let near = 10, far = 3000, floor = -250
let shadowMapWidth = 2048, shadowMapHeight = 2048

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x444444)
scene.fog = new THREE.Fog( scene.background, 1000, far)

// Camera
let aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(35, aspect, near, far)

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true; // < Shadows enabled
renderer.shadowMap.Type = THREE.PCFShadowMap // BasicShadowMap | PCFShadowMap | PCFSoftShadowMap | THREE.VSMShadowMap
// renderer.autoClear = false
document.body.appendChild(renderer.domElement)

// Orbit controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.19;

// Utilities
// let clock = new THREE.clock() ??
let perlin = new THREE.SimplexNoise()

// Add listener for window resize.
window.addEventListener('resize', onWindowResize, false)


/////////
///////// LIGHTS
/////////

// Ambient
let lightAmb = new THREE.AmbientLight( 0x444444 );
scene.add(lightAmb);

// Spot
let lightS = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 5, 0.3)
lightS.position.set(0, 1500, 1000)
lightS.target.position.set(0,0,0)
lightS.castShadow = true
lightS.shadow.camera.near	= 1200
lightS.shadow.camera.far = 2500
lightS.shadow.bias = 0.0001
lightS.shadow.mapSize.width = shadowMapWidth
lightS.shadow.mapSize.height = shadowMapHeight
scene.add(lightS)
// let slightS = new THREE.SpotLightHelper( lightS );
// scene.add( slightS );


/////////
///////// GEOMETRIES
/////////

// let's make a ground
let groundGeom = new THREE.PlaneBufferGeometry( 100, 100 )
let groundMate = new THREE.MeshPhongMaterial ( { color: 0xaaaaaa })
let ground = new THREE.Mesh ( groundGeom, groundMate )
ground.position.set (0, floor, 0)
ground.rotation.x = - Math.PI / 2
ground.scale.set (100, 100, 100)
ground.castShadow = false
ground.receiveShadow = true
scene.add(ground)

let loader = new THREE.GLTFLoader()
let dracoLoader = new THREE.DRACOLoader()
dracoLoader.setDecoderPath( 'https://cdn.jsdelivr.net/npm/three@0.115.0/examples/js/libs/draco/gltf/' )
loader.setDRACOLoader( dracoLoader )

let calavera
let calaveraMate = new THREE.MeshLambertMaterial ( {
  color: 0xffffff,
  emissive: 0xff0000,
  wireframe: true
})

loader.load( './assets/calavera-processed.glb', function ( gltf ) { //XXX
//loader.load( './assets/calavera.glb', function ( gltf ) {
  calavera = gltf.scene.children[0]
  console.log("calavera model loaded")
  calavera.position.set (0,20,0)
  calavera.scale.set(400,400,400)
  calavera.material = calaveraMate
  calavera.castShadow = true
  calavera.receiveShadow = true
  scene.add( calavera )
}, undefined, function ( error ) {
	console.error( error )
} )

let sphereGeom = new THREE.SphereGeometry(100,18,18)
let sphereMate = new THREE.MeshLambertMaterial ( { 
  color: 0xffffff,
  emissive: 0xff0000,
  wireframe: true
})
let sphere = new THREE.Mesh ( sphereGeom, sphereMate )
sphere.castShadow = true
sphere.position.set(700, floor + 100, 500)
scene.add(sphere)

let astroGeom = new THREE.SphereGeometry(100,4,2)
let astroMate = new THREE.MeshLambertMaterial ( { 
  color: 0xffffff,
  emissive: 0xff0000,
  wireframe: true
})
let astro = new THREE.Mesh ( astroGeom, astroMate )
astro.castShadow = true
astro.position.set(0, floor + 800, 0)
scene.add(astro)

/////////
///////// SCENE/CAMERA
/////////

controls.target.set(0,0,0)
camera.position.set( 700, 50, 1900 )

/////////
///////// RENDER/ANIMATION LOOP
/////////

// set
let time = 0;
let render = function() {
  requestAnimationFrame(render)
  controls.update()
  // renderer.clear()
  if (calavera) calavera.rotation.y = Math.sin(time) * .5
  let x
  let z
  sphere.position.set(Math.sin(time)*700, floor + 100, Math.cos(time)*700)
  sphere.rotation.y += 0.1
  astro.rotation.y -= 0.01
  renderer.render(scene, camera)
  time+=0.02
};

// go
render();


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  controls.handleResize()
}
