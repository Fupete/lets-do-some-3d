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
// 05-giant-s-causeway (1st approach with three.js for the master thesis of @iretrtr)

let xAx = new THREE.Vector3( 1, 0, 0 );
let yAx = new THREE.Vector3( 0, 1, 0 );
let zAx = new THREE.Vector3( 0, 0, 1 );

let poly = [
  [
    44.4004645342009,
    [
      [
        615.6658711378757,
        302.2956413983194
      ],
      [
        616.3427406777352,
        305.56529482077156
      ],
      [
        616.9956027337261,
        306.3185814025648
      ],
      [
        622.8363262586333,
        302.92764484501214
      ],
      [
        619.8038579623466,
        299.1307453706586
      ],
      [
        617.1395421187552,
        299.80520157304466
      ]
    ],
    "brown"
  ],
  [
    21.022252507074285,
    [
      [
        651.0961165943843,
        428.3002568658109
      ],
      [
        651.5533226628515,
        434.8830298529468
      ],
      [
        652.9443407987237,
        435.7009927628597
      ],
      [
        657.6256278807903,
        431.75679188584473
      ],
      [
        656.3298334318747,
        428.55615912132544
      ],
      [
        653.2967299362192,
        427.25251267630574
      ]
    ],
    "green"
  ],
  [
    25.52671980244051,
    [
      [
        444.53677156711814,
        450.28656325431723
      ],
      [
        445.59155024663613,
        450.9118832233781
      ],
      [
        451.67493463902855,
        448.90231621149223
      ],
      [
        452.31891526681494,
        448.32366570981503
      ],
      [
        450.634264328831,
        446.615146398555
      ],
      [
        445.70299316178483,
        447.2598191949421
      ]
    ],
    "green"
  ],
  [
    22.036650443954496,
    [
      [
        483.88619282551934,
        424.8255497324022
      ],
      [
        484.96406646648035,
        426.61616325732666
      ],
      [
        489.6573219158777,
        425.9586400396277
      ],
      [
        490.1789989529723,
        425.01293296847376
      ],
      [
        488.8467412011064,
        421.77130364108575
      ],
      [
        485.7998316582679,
        420.9154001787711
      ]
    ],
    "green"
  ],
  [
    43.72668666607423,
    [
      [
        646.7206879625045,
        165.53230923335448
      ],
      [
        648.3529690430812,
        168.47255613840048
      ],
      [
        653.6731072727911,
        166.35174266730763
      ],
      [
        653.5178364543128,
        164.93042576126365
      ],
      [
        650.246855550818,
        161.20337144716126
      ]
    ],
    "brown"
  ],
  [
    41.47494246949625,
    [
      [
        560.099905181464,
        362.9688482536793
      ],
      [
        560.3619917084659,
        367.9899286191145
      ],
      [
        560.9436517954549,
        368.70143447378865
      ],
      [
        562.2818222146468,
        368.52321052160136
      ],
      [
        563.5910707230938,
        366.2521996433174
      ],
      [
        561.9169315210959,
        362.340430473907
      ]
    ],
    "brown"
  ],
  [
    42.53351454001949,
    [
      [
        646.0546637321228,
        301.7753042977006
      ],
      [
        646.6408412078347,
        302.6408144130907
      ],
      [
        647.0358205657096,
        302.67392878464693
      ],
      [
        651.1978225081925,
        300.6432434696875
      ],
      [
        650.3771348533429,
        295.3826311193822
      ],
      [
        646.4473584144944,
        295.29561159140127
      ]
    ],
    "brown"
  ],
  [
    33.79677657996726,
    [
      [
        581.8538835438134,
        356.11007264225873
      ],
      [
        585.1283267009214,
        360.4730198792878
      ],
      [
        587.9712743779629,
        359.73099057218445
      ],
      [
        590.5049189975541,
        355.36555650364517
      ],
      [
        589.326752347273,
        352.5506522293314
      ],
      [
        584.6709293161251,
        352.137573808226
      ],
      [
        583.3090855081746,
        352.8670630854695
      ]
    ],
    "green"
  ],
  [
    15.86517733277391,
    [
      [
        576.6535692248843,
        166.49965106535308
      ],
      [
        578.1112194671324,
        171.06029238114067
      ],
      [
        581.9171481205353,
        170.70048560237734
      ],
      [
        582.5263336273148,
        168.614277327868
      ],
      [
        576.848223400351,
        165.68162437540062
      ]
    ],
    "green"
  ],
  [
    13.040898976640236,
    [
      [
        391.5968160597621,
        200.3880403259078
      ],
      [
        393.30198289672154,
        203.15199210610922
      ],
      [
        398.7528114339489,
        198.84758305993356
      ],
      [
        397.8092325831685,
        196.51423718277525
      ],
      [
        393.0426183015505,
        197.3536234375132
      ]
    ],
    "green"
  ],
  [
    83.07681372874484,
    [
      [
        663.7212090665954,
        265.13162108289345
      ],
      [
        664.8919220889205,
        269.7716477637389
      ],
      [
        668.3735807840613,
        270.30081420926155
      ],
      [
        668.7743318890812,
        269.81960165868173
      ],
      [
        669.154207624749,
        266.6226439208657
      ],
      [
        669.0878359237618,
        266.4851090707111
      ],
      [
        664.7358862598397,
        264.3909906136088
      ]
    ],
    "white"
  ],
  [
    23.55181286028281,
    [
      [
        401.94131974747955,
        361.57557450919967
      ],
      [
        405.28477417302923,
        364.5571517542023
      ],
      [
        407.99083562515426,
        361.3106432950749
      ],
      [
        405.20336532345317,
        358.323417642868
      ],
      [
        403.33286341548126,
        358.287818593503
      ]
    ],
    "green"
  ],
  [
    35.719315473548654,
    [
      [
        627.2237986558134,
        158.54980469237847
      ],
      [
        627.5611077214639,
        158.8748504294582
      ],
      [
        633.0890587804897,
        160.85659523936658
      ],
      [
        636.4038381812976,
        153.64434564286157
      ],
      [
        631.3007103884651,
        150.23519474097213
      ]
    ],
    "brown"
  ],
  [
    40.39500265082581,
    [
      [
        505.75832877907135,
        208.15799521528373
      ],
      [
        510.8031759498947,
        208.55727495369007
      ],
      [
        510.0817506649726,
        203.90266011932457
      ],
      [
        509.0549189747965,
        203.53544631049283
      ],
      [
        506.5007339004767,
        204.58209613904845
      ]
    ],
    "brown"
  ],
  [
    75.37729970964531,
    [
      [
        472.89168815603836,
        290.0802852089229
      ],
      [
        474.7775566485137,
        293.4533442813182
      ],
      [
        477.4238760652509,
        291.5552643789273
      ],
      [
        475.36226274037995,
        288.8413251589448
      ]
    ],
    "white"
  ],
  [
    36.95930434015794,
    [
      [
        628.7107303973398,
        371.48592999658257
      ],
      [
        632.1595515268474,
        373.03339874414627
      ],
      [
        632.5931876531671,
        372.9750829682755
      ],
      [
        635.7327894136876,
        368.74718061660485
      ],
      [
        631.6148051813333,
        365.6817280678124
      ],
      [
        629.9132635984924,
        366.47569328087906
      ]
    ],
    "brown"
  ],
  [
    18.79004809276421,
    [
      [
        562.0575793101799,
        169.22164371574672
      ],
      [
        562.2459247179676,
        173.22176819312926
      ],
      [
        565.8566259274374,
        176.64200211095246
      ],
      [
        565.9373663562551,
        176.6528756633794
      ],
      [
        568.2608742285026,
        175.77238431669565
      ],
      [
        569.2941177732487,
        174.54038995731938
      ],
      [
        566.9011588356958,
        169.47717692582265
      ],
      [
        562.6413850856131,
        168.30348262055236
      ]
    ],
    "green"
  ],
  [
    63.5486077243017,
    [
      [
        675.7932659498571,
        238.75401000593507
      ],
      [
        676.9358178599856,
        241.14603989279922
      ],
      [
        682.2213172572023,
        240.91090244782825
      ],
      [
        682.5697077446235,
        238.7139857917476
      ],
      [
        681.0725845123613,
        237.08061819837857
      ],
      [
        676.1108691277063,
        237.23537138474794
      ]
    ],
    "brown"
  ],
  [
    17.731825192903703,
    [
      [
        529.5088347891933,
        175.67016758988584
      ],
      [
        530.166652979816,
        178.03349891880487
      ],
      [
        536.1836148455761,
        178.76495386246594
      ],
      [
        536.6486053755013,
        177.5741334163093
      ],
      [
        536.6763012733624,
        176.49102915979344
      ],
      [
        534.1185303283634,
        172.47172668202887
      ],
      [
        533.55724543889,
        172.3750902733393
      ]
    ],
    "green"
  ],
  [
    76.46034973946686,
    [
      [
        527.3005382091443,
        315.30255665957446
      ],
      [
        528.193095248396,
        317.5684376503088
      ],
      [
        530.07316281032,
        319.3643822710984
      ],
      [
        530.3152012996859,
        319.43873120684174
      ],
      [
        533.8311616870584,
        318.2918771086136
      ],
      [
        535.2985195651402,
        314.5700837415358
      ],
      [
        528.8545826976804,
        313.20887972688973
      ]
    ],
    "white"
  ],
  [
    16.184944927246203,
    [
      [
        423.2297941409741,
        445.646578140621
      ],
      [
        425.339372707842,
        450.14310619109233
      ],
      [
        426.9313818122012,
        450.0638085573149
      ],
      [
        428.55542236311015,
        449.3319148667798
      ],
      [
        430.9124461155935,
        446.66608258797
      ],
      [
        430.22201005238793,
        442.9740469632253
      ],
      [
        427.22761379451805,
        441.96444587257486
      ]
    ],
    "green"
  ]
  ];



/////////
///////// SETUP
/////////

// Scene
let scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
scene.fog = new THREE.FogExp2( scene.background, 0.001 );

// Camera
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);

// Renderer
let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;
//renderer.shadowMapType = THREE.PCFSoftShadowMap;
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
let lightAmb = new THREE.AmbientLight( 0x000000 );

// Directional
let light = new THREE.DirectionalLight( 0xffffff, 1.5 );
light.position.set( -100, 200, 50 );
//let dlh = new THREE.DirectionalLightHelper( light );
//scene.add( dlh );
light.castShadow = true;
light.shadowDarkness = 0.5;


// Point
let light2 = new THREE.PointLight( 0xffffff, 0.7 );
light2.position.set (-50,50,50);
//let plh = new THREE.PointLightHelper( light2 );
//scene.add( plh );
light2.castShadow = true;
light2.shadowDarkness = 0.5;

// Spot
let light3 = new THREE.SpotLight( 0xffffff, .8 );
light3.position.set (100,-100,100);
light3.angle = Math.PI / 7;
light3.penumbra = 0.8;
//let slh = new THREE.SpotLightHelper( light3 );
//scene.add( slh );


/////////
///////// MATERIALS
/////////

let material = new THREE.MeshLambertMaterial({
  wireframe:false,
  color: 0xff0000,
  specular: 0xffffff,
  shininess: 1.1,
  side: THREE.DoubleSide
  }); // + material
// Normal Lambert Phong Standard Toon

let matGlass = new THREE.MeshLambertMaterial({
  wireframe:false,
  color: 0xcccccc,
  specular: 0xffffff,
  shininess: 1.8,
  side: THREE.DoubleSide,
  transparent: true,
  opacity:0.5
  });

let matMan = new THREE.MeshLambertMaterial({
  wireframe:false,
  color: 0xffffff,
  specular: 0xffffff,
  shininess: 1.8,
  emissive: 0xffffff,
  emissiveIntensity: 1
  });


/////////
///////// GEOMETRIES
/////////

// let's make a box
let geomet = new THREE.BoxGeometry(1000, 100, 1000); // dimensions
let box = new THREE.Mesh(geomet, matMan); // = the box
box.position.y=-50;
box.castShadow = true;
box.receiveShadow = false;
box.position.y = -78;
scene.add(box);


var axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

//console.log(poly.length); // quanti poligoni
for (let p = 0; p<poly.length; p++) {
  //path
  let poly2d = new THREE.Shape();
  poly2d.moveTo( poly[p][1][0][0], poly[p][1][0][1] ); // primo vertice
  for (let v = 0; v<4; v++) {
    poly2d.lineTo( poly[p][1][v][0], poly[p][1][v][1]); // tutti i vertici
  }
  poly2d.moveTo( poly[p][1][0][0], poly[p][1][0][1] ); // primo vertice
  //extrusion
  let heightToExtrude = poly[p][0];
  let extrudeSettings = {
    steps: 1,	depth: heightToExtrude, bevelEnabled: false,
    bevelThickness: 1, bevelSize: 1, bevelSegments: 1
  };
  let path = new THREE.ExtrudeBufferGeometry( poly2d, extrudeSettings );
  let extruded = new THREE.Mesh( path, material ) ;
  // Position & Rotation
  extruded.rotation.x = - Math.PI/2;
  extruded.position.x = -500;
  extruded.position.z = 300;
  scene.add( extruded );
}


// let's make few extrusions
for (let i=0; i<100; i++) {
  // Path
  let length = 24, width = 8;
  let shape = new THREE.Shape();
  shape.moveTo( 0,0 );
  shape.lineTo( 0, Math.random()*length );
  shape.lineTo( Math.random()*length, Math.random()*width );
  shape.lineTo( Math.random()*length, 0 );
  shape.lineTo( 0, 0 );
  // Extrusion
  let heightToExtrude = Math.random()*100;
  let extrudeSettings = {
    steps: 1,	depth: heightToExtrude, bevelEnabled: false,
    bevelThickness: 1, bevelSize: 1, bevelSegments: 1
  };
  let path = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
  let extruded = new THREE.Mesh( path, material ) ;
  // Position & Rotation
  extruded.rotation.x = - Math.PI/2;
  extruded.position.x = Math.random()*100;
  extruded.position.z = Math.random()*100;
  scene.add( extruded );
}

/////////
///////// DIRECTION
/////////

// grid helper
var gh = new THREE.GridHelper( 1000, 10, 0xcccccc, 0x555555 );
//scene.add( gh );
gh.position.y = -0.02;


// scene
camera.position.z = 500;
camera.position.y = 500;
// controls.center.set(0, 80, 0);
//scene.add(box);
//scene.add(sphere);
scene.add(lightAmb);
scene.add(light);
scene.add(light2);
scene.add(light3);

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
  camera.position.x = -200+Math.sin(time)*300;
  time+=0.02;
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
