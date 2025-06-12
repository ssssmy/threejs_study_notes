import * as THREE from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";

export const initScene = function (): void {

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const axes = new THREE.AxesHelper(60);
  scene.add(axes);

  // 几何体 
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
  const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubeMesh.position.set(0, 0, 0);
  scene.add(cubeMesh);

  document.body.appendChild(renderer.domElement);


  const animate = () => {
      renderer.render(scene,camera);
  }
  animate();
};