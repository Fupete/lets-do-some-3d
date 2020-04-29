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
// project-lazarus, using my 1st low poly character modeled in b3d

/////////
///////// SETUP + RENDER
/////////

// Vars
let near = 1,
  far = 1000,
  floor = 0
let shadowMapWidth = 2048,
  shadowMapHeight = 2048
let api = {
  state: 'PinkPanther_Walk'
}

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x444444)
scene.fog = new THREE.FogExp2(scene.background, .1)

// Camera
let aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(35, aspect, near, far)

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
let pRatio = window.devicePixelRatio
if (pRatio > 2) pRatio = 2 // < not too much on mobile...
// renderer.setPixelRatio(pRatio) // XXX disabled for mobile performance...
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true // < Shadows enabled
renderer.shadowMap.Type = THREE.PCFSoftShadowMap // BasicShadowMap | PCFShadowMap | PCFSoftShadowMap | THREE.VSMShadowMap
// renderer.autoClear = false
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement)

// Orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enablePan = false
controls.enableDamping = true
controls.dampingFactor = 0.19

// Utilities
const perlin = new THREE.SimplexNoise()
const clock = new THREE.Clock()
let gui, mixer, actions, activeAction, previousAction

// Add listener for window resize.
window.addEventListener('resize', onWindowResize, false)


/////////
///////// LIGHTS
/////////

// Ambient
let lightAmb = new THREE.AmbientLight(0x444444)
scene.add(lightAmb)

// Directional
let lightS = new THREE.SpotLight(0xffffff, .7, 0, Math.PI / 10, .4)
lightS.position.set(0, 14, -7)
scene.add(lightS)
// let dlh = new THREE.DirectionalLightHelper( lightS )
// scene.add( dlh )

let lightFront = new THREE.PointLight(0xffffff, .7)
lightFront.position.set(0, 7, 3)
lightFront.castShadow = true
lightFront.shadow.bias = -0.00003
lightFront.shadow.mapSize.width = shadowMapWidth
lightFront.shadow.mapSize.height = shadowMapHeight
scene.add(lightFront)
// let dlh = new THREE.PointLightHelper( lightFront )
// scene.add( dlh )

let lightFront2 = new THREE.PointLight(0xffffff, .1)
lightFront2.position.set(0, 1, -5)
scene.add(lightFront2)
// let dlh2 = new THREE.PointLightHelper( lightFront2 )
// scene.add( dlh2 )

let intensity = 1.5
let distance = 2
let decay = 2.0
let c = 0xffffff
let sphere = new THREE.SphereBufferGeometry(0.02, 3, 3)
let lightMate = new THREE.MeshBasicMaterial({
  color: c
})

light1 = new THREE.PointLight(c, intensity, distance, decay)
light1.add(new THREE.Mesh(sphere, lightMate))
scene.add(light1)

light2 = new THREE.PointLight(c, intensity, distance, decay)
light2.add(new THREE.Mesh(sphere, lightMate))
scene.add(light2)

light3 = new THREE.PointLight(c, intensity, distance, decay)
light3.add(new THREE.Mesh(sphere, lightMate))
scene.add(light3)




/////////
///////// GEOMETRIES
/////////

// let's make a ground
let groundGeom = new THREE.PlaneBufferGeometry(100, 100)
let groundMate = new THREE.MeshPhongMaterial({
  color: 0xaaaaaa,
  depthWrite: false
})
let ground = new THREE.Mesh(groundGeom, groundMate)
ground.position.set(0, floor, 0)
ground.rotation.x = -Math.PI / 2
ground.scale.set(10, 10, 10)
ground.castShadow = false
ground.receiveShadow = true
scene.add(ground)

// let's load lazarus
let loader = new THREE.GLTFLoader()
let dracoLoader = new THREE.DRACOLoader()
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/")
// dracoLoader.setDecoderPath( "https://cdn.jsdelivr.net/npm/three@0.115.0/examples/js/libs/draco/gltf/" )
loader.setDRACOLoader(dracoLoader)

let lazarus /*, mixer, clip1, action1*/
const lazarusMate = new THREE.MeshStandardMaterial({
  skinning: true,
  color: 0xffffff,
  emissive: 0x000000,
  metalness: .5,
  side: THREE.FrontSide,
  shadowSide: THREE.FrontSide
})

loader.load('./assets/project-lazarus-processed.glb',
  function(gltf) { //XXX
    dracoLoader.dispose()
    lazarus = gltf.scene.children[0]
    console.log("lazarus model loaded")
    lazarus.position.set(0, 1.95, 0)
    // lazarus.scale.set(1, 1, 1)
    lazarus.traverse((piece) => {
      if (piece.isMesh) {
        piece.material = lazarusMate
        piece.castShadow = true
        piece.receiveShadow = true
      }
    })
    scene.add(lazarus)
    createGUI(lazarus, gltf.animations)
    // mixer = new THREE.AnimationMixer(lazarus)
    // clip1 = gltf.animations[1]
    // action1 = mixer.clipAction(clip1)
    // action1.play()
  },
  function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded')
  },
  function(error) {
    console.error(error)
  })

/////////
///////// GUI/ANIMATIONS | Just applied same logic from the skinning example on three.js website...
/////////

function createGUI(model, animations) {

  let states = ['Rest', 'PinkPanther_Walk', "Loto_position_yoga"]

  gui = new dat.GUI()
  mixer = new THREE.AnimationMixer(model)
  actions = {}

  for (let i = 0; i < animations.length; i++) {
    let clip = animations[i]
    let action = mixer.clipAction(clip)
    actions[clip.name] = action
  }

  // states
  let statesFolder = gui.addFolder('Actions:');
  let clipCtrl = statesFolder.add(api, 'state').options(states);

  clipCtrl.onChange(function() {
    fadeToAction(api.state, 0.5)
  })

  statesFolder.open()

  function restoreState() {
    mixer.removeEventListener('finished', restoreState);
    fadeToAction(api.state, 0.2);
  }

  activeAction = actions['PinkPanther_Walk']
  activeAction.play()

}


function fadeToAction(name, duration) {
  previousAction = activeAction
  activeAction = actions[name]

  if (previousAction !== activeAction) {
    previousAction.fadeOut(duration)
  }

  if (name === "Loto_position_yoga") { // XXX for actions intro... to be generalized and to do the exit...
    activeAction.setLoop(THREE.LoopOnce)
    activeAction.clampWhenFinished = true
  }

  activeAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play()

  if (name === "Loto_position_yoga") {
    mixer.addEventListener('finished', loopYoga)
  }
}

function loopYoga() {
   mixer.removeEventListener('finished', loopYoga)
   fadeToAction("Loto_loop_yoga", .2)
}


/////////
///////// SCENE/CAMERA
/////////

controls.target.set(0, floor + 1.5, 0)
camera.position.set(0, floor + 2, 7)

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
  light1.position.x = perlin.noise(time * .4, 0, 0) * 3
  light1.position.z = perlin.noise(time * .3 + 5, 0, 0) * 3
  light1.position.y = perlin.noise(time * .5 + 10, 0, 0) * 4
  light2.position.x = perlin.noise(time * .2 + 15, 0, 0) * 4
  light2.position.z = perlin.noise(time * .5 + 20, 0, 0) * 4
  light2.position.y = perlin.noise(time * .3 + 25, 0, 0) * 2
  light3.position.x = perlin.noise(time * .2 + 30, 0, 0) * 3
  light3.position.z = perlin.noise(time * .3 + 35, 0, 0) * 5
  light3.position.y = perlin.noise(time * .4 + 40, 0, 0) * 2 + 1

  renderer.render(scene, camera)
  time += 0.015
}

// go
render()

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
