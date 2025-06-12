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
  
    // 几何体 
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.set(0, 0, 0);
    cubeMesh.position.x = 10;
    scene.add(cubeMesh);

  // 轨道控制器
  const clock = new THREE.Clock();
  const cameraControls = new CameraControls(camera, renderer.domElement);
    
  const renderScene = () => {
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
