import * as THREE from "three";
console.log('THREE.REVISION', THREE.REVISION) // 127
THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 );

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const alwaysLookAtCamera = function () {
  const worldPos = new THREE.Vector3();
  if (+THREE.REVISION > 85) {
      return function (object: THREE.Object3D, camera: THREE.Camera) {
          object.onBeforeRender = function() {
              worldPos.setFromMatrixPosition(object.matrixWorld);
              object.matrixWorld.lookAt(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), THREE.Object3D.DefaultUp);
              // object.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld);
              // object.normalMatrix.getNormalMatrix(object.modelViewMatrix);
          };
      };
  } else {
      return function (object: THREE.Object3D, camera: THREE.Camera) {
          object.onBeforeRender = function() {
              worldPos.setFromMatrixPosition(object.matrixWorld);
              object.matrixWorld.lookAt(camera.position, worldPos, THREE.Object3D.DefaultUp);
          };
      }
  }
}();

export const initScene = function (): void {  


  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );


  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  )
  camera.position.set(0, -100, 100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // camera.up.set(0, 0, 1)
  // THREE.Object3D.DefaultUp.set(0, 0, 1);

  // this.up = THREE.Object3D.DefaultUp.clone();
  // THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 1, 0 );

  const renderer = new THREE.WebGL1Renderer();
  scene.background = new THREE.Color(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const orbitControls: OrbitControls = new OrbitControls(camera, document.body);

  const axes = new THREE.AxesHelper(1000);
  scene.add(axes);

  // 添加地板
  // const floorMat = new THREE.MeshStandardMaterial({
  //   side: THREE.DoubleSide,
  //   color: 0x1F2A40,
  //   roughness: 0.8,
  //   metalness: 0.2,
  //   bumpScale: 0.0005,
  //   transparent: true,
  //   opacity: 0.6
  // })
  // const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50 ), floorMat )
  // // mesh.rotation.x = -Math.PI / 2
  // // mesh.receiveShadow = true
  // mesh.position.z = 20
  // scene.add( mesh )


  // const grid = new THREE.GridHelper( 30, 30, 0x444444, 0x888888 );
  // grid.rotateX(Math.PI / 2); 
  // scene.add( grid )

  const cone = new THREE.ConeGeometry(50,100)
  const fconeMat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    color: 0x1F2A40,
    roughness: 0.8,
    metalness: 0.2,
    bumpScale: 0.0005,
    transparent: true,
    opacity: 0.6
  })
  const mesh = new THREE.Mesh( cone, fconeMat )
  // mesh.rotateX(Math.PI / 2); 
  // mesh.up.set(0, 0, 1)
  // mesh.lookAt(1, 0, 0)

  // const group = new THREE.Group();
  // group.add(mesh)

  // group.rotateX(Math.PI / 4)
  // alwaysLookAtCamera(mesh, camera)
  
  // mesh.onBeforeRender = () => {
  //   // const worldPos = new THREE.Vector3();
  //   /**
  //    * .setFromMatrixPosition ( m : Matrix4 ) : this
  //    *  将这个向量设为变换矩阵m的位置元素。
  //    */
  //   // worldPos.setFromMatrixPosition(mesh.matrixWorld);
  //   /**
  //    * .lookAt ( eye : Vector3, target : Vector3, up : Vector3 ) : this
  //    *  构造一个旋转矩阵，从眼睛到由上向量定向的目标。
  //    */
  //   mesh.matrixWorld.lookAt(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), THREE.Object3D.DefaultUp);
  // }

  // mesh.rotation.x = Math.PI / 4
  // mesh.position.x = 100

  mesh.matrixWorld.lookAt(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), THREE.Object3D.DefaultUp);

  scene.add( mesh )

  
  console.log('mesh:', mesh)
  console.log('camera:', camera)
  console.log('scene:', scene)

  const renderScene = () => {
    orbitControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  renderScene();

  document.body.appendChild(renderer.domElement);
};
