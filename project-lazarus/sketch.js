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

// if ( WEBGL.isWebGL2Available() === false ) {
//
// 	document.body.appendChild( WEBGL.getWebGL2ErrorMessage() )
//
// }

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
  antialias: false
})
let pRatio = window.devicePixelRatio
if (pRatio > 2) pRatio = 2 // < not too much on mobile...
renderer.setPixelRatio(pRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true // < Shadows enabled
renderer.shadowMap.Type = THREE.PCFSoftShadowMap // BasicShadowMap | PCFShadowMap | PCFSoftShadowMap | THREE.VSMShadowMap
// renderer.autoClear = false
document.body.appendChild(renderer.domElement)

// Post-Processing
// let composer, glitchPass

// Orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enablePan = false
controls.enableDamping = true
controls.dampingFactor = 0.19

// Utilities
const perlin = new THREE.SimplexNoise()
const clock = new THREE.Clock()

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
// scene.add(lightS)
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

let intensity = 1.5
let distance = 2
let decay = 2.0

// let c1 = 0xff0040, c2 = 0x0040ff, c3 = 0x80ff80, c4 = 0xffaa00, c5 = 0x00ffaa, c6 = 0xff1100
let c1 = c2 = c3 = c4 = c5 = c6 = 0xffffff

let sphere = new THREE.SphereBufferGeometry( 0.02, 3, 3 )

light1 = new THREE.PointLight( c1, intensity, distance, decay )
light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c1 } ) ) )
scene.add( light1 )

light2 = new THREE.PointLight( c2, intensity, distance, decay )
light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c2 } ) ) )
scene.add( light2 )

light3 = new THREE.PointLight( c3, intensity, distance, decay )
light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c3 } ) ) )
scene.add( light3 )




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

// let's load lazarus
let loader = new THREE.GLTFLoader()
let dracoLoader = new THREE.DRACOLoader()
dracoLoader.setDecoderPath( "https://www.gstatic.com/draco/v1/decoders/" )
// dracoLoader.setDecoderPath( "https://cdn.jsdelivr.net/npm/three@0.115.0/examples/js/libs/draco/gltf/" )
loader.setDRACOLoader( dracoLoader )

let lazarus, mixer, clip1, action1
const lazarusMate = new THREE.MeshStandardMaterial({
  skinning: true,
  color: 0xffffff,
  emissive: 0x000000,
  metalness:.5,
  // side: THREE.BackSide,
  // shadowSide: THREE.FrontSide
})

loader.load( './assets/project-lazarus-processed.glb',
function ( gltf ) { //XXX
  dracoLoader.dispose()
  lazarus = gltf.scene.children[0]
  console.log("lazarus model loaded")
  lazarus.position.set (0,1.95,0)
  lazarus.scale.set(1,1,1)
  lazarus.traverse((piece) => {
    if (piece.isMesh) {
      piece.material = lazarusMate
      piece.castShadow = true
      // piece.receiveShadow = true
    }
  })
  mixer = new THREE.AnimationMixer(lazarus)
  clip1 = gltf.animations[0]
  action1 = mixer.clipAction(clip1)
  action1.play()
  scene.add( lazarus )
}, function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
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

// composer = new THREE.EffectComposer( renderer )
// composer.addPass( new THREE.RenderPass( scene, camera ) )
//
// glitchPass = new THREE.GlitchPass()
// composer.addPass( glitchPass )

/////////
///////// RENDER/ANIMATION LOOP
/////////

// set
let time = 0
let render = function() {
  requestAnimationFrame(render)
  controls.update()

  let dt = clock.getDelta()
  if (mixer) mixer.update(dt)
  if (lazarus) lazarus.rotation.y = Math.sin(time) * .5

  let d = 3
  light1.position.x = perlin.noise( time * .4, 0, 0 ) * 3
  light1.position.z = perlin.noise( time * .3 + 5, 0, 0 ) * 3
  light1.position.y = perlin.noise( time * .5 + 10, 0, 0 ) * 4
  light2.position.x = perlin.noise( time * .2 + 15, 0, 0 ) * 4
  light2.position.z = perlin.noise( time * .5 + 20, 0, 0 ) * 4
  light2.position.y = perlin.noise( time * .3 + 25, 0, 0 ) * 2
  light3.position.x = perlin.noise( time * .2 + 30, 0, 0 ) * 3
  light3.position.z = perlin.noise( time * .3 + 35, 0, 0 ) * 5
  light3.position.y = perlin.noise( time * .4 + 40, 0, 0 ) * 2 + 1


  renderer.render(scene, camera)
  // composer.render()
  time+=0.015
}

// go
render()


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  // composer.setSize( window.innerWidth, window.innerHeight )
}
