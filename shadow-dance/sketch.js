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
// shadow-dance
// partly inspired by this official example:
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_shadowmap.html


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

let sphereGeom = new THREE.SphereGeometry(50,36,36)
let sphereMate = new THREE.MeshPhongMaterial ( { color: 0x000000, specular: 0xffffff })
let sphere = new THREE.Mesh ( sphereGeom, sphereMate )
sphere.castShadow = true
scene.add(sphere)

// text
let text = new THREE.Object3D()
let sticks = new THREE.Object3D()
//
let loader = new THREE.FontLoader()
let textWidth = 0
let kerning = 20
const word = "shadow"
let letters = word.split("")
// construct these assets after font load...
loader.load ( './assets/myriad-pro-bold.json', function (font) {

  for (let l = 0; l < letters.length; l++) {
    let charGeo = new THREE.TextBufferGeometry ( letters[l] , {
      font: font,
      size: 200,
      height: 50,
      curveSegments: 24,
      bevelThickness: 2,
      bevelSize: 5,
      bevelEnabled: true
    })
    charGeo.computeBoundingBox()
    let charWidth = charGeo.boundingBox.max.x - charGeo.boundingBox.min.x
    let charMate = new THREE.MeshPhongMaterial({color: 0xaaaaaa, specular:0xffffff})
    let char = new THREE.Mesh (charGeo, charMate)
    char.position.x = textWidth
    textWidth += charWidth + kerning
    char.position.y = floor + 67
    char.castShadow = true
    char.receiveShadow = true
    char.rotation.x = - 3.14 / 4
    text.add(char)

    // sticks
    let stickGeo = new THREE.CylinderGeometry( 5, 5, 400, 36 );
    let stickMate = new THREE.MeshPhongMaterial({color: 0xffffff, specular:0xffffff})
    let stick = new THREE.Mesh( stickGeo, charMate );
    stick.position.x = textWidth - charWidth / 2 - 50
    stick.position.y = floor + 67
    stick.position.z = 25
    stick.castShadow = true
    stick.receiveShadow = true
    sticks.add( stick );
  }
  scene.add(text)
  scene.add(sticks)
  text.position.x = -textWidth * .5
  sticks.position.x = -textWidth * .5


  // cubes
  let boxMesh = new THREE.Mesh ( new THREE.BoxBufferGeometry( textWidth + 100, 220, 150), groundMate)
  boxMesh.position.y = floor - 50
  boxMesh.position.z = 20
  boxMesh.castShadow = true
  boxMesh.receiveShadow = true
  // scene.add(boxMesh)

  let boxMeshClone = boxMesh.clone()
  boxMesh.scale.x = 1.05
  boxMesh.scale.y = 0.7
  boxMesh.scale.z = 1.6
  scene.add( boxMeshClone );
})


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
  sphere.position.x = perlin.noise(time, 0, 0) * textWidth
  sphere.position.y = perlin.noise(time+5, 0, 0) * 200
  sphere.position.z = perlin.noise(time+10, 0, 0) * 400
  text.children.forEach(function(char, index) {
    char.position.y = floor + 220 + perlin.noise(time+index, 0, 0) * 200
  })
  sticks.children.forEach(function(stick, index) {
    stick.position.y = floor + 60 + perlin.noise(time+index, 0, 0) * 200
  })
  renderer.render(scene, camera)
  time+=0.005
};

// go
render();


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  controls.handleResize()
}
