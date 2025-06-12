import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const initScene = function (): void {  

  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  )
  camera.position.set(400, 800, 800);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const renderer = new THREE.WebGLRenderer();
  scene.background = new THREE.Color(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const orbitControls: OrbitControls = new OrbitControls(camera, document.body);

  const axes = new THREE.AxesHelper(1000);
  scene.add(axes);

  // 添加地板
  const floorMat = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: 0x5a5a5a,
  })
  const floorMesh = new THREE.Mesh( new THREE.PlaneGeometry( 500, 500 ), floorMat )
  floorMesh.rotation.x = -Math.PI / 2
  floorMesh.receiveShadow = true
  scene.add( floorMesh )

  const box = new THREE.BoxGeometry(50, 100, 100)
  const fconeMat = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: 0x1a401a,
  })
  const mesh = new THREE.Mesh( box, fconeMat )
  mesh.position.y = 50 
  mesh.castShadow = true;
  scene.add( mesh )

  const ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(40, 80, 100);
  spotLight.castShadow = true;
  spotLight.intensity = 4
  scene.add(spotLight);
  
  const renderScene = () => {
    orbitControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  renderScene();

  document.body.appendChild(renderer.domElement);
};
