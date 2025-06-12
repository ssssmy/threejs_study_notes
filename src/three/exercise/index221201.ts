import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import dat from 'dat.gui'

export const initScene = function (): void {  

  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  )
  camera.position.set(100, 200, 300);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const renderer = new THREE.WebGLRenderer();
  scene.background = new THREE.Color(0x000000);
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
  const floorMesh = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 500 ), floorMat )
  floorMesh.rotation.x = -Math.PI / 2
  floorMesh.receiveShadow = true
  scene.add( floorMesh )

  // -------------------------------------------
  const textureLoader = new THREE.TextureLoader();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const colorJpg = textureLoader.load(require('@/assets/door/color.jpg'))
  const box = new THREE.BoxGeometry(100, 100, 100)
  const fconeMat = new THREE.MeshLambertMaterial({
    side:THREE.DoubleSide,
    map: colorJpg
  })
  const mesh = new THREE.Mesh( box, fconeMat )
  mesh.position.y = 50 
  mesh.position.x = -300 
  scene.add( mesh )
  // -------------------------------------------

  
  // -------------------------------------------
  const textureLoader1 = new THREE.TextureLoader();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const colorJpg1 = textureLoader1.load(require('@/assets/door/color.jpg'))
  const box1 = new THREE.BoxGeometry(100, 100, 100)
  const fconeMat1 = new THREE.MeshLambertMaterial({
    side:THREE.DoubleSide,
    map: colorJpg1
  })
  const mesh1 = new THREE.Mesh( box1, fconeMat1 )
  mesh1.position.y = 50 
  mesh1.position.x = -100
  scene.add( mesh1 )
  // 设置纹理偏移
  colorJpg1.offset.x = 0.5;
  colorJpg1.offset.y = 0.5;
  colorJpg1.offset.set(0.5, 0.5);
  // 纹理旋转
  // 设置旋转的原点
  colorJpg1.center.set(0.5, 0.5);
  // 旋转45deg
  colorJpg1.rotation = Math.PI / 4;
  // 设置纹理的重复
  colorJpg1.repeat.set(2, 3);
  // 设置纹理重复的模式
  colorJpg1.wrapS = THREE.MirroredRepeatWrapping;
  colorJpg1.wrapT = THREE.RepeatWrapping;
  // -------------------------------------------


  // -------------------------------------------
  const textureLoader2 = new THREE.TextureLoader();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const colorJpg2 = textureLoader2.load(require('@/assets/door/color.jpg'))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const alphaJpg2 = textureLoader2.load(require('@/assets/door/alpha.jpg'))
  const box2 = new THREE.BoxGeometry(100, 100, 100)
  const fconeMat2 = new THREE.MeshLambertMaterial({
    side:THREE.DoubleSide,
    map: colorJpg2,
    alphaMap: alphaJpg2,
    transparent: true,
    opacity: 0.5,
  })
  const mesh2 = new THREE.Mesh( box2, fconeMat2 )
  mesh2.position.y = 50 
  mesh2.position.x = 100
  scene.add( mesh2 )
  // -------------------------------------------
 
 
  // -------------------------------------------
  const textureLoader3 = new THREE.TextureLoader();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const colorJpg3 = textureLoader3.load(require('@/assets/door/color.jpg'))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ambientOcclusionJpg3 = textureLoader.load(require('@/assets/door/ambientOcclusion.jpg'));
  const box3 = new THREE.BoxGeometry(100, 100, 100)
  const fconeMat3 = new THREE.MeshLambertMaterial({
    side:THREE.DoubleSide,
    map: colorJpg3,
    aoMap: ambientOcclusionJpg3,
    aoMapIntensity: 1,
  })
  const mesh3 = new THREE.Mesh( box3, fconeMat3 )
  mesh3.position.y = 50 
  mesh3.position.x = 300
  scene.add( mesh3 )
  box3.setAttribute(
    "uv2",
    new THREE.BufferAttribute(box3.attributes.uv.array, 2)
  );
  // -------------------------------------------
  
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

//   const spotLight = new THREE.SpotLight(0xffffff);
//   spotLight.position.set(40, 80, 100);
//   spotLight.castShadow = true;
//   spotLight.intensity = 4
//   scene.add(spotLight);
  
  const renderScene = () => {
    orbitControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  renderScene();

  document.body.appendChild(renderer.domElement);
};
