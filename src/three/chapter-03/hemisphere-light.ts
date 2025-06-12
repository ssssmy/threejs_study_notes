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
  
  // 贴图
  const textureLoader = new THREE.TextureLoader();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const textureFlare = textureLoader.load(require('@/assets/grasslight-big.jpg'))
  console.log(textureFlare)
  textureFlare.wrapS = THREE.RepeatWrapping;
  textureFlare.wrapT = THREE.RepeatWrapping;
  textureFlare.repeat.set(4, 4);

  // 地板
  const planeGeometry = new THREE.PlaneGeometry(1000, 200, 20, 20);
  const planeMaterial = new THREE.MeshPhongMaterial({ map: textureFlare })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(15, 0, 0)
  plane.receiveShadow = true;
  scene.add(plane);

  // 几何体 
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
  const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubeMesh.castShadow = true;
  cubeMesh.position.set(-4, 3, 0);
  scene.add(cubeMesh);

  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
  const sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphereMesh.position.set(20, 0, 2);
  scene.add(sphereMesh);

  const sphereLight = new THREE.SphereGeometry(0.2);
  const sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
  const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
  sphereLightMesh.castShadow = true;
  sphereLightMesh.position.set(3, 0, 3);
  scene.add(sphereLightMesh);

  // 光
  const spotColor = '#ffffff'
  const spotLight = new THREE.SpotLight(spotColor);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 2;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.camera.fov = 30;
  spotLight.target = plane;
  spotLight.distance = 0;
  spotLight.angle = 0.4;
  // scene.add(spotLight);
  const lightHelper = new THREE.SpotLightHelper(spotLight);
  // scene.add(lightHelper);

  const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
  hemisphereLight.position.set(0, 100, 0);
  scene.add(hemisphereLight);
  // const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 20)
  // scene.add(hemisphereLightHelper);

  const directionalColor = '#ffffff'
  const directionalLight = new THREE.DirectionalLight(directionalColor);
  directionalLight.position.set(30, 10, 50);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 200;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;
  directionalLight.target = plane;
  scene.add(directionalLight);

  
  const target = new THREE.Object3D();
  target.position.set(5, 0, 0)


  // 轨道控制器
  const clock = new THREE.Clock();
  const cameraControls = new CameraControls(camera, renderer.domElement);
    
  // 运动参数
  const ctrlObj = {
    rotationSpeed: 0.03,
    bouncingSpeed: 0.03,
    hemisphereLightVisible: true,
    skyColor: 0x0000ff,
    groundColor: 0x00ff00,
    hemisphereIntensity: 1
  }
  const ctrl = new dat.GUI();
  const hemisphereLightFolder = ctrl.addFolder('hemisphereLight')
  hemisphereLightFolder.add(ctrlObj, 'hemisphereLightVisible').onChange(function(e: any) {
      hemisphereLight.visible = e;
      // hemisphereLightHelper.update();
  })
  hemisphereLightFolder.addColor(ctrlObj, 'skyColor').onChange(function(clr: any) {
      hemisphereLight.color = new THREE.Color(clr);
  })
  hemisphereLightFolder.addColor(ctrlObj, 'groundColor').onChange(function(clr: any) {
      hemisphereLight.groundColor = new THREE.Color(clr);
  })
  hemisphereLightFolder.add(ctrlObj, 'hemisphereIntensity', 0, 10).onChange(function(e: any) {
      hemisphereLight.intensity = e
  })
  let step = 0;
  let invert = 1;
  let phase = 0;

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

    spotLight.position.copy(sphereLightMesh.position);
    lightHelper.update();

    const delta = clock.getDelta();
    const hasControlsUpdated = cameraControls.update(delta);
    if ( hasControlsUpdated ) {
      renderer.render( scene, camera );
    }
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
  }
  renderScene();

  document.body.appendChild(renderer.domElement);
};
