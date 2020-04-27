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
// project-lazarus

/////////
///////// SETUP + RENDER
/////////

// Vars
let near = 1, far = 1000, floor = 0
let shadowMapWidth = 2048, shadowMapHeight = 2048

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x444444)
scene.fog = new THREE.FogExp2( scene.background, .1)

// Camera
let aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(35, aspect, near, far)

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.toneMappingExposure = 1.2;
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true; // < Shadows enabled
renderer.shadowMap.Type = THREE.BasicShadowMap // BasicShadowMap | PCFShadowMap | PCFSoftShadowMap | THREE.VSMShadowMap
// renderer.autoClear = false
document.body.appendChild(renderer.domElement)

// Post-Processing
let composer, glitchPass

// Orbit controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.19;

// Utilities
let perlin = new THREE.SimplexNoise()
let clock = new THREE.Clock()

// Add listener for window resize.
window.addEventListener('resize', onWindowResize, false)


/////////
///////// LIGHTS
/////////

// Ambient
let lightAmb = new THREE.AmbientLight( 0x444444 )
scene.add(lightAmb)

// Directional
let lightS = new THREE.SpotLight( 0xffffff, .7, 0, Math.PI / 10, .4 )
lightS.position.set( 0, 14, -7 )
scene.add(lightS)
// let dlh = new THREE.DirectionalLightHelper( lightS )
// scene.add( dlh )

let lightFront = new THREE.PointLight(0xffffff, .7)
lightFront.position.set(0,7,3)
lightFront.castShadow = true
lightFront.shadow.bias = -0.00001
lightFront.shadow.mapSize.width = shadowMapWidth
lightFront.shadow.mapSize.height = shadowMapHeight
scene.add(lightFront)

let lightFront2 = new THREE.PointLight(0xffffff, .1)
lightFront2.position.set(0,1,-5)
scene.add(lightFront2)
// let dlh = new THREE.PointLightHelper( lightFront )
// scene.add( dlh )
// let dlh2 = new THREE.PointLightHelper( lightFront2 )
// scene.add( dlh2 )




/////////
///////// GEOMETRIES
/////////

// let's make a ground
let groundGeom = new THREE.PlaneBufferGeometry( 100, 100 )
let groundMate = new THREE.MeshPhongMaterial ( { color: 0xaaaaaa })
let ground = new THREE.Mesh ( groundGeom, groundMate )
ground.position.set (0, floor, 0)
ground.rotation.x = - Math.PI / 2
ground.scale.set (10, 10, 10)
ground.castShadow = false
ground.receiveShadow = true
scene.add(ground)

let loader = new THREE.GLTFLoader()
let dracoLoader = new THREE.DRACOLoader()
dracoLoader.setDecoderPath( 'https://cdn.jsdelivr.net/npm/three@0.115.0/examples/js/libs/draco/gltf/' )
loader.setDRACOLoader( dracoLoader )

let lazarus, mixer, clip1, action1
const lazarusMate = new THREE.MeshStandardMaterial({
  skinning: true,
  color: 0xffffff,
  emissive: 0x000000,
  metalness:.5,
  side: THREE.BackSide,
  shadowSide: THREE.DoubleSide
})

loader.load( './assets/project-lazarus-processed.glb',
function ( gltf ) { //XXX
//loader.load( './assets/calavera.glb', function ( gltf ) {
  lazarus = gltf.scene.children[0]
  console.log("lazarus model loaded")
  lazarus.position.set (0,1.95,0)
  lazarus.scale.set(1,1,1)
  // lazarus.castShadow = true
  // lazarus.receiveShadow = true
  lazarus.traverse((piece) => {
    if (piece.isMesh) {
      piece.material = lazarusMate
      // console.log(piece.material)
      // // piece.material.color = new THREE.Color( 0xffffff ),
      // // piece.material.metalness = 0,
      // // // piece.material.emissive = new THREE.Color ( 0x000000 ),
      // // piece.material.roughtness = .5,
      // // piece.material.wireframe = true,
      piece.castShadow = true
      piece.receiveShadow = true
    }
  })
  mixer = new THREE.AnimationMixer(lazarus);
  clip1 = gltf.animations[0]
  action1 = mixer.clipAction(clip1)
  action1.play()
  scene.add( lazarus )
}, function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
},  function ( error ) {
	 console.error( error )
} )

/////////
///////// SCENE/CAMERA
/////////

controls.target.set(0,1.5,0)
camera.position.set( 0, floor+2, 7 )

/////////
///////// POST/PROCESSING
/////////

composer = new THREE.EffectComposer( renderer )
composer.addPass( new THREE.RenderPass( scene, camera ) )

glitchPass = new THREE.GlitchPass()
composer.addPass( glitchPass )

/////////
///////// RENDER/ANIMATION LOOP
/////////

// set
let time = 0;
let render = function() {
  requestAnimationFrame(render)
  controls.update()
  let dt = clock.getDelta()
  if (mixer) mixer.update(dt);
  if (lazarus) lazarus.rotation.y = Math.sin(time) * .5
  renderer.render(scene, camera)
  // composer.render()
  time+=0.02
};

// go
render();


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize( window.innerWidth, window.innerHeight )
}
