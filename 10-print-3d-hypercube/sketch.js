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
// 10-print-3d-hypercube (original concept)

/////////
///////// SETUP + RENDER
/////////

// Scene
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x0066cc);
scene.fog = new THREE.FogExp2(scene.background, 0.005);

// Camera
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 1000);

// Renderer
let renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // < Shadows enabled
renderer.shadowMap.Type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Orbit controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);
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
let light = new THREE.DirectionalLight(0xdddddd, 1.5);
light.position.set(-100, 200, 50);
light.penumbra = 0.8;
light.castShadow = true;
light.receiveShadow = true;
light.shadow.camera.near = 0.5;
scene.add(light);
// let dlight = new THREE.DirectionalLightHelper( light );
// scene.add( dlight );

// Point
let light2 = new THREE.PointLight(0xeeeeee, 1.5);
light2.position.set(0, 20, 0);
light2.castShadow = true;
scene.add(light2);
// let plight2 = new THREE.PointLightHelper( light2 );
// scene.add( plight2 );

// Spot
let light3 = new THREE.SpotLight(0xffffff, 2.7);
light3.position.set(200, 400, 200);
light3.angle = Math.PI / 7;
light3.penumbra = 0.8;
light3.castShadow = true;
light3.receiveShadow = true;
light3.shadowCameraNear	= 0.5;
light3.shadowCameraVisible = true;
light3.shadow.mapSize.width = light3.shadow.mapSize.width = 4096;
scene.add(light3);
// let slight3 = new THREE.SpotLightHelper( light3 );
// scene.add( slight3 );

let light4 = new THREE.SpotLight( 0xffffff, 2.7 );
light4.position.set (-200,400,-200);
light4.angle = Math.PI / 7;
light4.penumbra = 0.8;
light4.castShadow = true;
light4.receiveShadow = true;
light4.shadowDarkness = 0.35;
light4.shadowCameraNear	= 0.5;
scene.add(light4);
// let slight4 = new THREE.SpotLightHelper( light4 );
// scene.add( slight4 );

/////////
///////// MATERIALS
/////////

let material = new THREE.MeshLambertMaterial({
  wireframe: false,
  color: 0xafafaf,
  specular: 0xffffff,
  shininess: 0.2,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.9
}); // + material
// Normal Lambert Phong Standard Toon

let matGlass = new THREE.MeshLambertMaterial({
  wireframe: false,
  color: 0xaaaaaa,
  //  specular: 0xffffff,
  //shininess: 0.2,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.5
});

let matMan = new THREE.MeshLambertMaterial({
  wireframe: false,
  color: 0xaaaaaa,
  //specular: 0xffffff,
  //shininess: 0.8,
  emissive: 0xffffff,
  emissiveIntensity: 1
});

var starsMaterial = new THREE.PointsMaterial({
  color: 0x0000ff
});
var materialLine = new THREE.LineBasicMaterial({
  color: 0xffffff
});

/////////
///////// GEOMETRIES
/////////

// let gomSph = new THREE.SphereGeometry(22);
// let sphere = new THREE.Mesh(gomSph, matMan);
// sphere.position.x=-35;
// sphere.position.z=-35;
// scene.add(sphere);

let guiOptions = {
  REFRESH: function() { crea(); },
  unit: 10, // < unit
  grid: 1,
  closedLines: true,
  drawMesh: false
}

let gui = new dat.GUI();
gui.add(guiOptions, 'unit', 1, 10, 1).onFinishChange(function() {
  riCreaGriglia()
});
gui.add(guiOptions, 'grid', 1, 10, 1).onFinishChange(function() {
  riCreaGriglia()
});
gui.add(guiOptions, 'closedLines').onChange(function() {
  riCreaGriglia()
});
gui.add(guiOptions, 'drawMesh').onChange(function() {
  riCreaGriglia()
});

let u = guiOptions.unit; // < da passare a interfaccia XXX
let g = guiOptions.grid;
let closedLines = guiOptions.closedLines; // < per attivare r3, chiusura del triangolo
let drawMesh = guiOptions.drawMesh;

let r1, r2, r3; // r1 - r2 - r3 (per fare il triangolo...)
let verticiCubo = []
let elementiGriglia = []
let elementi10Print = []

creaGriglia();

function creaGriglia() {

  let u = guiOptions.unit; // < da passare a interfaccia XXX
  let g = guiOptions.grid;
  let closedLines = guiOptions.closedLines; // < per attivare r3, chiusura del triangolo
  let drawMesh = guiOptions.drawMesh;

  // UNITA
  verticiCubo.push(new THREE.Vector3(0, 0, 0)) // 0 - 7 - 6
  verticiCubo.push(new THREE.Vector3(u, 0, 0)) // 1 - 4 - 5
  verticiCubo.push(new THREE.Vector3(u, u, 0)) // 2 - 5 - 1
  verticiCubo.push(new THREE.Vector3(0, u, 0)) // 3 - 6 - 0
  verticiCubo.push(new THREE.Vector3(0, u, u)) // 4
  verticiCubo.push(new THREE.Vector3(0, 0, u)) // 5
  verticiCubo.push(new THREE.Vector3(u, 0, u)) // 6
  verticiCubo.push(new THREE.Vector3(u, u, u)) // 7

  // GRIGLIA DI PUNTI
  for (let ix = 0; ix < g; ix++) {
    for (let iy = 0; iy < g; iy++) {
      for (let iz = 0; iz < g; iz++) {
        // punti a cubetto intero per verificare punti come traccia
        var cuboLinea = new THREE.Geometry();
        for (let i = 0; i < verticiCubo.length - 1; i++) {
          cuboLinea.vertices.push(verticiCubo[i], verticiCubo[i + 1]);
        }
        var cubeL = new THREE.Points(cuboLinea, starsMaterial);
        cubeL.position.x = ix * u;
        cubeL.position.y = iy * u;
        cubeL.position.z = iz * u;
        scene.add(cubeL);
        elementiGriglia.push(cubeL);
      }
    }
  }

  // 10 PRINT... 4 DIAGONALI A CASO...
  // r1 - r2 - r3(opzione closedLines...)
  // 0 - 7 - 6
  // 1 - 4 - 5
  // 2 - 5 - 1
  // 3 - 6 - 0
  for (let ix = 0; ix < g; ix++) {
    for (let iy = 0; iy < g; iy++) {
      for (let iz = 0; iz < g; iz++) {
        // linea a caso tra i punti (4 combinazioni di diagonali del cubo!)
        let r1 = parseInt(Math.random() * 4);
        let r2;
        if (r1 == 0) {
          r2 = 7;
          if (closedLines || drawMesh) r3 = 6;
        } else if (r1 == 1) {
          r2 = 4;
          if (closedLines || drawMesh) r3 = 5;
        } else if (r1 == 2) {
          r2 = 5;
          if (closedLines || drawMesh) r3 = 1;
        } else if (r1 == 3) {
          r2 = 6;
          if (closedLines || drawMesh) r3 = 0;
        }

        if (drawMesh) {
          let contorno = new THREE.Geometry();
          contorno.vertices.push(verticiCubo[r1], verticiCubo[r2], verticiCubo[r3]);
          contorno.faces.push( new THREE.Face3( 0, 1, 2 ) );
          // linea.computeBoundingSphere();
          contorno.computeFaceNormals();
          contorno.computeVertexNormals();
          let faccia = new THREE.Mesh(contorno, material);
          faccia.position.x = ix * u;
          faccia.position.y = iy * u;
          faccia.position.z = iz * u;
          scene.add(faccia)
          elementi10Print.push(faccia);
        } else {
          let linea = new THREE.Geometry();
          linea.vertices.push(verticiCubo[r1], verticiCubo[r2]);
          if (closedLines || drawMesh) {
            linea.vertices.push(verticiCubo[r2], verticiCubo[r3]);
            linea.vertices.push(verticiCubo[r3], verticiCubo[r1]);
          }
          var line = new THREE.Line(linea, materialLine);
          line.position.x = ix * u;
          line.position.y = iy * u;
          line.position.z = iz * u;
          scene.add(line);
          elementi10Print.push(line);
        }
      }
    }
  }
  //camera.position.y = 500;
  controls.target.set(g/2 * u, g/2 * u, g/2 * u);
}

function riCreaGriglia() { // < per dat gui ...
  for (let i=0; i<elementiGriglia.length; i++) {
    scene.remove(elementiGriglia[i]);
  }
  for (let i=0; i<elementi10Print.length; i++) {
    scene.remove(elementi10Print[i]);
  }
  elementiGriglia = [];
  elementi10Print = [];
  verticiCubo = []
  creaGriglia();
}

// scene
camera.position.z = -u*20;

/////////
///////// RENDER/ANIMATION LOOP
/////////

// set
let time = 0;
let render = function() {
  requestAnimationFrame(render);
  //
  // light.position.x = Math.sin(time) * 150;
  // light.position.y = Math.cos(time) * 150;
  // light.position.z = Math.sin(time + 10) * 150;
  // time += 0.01;
  controls.update()
  renderer.render(scene, camera)
};

// go
render();


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
