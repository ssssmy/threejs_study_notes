import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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
  scene.background = new THREE.Color(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // const orbitControls: OrbitControls = new OrbitControls(camera, document.body);

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

  // const box = new THREE.BoxGeometry(50, 100, 100)
  // const fconeMat = new THREE.MeshLambertMaterial({
  //   side: THREE.DoubleSide,
  //   color: 0x1a401a,
  // })
  // const mesh = new THREE.Mesh( box, fconeMat )
  // mesh.position.y = 50 
  // mesh.material.wireframe = true;
  // scene.add( mesh )

  // const fconeMat1 = new THREE.MeshLambertMaterial({
  //   side: THREE.DoubleSide,
  //   color: 0x1a401a,
  // })
  // const mesh1 = new THREE.Mesh( box, fconeMat1 )
  // mesh1.position.y = 50 
  // mesh1.castShadow = true;
  // mesh1.material.transparent = true;
  // mesh1.material.opacity = 0.6;
  // scene.add( mesh1 )


  const posArr: any = {
    'v1': {
      x: 0,
      y: 0,
      z: 0
    },
    'v2':  {
      x: 100,
      y: 0,
      z: 0
    },
    'v3':  {
      x: 0,
      y: 100,
      z: 0
    },
    'v4':  {
      x: 100,
      y: 100,
      z: 0
    },
    'v5':  {
      x: 0,
      y: 100,
      z: 100
    },
    'v6':  {
      x: 0,
      y: 0,
      z: 100
    },
    'v7':  {
      x: 100,
      y: 0,
      z: 100
    },
    'v8':  {
      x: 100,
      y: 100,
      z: 100
    }
  }
  const creatMesh = () => {
    const group = scene.getObjectByName('group') as THREE.Object3D
    if (group) {
      scene.remove(group)
    }
  

    const newgroup = new THREE.Group();
    newgroup.name = 'group'

    const vertices = new Float32Array([
        posArr.v1.x, posArr.v1.y, posArr.v1.z,
        posArr.v2.x, posArr.v2.y, posArr.v2.z,
        posArr.v3.x, posArr.v3.y, posArr.v3.z,
        posArr.v2.x, posArr.v2.y, posArr.v2.z,
        posArr.v3.x, posArr.v3.y, posArr.v3.z,
        posArr.v4.x, posArr.v4.y, posArr.v4.z,
        posArr.v1.x, posArr.v1.y, posArr.v1.z,
        posArr.v3.x, posArr.v3.y, posArr.v3.z,
        posArr.v5.x, posArr.v5.y, posArr.v5.z,
        posArr.v5.x, posArr.v5.y, posArr.v5.z,
        posArr.v1.x, posArr.v1.y, posArr.v1.z,
        posArr.v6.x, posArr.v6.y, posArr.v6.z,
        posArr.v2.x, posArr.v2.y, posArr.v2.z,
        posArr.v4.x, posArr.v4.y, posArr.v4.z,
        posArr.v8.x, posArr.v8.y, posArr.v8.z,
        posArr.v2.x, posArr.v2.y, posArr.v2.z,
        posArr.v7.x, posArr.v7.y, posArr.v7.z,
        posArr.v8.x, posArr.v8.y, posArr.v8.z,
        posArr.v1.x, posArr.v1.y, posArr.v1.z,
        posArr.v6.x, posArr.v6.y, posArr.v6.z,
        posArr.v2.x, posArr.v2.y, posArr.v2.z,
        posArr.v2.x, posArr.v2.y, posArr.v2.z,
        posArr.v7.x, posArr.v7.y, posArr.v7.z,
        posArr.v6.x, posArr.v6.y, posArr.v6.z,
        posArr.v3.x, posArr.v3.y, posArr.v3.z,
        posArr.v5.x, posArr.v5.y, posArr.v5.z,
        posArr.v4.x, posArr.v4.y, posArr.v4.z,
        posArr.v4.x, posArr.v4.y, posArr.v4.z,
        posArr.v8.x, posArr.v8.y, posArr.v8.z,
        posArr.v5.x, posArr.v5.y, posArr.v5.z,
        posArr.v6.x, posArr.v6.y, posArr.v6.z,
        posArr.v7.x, posArr.v7.y, posArr.v7.z,
        posArr.v5.x, posArr.v5.y, posArr.v5.z,
        posArr.v7.x, posArr.v7.y, posArr.v7.z,
        posArr.v5.x, posArr.v5.y, posArr.v5.z,
        posArr.v8.x, posArr.v8.y, posArr.v8.z,
    ]);

    const bufferGeometry = new THREE.BufferGeometry();
    const attribue = new THREE.BufferAttribute(vertices, 3);
    bufferGeometry.attributes.position = attribue;
    const bufferMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        side: THREE.DoubleSide,
        wireframe: true
    })
    const bufferMesh = new THREE.Mesh(bufferGeometry, bufferMaterial);
    bufferMesh.name = 'bufferGeometry1';
    newgroup.add(bufferMesh);

    const bufferGeometry2 = new THREE.BufferGeometry();
    const attribue2 = new THREE.BufferAttribute(vertices, 3);
    bufferGeometry2.attributes.position = attribue2;
    const bufferMaterial2 = new THREE.MeshBasicMaterial({ 
        color: 0x409840,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    })
    const bufferMesh2 = new THREE.Mesh(bufferGeometry2, bufferMaterial2);
    bufferMesh2.name = 'bufferGeometry2';
    newgroup.add(bufferMesh2);

    scene.add(newgroup);
  }
  creatMesh();

  const ctrlM = {
    clone: () => {
      console.log('a')
    }
  }
  const ctrl = new dat.GUI();
  ctrl.add(ctrlM, 'clone')
  for (let index = 1; index <= 8; index++) {
    const c = ctrl.addFolder('v' + index);
    c.add(posArr['v' + index], 'x', -500, 500).onChange((e: number)=>{
      posArr['v' + index].x = e
      creatMesh();
    })
    c.add(posArr['v' + index], 'y', -500, 500).onChange((e: number)=>{
      posArr['v' + index].y = e
      creatMesh();
    })
    c.add(posArr['v' + index], 'z', -500, 500).onChange((e: number)=>{
      posArr['v' + index].z = e
      creatMesh();
    })
  }

  
  const ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(40, 80, 100);
  spotLight.castShadow = true;
  spotLight.intensity = 4
  scene.add(spotLight);
  
  const renderScene = () => {
    // orbitControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  renderScene();

  document.body.appendChild(renderer.domElement);
};
