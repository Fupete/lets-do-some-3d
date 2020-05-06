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

// stats
let stats = new Stats()
stats.showPanel( 0 )
document.body.appendChild( stats.dom )

// Vars
let near = .5,
  far = 1000,
  floor = 0

let textes = []
textes.push("FUPETE")
textes.push("GERJKA")
textes.push("NASONERO")
textes.push("TELLER+K")

let text = {
  height: .1,
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
scene.background = new THREE.Color(0x000000)
// scene.fog = new THREE.FogExp2(0x999999, .05)

// Camera
let aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(75, aspect, near, far)

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  // powerPreference: "high-performance"
})
let pRatio = window.devicePixelRatio
// if (pRatio > 2) pRatio = 2 // < not more than 2...
renderer.setPixelRatio(pRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding
document.body.appendChild(renderer.domElement)

// Orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enablePan = false
controls.enableDamping = true
controls.dampingFactor = 0.19
controls.minDistance = 4
controls.maxDistance = 14
controls.maxPolarAngle = Math.PI
controls.minPolarAngle = - Math.PI
// controls.maxAzimuthAngle = Math.PI / 2
// controls.minAzimuthAngle = -Math.PI / 2

// gimbal...
// let gimbal = new Gimbal()
// gimbal.enable()

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

// let lightAmb = new THREE.AmbientLight(0xFFFFFF)
// scene.add(lightAmb)

// let dirLight = new THREE.DirectionalLight( 0xffffff, 4 );
// dirLight.color.setHSL( 0.1, 1, 1 );
// dirLight.position.set( - 1, 1.75, 3 );
// scene.add( dirLight );
// dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
// scene.add( dirLightHeper );

/////////
///////// GEOMETRIES
/////////

let font
let loader = new THREE.TTFLoader()
loader.load( 'assets/ttf/Hack-Bold.ttf', function ( json ) {
	font = new THREE.Font( json )
	createText()
} )

// TEXT
let textGeo = []
let textGroup = []
let textMesh = []
let textHoverBox = []

function createText() {



  for (let t = 0; t<textes.length; t++) {

    textGroup.push(new THREE.Group())
    scene.add( textGroup[t] )

    // testo
    let textGeo = new THREE.TextBufferGeometry( textes[t], {
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
  	textMesh.push(new THREE.Mesh( textGeo,  new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe:text.wireframe } ) ))
    textGroup[t].add(textMesh[t])

    // let's center
    let textBox3 = new THREE.Box3().setFromObject( textMesh[t] )
    textBox3.getCenter( textMesh[t].position )
    textMesh[t].position.multiplyScalar( - 1 )

    // let's make the hover box
    let textBox3Size = new THREE.Vector3()
    textBox3.getSize(textBox3Size)
    let textBoxGeo = new THREE.BoxGeometry(textBox3Size.x, textBox3Size.y, textBox3Size.z)
    textHoverBox.push(new THREE.Mesh(textBoxGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe:false, visible:false })))
    textGroup[t].add(textHoverBox[t])
    objectsForRayCasting.push(textHoverBox[t])

    textGroup[t].name = t
    textGroup[t].position.y = - 4 + Math.random()*8
    textGroup[t].rotation.y += - 1 + Math.random()
  }

  renderer.render(scene, camera)

}

// let's make some spheres
let spheres = []
let geomSphere = new THREE.SphereBufferGeometry( .5, 35, 35 )
for (let s=0; s<23; s++) {
  spheres.push(new THREE.Mesh(geomSphere, new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe:false } )))
  scene.add(spheres[s])
  objectsForRayCasting.push( spheres[s] )
  let scala = Math.random()
  spheres[s].scale.set(scala, scala, scala  )
  spheres[s].position.x = -3 + Math.random()*6
  spheres[s].position.y = -3 + Math.random()*6
  spheres[s].position.z = -3 + Math.random()*6
}



/////////
///////// SCENE/CAMERA
/////////

controls.target.set(0, 0, 0)
camera.position.set(0, floor + 2, 7)

/////////
///////// RENDER/ANIMATION LOOP
/////////

// if (gimbal.yaw) gimbal.recalibrate()

// set
let time = 0
let render = function() {
  stats.begin()

  // gimbal.update()
  controls.update()

  // tilt camera 1
  // camera.position.x = ( mouse.x - camera.position.x ) * .005
	// camera.position.y = ( - mouse.y - camera.position.y ) * .005
	// camera.lookAt( scene.position )

  // gimbal for device orientation
  // if (gimbal.yaw) {
  //   camera.rotation.x = 0.25 * - gimbal.pitch
  //   camera.rotation.y = 0.25 * - gimbal.yaw
  // } else {
    // tilt camera 2
    // target.x = ( 1 - mouse.x ) * 0.001
    // target.y = ( 1 - mouse.y ) * 0.001
    // camera.rotation.x += 0.05 * ( target.y - camera.rotation.x )
    // camera.rotation.y += 0.05 * ( target.x - camera.rotation.y )
  // }

  stats.end()
  requestAnimationFrame(render)
  // renderer.render(scene, camera)
  // time += 0.015
}

// go
render()
controls.addEventListener( 'change', () => renderer.render( scene, camera ) )

/////////
///////// EVENTS
/////////

let touchDrag = false
let touchZoom = false
let mouseDrag = false

function onMouseDown( event ) {
  mouseDrag = false
}
window.addEventListener( 'mousedown', onMouseDown, true )

function onTouchStart( event ) {
  event.preventDefault()
  if (event.touches.length > 1) {
    touchZoom = true
  } if (event.touches.length == 1) {
    touchDrag = false
    touchZoom = false
  }
}
window.addEventListener( 'touchstart', onTouchStart, true)

function onTouchEnd( event ) {
  event.preventDefault()
  if (!touchDrag && !touchZoom && event.changedTouches[0]) {
    // touch camera
    event.clientX = event.changedTouches[0].pageX
    event.clientY = event.changedTouches[0].pageY
    // se tap vai a click sennò vai a move...
    onMouseUp( event )
  }
}
window.addEventListener( 'touchend', onTouchEnd, true )

function onMouseMove( event ) {
  mouseDrag = true
}
window.addEventListener( 'mousemove', onMouseMove, true )

function onMouseUp( event ) {
  if (!mouseDrag) {
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
    renderer.render( scene, camera )
  }
}
window.addEventListener( 'mouseup', onMouseUp, true )

function onTouchMove( event ) {
    event.preventDefault()
    touchDrag = true
    // // touch camera
    // event.clientX = event.changedTouches[0].pageX
    // event.clientY = event.changedTouches[0].pageY
    // onMouseMove( event )
}
window.addEventListener( 'touchmove', onTouchMove, true)

let cAttivo =  "0x00ffff"
let cPassivo = "0xffffff"

function objectHover_on(o) {
  if ( o.parent.type === "Group" ) {
    for (let children of o.parent.children)
      children.material.color.setHex( cAttivo )
  } else o.material.color.setHex( cAttivo )
  let t = new THREE.Vector3()
  o.getWorldPosition(t)
  controls.saveState()
  controls.target.set(t.x,t.y,t.z)
}

function objectHover_off(o) {
  if ( o.parent.type === "Group" ) {
    for (let children of o.parent.children)
      children.material.color.setHex( cPassivo )
  } else o.material.color.setHex( cPassivo )
  controls.reset()
}

function onWindowResize() {
  windowHalf.set( window.innerWidth / 2, window.innerHeight / 2 );
  camera.aspect = window.innerWidth / window.innerHeight
  // cam.left = -camera.aspect * 10;
  // cam.right = camera.aspect * 10;
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', onWindowResize, false)
