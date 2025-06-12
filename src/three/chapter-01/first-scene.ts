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
  renderer.setClearColor(new THREE.Color(0xeeeeee));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 创建一个坐标系
  const axes = new THREE.AxesHelper(60);
  scene.add(axes);

  // 创建一个地板
  const planeGeometry = new THREE.PlaneGeometry(60, 20);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
  scene.add(plane);

  // 创建一个立方几何体
  const geometry = new THREE.BoxGeometry(4, 4, 4);
  // 创建一个材质
  const material = new THREE.MeshBasicMaterial({
    color: 0x002299,
    wireframe: true,
  });
  // 把立方体和基础材质进行组合后，创建出一个新的网格对象
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = -4;
  cube.position.y = 3;
  cube.position.z = 0;
  // 把立方体网格添加到场景
  scene.add(cube);

  // 加入页面
  document.body.appendChild(renderer.domElement);

  // 将场景和摄像机传入渲染器
  renderer.render(scene, camera);
};
