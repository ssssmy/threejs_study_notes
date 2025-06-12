import * as THREE from "three";
import dat from 'dat.gui'
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";

import CameraControls from 'camera-controls';
CameraControls.install( { THREE: THREE } );

export const initScene = function (): void {  
  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x444444 );
  scene.fog = new THREE.Fog(0x3f7b9d, 0, 60)


  const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 10, 100 );
  camera.position.set(0, 0, 35);
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  const renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  const axes = new THREE.AxesHelper(60);
  scene.add(axes);
  

  const geometry = new THREE.TorusKnotGeometry( 10, 3, 200, 32 ).toNonIndexed();
  const positionAttribute = geometry.attributes.position;
  const colors = [];
  const color = new THREE.Color();
  for ( let i = 0, il = positionAttribute.count; i < il; i ++ ) {
    color.setHSL( i / il * Math.random(), 0.5, 0.5 );
    colors.push( color.r, color.g, color.b );
  }
  geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  const material = new THREE.MeshBasicMaterial({ color: 0x049EF4, side: THREE.FrontSide});
  material.needsUpdate = true;
  material.transparent = true;
  material.vertexColors = false;
  material.alphaTest = 0.37;
  material.combine = THREE.MultiplyOperation
  material.fog = false;
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // const ambientLight = new THREE.AmbientLight( 0x000000 );
  // scene.add(ambientLight);
  // const light1 = new THREE.PointLight( 0xffffff, 1, 0 );
  // light1.position.set( 0, 200, 0 );
  // scene.add( light1 );
  // const light2 = new THREE.PointLight( 0xffffff, 1, 0 );
  // light2.position.set( 100, 200, 100 );
  // scene.add( light2 );
  // const light3 = new THREE.PointLight( 0xffffff, 1, 0 );
  // light3.position.set( - 100, - 200, - 100 );
  // scene.add( light3 );

  // side
  const sideArr = [ 'THREE.DoubleSide', 'THREE.BackSide', 'THREE.FrontSide' ]

  // envMap
  const loader = new THREE.CubeTextureLoader();
  const reflectionCube = loader.load([
    require('@/assets/px.jpg'),
    require('@/assets/nx.jpg'),
    require('@/assets/py.jpg'),
    require('@/assets/ny.jpg'),
    require('@/assets/pz.jpg'),
    require('@/assets/nz.jpg')
  ]);
  const refractionCube = loader.load([
    require('@/assets/px.jpg'),
    require('@/assets/nx.jpg'),
    require('@/assets/py.jpg'),
    require('@/assets/ny.jpg'),
    require('@/assets/pz.jpg'),
    require('@/assets/nz.jpg')
  ]);
  refractionCube.mapping = THREE.CubeRefractionMapping;
  const envMaps = {
    none: null,
    reflection: reflectionCube,
    refraction: refractionCube
  }
  const envMapKeys = ['none', 'reflection', 'refraction'];

  // map
  const textureLoader = new THREE.TextureLoader();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const urls = require('@/assets/env.jpeg');
  const texure = textureLoader.load(urls);
  texure.wrapS = THREE.RepeatWrapping;
  texure.wrapT = THREE.RepeatWrapping;
  texure.repeat.set(9,1);
  const maps = {
    none: null,
    bricks: texure,
  }
  const mapKeys = ['none', 'bricks'];

  // alphaMap
  const alphaMaps = {
    none: null,
    alphaMap: texure,
  }
  const alphaMapsKeys = ['none', 'alphaMap'];

  // combine
  const combineArr = [ 'THREE.MultiplyOperation', 'THREE.MixOperation', 'THREE.AddOperation' ]

  const ctrlobj = {
    transparent: true,
    opacity: 1,
    depthTest: true,
    depthWrite: true,
    alphaTest: 0.37,
    side: sideArr[2],
    color: '#049EF4',
    wireframe: false,
    fog: false,
    vertexColors: false,
    envMaps: envMapKeys[0],
    maps: mapKeys[0],
    alphaMaps: alphaMapsKeys[0],
    combine: combineArr[0],
    reflectivity:1,
    refractionRatio: 0.98
  }
  const ctrl = new dat.GUI();
  const threeMaterial = ctrl.addFolder('Three.Material')
  threeMaterial.add(ctrlobj, 'transparent').onChange((e: boolean)=>{
    material.transparent = e;
  })
  threeMaterial.add(ctrlobj, 'opacity', 0, 1).onChange((e: number)=>{
    material.opacity = e;
    material.needsUpdate = true;
  })  
  threeMaterial.add(ctrlobj, 'depthTest', 0, 1).onChange((e: boolean)=>{
    material.depthTest = e;
  })
  threeMaterial.add(ctrlobj, 'depthWrite', 0, 1).onChange((e: boolean)=>{
    material.depthWrite = e;
  })
  threeMaterial.add(ctrlobj, 'alphaTest',0 ,1).onChange((e: number) => {
    material.alphaTest = e;
    material.needsUpdate = true;
  });
  threeMaterial.add(ctrlobj, 'side', sideArr).onChange((e: string) => {
    if (e === 'THREE.DoubleSide') {
      material.side = THREE.DoubleSide;
    }
    if (e === 'THREE.BackSide') {
      material.side = THREE.BackSide;
    }
    if (e === 'THREE.FrontSide') {
      material.side = THREE.FrontSide;
    }
  });
  const basicMaterial = ctrl.addFolder('Three.BasicMaterial')
  basicMaterial.addColor(ctrlobj, 'color').onChange((e: string) => {
    material.color = new THREE.Color(e);
  });  
  basicMaterial.add(ctrlobj, 'wireframe').onChange((e: boolean) => {
    material.wireframe = e;
  });  
  basicMaterial.add(ctrlobj, 'fog').onChange((e: boolean) => {
    material.fog = e;
    material.needsUpdate = true;
  });
  basicMaterial.add(ctrlobj, 'vertexColors').onChange((e: boolean) => {
    material.vertexColors = e;
    material.needsUpdate = true;
  });
  basicMaterial.add(ctrlobj, 'envMaps', envMapKeys).onChange((e: string) => {
    if (e === 'none') {
      material.envMap = envMaps.none;
    }
    if (e === 'reflection') {
      material.envMap = envMaps.reflection;
    }
    if (e === 'refraction') {
      material.envMap = envMaps.refraction;
    }
    material.needsUpdate = true;
  });
  basicMaterial.add(ctrlobj, 'maps', mapKeys).onChange((e: string) => {
    if (e === 'none') {
      material.map = maps.none;
    }
    if (e === 'bricks') {
      material.map = maps.bricks;
    }
    material.needsUpdate = true;
  });
  basicMaterial.add(ctrlobj, 'alphaMaps', alphaMapsKeys).onChange((e: string) => {
    console.log(e)
    if (e === 'none') {
      material.alphaMap = alphaMaps.none
    }
    if (e === 'alphaMap') {
      material.alphaMap = alphaMaps.alphaMap
    }
    material.needsUpdate = true;
  });
  basicMaterial.add(ctrlobj, 'combine', combineArr).onChange((e: string) => {
    if (e === 'THREE.MultiplyOperation') {
      material.combine = THREE.MultiplyOperation;
    }
    if (e === 'THREE.MixOperation') {
      material.combine = THREE.MixOperation;
    }
    if (e === 'THREE.AddOperation') {
      material.combine = THREE.AddOperation;
    }
    material.needsUpdate = true;
  });
  basicMaterial.add(ctrlobj, 'reflectivity', 0, 1).onChange((e: number) => {
    material.reflectivity = e;
  });
  basicMaterial.add(ctrlobj, 'refractionRatio', 0, 0.99).onChange((e: number)=>{
    material.refractionRatio = e;
  })

  // 轨道控制器
  const clock = new THREE.Clock();
  const cameraControls = new CameraControls(camera, renderer.domElement);
    
  const renderScene = () => {
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;
    mesh.rotation.z += 0.005;

    const delta = clock.getDelta();
    const hasControlsUpdated = cameraControls.update(delta);
    if ( hasControlsUpdated ) {
      renderer.render(scene, camera);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  renderScene();

  document.body.appendChild(renderer.domElement);
};
