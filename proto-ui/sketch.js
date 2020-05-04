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
  content: 'FUPETE',
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
let mouseRAY = new THREE.Vector2(), SEL
let objectsForRayCasting = []

// mouse camera
let mouse = new THREE.Vector2()
const target = new THREE.Vector2()
let windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 )

// Raycaster
let raycaster = new THREE.Raycaster()

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFFFFF)
scene.fog = new THREE.FogExp2(scene.background, .1)

// Camera
let aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(55, aspect, near, far)

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

// raycaster
window.addEventListener( 'mousemove', onMouseMove, false )
function onMouseMove( event ) {

  // mouse camera
	mouse.x = ( event.clientX - windowHalf.x )
	mouse.y = ( event.clientY - windowHalf.y )
  // mouse raycasting
  mouseRAY.x = ( event.clientX / window.innerWidth ) * 2 - 1
	mouseRAY.y = - ( event.clientY / window.innerHeight ) * 2 + 1
}

window.addEventListener( 'touchmove', onTouchMove, false)
function onTouchMove( event ) {

    event.preventDefault()
    // touch camera
    event.clientX = event.touches[0].pageX
    event.clientY = event.touches[0].pageY

    onMouseMove( event )
}


/////////
///////// LIGHTS
/////////

// Ambient
let lightAmb = new THREE.AmbientLight(0xFFFFFF)
scene.add(lightAmb)

// Directional
// let lightS = new THREE.SpotLight(0xffffff, .7, 0, Math.PI / 10, .4)
// lightS.position.set(0, 14, -7)
// scene.add(lightS)
// // let dlh = new THREE.DirectionalLightHelper( lightS )
// // scene.add( dlh )
//
// let lightFront = new THREE.PointLight(0xffffff, .7)
// lightFront.position.set(0, 7, 3)
// scene.add(lightFront)
// // let dlh = new THREE.PointLightHelper( lightFront )
// // scene.add( dlh )
//
// let lightFront2 = new THREE.PointLight(0xffffff, .1)
// lightFront2.position.set(0, 1, -5)
// scene.add(lightFront2)
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
let textMate = new THREE.MeshPhongMaterial( { color: 0x000000, wireframe:text.wireframe } )

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
  // textMesh.position.x = centerOffset.x
	// textMesh.position.y = centerOffset.y
	// textMesh.position.z = 0
  // textMesh.rotation.x = 0
	// textMesh.rotation.y = Math.PI * 2
  //new THREE.Box3().setFromObject( textMesh ).getCenter( textMesh.position ).multiplyScalar( - 1 )
  textGroup.add(textMesh)

  let textBox3 = new THREE.Box3().setFromObject( textMesh )
  let textBoxCenter = new THREE.Vector3()
  let textBoxSize = new THREE.Vector3()
  textBox3.getSize(textBoxSize)
  textBox3.getCenter(textBoxCenter)
  let textBoxGeo = new THREE.BoxGeometry(textBoxSize.x, textBoxSize.y, textBoxSize.z)
  textBox = new THREE.Mesh(textBoxGeo, new THREE.MeshPhongMaterial({ color: 0x000000, wireframe:true, visible:true }))
  textBox.position.x = textBoxCenter.x
  textBox.position.y = textBoxCenter.y
  textBox.position.z = textBoxCenter.z
  textGroup.add(textBox)

  // objectsForRayCasting.push( textMesh1 )
  objectsForRayCasting.push( textBox )
  // objectsForRayCasting.push( textGroup )

  new THREE.Box3().setFromObject( textGroup ).getCenter( textGroup.position ).multiplyScalar( - 1 );
  // scene.add( object );
}

// let's make a sphere
let geomSphere = new THREE.SphereGeometry( .3, 35, 35 )
let sphere = new THREE.Mesh(geomSphere, new THREE.MeshPhongMaterial( { color: 0x000000, wireframe:true } ))
scene.add(sphere)
objectsForRayCasting.push( sphere )
sphere.position.x = 0
sphere.position.y = 1
sphere.position.z = 1

let sphere1 = new THREE.Mesh(geomSphere, new THREE.MeshPhongMaterial( { color: 0x000000, wireframe:true } ))
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
	raycaster.setFromCamera( mouseRAY, camera )
  let intersects = raycaster.intersectObjects( objectsForRayCasting )
  if ( intersects.length > 0 ) {
    if ( SEL != intersects[ 0 ].object ) {
      if ( SEL ) {
        if ( SEL != textGroup ) {
          SEL.material.color.setHex( SEL.currentHex )
          SEL.scale.set( SEL.currentScale )
        } else {
          for (j = 0; j < SEL.children.length; j++) {
            SEL.children[j].material.color.setHex( SEL.children[j].currentHex )
            SEL.children[j].scale.set( SEL.children[j].currentScale )
          }
        }
      }
      SEL = intersects[ 0 ].object
      if ( SEL.parent == textGroup ) {
        SEL = textGroup
        for (j = 0; j < SEL.children.length; j++) {
          SEL.children[j].currentHex = SEL.children[j].material.color.getHex()
          SEL.children[j].currentScale = SEL.children[j].scale
          SEL.children[j].scale.set( 1.2, 1.2, 1.2)
          SEL.children[j].material.color.setHex( 0xff0000 ) // < è l'oggetto
        }
      } else {
        SEL.currentHex = SEL.material.color.getHex()
        SEL.currentScale = SEL.scale
        SEL.scale.set( 1.2, 1.2, 1.2)
        SEL.material.color.setHex( 0xff0000 ) // < è l'oggetto
      }

      // console.log(SEL) // XXX da attivare oggetto/fratello nel gruppo...
    }
  } else { // non ci sono oggetti
    if ( SEL) {
      if ( SEL != textGroup ) {
        SEL.material.color.setHex( SEL.currentHex )
        SEL.scale.set( 1, 1, 1 )
      } else {
        for (j = 0; j < SEL.children.length; j++) {
          SEL.children[j].material.color.setHex( SEL.children[j].currentHex )
          SEL.children[j].scale.set( 1, 1, 1 )
        }
      }
    }
    SEL = null;
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
