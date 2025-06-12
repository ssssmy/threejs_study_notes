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
//   scene.add( floorMesh )
 
 
  // -------------------------------------------
  const textureLoader3 = new THREE.TextureLoader();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const colorJpg3 = textureLoader3.load(require('@/assets/door/color.jpg'))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ambientOcclusionJpg3 = textureLoader3.load(require('@/assets/door/ambientOcclusion.jpg'));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const alphaJpg3 = textureLoader3.load(require('@/assets/door/alpha.jpg'))

  // 置换贴图
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const heightJpg3 = textureLoader3.load(require('@/assets/door/height.jpg'))
  
  // 粗糙度贴图
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const roughnessJpg3 = textureLoader3.load(require('@/assets/door/roughness.jpg'))
  
  // 金属贴图
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const metalnessJpg3 = textureLoader3.load(require('@/assets/door/metalness.jpg'))
  
  // 法向贴图
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const normalJpg3 = textureLoader3.load(require('@/assets/door/normal.jpg'))
  
  const box3 = new THREE.PlaneBufferGeometry(100, 100, 200, 200)
  const fconeMat3 = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side:THREE.DoubleSide,
    map: colorJpg3,
    aoMap: ambientOcclusionJpg3,
    aoMapIntensity: 1,
    alphaMap: alphaJpg3,
    transparent: true,
    // opacity: 1,
    
    displacementMap: heightJpg3,
    displacementScale: 0.1,

    roughness: 1,
    roughnessMap: roughnessJpg3,

    metalness: 1,
    metalnessMap: metalnessJpg3,

    normalMap: normalJpg3,
  })
  const mesh3 = new THREE.Mesh( box3, fconeMat3 )
  scene.add( mesh3 )
  box3.setAttribute(
    "uv2",
    new THREE.BufferAttribute(box3.attributes.uv.array, 2)
  );
  
  // -------------------------------------------
  

  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(100, 100, 100)
  scene.add(directionalLight);

  const helper = new THREE.DirectionalLightHelper(directionalLight)
  scene.add(helper);

//   const props = {
//     color: material.color.getStyle(),
//     emissive: material.emissive.getStyle()
//   }
//   const ctrl = new dat.GUI();
//   // 添加标准材质属性分组
//   const smGUI = ctrl.addFolder('MeshStandardmaterial')
//   smGUI.addColor(props, 'color').onChange(function(e){
//     material.color.setStyle(e)
//   })
//   smGUI.addColor(props, 'emissive').onChange(function(e){
//     material.color.setStyle(e)
//   })
//   smGUI.add(material, 'metalness', 0, 1, 0.01)
//   smGUI.add(material, 'roughness', 0, 1, 0.01)
//   smGUI.add(material, 'wireframe')
//   smGUI.add(material, 'wireframeLinewidth', 0, 20)

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
