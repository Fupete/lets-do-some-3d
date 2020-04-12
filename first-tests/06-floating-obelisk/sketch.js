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
// 06-floating-obelisk (1st approach with three.js to render my allucinations)

// © 2019 Daniele Tabellini @fupete, MIT License

/////////
///////// SETUP
/////////

// Scene
let scene = new THREE.Scene();
scene.background = new THREE.Color( 0x212121);
scene.fog = new THREE.FogExp2(scene.background, 0.0009 );

// Camera
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 2000);

// Renderer
let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controls
let controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.19;

// Add listener for window resize.
window.addEventListener('resize', onWindowResize, false);


/////////
///////// LIGHTS
/////////

// Ambient
let lightAmb = new THREE.AmbientLight( scene.background );
scene.add(lightAmb);

// Directional
let light = new THREE.DirectionalLight( 0xdddddd, 1.6 );
light.position.set( -100, 200, 50 );
light.castShadow = true;
light.shadowDarkness = 0.5;
scene.add(light);
//let dlh = new THREE.DirectionalLightHelper( light );
//scene.add( dlh );



// Point
let light2 = new THREE.PointLight( 0x00feb4, 1.5 );
light2.position.set (0,20,0);
//light2.castShadow = true;
//light2.shadowDarkness = 0.5;
scene.add(light2);
//let plh = new THREE.PointLightHelper( light2 );
//scene.add( plh );

// Spot
let light3 = new THREE.SpotLight( 0xffffa2, 2.7 );
light3.position.set (200,-200,200);
light3.angle = Math.PI / 7;
light3.penumbra = 0.8;
light3.castShadow = true;
light3.receiveShadow = true;
light3.shadowDarkness = 0.35;
light3.shadowCameraNear	= 0.5;
scene.add(light3);
//let slh = new THREE.SpotLightHelper( light3 );
//scene.add( slh );



/////////
///////// MATERIALS
/////////

let material = new THREE.MeshStandardMaterial({
  wireframe:false,
  color: 0xff0000,
  specular: 0xff00fa,
  shininess: 0.2,
  side: THREE.DoubleSide
  }); // + material
// Normal Lambert Phong Standard Toon

let matGlass = new THREE.MeshStandardMaterial({
  wireframe:false,
  color: 0x0000ff,
  specular: 0xff00ae,
  shininess: 1.8,
  side: THREE.DoubleSide,
  transparent: true,
  opacity:0.5
  });

let matMan = new THREE.MeshLambertMaterial({
  wireframe:false,
  color: 0x00aeff,
  specular: 0xffaeff,
  shininess: 1.8,
  emissive: 0x00aeff,
  emissiveIntensity: 1
  });


/////////
///////// GEOMETRIES
/////////

let gomSph = new THREE.SphereGeometry(22);
let sphere = new THREE.Mesh(gomSph, matMan);
sphere.position.x=-35;
sphere.position.z=-35;
scene.add(sphere);


let lato = 4;
let pyramids = []
let geomPyr = new THREE.CylinderGeometry(0, 50, 60, 4, 1);
// Let's make various pyramids
for (let k=0; k<lato; k++) {
  let nMax = lato - k;
  for (let i=0; i<nMax; i++) {
    for (let j=0; j<nMax; j++) {

      let pyramid = new THREE.Mesh(geomPyr, material);
      pyramid.rotation.y=Math.PI/4;
      pyramid.position.y=k*60+30;
      pyramid.position.x=i*70+k*35-70*lato/2;
      pyramid.position.z=j*70+k*35-70*lato/2;
      scene.add(pyramid);
      pyramids.push(pyramid);

      let pyramid2 = new THREE.Mesh(geomPyr, material);
      pyramid2.rotation.y=Math.PI/4;
      pyramid2.rotation.x=Math.PI;  //*
      pyramid2.position.y=-k*60-30; //*
      pyramid2.position.x=i*70+k*35-70*lato/2;
      pyramid2.position.z=j*70+k*35-70*lato/2;
      scene.add(pyramid2);
      pyramids.push(pyramid2);
    }
  }
}
for (let i=0; i<pyramids.length; i++) {
  pyramids[i].receiveShadow = true;
  pyramids[i].castShadow = true;
}

var geomP = new THREE.PlaneGeometry(2000,2000);
var planeP = new THREE.Mesh(geomP, matGlass);
planeP.position.y=-60*lato;
planeP.rotation.x=Math.PI/2;
planeP.receiveShadow = true;
planeP.castShadow = true;
scene.add(planeP);

/*
var geom = new THREE.Geometry();
var v1 = new THREE.Vector3(0,0,0);
var v2 = new THREE.Vector3(15,0,50);
var v3 = new THREE.Vector3(-15,0,50);
geom.vertices.push(v1);
geom.vertices.push(v2);
geom.vertices.push(v3);
geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
geom.computeFaceNormals();
var triangle= new THREE.Mesh( geom, material );
triangle.position.y = 30;
scene.add(triangle);
*/

/////////
///////// DIRECTION
/////////

// grid helper
/*var gh = new THREE.GridHelper( 1000, 10, 0xcccccc, 0x555555 );
scene.add( gh );
gh.position.y = -0.02;
*/

// scene
camera.position.z = 500;
//camera.position.y = 500;
//controls.center.set(0, 80, 0);

/////////
///////// RENDER/ANIMATION LOOP
/////////

// set
let time = 0;
let render = function() {
  requestAnimationFrame(render);
  /*box.rotation.x += 0.01;
  box.rotation.y += 0.01;
  sphere.position.x = Math.cos(time)*100;
  sphere.position.y = Math.sin(time)*100;*/
  //camera.position.x = -200+Math.sin(time)*300;
  sphere.position.y+=Math.sin(time)*0.17;
  for (let i=0; i<pyramids.length-1; i+=2) {
    pyramids[i].position.y+=Math.sin(time)*0.22;
    pyramids[i+1].position.y+=Math.sin(time)*0.12;
  }

  light.position.x=Math.sin(time)*5;
  light.position.y=Math.cos(time)*5;
  light.position.z=Math.sin(time+10)*5;
  time+=0.01;
  controls.update()
  renderer.render(scene, camera)
};

// go
render();


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //controls.handleResize();
}
