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
let near = .1,
  far = 1000,
  floor = 0

let text = {
  content: 'portfolio',
  height: 2,
  size: .7,
  hover: 0,
	curveSegments: 7,
  bevelThickness: 0.05,
  bevelSize: 0.01,
  bevelEnabled: false,
  wireframe: true
}

let font
let textMesh1

// mouse raycasting
let mouseI = new THREE.Vector2(), INTERSECTED
let objectsForRayCasting = []

// mouse camera
let mouse = new THREE.Vector2()
const target = new THREE.Vector2()
let windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 )
window.addEventListener( 'mousemove', onMouseMove, false )

function onMouseMove( event ) {
  // mouse camera
	mouse.x = ( event.clientX - windowHalf.x )
	mouse.y = ( event.clientY - windowHalf.y )
  // mouse raycasting
  mouseI.x = ( event.clientX / window.innerWidth ) * 2 - 1
	mouseI.y = - ( event.clientY / window.innerHeight ) * 2 + 1
}

// Raycaster
let raycaster = new THREE.Raycaster()

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)
scene.fog = new THREE.FogExp2(scene.background, .1)

// Camera
let aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(45, aspect, near, far)

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
let pRatio = window.devicePixelRatio
if (pRatio > 2) pRatio = 2 // < not too much on mobile...
// renderer.setPixelRatio(pRatio) // XXX disabled for mobile performance...
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement)

// Add listener for window resize.
window.addEventListener('resize', onWindowResize, false)


/////////
///////// LIGHTS
/////////

// Ambient
let lightAmb = new THREE.AmbientLight(0x999999)
scene.add(lightAmb)

// Directional
let lightS = new THREE.SpotLight(0xffffff, .7, 0, Math.PI / 10, .4)
lightS.position.set(0, 14, -7)
scene.add(lightS)
// let dlh = new THREE.DirectionalLightHelper( lightS )
// scene.add( dlh )

let lightFront = new THREE.PointLight(0xffffff, .7)
lightFront.position.set(0, 7, 3)
scene.add(lightFront)
// let dlh = new THREE.PointLightHelper( lightFront )
// scene.add( dlh )

let lightFront2 = new THREE.PointLight(0xffffff, .1)
lightFront2.position.set(0, 1, -5)
scene.add(lightFront2)
// let dlh2 = new THREE.PointLightHelper( lightFront2 )
// scene.add( dlh2 )

/////////
///////// GEOMETRIES
/////////

//// FONT
let loader = new THREE.TTFLoader()
loader.load( 'assets/ttf/Hack-Regular.ttf', function ( json ) {
	font = new THREE.Font( json )
	createText()
} )


// TEXT
let textGroup = new THREE.Group()
scene.add( textGroup )
let textBox
let textMate = new THREE.MeshPhongMaterial( { color: 0xffffff, wireframe:text.wireframe } )

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
	textGeo.computeBoundingBox()
	textGeo.computeVertexNormals()
  let centerOffset = {
    x: - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x ),
    y: - 0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y )
  }
	textMesh = new THREE.Mesh( textGeo, textMate )
  textMesh.position.x = centerOffset.x
	textMesh.position.y = centerOffset.y
	textMesh.position.z = 0
  textMesh.rotation.x = 0
	textMesh.rotation.y = Math.PI * 2
  textGroup.add(textMesh)

  let textBox3 = new THREE.Box3().setFromObject( textMesh )
  let textBoxCenter = new THREE.Vector3()
  let textBoxSize = new THREE.Vector3()
  textBox3.getSize(textBoxSize)
  textBox3.getCenter(textBoxCenter)
  let textBoxGeo = new THREE.BoxGeometry(textBoxSize.x, textBoxSize.y, textBoxSize.z)
  textBox = new THREE.Mesh(textBoxGeo, new THREE.MeshPhongMaterial({ wireframe:true, /*visible:false XXX*/ }))
  textBox.position.x = textBoxCenter.x
  textBox.position.y = textBoxCenter.y
  textBox.position.z = textBoxCenter.z
  textGroup.add(textBox)

  // objectsForRayCasting.push( textMesh1 )
  objectsForRayCasting.push( textBox )
}

// let's make a sphere
let geomSphere = new THREE.SphereGeometry( .3, 35, 35 )
let sphere = new THREE.Mesh(geomSphere, new THREE.MeshPhongMaterial( { color: 0xffffff, wireframe:true } ))
scene.add(sphere)
objectsForRayCasting.push( sphere )
sphere.position.x = 0
sphere.position.y = 1
sphere.position.z = 1

let sphere1 = new THREE.Mesh(geomSphere, new THREE.MeshPhongMaterial( { color: 0xffffff, wireframe:true } ))
scene.add(sphere1)
objectsForRayCasting.push( sphere1 )
sphere1.position.x = 1
sphere1.position.y = 1
sphere1.position.z = -1


/////////
///////// SCENE/CAMERA
/////////

// controls.target.set(0, 0, 0)
camera.position.set(0, 0, 7)

/////////
///////// RENDER/ANIMATION LOOP
/////////

// set
let time = 0
let render = function() {
  requestAnimationFrame(render)

  // tilt camera
  target.x = ( 1 - mouse.x ) * 0.001
  target.y = ( 1 - mouse.y ) * 0.001
  camera.rotation.x += 0.05 * ( target.y - camera.rotation.x )
  camera.rotation.y += 0.05 * ( target.x - camera.rotation.y )

  // mouse raycasting, find intersections
	raycaster.setFromCamera( mouseI, camera )
  let intersects = raycaster.intersectObjects( objectsForRayCasting )
  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if ( INTERSECTED ) { // non è l'oggetto
        INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex )
      }
      INTERSECTED = intersects[ 0 ].object
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
      INTERSECTED.material.emissive.setHex( 0xff0000 ) // < è l'oggetto
      console.log(INTERSECTED) // XXX da attivare oggetto/fratello nel gruppo...
    }
  } else { // non ci sono oggetti
    if ( INTERSECTED ) {
      INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex )
    }
    INTERSECTED = null;
  }

  renderer.render(scene, camera)
  // time += 0.015
}

// go
render()

function onWindowResize() {
  windowHalf.set( window.innerWidth / 2, window.innerHeight / 2 );
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
