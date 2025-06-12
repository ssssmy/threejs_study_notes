import * as THREE from "three";
export const initScene = function (): void {
  // 创建一个场景对象
  const scene = new THREE.Scene();

  // 创建一个透视摄像机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // 设置透视摄像机在Z轴上的距离（它与我们屏幕春指的距离）
  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  camera.lookAt(scene.position);

  // 创建一个渲染器
  const renderer = new THREE.WebGLRenderer();
  // 启用阴影
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 创建一个坐标系
  const axes = new THREE.AxesHelper(60);
  scene.add(axes);

  // 创建一个地板
  const planeGeometry = new THREE.PlaneGeometry(60, 20);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
  // 作为地面接受阴影的对象，必须设置 receiveShadow 的属性为真
  plane.receiveShadow = true;
  scene.add(plane);

  // 创建一个立方几何体
  const geometry = new THREE.BoxGeometry(4, 4, 4);
  // 创建一个材质
  const material = new THREE.MeshLambertMaterial({
    color: 0x002299,
    // wireframe: true,
  });
  // 把立方体和基础材质进行组合后，创建出一个新的网格对象
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = -4;
  cube.position.y = 5;
  cube.position.z = 0;
  // 设置立方体的 castShadow 为真(启用阴影)
  cube.castShadow = true;
  // 把立方体网格添加到场景
  scene.add(cube);

  // 制作三维物体投影效果
  // 创建有产应阴影的光源，创建聚光灯光源对象
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-30, 40, -30)
  // 需要设置 castShadow 为真，才会让聚光灯产生阴影
  spotLight.castShadow = true;
  // 设置阴影效果
  spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  spotLight.shadow.camera.far = 130;
  spotLight.shadow.camera.near = 40;
  scene.add(spotLight)

  // 创建 Lambert 光源（该光源没有特殊的来源方向，并且他不会生成阴影，所以不能作为唯一光源）
  const ambienLight = new THREE.AmbientLight(0xAAAAAA);
  scene.add(ambienLight);

  // 加入页面
  document.body.appendChild(renderer.domElement);

  // 将场景和摄像机传入渲染器
  renderer.render(scene, camera);
};
