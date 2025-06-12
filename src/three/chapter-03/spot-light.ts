import * as THREE from "three";
import dat from 'dat.gui'
import CameraControls from 'camera-controls';
CameraControls.install( { THREE: THREE } );

export const initScene = function (): void {  
  const scene = new THREE.Scene();

  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(-25, 30, 25);
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const axes = new THREE.AxesHelper(60);
  scene.add(axes);

  const planeGeometry = new THREE.PlaneGeometry(60, 20);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(15, 0, 0)
  plane.receiveShadow = true;
  scene.add(plane);

  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff7777});
  const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubeMesh.castShadow = true;
  cubeMesh.position.set(-4, 3, 0);
  scene.add(cubeMesh);

  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
  const sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphereMesh.position.set(20, 0, 2);
  scene.add(sphereMesh);

  const sphereLight = new THREE.SphereGeometry(0.2);
  const sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});
  const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
  sphereLightMesh.castShadow = true;
  sphereLightMesh.position.set(3, 0, 3);
  scene.add(sphereLightMesh);

  const spotColor = '#ffffff'
  const spotLight = new THREE.SpotLight(spotColor);
  spotLight.position.set(-40, 30, -10);
  spotLight.castShadow = true;
  // 设置阴影效果
  spotLight.shadow.camera.near = 2;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.camera.fov = 30;
  spotLight.target = plane;
  spotLight.distance = 0;
  spotLight.angle = 0.4;
  scene.add(spotLight);
  // 通过聚光灯对象创建一个 SpotLightHelper 对象
  const lightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(lightHelper);


  const ctrlObj = {
    rotationSpeed: 0.03,
    bouncingSpeed: 0.03,
    spotColor: spotColor,
    spotIntensity: 1,
    spotDistance: 100,
    // exponent: 30,
    spotAngle: 0.1,
    spotDecay: 2,
    // debug: false,
    // castShadow: false,
    // onlytShadow: false,
    // target: 'Plane',
    // stopMovingLight: false
  }
  const ctrl = new dat.GUI();
  const SpotFolder = ctrl.addFolder('Spot')
  SpotFolder.addColor(ctrlObj, 'spotColor').onChange((e: any) => {
    spotLight.color = new THREE.Color(e);
  })
  SpotFolder.add(ctrlObj, 'spotIntensity', 1, 5).onChange((e: any) => {
    spotLight.intensity = e;
  })
  SpotFolder.add(ctrlObj, 'spotDistance', 1, 500).onChange((e: any) => {
    spotLight.distance = e;
  })
  SpotFolder.add(ctrlObj, 'spotAngle', 0, Math.PI * 2).onChange((e: any) => {
    spotLight.angle = e;
  })
  SpotFolder.add(ctrlObj, 'spotDecay', 0, 5).onChange((e: any) => {
    spotLight.decay = e;
  })

  // 添加轨道控制器
  const clock = new THREE.Clock();
  const cameraControls = new CameraControls(camera, renderer.domElement);
    
  let step = 0;
  let invert = 1;
  let phase = 0;
  // 封装一个刷新页面的方法
  const renderScene = () => {
    cubeMesh.rotation.x += ctrlObj.rotationSpeed;
    cubeMesh.rotation.y += ctrlObj.rotationSpeed;
    cubeMesh.rotation.z += ctrlObj.rotationSpeed;

    step += ctrlObj.bouncingSpeed;
    sphereMesh.position.x = 20 + ( 10 * (Math.cos(step)));
    sphereMesh.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

    if (phase > 2 * Math.PI) {
        invert = invert * -1;
        phase -= 2 * Math.PI;
    } else {
        phase += ctrlObj.rotationSpeed;
    }
    sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
    sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
    sphereLightMesh.position.y = 10;
    if (invert < 0) {
        const pivot = 14;
        sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
    }

    // pointLight.position.copy(sphereLightMesh.position);
    spotLight.position.copy(sphereLightMesh.position);
    lightHelper.update();

    // 添加轨道控制器
    const delta = clock.getDelta();
    const hasControlsUpdated = cameraControls.update(delta);
    if ( hasControlsUpdated ) {
      renderer.render( scene, camera );
    }
    // 将场景和摄像机传入渲染器
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  renderScene();

  // 加入页面
  document.body.appendChild(renderer.domElement);

};
