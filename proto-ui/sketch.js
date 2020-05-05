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
// proto ui
// ttf loader example: https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_ttf.html
// To do: Implement a better Picking with webgl in GPU > https://threejsfundamentals.org/threejs/lessons/threejs-picking.html

/////////
///////// SETUP + RENDER
/////////

// Vars
let near = .5,
  far = 1000,
  floor = 0

let text = {
  content: 'FUPETE',
  height: 2,
  size: 1,
  hover: 0,
	curveSegments: 7,
  bevelThickness: 0.05,
  bevelSize: 0.05,
  bevelEnabled: true,
  wireframe: false
}

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x212121)
scene.fog = new THREE.FogExp2(scene.background, .1)

// Camera
let aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(60, aspect, near, far)

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
let pRatio = window.devicePixelRatio
if (pRatio > 2) pRatio = 2 // < not more than 2...
renderer.setPixelRatio(pRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement)

// gimbal...
let gimbal = new Gimbal()
gimbal.enable()

// mouse camera
let mouse = new THREE.Vector2()
const target = new THREE.Vector2()
let windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 )

// mouse/touch raycasting
let mouseRAY = new THREE.Vector2(), SEL
let objectsForRayCasting = []
let raycaster = new THREE.Raycaster()

/////////
///////// LIGHTS
/////////

// Ambient
let lightAmb = new THREE.AmbientLight(0xFFFFFF)
scene.add(lightAmb)

/////////
///////// GEOMETRIES
/////////

//// FONT
let font
let loader = new THREE.TTFLoader()
loader.load( 'assets/ttf/Hack-Bold.ttf', function ( json ) {
	font = new THREE.Font( json )
	createText()
} )

// TEXT
let textGroup = new THREE.Group()
scene.add( textGroup )

let textMesh
let textHoverBox
let textMate = new THREE.MeshBasicMaterial( { color: 0x999999, wireframe:text.wireframe } )

function createText() {

  // testo
  let textGeo = new THREE.TextBufferGeometry( text.content, {
					font: font,
					size: text.size,
					height: text.height,
					curveSegments: text.curveSegments,
					bevelThickness: text.bevelThickness,
					bevelSize: text.bevelSize,
					bevelEnabled: text.bevelEnabled
				} )
	// textGeo.computeBoundingBox()
	// textGeo.computeVertexNormals()
	textMesh = new THREE.Mesh( textGeo, textMate )
  textGroup.add(textMesh)

  // let's center
  let textBox3 = new THREE.Box3().setFromObject( textMesh )
  textBox3.getCenter( textMesh.position )
  textMesh.position.multiplyScalar( - 1 )

  // let's make the hover box
  let textBox3Size = new THREE.Vector3()
  textBox3.getSize(textBox3Size)
  let textBoxGeo = new THREE.BoxGeometry(textBox3Size.x, textBox3Size.y, textBox3Size.z)
  textHoverBox = new THREE.Mesh(textBoxGeo, new THREE.MeshBasicMaterial({ color: 0x000000, wireframe:true, visible:true }))
  textGroup.add(textHoverBox)

  textMesh.name = "testo"
  textHoverBox.name = "box"
  textGroup.name = "gruppo"

  objectsForRayCasting.push( textHoverBox)

  // scene.add( object );
}

// let's make a sphere
let geomSphere = new THREE.SphereGeometry( .5, 35, 35 )
let sphere = new THREE.Mesh(geomSphere, new THREE.MeshPhongMaterial( { color: 0x000000, wireframe:true } ))
scene.add(sphere)
objectsForRayCasting.push( sphere )
sphere.position.x = 0
sphere.position.y = 2
sphere.position.z = 2

let sphere1 = new THREE.Mesh(geomSphere, new THREE.MeshPhongMaterial( { color: 0x000000, wireframe:true } ))
scene.add(sphere1)
objectsForRayCasting.push( sphere1 )
sphere1.position.x = 2
sphere1.position.y = 2
sphere1.position.z = -2


/////////
///////// SCENE/CAMERA
/////////

// controls.target.set(0, 0, 0)
camera.position.set(0, 0, 7)

function objectHover_on(o) {
  if ( o.parent == textGroup ) {
    // gruppo
    for (j = 0; j < o.parent.children.length; j++) {
      o.parent.children[j].material.color.setHex( cAttivo )
    }
  } else {
    // oggetto
    o.material.color.setHex( cAttivo )
  }
}

function objectHover_off(o) {
  if ( o.parent != textGroup ) {
    // gruppo
    o.material.color.setHex( cPassivo )
  } else {
    // oggetto
    for (j = 0; j < o.parent.children.length; j++) {
      o.parent.children[j].material.color.setHex( cPassivo )
    }
  }
}

/////////
///////// RENDER/ANIMATION LOOP
/////////

let cAttivo =  "0x00ff00"
let cPassivo = "0xffffff"
let yaw = 0, roll = 0, pitch = 0
gimbal.recalibrate()

// set
let time = 0
let render = function() {
  gimbal.update()
  requestAnimationFrame(render)

  // tilt camera 1
  // camera.position.x = ( mouse.x - camera.position.x ) * .005
	// camera.position.y = ( - mouse.y - camera.position.y ) * .005
	// camera.lookAt( scene.position )

  // tilt camera
  if (gimbal.yaw) {
    roll = gimbal.roll
    yaw =  gimbal.yaw
    pitch = gimbal.pitch
  }
  // tilt camera 2
  target.x = ( 1 - mouse.x ) * 0.001
  target.y = ( 1 - mouse.y ) * 0.001
  if (gimbal.yaw) {
    roll = gimbal.roll
    yaw =  gimbal.yaw
    pitch = gimbal.pitch
    camera.rotation.x = 0.25 * - pitch
    camera.rotation.y = 0.25 * - yaw
  } else {
    camera.rotation.x += 0.05 * ( target.y - camera.rotation.x )
    camera.rotation.y += 0.05 * ( target.x - camera.rotation.y )
  }

  renderer.render(scene, camera)
  // time += 0.015
}

// go
render()

/////////
///////// EVENTS
/////////

// Add listener for window resize.
window.addEventListener('resize', onWindowResize, false)


window.addEventListener( 'mousemove', onMouseMove, false )
function onMouseMove( event ) {
  // mouse camera
	mouse.x = ( event.clientX - windowHalf.x )
	mouse.y = ( event.clientY - windowHalf.y )
  // mouse raycasting
  mouseRAY.x = ( event.clientX / window.innerWidth ) * 2 - 1
	mouseRAY.y = 1 - ( event.clientY / window.innerHeight ) * 2

  // mouse raycasting, find intersections
  raycaster.setFromCamera( mouseRAY, camera )
  let intersects = raycaster.intersectObjects( objectsForRayCasting )
  if ( intersects[0]) {
    if ( SEL != intersects[ 0 ].object ) {
      if ( SEL ) objectHover_off(SEL)
      SEL = intersects[0].object
      objectHover_on(SEL)
    }
  } else {
    if ( SEL ) objectHover_off(SEL)
    SEL = null
  }
}

window.addEventListener( 'touchmove', onTouchMove, false)
function onTouchMove( event ) {
    event.preventDefault()
    // touch camera
    event.clientX = event.changedTouches[0].pageX
    event.clientY = event.changedTouches[0].pageY
    onMouseMove( event )
}

function onWindowResize() {
  windowHalf.set( window.innerWidth / 2, window.innerHeight / 2 );
  camera.aspect = window.innerWidth / window.innerHeight
  cam.left = -camera.aspect * 10;
  cam.right = camera.aspect * 10;
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
